import { PrismaClient } from "@prisma/client";

import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

import chai from "chai";
import chaiHttp from "chai-http";

import app from "../../../index";

import admin from "../../../config/firebaseAdminConfig";
import { signInWithCustomToken } from "firebase/auth";
import { Auth } from "../../../config/firebaseConfig";

chai.use(chaiHttp);

const prisma = new PrismaClient();

describe("Create Project", () => {
	const baseURL = "/api/projects";

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "123",
	};

	// firebase jwt token
	let token: string;

	// connect to the database before each test & create jwt token
	beforeEach(async function () {
		await prisma.$connect();
		const customSignInToken = await signInWithCustomToken(
			Auth,
			await admin.auth().createCustomToken(user.uid)
		);
		token = await customSignInToken.user.getIdToken();
	});

	// disconnect the database connection after each test
	afterEach(async function () {
		await prisma.$disconnect();
	});

	it("Should return a status of 401 upon unauthorized request", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.end((_, response) => {
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status of 201 upon successful request", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({ name: "React" })
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(201);
				done();
			});
	});

	it("Should return a status of 400 when no project name is passed", function (done) {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.set({ Authorization: `Bearer ${token}` })
			.end((_, response) => {
				expect(response).to.have.status(400);
				done();
			});
	});
});
