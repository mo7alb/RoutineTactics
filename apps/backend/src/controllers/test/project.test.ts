import sinon from "sinon";
import { Request, Response } from "express";
import { PrismaClient, Project } from "@prisma/client";
import { ProjectController } from "..";
import { expect } from "chai";
import { describe, it, before, after, afterEach, beforeEach } from "mocha";

const prisma = new PrismaClient();

const controller = new ProjectController();

const mockResponse = {
	status: sinon.stub().returnsThis(),
	sendStatus: sinon.stub().returnsThis(),
	json: sinon.spy(),
};

describe("Controller createProject", () => {
	const mockRequest = {
		user: { uid: "123" },
		body: { name: "torch", description: "A chess engine" },
	};

	beforeEach(async () => {
		await prisma.$connect();
	});

	afterEach(async () => {
		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
		await prisma.$disconnect();
	});

	it("Should return a project with correct data", async () => {
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

describe("Controller getProjects", () => {
	const mockUser = { uid: "12345" };
	const mockUser2 = { uid: "123456" };
	const mockUser3 = { uid: "1234561" };

	before(async function () {
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

	after(async function () {
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
		expect(projects.every((project: Project) => project.description === null))
			.to.be.true;
	});
});

describe("Controller getProject", () => {
	const mockUser = { uid: "12345" };

	let project: Project;

	beforeEach(async function () {
		await prisma.$connect();
		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
		project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});
	});

	afterEach(async function () {
		await prisma.projectMember.deleteMany();
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

	it("Should return a project with correct data for a project member", async () => {
		await prisma.projectMember.create({
			data: { projectId: project.id, userId: "55555" },
		});
		await controller.getProject(
			// @ts-ignore
			{
				params: { id: project.id },
				user: { uid: "55555" },
			} as unknown as Request,
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

	it("Should return a project with 1 task within it", async () => {
		await prisma.task.create({
			data: {
				title: "Some task",
				projectId: project.id,
				createdById: mockUser.uid,
			},
		});
		const res = {
			status: sinon.stub().returnsThis(),
			sendStatus: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};
		await controller.getProject(
			{
				params: { id: project.id },
				user: { uid: mockUser.uid },
			} as unknown as Request,
			res as unknown as Response
		);

		const json = res.json.getCall(0).args[0];
		expect(json.Task.length).to.be.equal(1);
	});

	it("Should return a project with task having a correct title", async () => {
		await prisma.task.create({
			data: {
				title: "Some task",
				projectId: project.id,
				createdById: mockUser.uid,
			},
		});
		const res = {
			status: sinon.stub().returnsThis(),
			sendStatus: sinon.stub().returnsThis(),
			json: sinon.spy(),
		};
		await controller.getProject(
			{
				params: { id: project.id },
				user: { uid: mockUser.uid },
			} as unknown as Request,
			res as unknown as Response
		);

		const json = res.json.getCall(0).args[0];

		expect(json.Task[0]).to.have.deep.property("title", "Some task");
	});
});
