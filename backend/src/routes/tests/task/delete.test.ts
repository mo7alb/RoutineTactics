import { PrismaClient, Task } from "@prisma/client";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { after, afterEach, before, beforeEach, describe, it } from "mocha";
import app from "../../../index";
import { signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);
const prisma = new PrismaClient();

describe("Delete /api/tasks/:id", () => {
	let baseURL: string;
	let token: string;
	let projectId: string;
	let taskId: string;

	const mockUser = { uid: "555" };

	before(async () => {
		await prisma.$connect();
		const project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});
		projectId = project.id;

		token = await signInToken(mockUser.uid);
	});

	beforeEach(async () => {
		const task = await prisma.task.create({
			data: {
				title: "Code Review",
				projectId,
				createdById: mockUser.uid,
			},
		});

		baseURL = `/api/tasks/${task.id}`;
		taskId = task.id;
	});

	after(async () => {
		signOut(Auth);

		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return a status of 204 upon successful task deletion", done => {
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

	it("Should return a status of 401 when user is not permitted to delete task", done => {
		chai
			.request(app)
			.delete(baseURL)
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status of 404 when request task does not exist", done => {
		chai
			.request(app)
			.delete(`${baseURL}asdsadasd445da4sd`)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return a status of 204 upon deleting a task with comments", async () => {
		await prisma.comment.create({
			data: {
				comment: "This code doesn't work",
				userId: mockUser.uid,
				taskId,
			},
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

	it("Should return a status of 403 when user is not permitted to delete task", async () => {
		// sign out with previous user and sign in with an invalid user
		await signOut(Auth);

		const invalidUser = {
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
