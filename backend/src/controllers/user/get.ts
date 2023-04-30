import { Request, Response } from "express";
import { prisma } from "../../utils/prisma";

export async function GET(request: Request, response: Response) {
	response.send("Hello world");
}
