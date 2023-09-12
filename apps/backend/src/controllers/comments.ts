import { Request, Response } from "express";
import { User } from "firebase/auth";
import { prisma } from "../config/prisma";

/**
 * A controller class for all comment related tasks
 */
class CommentController {
	/**
	 * Queries database for a single comment and responds with it
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	async getComment(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { id } = request.params;

		try {
			const comment = await prisma.comment.findUnique({
				where: { id },
				include: {
					task: {
						select: {
							id: true,
							createdById: true,
							project: { select: { userId: true } },
						},
					},
				},
			});

			if (comment == null) return response.sendStatus(404);

			if (
				user.uid !== comment.userId &&
				user.uid !== comment.task.createdById &&
				comment.task.project.userId !== user.uid
			)
				return response.sendStatus(403);

			return response.status(200).json(comment);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Makes changes to the database by adding a new comment
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
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

	/**
	 * Makes changes to the database by editing an existing comment
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	async updateComment(request: Request, response: Response) {
		const id = request.params.id;
		// @ts-ignore
		const user: User = request.user;

		const { comment } = request.body;
		if (comment == undefined) return response.sendStatus(400);

		try {
			const _comment = await prisma.comment.findUnique({
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

			if (!_comment) return response.sendStatus(404);
			if (
				_comment.userId !== user.uid &&
				_comment.task.createdById !== user.uid &&
				_comment.task.project.userId !== user.uid
			) {
				return response.sendStatus(403);
			}

			await prisma.comment.update({
				where: { id },
				data: { comment },
			});

			return response.sendStatus(204);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Makes changes to the database by deleting an existing comment
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
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
