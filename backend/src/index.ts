// import packages and types
import express, { Express } from "express";

// import routes
import userRouter from "./routes/user";
import boardRouter from "./routes/board";
import listRouter from "./routes/list";
import taskRouter from "./routes/task";

const app: Express = express();

app.use("/api/user", userRouter);
app.use("/api/board", boardRouter);
app.use("/api/list", listRouter);
app.use("/api/task", taskRouter);

// listen for requests
const PORT = 3000;
app.listen(PORT, () => console.log(`app running on port ${PORT}`));
