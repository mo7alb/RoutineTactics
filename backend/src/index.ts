// import packages and types
import express, { Express } from "express";

// import routes
import userRouter from "./routes/user";
import projectRouter from "./routes/project";
import taskRouter from "./routes/task";
import commentRouter from "./routes/comments";

const app: Express = express();

app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/comments", commentRouter);

// listen for requests
const PORT = 3000;
app.listen(PORT, () => console.log(`app running on port ${PORT}`));

export default app;
