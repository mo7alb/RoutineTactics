import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import admin from "../config/firebaseAdminConfig";
import { User } from "firebase/auth";

/**
 * Controller for project member related tasks
 */
class ProjectMembersController {
	/**
	 * Makes changes to the database by deleting a project member
	 * It can either be the project owner deleting an member or a member leaving
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
	public async deleteProjectMember(request: Request, response: Response) {
		// @ts-ignore
		const user: User = request.user;

		const { id } = request.params;
		const { userId } = request.body;

		try {
			const membership = await prisma.projectMember.findFirst({
				where: {
					projectId: id,
					userId: userId == undefined ? user.uid : userId,
				},
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

	/**
	 * Queries database for a list of project members for a given project
	 * @param request Express request object
	 * @param response Express response object
	 * @returns Express response
	 */
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
				project.members.every(member => member.userId !== user.uid)
			) {
				return response.sendStatus(403);
			}

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
