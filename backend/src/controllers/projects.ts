import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { User } from "firebase/auth";
import { Project } from "@prisma/client";

class ProjectController {
	public async createProject(request: Request, response: Response) {
		const body = request.body;

		if (!body) return response.sendStatus(400);
		const { name, description, dueDate, categories } = body;

		if (name == "" || name == null) return response.sendStatus(400);

		try {
			// @ts-ignore
			const uid = request.user.uid;
			const newProject = await prisma.project.create({
				data: {
					name,
					description,
					dueDate,
					categories,
					userId: uid,
				},
			});

			return response.status(201).json(newProject);
		} catch (error) {
			return response.sendStatus(500);
		}
	}

	public async getProjects(request: Request, response: Response) {
		// @ts-ignore
		const uid = request.user.uid;
		try {
			let projects: Project[] = await prisma.project.findMany({
				where: { userId: uid },
				include: {},
			});
			const relations = await prisma.projectMember.findMany({
				where: { userId: uid },
			});

			for (const relation of relations) {
				const project = await prisma.project.findUnique({
					where: { id: relation.projectId },
				});
				if (project == null) continue;

				projects = [...projects, project];
			}

			return response.json(projects).sendStatus(200);
		} catch (error) {
			return response.sendStatus(500);
		}
	}

	public async getProject(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		try {
			const project = await prisma.project.findUnique({
				where: { id },
				include: { Task: true },
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
		} catch {
			return response.sendStatus(500);
		}
	}

	public async deleteProject(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;
		try {
			const project = await prisma.project.findUnique({ where: { id } });
			if (project == null) return response.sendStatus(404);

			if (project.userId !== user.uid) return response.sendStatus(403);

			await prisma.projectMember.deleteMany({ where: { projectId: id } });
			await prisma.project.delete({ where: { id } });
			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}
}

export { ProjectController };
