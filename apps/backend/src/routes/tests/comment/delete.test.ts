import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { after, before, beforeEach, describe, it } from "mocha";
import app from "../../../index";
import { signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("Delete /api/comments/:id", () => {
	let baseURL: string;
	let token: string;
	let taskId: string;

	const mockUser = { uid: "555" };

	before(async () => {
		const project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});

		const task = await prisma.task.create({
			data: {
				title: "Code Review",
				projectId: project.id,
				createdById: mockUser.uid,
			},
		});

		taskId = task.id;

		token = await signInToken(mockUser.uid);
	});

	beforeEach(async () => {
		const comment = await prisma.comment.create({
			data: { comment: "Some comment", userId: mockUser.uid, taskId },
		});

		baseURL = `/api/comments/${comment.id}`;
	});

	after(async () => {
		signOut(Auth);

		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a status code of 401 for unauthenticated users", done => {
		chai
			.request(app)
			.delete(baseURL)
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status code of 404 for invalid comment path", done => {
		chai
			.request(app)
			.delete(`${baseURL}121`)
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(404);
				done();
			});
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
