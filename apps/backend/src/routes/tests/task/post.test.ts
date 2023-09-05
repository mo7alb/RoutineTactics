import { Project } from "@prisma/client";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { signOut } from "firebase/auth";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import app from "../../../index";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("POST /api/tasks/", () => {
	const baseURL = "/api/tasks/";

	const mockUser = {
		email: "test@test.io",
		uid: "777",
	};

	let token: string;
	let project: Project;

	before(async () => {
		project = await prisma.project.create({
			data: { name: "Android", userId: mockUser.uid },
		});
	});

	beforeEach(async () => {
		token = await signInToken(mockUser.uid);
	});

	afterEach(() => {
		signOut(Auth);
	});

	after(async () => {
		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a status code of 201 for a successful request", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review", projectId: project.id })
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.be.have.status(201);
				done();
			});
	});

	it("Should return a status code of 201 for a member user", async () => {
		signOut(Auth);
		await prisma.projectMember.create({
			data: { projectId: project.id, userId: "666" },
		});

		token = await signInToken("666");

		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review", projectId: project.id })
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.be.have.status(201);
			});
	});

	it("Should return a status code of 403 if user does not has access to project", async () => {
		signOut(Auth);
		const newMockUser = { uid: "55555" };

		let newToken = await signInToken(newMockUser.uid);

		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review", projectId: project.id })
			.set({ Authorization: `Bearer ${newToken}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.be.have.status(403);
			});
	});

	it("Should return a status code of 400 if no projectId is passed to the request", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review" })
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.be.have.status(400);
				done();
			});
	});

	it("Should return a status code of 400 if no title is passed to the request", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({ projectId: project.id })
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.be.have.status(400);
				done();
			});
	});

	it("Should return a status code of 400 if empty body is passed to the request", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.be.have.status(400);
				done();
			});
	});

	it("Should return a status code of 401 if user is not authenticated", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.be.have.status(401);
				done();
			});
	});
});
