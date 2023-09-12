import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { signOut } from "firebase/auth";
import { after, before, describe, it } from "mocha";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import app from "../../../index";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("GET /api/projects/members", () => {
	let baseURL: string;

	const user = { uid: "123" };

	let token: string;

	// connect to the database, create a firebase jwt token and create some projects to fetch
	before(async () => {
		token = await signInToken(user.uid);

		const project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});

		await prisma.projectMember.createMany({
			data: [
				{ projectId: project.id, userId: "12345" },
				{ projectId: project.id, userId: "12346" },
				{ projectId: project.id, userId: "12347" },
				{ projectId: project.id, userId: "12348" },
				{ projectId: project.id, userId: "12349" },
				{ projectId: project.id, userId: "12350" },
			],
		});
		baseURL = `/api/projects/members/${project.id}`;
	});

	// abort database connection and delete all projects from the database
	after(async () => {
		await signOut(Auth);
		await prisma.project.deleteMany();
	});

	it("Should return a status of 200 upon successful request", done => {
		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(200);
				done();
			});
	});

	it("Should return a status of 401 when unauthorized", done => {
		chai
			.request(app)
			.get(baseURL)

			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status of 404 for an invalid project", done => {
		chai
			.request(app)
			.get(`${baseURL}1234`)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return a status of 403 for an unauthorized user", async () => {
		await signOut(Auth);

		token = await signInToken("55555");

		const response = await chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` });

		expect(response).to.have.status(403);
	});
});
