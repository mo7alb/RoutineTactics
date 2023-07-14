import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function GET(request: Request, response: Response) {
	const taskId = request.params.id;
	const comments = await prisma.comment.findMany({ where: { taskId } });
	response.status(200).json(comments);
}
