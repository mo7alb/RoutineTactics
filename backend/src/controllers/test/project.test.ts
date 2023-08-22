import sinon from "sinon";
import { Request, Response } from "express";
import { PrismaClient, Project } from "@prisma/client";
import { ProjectController } from "../projects";

import { expect } from "chai";
import { afterEach, beforeEach, describe, it } from "mocha";

const prisma = new PrismaClient();

const controller = new ProjectController();

const mockResponse = {
	status: sinon.stub().returnsThis(),
	sendStatus: sinon.stub().returnsThis(),
	json: sinon.spy(),
};

describe("Controller create project", () => {
	const mockRequest = {
		user: { uid: "123" },
		body: { name: "torch", description: "A chess engine" },
	};

	beforeEach(async function () {
		await prisma.$connect();
	});

	afterEach(async function () {
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return correct data", async () => {
		await controller.createProject(
			// @ts-ignore
			mockRequest as Request,
			mockResponse as unknown as Response
		);
		expect(
			mockResponse.json.calledWithMatch({
				name: "torch",
				description: "A chess engine",
				userId: "123",
				dueDate: null,
			})
		).to.be.true;
	});
});

describe("Controller get projects", () => {
	const mockUser = { uid: "12345" };
	const mockUser2 = { uid: "123456" };
	const mockUser3 = { uid: "1234561" };

	beforeEach(async function () {
		await prisma.$connect();
		await prisma.project.createMany({
			data: [
				{ name: "React", userId: mockUser.uid },
				{ name: "Tailwind", userId: mockUser2.uid },
				{ name: "Prisma", userId: mockUser3.uid },
			],
		});
		const project = await prisma.project.findFirst({
			where: { name: "React" },
		});
		if (project == null) throw new Error();
		await prisma.projectMember.create({
			data: {
				userId: mockUser3.uid,
				projectId: project.id,
			},
		});
	});

	afterEach(async function () {
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return correct number of projects for a user", async () => {
		await controller.getProjects(
			{ user: mockUser3 } as unknown as Request,
			mockResponse as unknown as Response
		);

		const projects = mockResponse.json.getCall(1).args[0];

		expect(projects.length).to.be.equal(2);
	});

	it("Should return correct projects with correct data", async () => {
		await controller.getProjects(
			{ user: mockUser3 } as unknown as Request,
			mockResponse as unknown as Response
		);

		const projects = mockResponse.json.getCall(1).args[0];
		expect(projects.some((project: Project) => project.name === "React")).to
			.be.true;
		expect(projects.some((project: Project) => project.name === "Prisma")).to
			.be.true;
		expect(projects.some((project: Project) => project.description === null))
			.to.be.true;
	});
});

describe("Controller get project", () => {
	const mockUser = { uid: "12345" };

	let project: Project;

	beforeEach(async function () {
		await prisma.$connect();
		project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});
	});

	afterEach(async function () {
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return an object with a name of react", async () => {
		await controller.getProject(
			{
				params: { id: project.id },
				user: mockUser,
			} as unknown as Request,
			mockResponse as unknown as Response
		);

		const json = mockResponse.json.getCall(3).args[0];
		expect(json).to.have.property("name", "React");
		expect(json).to.have.property("description", null);
	});
});
