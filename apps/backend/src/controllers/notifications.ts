import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { Task } from "@prisma/client";

class NotificationController {
	public async sendNotification(request: Request, response: Response) {
		// @ts-ignore
		const user = request.user;
		try {
			const membershipNotification =
				await prisma.projectMemberNotification.findMany({
					where: { userId: user.uid },
				});

			const projects = await prisma.project.findMany({
				where: { userId: user.uid },
				include: {
					members: { where: { userId: user.uid } },
					tasks: true,
				},
			});

			const tasks: Task[] = projects
				.map(project => project.tasks)
				.flatMap(task => task);

			const taskNotifications = tasks.filter(
				task =>
					task.dueDate != null &&
					(task.dueDate == date || task.dueDate < date)
			);

			const date = new Date();
			const projectNotifications = projects.filter(
				project =>
					project.dueDate != null &&
					(project.dueDate == date || project.dueDate < date)
			);

			if (membershipNotification != null)
				return response
					.send(200)
					.json({ ...membershipNotification, type: "ProjectMembership" });
			else if (projectNotifications.length != 0)
				return response
					.send(200)
					.json({ ...projectNotifications, type: "ProjectDeadline" });
			else if (taskNotifications.length != 0)
				return response
					.send(200)
					.json({ ...taskNotifications, type: "TaskDeadline" });
			else return response.send(200).json(null);
		} catch {
			return response.sendStatus(500);
		}
	}
}

export { NotificationController };
