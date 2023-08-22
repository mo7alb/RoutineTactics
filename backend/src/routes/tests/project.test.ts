import { PrismaClient, Project } from "@prisma/client";

import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

import chai from "chai";
import chaiHttp from "chai-http";

import app from "../../index";

chai.use(chaiHttp);

const prisma = new PrismaClient();

describe("Get list of projects", () => {
	let baseURL = "/api/projects";

	beforeEach(async function () {
		await prisma.$connect();

		await prisma.user.deleteMany();

		const user = await prisma.user.create({
			data: {
				email: "something",
				fullName: "John Doe",
				username: "doe",
				password: "something",
			},
		});

		await prisma.project.createMany({
			data: [
				{ name: "Android", userId: user.id },
				{ name: "IOS", userId: user.id },
				{ name: "React", userId: user.id },
				{ name: "Django", userId: user.id },
				{ name: "React Native", userId: user.id },
				{ name: "Express", userId: user.id },
			],
		});
	});

	afterEach(async function () {
		await prisma.$disconnect();
		await prisma.project.deleteMany();
	});

	it("Should return a status of 200 upon successful request", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((_, response) => {
				expect(response).to.have.status(200);
				done();
			});
	});

	it("Should return an array of projects", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((_, response) => {
				const data = response.body;

				expect(data).to.be.instanceOf(Array);
				done();
			});
	});

	it("Should return 6 projects within the array", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((_, response) => {
				const data = response.body;

				expect(data.length).to.be.equal(6);
				done();
			});
	});
});

describe("Get project", () => {
	let project: Project;
	let baseURL: string;

	beforeEach(async function () {
		await prisma.$connect();

		await prisma.user.deleteMany();

		const user = await prisma.user.create({
			data: {
				email: "something",
				fullName: "John Doe",
				username: "doe",
				password: "something",
			},
		});

		project = await prisma.project.create({
			data: { name: "Android", userId: user.id },
		});

		baseURL = `/api/projects/${project.id}`;
	});

	afterEach(async function () {
		await prisma.$disconnect();
		await prisma.project.deleteMany();
	});

	it("Should return a status of 200 request an existing project", done => {
		chai
			.request(app)
			.get(baseURL)
			.end((_, response) => {
				expect(response).to.have.status(200);
				done();
			});
	});

	it("Should return a status of 400 requesting an invalid project", done => {
		chai
			.request(app)
			.get("/api/projects/1234")
			.end((_, response) => {
				expect(response).to.have.status(400);
				done();
			});
	});
});
