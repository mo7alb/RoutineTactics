import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { User } from "firebase/auth";
import { Project } from "@prisma/client";

/**
 * Controller for all project related tasks and operations
 */
class ProjectController {
	/**
	 * Makes changes to the database by creating a new project
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	public async createProject(request: Request, response: Response) {
		const body = request.body;

		if (!body) return response.sendStatus(400);
		const { name, description, dueDate, categories } = body;

		if (name == "" || name == null) return response.sendStatus(400);

		try {
			// @ts-ignore
			const uid = request.user.uid;
			await prisma.project.create({
				data: {
					name,
					description,
					dueDate: dueDate != null ? new Date(dueDate) : null,
					categories,
					userId: uid,
				},
			});

			return response.sendStatus(201);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Queries the database and returns a list of projects
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	public async getProjects(request: Request, response: Response) {
		// @ts-ignore
		const uid = request.user.uid;
		try {
			let projects: Project[] = await prisma.project.findMany({
				where: { userId: uid },
			});
			const relations = await prisma.projectMember.findMany({
				where: { userId: uid },
				include: { project: true },
			});

			return response
				.status(200)
				.json([
					...projects,
					...relations.map(relations => relations.project),
				]);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Queries the database and returns a single project
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	public async getProject(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		try {
			const project = await prisma.project.findUnique({
				where: { id },
				include: { tasks: true, members: true },
			});

			if (project == null) return response.sendStatus(404);

			if (project.userId != user.uid) {
				const relation = await prisma.projectMember.findFirst({
					where: { userId: user.uid, projectId: id },
				});
				if (!relation) return response.sendStatus(403);
			}

			return response.status(200).json(project);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Makes changes to the database by updating an existing project
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	public async updateProject(request: Request, response: Response) {
		const id = request.params.id;

		const { name, description, dueDate, categories } = request.body;

		// @ts-ignore
		const user: User = request.user;

		try {
			const project = await prisma.project.findUnique({ where: { id } });
			if (project == null) return response.sendStatus(404);

			if (project.userId != user.uid) return response.sendStatus(403);

			if (
				request.body.constructor === Object &&
				Object.keys(request.body).length === 0
			)
				return response.sendStatus(400);
			await prisma.project.update({
				where: { id },
				data: { name, description, dueDate, categories },
			});
			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Makes changes to the database by deleting an existing project
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	public async deleteProject(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;
		try {
			const project = await prisma.project.findUnique({
				where: { id },
			});
			if (project == null) return response.sendStatus(404);

			if (project.userId !== user.uid) return response.sendStatus(403);

			await prisma.project.delete({ where: { id } });
			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}
}

export { ProjectController };
