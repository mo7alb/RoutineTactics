import { PrismaClient } from "@prisma/client";

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { before, after, afterEach, beforeEach, describe, it } from "mocha";

import app from "../../../index";

import { signInWithCustomToken, signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";
import admin from "../../../config/firebaseAdminConfig";

chai.use(chaiHttp);

const prisma = new PrismaClient();

describe("PUT /api/projects/:id", () => {
	let baseURL: string;
	let token: string;

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "1234",
	};

	// connect to the database, create a firebase user and jwt token and create a project to fetch
	before(async function () {
		await prisma.$connect();
		let project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});
		baseURL = `/api/projects/${project.id}`;
	});

	beforeEach(async function () {
		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(user.uid)
		);
		token = await customSignInToken.user.getIdToken();
	});

	// abort database connection and delete all projects from the database
	afterEach(async function () {
		signOut(Auth);
	});

	after(async function () {
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return a status of 204 upon updating project sucessfully", done => {
		chai
			.request(app)
			.put(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.send({ name: "React", description: "A UI library" })
			.end((_, response) => {
				expect(response).to.have.status(204);
				done();
			});
	});

	it("Should return a status of 404 when request project does not exist", done => {
		chai
			.request(app)
			.put(`${baseURL}1234`)
			.set({ Authorization: `Bearer ${token}` })
			.send({ name: "React", description: "A UI library" })
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

	it("Should return a status of 403 when user is not permitted to change project details", async () => {
		// sign out with previous user
		await signOut(Auth);

		// create a new user
		const invalidUser = {
			email: "test2@test.io",
			uid: "55555",
		};
		const customToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(invalidUser.uid)
		);
		const newToken = await customToken.user.getIdToken();

		chai
			.request(app)
			.put(baseURL)
			.set({ Authorization: `Bearer ${newToken}` })
			.end((_, response) => {
				expect(response).to.have.status(403);
			});
	});
});
