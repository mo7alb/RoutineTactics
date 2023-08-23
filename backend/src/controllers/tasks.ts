import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { User } from "firebase/auth";

class TaskController {
	async createTask(request: Request, response: Response) {
		const { title, description, labels, dueDate, projectId } = request.body;
		// @ts-ignore
		const user: User = request.user;

		// check if correct data is being passed to the request
		if (title == null || projectId == null) {
			return response.sendStatus(400);
		}

		try {
			// check if project id passed in is a valid project
			const project = await prisma.project.findUnique({
				where: { id: projectId },
			});

			if (!project) {
				return response.sendStatus(400);
			}

			// check if user has access to the project
			if (project.userId != user.uid) {
				const relation = await prisma.projectMember.findFirst({
					where: { projectId, userId: user.uid },
				});
				if (!relation) {
					return response.sendStatus(403);
				}
			}

			const task = await prisma.task.create({
				data: {
					title,
					description,
					labels,
					dueDate,
					projectId,
					createdById: user.uid,
				},
			});

			return response.status(201).json(task);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	async getTask(request: Request, response: Response) {}

	async updateTask(request: Request, response: Response) {}

	async deleteTask(request: Request, response: Response) {}
}

export { TaskController };
