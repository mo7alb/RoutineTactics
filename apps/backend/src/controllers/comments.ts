import { Request, Response } from "express";
import { User } from "firebase/auth";
import { prisma } from "../config/prisma";

class CommentController {
	async createComment(request: Request, response: Response) {
		const { comment, taskId } = request.body;

		if (
			Object.keys(request.body).length === 0 ||
			comment == undefined ||
			taskId == undefined
		)
			return response.sendStatus(400);

		// @ts-ignore
		const user: User = request.user;

		try {
			const task = await prisma.task.findUnique({
				where: { id: taskId },
				include: {
					project: {
						select: {
							userId: true,
							members: { select: { userId: true } },
						},
					},
				},
			});

			if (!task) return response.sendStatus(400);
			if (
				task.createdById !== user.uid &&
				task.project.userId !== user.uid &&
				task.project.members.every(member => member.userId !== user.uid)
			)
				return response.sendStatus(403);

			const _comment = await prisma.comment.create({
				data: { comment, userId: user.uid, taskId: taskId },
			});

			return response.status(201).json(_comment);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	async updateComment(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		const { _comment } = request.body;
		if (_comment == undefined) return response.sendStatus(400);

		try {
			const comment = await prisma.comment.findUnique({
				where: { id },
				include: {
					task: {
						select: {
							createdById: true,
							project: { select: { id: true, userId: true } },
						},
					},
				},
			});

			if (!comment) return response.sendStatus(404);
			if (
				comment.userId !== user.uid &&
				comment.task.createdById !== user.uid &&
				comment.task.project.userId !== user.uid
			) {
				return response.sendStatus(403);
			}

			await prisma.comment.update({
				where: { id },
				data: { comment: _comment },
			});

			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	async deleteComment(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;
		try {
			const comment = await prisma.comment.findUnique({
				where: { id },
				include: {
					task: {
						select: {
							createdById: true,
							project: { select: { id: true, userId: true } },
						},
					},
				},
			});

			if (!comment) return response.sendStatus(404);
			if (
				comment.userId !== user.uid &&
				comment.task.createdById !== user.uid &&
				comment.task.project.userId !== user.uid
			) {
				return response.sendStatus(403);
			}

			await prisma.comment.delete({ where: { id } });
			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}
}

export { CommentController };
