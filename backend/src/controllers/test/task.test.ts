import sinon from "sinon";
import { Request, Response } from "express";
import { PrismaClient, Project } from "@prisma/client";
import { TaskController } from "../";
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
