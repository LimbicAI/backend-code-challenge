import express from "express";
import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
const app = express();
import helmet from "helmet";
import bodyParser from "body-parser";
import connectorDb from "./Helper/Dbconnector";
import * as dotenv from "dotenv";
import PostRoute from "./Routes/PostRoute";
import UserRoute from "./Routes/UserRoute";
import morgan from "morgan";
import path from "path";

dotenv.config();

app.use(helmet());
app.use(bodyParser.json());

//Logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "requests.log"),
  { flags: "a" }
);
app.use(morgan("combined", { stream: accessLogStream }));

const dbConnectionString: string = process.env.DB_CONNECTION ?? "";
const server_port = process.env.SERVER_PORT ?? "";

connectorDb(dbConnectionString);

//user route
app.use("/user", UserRoute);
//post route
app.use("/post", PostRoute);

//404 response
app.use((error: any, res: Response, next: NextFunction) => {
  try {
    res.status(404).send("Resource not found");
  } catch (error) {
    next(error);
  }
});

app.use((error: any, res: Response, next: NextFunction) => {
  try {
    const status = error.status || 500;
    const message =
      error.message ||
      "There was an error while processing your request, please try again";
    return res.status(status).send({
      status,
      message,
    });
  } catch (error) {
    next(error);
  }
});
const port = server_port || 3000;
app.listen(port, () => {
  console.log(`Application listening on ${port}...`);
});

export default app;
