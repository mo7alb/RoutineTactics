import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import admin from "../config/firebaseAdminConfig";
import { User } from "firebase/auth";

class ProjectMembersController {
	// route to delete a member
	public async deleteProjectMember(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { id } = request.params;
		try {
			const membership = await prisma.projectMember.findUnique({
				where: { id },
			});

			if (membership == null) return response.sendStatus(404);

			const project = await prisma.project.findUnique({
				where: { id: membership.projectId },
			});

			if (user.uid !== membership.userId && user.uid !== project!.userId)
				return response.sendStatus(403);

			await prisma.projectMember.delete({ where: { id: membership.id } });
			return response.sendStatus(204);
		} catch {
			return response.sendStatus(500);
		}
	}

	// route to response with a list of project members
	public async getProjectMembers(request: Request, response: Response) {
		// @ts-ignore
		const user = request.user;
		const { id } = request.params;

		try {
			const project = await prisma.project.findUnique({
				where: { id },
				include: { members: { select: { userId: true } } },
			});

			if (project == null) return response.sendStatus(404);

			if (
				project.userId !== user.uid &&
				project.members.indexOf(user.uid) === -1
			)
				return response.sendStatus(403);

			const userIdentifiers = [
				{ uid: project.userId },
				...project.members.map(member => ({
					uid: member.userId,
				})),
			];
			const users = await admin.auth().getUsers(userIdentifiers);
			return response.status(200).json(users);
		} catch (error) {
			console.log(error);
			return response.sendStatus(500);
		}
	}
}

export { ProjectMembersController };
