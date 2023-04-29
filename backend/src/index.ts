import express from "express";

// import types
import { Express, Request, Response } from "express";

const app: Express = express();

app.get("/", (req: Request, res: Response) => res.send("Index route"));

const PORT = 3000;

app.listen(PORT, () => console.log(`app running on port ${PORT}`));
