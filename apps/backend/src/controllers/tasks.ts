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

	async getTask(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		try {
			const task = await prisma.task.findUnique({
				where: { id },
				include: {
					project: {
						select: {
							userId: true,
						},
					},
					comments: true,
				},
			});

			if (!task) return response.sendStatus(404);

			if (task.createdById != user.uid && task.project.userId != user.uid) {
				const member = await prisma.projectMember.findFirst({
					where: { projectId: task.projectId, userId: user.uid },
				});
				if (!member) return response.sendStatus(403);
			}

			return response.status(200).json(task);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	async updateTask(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		const { title, description, labels, dueDate, completed } = request.body;

		if (Object.keys(request.body).length === 0 || title == undefined)
			return response.sendStatus(400);

		try {
			const task = await prisma.task.findUnique({
				where: { id },
				include: {
					project: {
						select: {
							userId: true,
							members: { select: { userId: true } },
						},
					},
				},
			});

			if (!task) return response.sendStatus(404);

			if (
				task.createdById !== user.uid &&
				task.project.userId !== user.uid &&
				task.project.members.every(member => member.userId !== user.uid)
			)
				return response.sendStatus(403);

			await prisma.task.update({
				where: { id },
				data: { title, description, labels, dueDate, completed },
			});
			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	async deleteTask(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		try {
			const task = await prisma.task.findUnique({
				where: { id },
				include: {
					project: {
						select: {
							userId: true,
							members: { select: { userId: true } },
						},
					},
				},
			});
			if (!task) return response.sendStatus(404);

			if (task.createdById !== user.uid && task.project.userId !== user.uid)
				return response.sendStatus(403);

			await prisma.comment.deleteMany({ where: { taskId: id } });
			await prisma.task.delete({ where: { id } });
			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}
}

export { TaskController };
