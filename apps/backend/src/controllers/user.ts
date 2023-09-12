import { Request, Response } from "express";
import { User } from "firebase/auth";
import { prisma } from "../config/prisma";

class UserController {
	/**
	 * Updates database by creating a new user
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	async createUser(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { notificationToken } = request.body;

		try {
			await prisma.user.create({
				data: {
					id: user.uid,
					email: user.email as string,
					notificationToken,
				},
			});

			return response.sendStatus(204);
		} catch (error) {
			console.log(error);
			return response.sendStatus(500);
		}
	}

	/**
	 * Updates database by updating a existing user
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	async updateToken(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { notificationToken } = request.body;

		try {
			const _user = await prisma.user.findUnique({
				where: { id: user.uid },
			});

			if (!_user) return response.sendStatus(400);

			await prisma.user.update({
				where: { id: _user.id },
				data: { notificationToken },
			});

			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}
}

export { UserController };
