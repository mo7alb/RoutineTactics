import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import admin from "../config/firebaseAdminConfig";
import { User } from "firebase/auth";

class ProjectMembersController {
	public async createProjectMember(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { email, projectId } = request.body;
		if (email == undefined || projectId == undefined)
			return response.sendStatus(400);
		try {
			const project = await prisma.project.findUnique({
				where: { id: projectId },
			});

			if (project == null) return response.sendStatus(400);
			if (project.userId !== user.uid) return response.sendStatus(403);

			const member = await admin.auth().getUserByEmail(email);
			await prisma.projectMemberNotification.create({
				data: {
					userId: member.uid,
					projectId: projectId,
				},
			});
			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}

	public async acceptProjectMember(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { notificationId } = request.body;
		try {
			const notification = await prisma.projectMemberNotification.findUnique(
				{ where: { id: notificationId } }
			);

			if (notification == null) return response.sendStatus(400);
			if (notification.userId !== user.uid) return response.sendStatus(403);

			await prisma.projectMember.create({
				data: {
					userId: notification.userId,
					projectId: notification.projectId,
				},
			});

			await prisma.projectMemberNotification.delete({
				where: { id: notification.id },
			});

			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}

	public async rejectProjectMember(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { notificationId } = request.body;
		try {
			const notification = await prisma.projectMemberNotification.findUnique(
				{ where: { id: notificationId } }
			);

			if (notification == null) return response.sendStatus(400);
			if (notification.userId !== user.uid) return response.sendStatus(403);

			await prisma.projectMemberNotification.delete({
				where: { id: notification.id },
			});

			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}

	public async deleteProjectMember(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { membershipId } = request.body;
		try {
			const membership = await prisma.projectMember.findUnique({
				where: { id: membershipId },
			});

			if (membership == null) return response.sendStatus(400);

			const project = await prisma.project.findUnique({
				where: { id: membership.projectId },
			});

			if (user.uid !== membership.userId && user.uid !== project?.userId)
				return response.sendStatus(403);

			await prisma.projectMember.delete({ where: { id: membership.id } });
			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}
}

export { ProjectMembersController };
