"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const employeeController_1 = require("../controllers/employeeController");
const route = (0, express_1.Router)();
route.get("/add", (_, res) => {
    res.status(200).json({ statusCode: 200, msg: "this route is working" });
});
route.post("/add", employeeController_1.addEmployee);
exports.default = route;
