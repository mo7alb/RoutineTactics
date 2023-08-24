// delete a project
import { Task } from "@prisma/client";

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { after, before, describe, it } from "mocha";

import app from "../../../index";

import { signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";

import { prisma } from "../../../config/prisma";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("Delete /api/tasks/:id", () => {
	let baseURL: string;
	let token: string;
	let task: Task;

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "1234",
	};

	// connect to the database and create a project to fetch
	// create a firebase user and jwt token
	before(async function () {
		const project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});

		const task = await prisma.task.create({
			data: {
				title: "Code review",
				projectId: project.id,
				createdById: user.uid,
			},
		});

		baseURL = `/api/tasks/${task.id}`;

		token = await signInToken(user.uid);
	});

	// abort database connection and delete all projects from the database
	after(async function () {
		signOut(Auth);

		await prisma.comment.deleteMany();
		await prisma.task.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a status of 204 upon successful task deletion", done => {
		chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(204);
				done();
			});
	});

	it("Should return a status of 204 upon deleting a task with comments", async () => {
		await prisma.comment.createMany({
			data: [
				{
					comment: "This code does not work",
					taskId: task.id,
					userId: user.uid,
				},
				{
					comment: "This code does not work",
					taskId: task.id,
					userId: user.uid,
				},
			],
		});
		chai
			.request(app)
			.delete(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(204);
			});
	});

	it("Should return a status of 404 when request task does not exist", done => {
		chai
			.request(app)
			.delete(`${baseURL}1234`)
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return a status of 403 when user is not permitted to delete task", async () => {
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
			.end((_, response) => {
				expect(response).to.have.status(403);
			});
	});
});
