import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function DELETE(request: Request, response: Response) {
	const projectId = request.params.id;

	try {
		const project = await prisma.project.findFirst({
			where: { id: projectId },
		});

		if (project == null) {
			return response.sendStatus(400);
		}

		response.status(200).json(project);
	} catch (e) {
		response.status(500).send(e);
	}
}
