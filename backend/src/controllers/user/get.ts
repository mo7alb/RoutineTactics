import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function GET(request: Request, response: Response) {
	const userID = request.params.id;
	const user = await prisma.user.findFirst({
		where: {
			id: userID,
		},
	});

	if (user == null)
		return response.sendStatus(400).json({ message: "Invalid User ID" });

	response.status(200).json({
		id: user.id,
		email: user.email,
		boards: [],
	});
}
