import { PrismaClient, Project } from "@prisma/client";

import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { afterEach, beforeEach, describe, it } from "mocha";

import app from "../../../index";

import { signInWithCustomToken, signOut } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";
import admin from "../../../config/firebaseAdminConfig";

chai.use(chaiHttp);

const prisma = new PrismaClient();

describe("Get project list", () => {
	let baseURL = "/api/projects";

	const user = {
		email: "test@test.io",
		uid: "123",
	};

	let token: string;

	// connect to the database, create a firebase jwt token and create some projects to fetch
	beforeEach(async function () {
		await prisma.$connect();

		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(user.uid)
		);
		token = await customSignInToken.user.getIdToken();

		await prisma.project.createMany({
			data: [
				{ name: "Android", userId: user.uid },
				{ name: "IOS", userId: user.uid },
				{ name: "React", userId: user.uid },
				{ name: "Django", userId: user.uid },
				{ name: "React Native", userId: user.uid },
				{ name: "Express", userId: user.uid },
			],
		});
	});

	// abort database connection and delete all projects from the database
	afterEach(async function () {
		await signOut(Auth);
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return a status of 200 upon successful request", done => {
		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(200);
				done();
			});
	});

	it("Should return a status of 401 when unauthorized", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((_, response) => {
				expect(response).to.have.status(401);
				done();
			});
	});
});

describe("Get project", () => {
	let project: Project;
	let baseURL: string;
	let token: string;

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "1234",
	};

	// connect to the database, create a firebase user and jwt token and create a project to fetch
	beforeEach(async function () {
		await prisma.$connect();

		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(user.uid)
		);
		token = await customSignInToken.user.getIdToken();

		project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});
		baseURL = `/api/projects/${project.id}`;
	});

	// abort database connection and delete all projects from the database
	afterEach(async function () {
		signOut(Auth);
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return a status of 200 request an existing project", done => {
		chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(200);
				done();
			});
	});

	it("Should return a status of 401 when unauthorized", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((_, response) => {
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status of 404 requesting an invalid project", done => {
		chai
			.request(app)
			.get("/api/projects/test")
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(404);
				done();
			});
	});

	it("Should return a status of 403 requesting a project to which user has no access", async () => {
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
			.get(baseURL)
			.set({ Authorization: `Bearer ${newToken}` })
			.end((_, response) => {
				expect(response).to.have.status(403);
			});
	});
});
