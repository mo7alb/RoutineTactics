import { Request, Response } from "express";
import { prisma } from "../config/prisma";

class InvitationController {
	async createInvitation(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { email, projectId } = request.body;
		if (
			Object.keys(request.body).length !== 2 ||
			email == undefined ||
			projectId == undefined
		)
			return response.sendStatus(400);

		try {
			const project = await prisma.project.findUnique({
				where: { id: projectId },
			});
			if (project == null) return response.sendStatus(400);

			const reciever = await prisma.user.findFirst({ where: { email } });
			if (reciever == null) return response.sendStatus(404);

			await prisma.invitations.create({
				data: {
					userId: reciever.id,
					senderId: user.uid,
					projectId: project.id,
				},
			});

			await fetch("https://expo.dev/api/v2/push/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token: reciever.notificationToken,
				}),
			});

			return response.sendStatus(201);
		} catch {
			return response.sendStatus(500);
		}
	}

	async updateInvitation(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { id } = request.params;
		const { status } = request.body;

		if (Object.keys(request.body).length !== 2 || status == undefined)
			return response.sendStatus(400);
		if (["ACCEPTED", "REJECTED"].indexOf(status) === -1)
			return response.sendStatus(400);

		try {
			const invitation = await prisma.invitations.findUnique({
				where: { id: parseInt(id) },
			});

			if (!invitation) return response.sendStatus(404);

			if (invitation.userId !== user.uid) return response.sendStatus(403);

			if (status == "ACCEPTED") {
				await prisma.projectMember.create({
					data: {
						userId: invitation.userId,
						projectId: invitation.projectId,
					},
				});
			}

			await prisma.invitations.update({
				where: { id: invitation.id },
				data: { status },
			});
			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}

	async getInvitations(request: Request, response: Response) {
		// @ts-ignore
		const user = request.user;

		try {
			const invitations = await prisma.invitations.findMany({
				where: { userId: user.uid },
			});
			return response.status(200).json(invitations);
		} catch (error) {
			console.error(error);
			return response.sendStatus(500);
		}
	}
}

export { InvitationController };
