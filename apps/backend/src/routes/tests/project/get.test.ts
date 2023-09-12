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

describe("GET /api/projects", () => {
	let baseURL = "/api/projects";

	const user = {
		email: "test@test.io",
		uid: "123",
	};

	let token: string;

	// connect to the database, create a firebase jwt token and create some projects to fetch
	before(async () => {
		token = await signInToken(user.uid);

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
	after(async () => {
		await signOut(Auth);
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a status of 200 upon successful request", done => {
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

	it("Should return a status of 401 when unauthorized", done => {
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

describe("GET /api/projects/:id", () => {
	let project: Project;
	let baseURL: string;
	let token: string;

	// mock firebase user
	const user = {
		email: "test@test.io",
		uid: "1234",
	};

	// connect to the database, create a firebase user and jwt token and create a project to fetch
	before(async () => {
		project = await prisma.project.create({
			data: { name: "Android", userId: user.uid },
		});
		baseURL = `/api/projects/${project.id}`;
	});

	beforeEach(async () => {
		token = await signInToken(user.uid);
	});

	afterEach(() => {
		signOut(Auth);
	});

	// abort database connection and delete all projects from the database
	after(async () => {
		try {
			await prisma.project.deleteMany();
		} catch (error) {
			console.log(error);
		}
	});

	it("Should return a status of 200 when requesting an existing project", done => {
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

	it("Should return a status of 200 when a user member requests for an existing project", async () => {
		signOut(Auth);
		const newUser = { uid: "5555" };

		token = await signInToken(newUser.uid);
		await prisma.projectMember.create({
			data: { projectId: project.id, userId: newUser.uid },
		});

		const response = await chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${token}` });

		expect(response).to.have.status(200);
	});

	it("Should return a status of 401 when unauthorized", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((error, response) => {
				expect(error).to.be.null;
				expect(response).to.have.status(401);
				done();
			});
	});

	it("Should return a status of 404 requesting an invalid project", done => {
		chai
			.request(app)
			.get("/api/projects/test")
			.set({ Authorization: `Bearer ${token}` })
			.end((error, response) => {
				expect(error).to.be.null;
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

		const newToken = await signInToken(invalidUser.uid);

		const response = await chai
			.request(app)
			.get(baseURL)
			.set({ Authorization: `Bearer ${newToken}` });

		expect(response).to.have.status(403);
	});
});
