import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function GET(request: Request, response: Response) {
	const projects = await prisma.project.findMany();
	response.status(200).json(projects);
}
