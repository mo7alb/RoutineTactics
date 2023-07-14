import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function DELETE(request: Request, response: Response) {
	response.send("Hello world");
}
