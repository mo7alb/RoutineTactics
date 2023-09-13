import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { User } from "firebase/auth";

class TaskController {
	/**
	 * Makes changes to the database by creating a new Task
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
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
					dueDate: dueDate == null ? null : new Date(dueDate),
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

	/**
	 * Queries database for a list of tasks
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	async getTasks(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;
		try {
			const projects = await prisma.project.findMany({
				where: { userId: user.uid },
				include: { tasks: true },
			});

			const members = await prisma.projectMember.findMany({
				where: { userId: user.uid },
				include: { project: { select: { tasks: true } } },
			});

			let tasksList = projects.map(project => project.tasks);

			tasksList = tasksList.concat(
				members.map(member => member.project.tasks)
			);

			let tasks = tasksList.flat();

			tasks = tasks.filter(task => !task.completed);

			return response.status(200).json(tasks);
		} catch (error) {
			console.log(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Queries database for a single task
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
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
					assignedTo: true,
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

	/**
	 * Makes changes to the database by updating an existing task
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	async updateTask(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		const { title, description, labels, dueDate, completed, assignedToId } =
			request.body;

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
				data: {
					title,
					description,
					labels,
					dueDate,
					completed,
					assignedToId,
				},
			});
			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Makes changes to the database by deleting an existing task
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
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
