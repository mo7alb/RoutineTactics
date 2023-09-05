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

describe("GET /api/tasks/:id", () => {
	let baseURL: string;
	let token: string;
	let project: Project;

	const mockUser = { uid: "3333" };

	before(async () => {
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

	it("Should return status code of 200 upon request a task", done => {
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

	it("Should return status code of 200 upon request a task by a member", async () => {
		const newUser = { uid: "911" };

		await prisma.projectMember.create({
			data: { userId: newUser.uid, projectId: project.id },
		});

		signOut(Auth);

		token = await signInToken(newUser.uid);

		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(200);
			});
	});

	it("Should return status code of 404 if task does not exists", done => {
		chai
			.request(app)
			.get(`${baseURL}12343`)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return status code of 403 if user does not have access to the project", async () => {
		const newUser = { uid: "999" };
		signOut(Auth);

		token = await signInToken(newUser.uid);

		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(403);
			});
	});

	it("Should return status code of 401 if user is unauthenticated", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});
});

describe("GET /api/tasks", () => {
	let baseURL: string = "/api/tasks";
	let token: string;
	let project: Project;

	const mockUser = { uid: "3333" };

	before(async () => {
		project = await prisma.project.create({
			data: { name: "Linux", userId: mockUser.uid },
		});

		await prisma.task.createMany({
			data: [
				{
					title: "Code review",
					createdById: mockUser.uid,
					projectId: project.id,
				},
				{
					title: "Code review",
					createdById: mockUser.uid,
					projectId: project.id,
				},
				{
					title: "Code review",
					createdById: mockUser.uid,
					projectId: project.id,
				},
				{
					title: "Code review",
					createdById: mockUser.uid,
					projectId: project.id,
				},
			],
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

	it("Should return status code of 200 upon request a task", done => {
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

	it("Should return status code of 200 upon request a task by a member", async () => {
		const newUser = { uid: "911" };

		await prisma.projectMember.create({
			data: { userId: newUser.uid, projectId: project.id },
		});

		signOut(Auth);

		token = await signInToken(newUser.uid);

		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(200);
			});
	});

	it("Should return status code of 401 if user is unauthenticated", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});
});
