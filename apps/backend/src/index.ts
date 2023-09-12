import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import Authentication from "./middleware/authentication";
import {
	InvitationRouter,
	ProjectRouter,
	TaskRouter,
	CommentRouter,
	ProjectMemberRouter,
	UserRouter,
} from "./routes";

const app: Express = express();

app.use(express.json());

// authenticate all incoming requests
app.use(Authentication.decodeToken);

// Map all routes to respective routers§
app.use("/api/user", UserRouter);
app.use("/api/projects", ProjectRouter);
app.use("/api/projects/members", ProjectMemberRouter);
app.use("/api/invitations", InvitationRouter);
app.use("/api/tasks", TaskRouter);
app.use("/api/comments", CommentRouter);

// listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`app running on port ${PORT}`));

export default app;
