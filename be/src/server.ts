import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import logger from "jet-logger";
import cors from "cors";

import BaseRouter from "@src/routes";

import Paths from "@src/common/constants/Paths";
import ENV from "@src/common/constants/ENV";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { RouteError } from "@src/common/util/route-errors";
import { NodeEnvs } from "@src/common/constants";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (ENV.NodeEnv === NodeEnvs.Dev) {
  app.use(morgan("dev"));
}

if (ENV.NodeEnv === NodeEnvs.Production) {
  if (!process.env.DISABLE_HELMET) {
    app.use(helmet());
  }
}

app.use(Paths.Base, BaseRouter);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

app.get("/", (_: Request, res: Response) => {
  return res.redirect("/users");
});

app.get("/users", (_: Request, res: Response) => {
  return res.sendFile("users.html", { root: viewsDir });
});

export default app;
