import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function GET(request: Request, response: Response) {
	const projectId = request.params.id;
	const tasks = await prisma.task.findMany({ where: { projectId } });

	response.status(200).json(tasks);
}
