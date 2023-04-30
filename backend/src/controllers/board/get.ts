import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function GET(request: Request, response: Response) {
	const boardId = request.params.id;

	try {
		const board = await prisma.board.findFirst({ where: { id: boardId } });

		if (board == null) {
			return response.sendStatus(400);
		}

		response.status(200).json(board);
	} catch (e) {
		response.status(500).send(e);
	}
}
