import app from "../../..";
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { before, after, afterEach, beforeEach, describe, it } from "mocha";
import { signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import { signInToken } from "../../../lib/signInToken";
import { Task } from "@prisma/client";

chai.use(chaiHttp);

describe("POST /api/comments", () => {
	const mockUser = { uid: "123" };
	let baseURL = "/api/comments";
	let token: string;
	let task: Task;

	before(async () => {
		token = await signInToken(mockUser.uid);
		const project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});
		task = await prisma.task.create({
			data: {
				title: "Code Review",
				createdById: mockUser.uid,
				projectId: project.id,
			},
		});
	});

	after(async () => {
		signOut(Auth);
		await prisma.task.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return status of 201 upon successful creation of comment", done => {
		chai
			.request(app)
			.post(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.send({ comment: "This code does not work", taskId: task.id })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(201);
				done();
			});
	});

	it("Should return status of 400 when task passed does not exists", done => {
		chai
			.request(app)
			.post(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(400);
				done();
			});
	});

	it("Should return status of 401 for unauthenticated users", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({ comment: "This code does not work", taskId: task.id })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return status of 403 when user does not have access to project", async () => {
		await signOut(Auth);
		token = await signInToken("55555");

		chai
			.request(app)
			.post(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.send({ comment: "This code does not work", taskId: task.id })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(403);
			});
	});
});
