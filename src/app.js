"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var summary_route_ts_1 = require("./api/v1/routes/summary.route.ts");
var path_1 = require("path");
var file_ts_1 = require("./config/file.ts");
var app = (0, express_1.default)();
var PORT = parseInt(process.env.PORT || "8080");
app.use(express_1.default.static(path_1.default.join(file_ts_1.parentDir, "public")));
app.get("/openapi.json", function (req, res) {
    res.sendFile(path_1.default.join(file_ts_1.parentDir, "public", "openapi.json"));
});
app.use("/api/v1", (0, cors_1.default)(), express_1.default.json(), summary_route_ts_1.default);
app.use("*", function (_req, res) {
    var error = new Error("Not Found");
    error.message = "Invalid Route";
    res.status(404).json({
        error: {
            message: error.message,
        },
    });
});
app
    .listen(PORT, "0.0.0.0", function () {
    console.log("Server running at PORT: ", PORT);
})
    .on("error", function (error) {
    throw new Error(error.message);
});
