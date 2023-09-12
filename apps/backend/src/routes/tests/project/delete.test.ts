import { Project } from "@prisma/client";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { signOut } from "firebase/auth";
import { afterEach, beforeEach, describe, it } from "mocha";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import app from "../../../index";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("Delete /api/projects/:id", () => {
	let baseURL: string;
	let token: string;
	let project: Project;

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "1234",
	};

	// connect to the database and create a project to fetch
	// create a firebase user and jwt token
	beforeEach(async () => {
		project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});

		baseURL = `/api/projects/${project.id}`;

		token = await signInToken(user.uid);
	});

	// abort database connection and delete all projects from the database
	afterEach(async () => {
		signOut(Auth);

		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a status of 204 upon successful project deletion", done => {
		chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(204);
				done();
			});
	});

	it("Should return a status of 204 upon deleting a project with other user members", async () => {
		await prisma.projectMember.createMany({
			data: [
				{ projectId: project.id, userId: "33333" },
				{ projectId: project.id, userId: "77777" },
				{ projectId: project.id, userId: "121212" },
			],
		});
		chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(204);
			});
	});

	it("Should return a status of 404 when request project does not exist", done => {
		chai
			.request(app)
			.delete(`${baseURL}1234`)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return a status of 403 when user is not permitted to delete project", async () => {
		// sign out with previous user
		await signOut(Auth);

		// create a new user
		const invalidUser = {
			email: "test2@test.io",
			uid: "15151515",
		};

		const newToken = await signInToken(invalidUser.uid);

		chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${newToken}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(403);
			});
	});
});
