import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function POST(req: Request, res: Response) {
	res.status(201);
}
