import express from "express";
import { prisma } from "./utils/prisma";

// import types
import { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", async (req: Request, res: Response) => {
	const users = await prisma.user.findMany();

	res.status(200).json(users);
});

const PORT = 3000;

app.listen(PORT, () => console.log(`app running on port ${PORT}`));
