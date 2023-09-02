import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { before, after, afterEach, beforeEach, describe, it } from "mocha";
import app from "../../../index";
import { signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("PUT /api/tasks/:id", () => {
	let baseURL: string;
	let token: string;

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "1234",
	};

	// connect to the database, create a firebase user and jwt token and create a project to fetch
	before(async function () {
		const project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});

		const task = await prisma.task.create({
			data: {
				title: "Code Review",
				createdById: user.uid,
				projectId: project.id,
			},
		});

		baseURL = `/api/tasks/${task.id}`;
	});

	beforeEach(async function () {
		token = await signInToken(user.uid);
	});

	// abort database connection and delete all tasks from the database
	afterEach(async function () {
		signOut(Auth);
	});

	after(async function () {
		await prisma.task.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a status of 204 upon updating task sucessfully", done => {
		chai
			.request(app)
			.put(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.send({
				title: "Code Review",
				description: "Review my code",
				completed: true,
			})
			.end((_, response) => {
				expect(response).to.have.status(204);
				done();
			});
	});

	it("Should return a status of 404 when request task does not exist", done => {
		chai
			.request(app)
			.put(`${baseURL}1234`)
			.set({ Authorization: `Bearer ${token}` })
			.send({
				title: "Code Review",
				description: "Review my code",
				completed: true,
			})
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

	it("Should return a status of 403 when user is not permitted to change task details", async () => {
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
			.send({
				title: "Code Review",
				description: "Review my code",
				completed: true,
			})
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(403);
			});
	});
});
