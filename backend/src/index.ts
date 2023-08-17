import express, { Express } from "express";

// import userRouter from "./routes/user";
import projectRouter from "./routes/projects";
import Authentication from "./middleware/authentication";
// import taskRouter from "./routes/tasks";
// import commentRouter from "./routes/comments";

const app: Express = express();

app.use(express.json());
app.use(Authentication.decodeToken);
<<<<<<< HEAD

=======
>>>>>>> 8a0c1b9 (Added authentication verification to the backend)
// app.use("/api/users", userRouter);
app.use("/api/projects", projectRouter);
// app.use("/api/tasks", taskRouter);
// app.use("/api/comments", commentRouter);

// listen for requests
const PORT = 3000;
app.listen(PORT, () => console.log(`app running on port ${PORT}`));

export default app;
