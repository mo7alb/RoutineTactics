import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function GET(req: Request, res: Response) {
	res.send("Hello world");
}
