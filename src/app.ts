import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import apiRouter from "./api/v1/routes/index.ts";
import path from "path";
import { __dirname, parentDir } from './config/file.ts';

const app = express();

const PORT = parseInt(process.env.PORT || "8080");

app.use(express.static(path.join(parentDir, "public")));


app.get("/openapi.json", (req, res) => {
  res.sendFile(path.join(parentDir, "public", "openapi.json"));
});

app.use("/api/v1", cors<cors.CorsRequest>(), express.json(), apiRouter);

app.use("*", (_req: Request, res: Response) => {
  const error = new Error("Not Found");
  error.message = "Invalid Route";
  res.status(404).json({
    error: {
      message: error.message,
    },
  });
});

app
  .listen(PORT, "0.0.0.0", () => {
    console.log("Server running at PORT: ", PORT);
  })
  .on("error", (error) => {
    throw new Error(error.message);
  });
