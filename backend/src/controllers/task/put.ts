import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function PUT(req: Request, res: Response) {
	res.send("Hello world");
}