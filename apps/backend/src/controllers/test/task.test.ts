import sinon from "sinon";
import { Request, Response } from "express";
import { PrismaClient, Project, Task } from "@prisma/client";
import { TaskController } from "..";
import { expect } from "chai";
import { after, before, describe, it } from "mocha";

const prisma = new PrismaClient();

const controller = new TaskController();

const mockResponse = {
	status: sinon.stub().returnsThis(),
	sendStatus: sinon.stub().returnsThis(),
	json: sinon.spy(),
};

const mockUser = { uid: "1234" };

describe("Controller createTask", () => {
	let project: Project;

	before(async function () {
		await prisma.$connect();
		project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});
	});

	after(async function () {
		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a task with correct data", async function () {
		const mockRequest = {
			user: mockUser,
			body: { title: "Code Review", projectId: project.id },
		};

		await controller.createTask(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response
		);

		expect(
			mockResponse.json.calledWithMatch({
				title: "Code Review",
				projectId: project.id,
			})
		);
	});
});

describe("Controller getTask", () => {
	let task: Task;

	before(async function () {
		await prisma.$connect();
		const project = await prisma.project.create({
			data: { name: "Tailwind", userId: mockUser.uid },
		});
		task = await prisma.task.create({
			data: {
				title: "New css rule",
				createdById: mockUser.uid,
				projectId: project.id,
			},
		});
	});

	after(async function () {
		await prisma.task.deleteMany();
		await prisma.projectMember.deleteMany();
		await prisma.project.deleteMany();
	});

	it("Should return a task with correct data for the task creator", async function () {
		const mockRequest = {
			user: mockUser,
			params: { id: task.id },
		};

		await controller.getTask(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response
		);

		expect(
			mockResponse.json.calledWithMatch({
				title: task.title,
				projectId: task.projectId,
				Comment: [],
			})
		);
	});

	it("Should return a task with correct data for a member user", async function () {
		const memberUser = { uid: "999" };

		await prisma.projectMember.create({
			data: { projectId: task.projectId, userId: memberUser.uid },
		});

		const mockRequest = {
			user: memberUser,
			params: { id: task.id },
		};

		await controller.getTask(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response
		);

		expect(
			mockResponse.json.calledWithMatch({
				title: task.title,
				projectId: task.projectId,
				Comment: [],
			})
		);
	});
});
