import { Project } from "@prisma/client";
import { prisma } from "../../../config/prisma";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { after, before, beforeEach, afterEach, describe, it } from "mocha";
import app from "../../../index";
import { signInWithCustomToken, signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";
import admin from "../../../config/firebaseAdminConfig";

chai.use(chaiHttp);

describe("GET /api/tasks", () => {
	let baseURL: string;
	let token: string;
	let project: Project;

	const mockUser = { uid: "3333" };

	before(async function () {
		project = await prisma.project.create({
			data: { name: "Linux", userId: mockUser.uid },
		});

		const task = await prisma.task.create({
			data: {
				title: "Code review",
				createdById: mockUser.uid,
				projectId: project.id,
			},
		});

		baseURL = `/api/tasks/${task.id}`;
	});

	beforeEach(async function () {
		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(mockUser.uid)
		);
		token = await customSignInToken.user.getIdToken();
	});

	afterEach(function () {
		signOut(Auth);
	});

	after(async function () {
		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return status code of 200 upon request a task", function (done) {
		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.have.status(200);
				done();
			});
	});

	it("Should return status code of 200 upon request a task by a member", async function () {
		const newUser = { uid: "911" };

		await prisma.projectMember.create({
			data: { userId: newUser.uid, projectId: project.id },
		});

		signOut(Auth);
		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(newUser.uid)
		);
		token = await customSignInToken.user.getIdToken();

		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.have.status(200);
			});
	});

	it("Should return status code of 404 if task does not exists", function (done) {
		chai
			.request(app)
			.get(`${baseURL}12343`)
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return status code of 403 if user does not have access to the project", async function () {
		const newUser = { uid: "999" };
		signOut(Auth);
		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(newUser.uid)
		);
		token = await customSignInToken.user.getIdToken();

		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end(function (_, response) {
				expect(response).to.have.status(403);
			});
	});

	it("Should return status code of 401 if user is unauthenticated", function (done) {
		chai
			.request(app)
			.get(baseURL)
			.end(function (_, response) {
				expect(response).to.have.status(401);
				done();
			});
	});
});
