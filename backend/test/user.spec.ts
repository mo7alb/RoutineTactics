import { PrismaClient } from "@prisma/client";

import { expect } from "chai";
import { describe, it } from "mocha";

import chai from "chai";
import chaiHttp from "chai-http";

import app from "../src/index";

chai.use(chaiHttp);

const prisma = new PrismaClient();

interface IUser {
	id: string;
	email: string;
	password: string;
	board: [];
}

let user: IUser;

describe("GET /api/user", () => {
	before(async () => {
		await prisma.$connect();
		await prisma.user.deleteMany();

		user = (await prisma.user.create({
			data: {
				email: "example@something.com",
				password: "secret",
			},
		})) as IUser;
	});

	after(async () => {
		await prisma.$disconnect();
	});

	it("should return a status of 200 for a correct user", done => {
		chai
			.request(app)
			.get(`/api/user/${user.id}`)
			.end((err, res) => {
				expect(res).to.have.status(200);
				done();
			});
	});

	it("should return the correct email address for the user", done => {
		chai
			.request(app)
			.get(`/api/user/${user.id}`)
			.end((err, res) => {
				expect(res.body.email).to.be.equal(user.email);
				done();
			});
	});

	it("should not return the password for the user", done => {
		chai
			.request(app)
			.get(`/api/user/${user.id}`)
			.end((err, res) => {
				expect(res.body.password).to.be.undefined;
				done();
			});
	});

	it("should return a status of 400 for a invalid user", done => {
		chai
			.request(app)
			.get("/api/user/123")
			.end((err, res) => {
				expect(res).to.have.status(400);
				done();
			});
	});
});

describe("POST /api/user", () => {
	before(async () => {
		await prisma.$connect();
		await prisma.user.deleteMany();
	});

	after(async () => {
		await prisma.$disconnect();
	});

	it("Should return status of 201 upon good request", done => {
		chai
			.request(app)
			.post("/api/user")
			.send({ something: "good" })
			.end((err, res) => {
				expect(res).to.have.status(201);
				done();
			});
	});

	it("Should return a status of 400 when no body is passed through the request", done => {
		chai
			.request(app)
			.post("/api/user")
			.end((err, res) => {
				expect(res).to.have.status(400);
				done();
			});
	});
});
