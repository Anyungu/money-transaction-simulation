"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsRouter = void 0;
var express_1 = require("express");
var express_api_reference_1 = require("@scalar/express-api-reference");
exports.docsRouter = express_1.default.Router();
exports.docsRouter.use("/", (0, express_api_reference_1.apiReference)({
    spec: {
        url: "/openapi.json",
    },
    theme: "purple",
}));
