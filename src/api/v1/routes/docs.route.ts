import express from "express";
import { apiReference } from "@scalar/express-api-reference";

export const docsRouter = express.Router();

docsRouter.use(
  "/",
  apiReference({
    spec: {
      url: "/openapi.json",
    },
    theme: "purple",
  })
);
