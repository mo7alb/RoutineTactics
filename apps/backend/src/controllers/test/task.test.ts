import sinon from "sinon";
import { Request, Response } from "express";
import { Project, Task } from "@prisma/client";
import { TaskController } from "..";
import { expect } from "chai";
import { after, before, describe, it } from "mocha";
import { prisma } from "../../config/prisma";

const controller = new TaskController();

const mockResponse = {
	status: sinon.stub().returnsThis(),
	sendStatus: sinon.stub().returnsThis(),
	json: sinon.spy(),
};

const mockUser = { uid: "1234" };

describe("Controller createTask", () => {
	let project: Project;

	before(async () => {
		project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});
	});

	after(async () => {
		await prisma.project.deleteMany();
	});

	it("Should return a task with correct data", async () => {
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

	before(async () => {
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

	after(async () => {
		await prisma.project.deleteMany();
	});

	it("Should return a task with correct data for the task creator", async () => {
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

	it("Should return a task with correct data for a member user", async () => {
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

describe("Controller getTasks", () => {
	const mockResponse = {
		status: sinon.stub().returnsThis(),
		sendStatus: sinon.stub().returnsThis(),
		json: sinon.spy(),
	};

	before(async () => {
		const project = await prisma.project.create({
			data: { name: "React", userId: mockUser.uid },
		});

		await prisma.task.createMany({
			data: [
				{
					title: "Code Review",
					projectId: project.id,
					createdById: mockUser.uid,
				},
				{
					title: "New feature",
					projectId: project.id,
					createdById: mockUser.uid,
				},
				{
					title: "New hook",
					projectId: project.id,
					createdById: mockUser.uid,
				},
			],
		});
	});

	after(async () => {
		await prisma.project.deleteMany();
	});

	it("Should return a list of 3 tasks", async () => {
		const mockRequest = {
			user: mockUser,
		};

		await controller.getTasks(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response
		);
		const tasks = mockResponse.json.getCall(0).args[0];
		expect(tasks.length).to.be.equal(3);
	});

	it("Should return a list with correct data", async () => {
		const mockRequest = {
			user: mockUser,
		};

		await controller.getTasks(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response
		);
		const tasks = mockResponse.json.getCall(1).args[0];
		expect(tasks[0]).to.have.deep.property("title", "Code Review");
		expect(tasks[1]).to.have.deep.property("title", "New feature");
	});
});
