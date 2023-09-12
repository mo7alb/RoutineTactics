import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { signOut } from "firebase/auth";
import { after, afterEach, beforeEach, describe, it } from "mocha";
import { Auth } from "../../../config/firebaseConfig";
import { prisma } from "../../../config/prisma";
import app from "../../../index";
import { signInToken } from "../../../lib/signInToken";

chai.use(chaiHttp);

describe("POST /api/projects", () => {
	const baseURL = "/api/projects";

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "123",
	};

	// firebase jwt token
	let token: string;

	// connect to the database before each test & create jwt token
	beforeEach(async () => {
		token = await signInToken(user.uid);
	});

	// disconnect the database connection after each test
	afterEach(async () => {
		signOut(Auth);
	});

	after(async () => {
		await prisma.project.deleteMany();
	});

	it("Should return a status of 401 upon unauthorized request", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status of 201 upon successful request", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({ name: "React" })
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(201);
				done();
			});
	});

	it("Should return a status of 400 when no project name is passed", done => {
		chai
			.request(app)
			.post(baseURL)
			.send({})
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(400);
				done();
			});
	});
});
