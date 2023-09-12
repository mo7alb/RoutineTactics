import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { signOut } from "firebase/auth";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import app from "../../../index";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("PUT /api/projects/:id", () => {
	let baseURL: string;
	let token: string;

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "1234",
	};

	// connect to the database, create a firebase user and jwt token and create a project to fetch
	before(async () => {
		let project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});
		baseURL = `/api/projects/${project.id}`;
	});

	beforeEach(async () => {
		token = await signInToken(user.uid);
	});

	// abort database connection and delete all projects from the database
	afterEach(async () => {
		signOut(Auth);
	});

	after(async () => {
		await prisma.project.deleteMany();
	});

	it("Should return a status of 204 upon updating project sucessfully", done => {
		chai
			.request(app)
			.put(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.send({ name: "React", description: "A UI library" })
			.end((_, response) => {
				expect(response).to.have.status(204);
				done();
			});
	});

	it("Should return a status of 404 when request project does not exist", done => {
		chai
			.request(app)
			.put(`${baseURL}1234`)
			.set({ Authorization: `Bearer ${token}` })
			.send({ name: "React", description: "A UI library" })
			.end((_, response) => {
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return a status of 400 when no data is passed to the request", done => {
		chai
			.request(app)
			.put(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(400);
				done();
			});
	});

	it("Should return a status of 403 when user is not permitted to change project details", async () => {
		// sign out with previous user
		await signOut(Auth);

		// create a new user
		const invalidUser = {
			email: "test2@test.io",
			uid: "55555",
		};

		const newToken = await signInToken(invalidUser.uid);

		chai
			.request(app)
			.put(baseURL)
			.set({ Authorization: `Bearer ${newToken}` })
			.end((_, response) => {
				expect(response).to.have.status(403);
			});
	});
});
