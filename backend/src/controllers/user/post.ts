import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function POST(request: Request, response: Response) {
	response.status(201).send("Hello world");
}
