import express, { Express } from "express";

import Authentication from "./middleware/authentication";
import { ProjectRouter } from "./routes";
import { TaskRouter } from "./routes";
// import commentRouter from "./routes/comments";

const app: Express = express();

app.use(express.json());
app.use(Authentication.decodeToken);

app.use("/api/projects", ProjectRouter);
app.use("/api/tasks", TaskRouter);
// app.use("/api/comments", commentRouter);

// listen for requests
const PORT = 3000;
app.listen(PORT, () => console.log(`app running on port ${PORT}`));

export default app;
