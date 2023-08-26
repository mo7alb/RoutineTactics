import { PrismaClient, Project } from "@prisma/client";
import { expect } from "chai";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import chai from "chai";
import chaiHttp from "chai-http";
import app from "../../../index";
import admin from "../../../config/firebaseAdminConfig";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";

chai.use(chaiHttp);

const prisma = new PrismaClient();

describe("POST /api/tasks/", () => {
	const baseURL = "/api/tasks/";

	const mockUser = {
		email: "test@test.io",
		uid: "777",
	};

	let token: string;
	let project: Project;

	before(async () => {
		await prisma.$connect();
		project = await prisma.project.create({
			data: { name: "Android", userId: mockUser.uid },
		});
	});

	beforeEach(async () => {
		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(mockUser.uid)
		);
		token = await customSignInToken.user.getIdToken();
	});

  afterEach(() => {
    signOut(Auth);
	});

  
	after(async () => {
		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return a status code of 201 for a successful request", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review", projectId: project.id })
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.be.have.status(201);
				done();
			});
	});

	it("Should return a status code of 201 for a member user", async function () {
		signOut(Auth);
		await prisma.projectMember.create({
			data: { projectId: project.id, userId: "666" },
		});

		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken("666")
		);
		token = await customSignInToken.user.getIdToken();

		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review", projectId: project.id })
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.be.have.status(201);
			});
	});

	it("Should return a status code of 403 if user does not has access to project", async function () {
		signOut(Auth);
		const newMockUser = { uid: "55555" };
		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(newMockUser.uid)
		);

		let newToken = await customSignInToken.user.getIdToken();

		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review", projectId: project.id })
			.set({ Authorization: `Bearer ${newToken}` })
			.end(function (_, response) {
				expect(response).to.be.have.status(403);
			});
	});

	it("Should return a status code of 400 if no projectId is passed to the request", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({ title: "Code review" })
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.be.have.status(400);
				done();
			});
	});

	it("Should return a status code of 400 if no title is passed to the request", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({ projectId: project.id })
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.be.have.status(400);
				done();
			});
	});

	it("Should return a status code of 400 if empty body is passed to the request", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.be.have.status(400);
				done();
			});
	});

	it("Should return a status code of 401 if user is not authenticated", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.end(function (_, response) {
				expect(response).to.be.have.status(401);
				done();
			});
	});
});
