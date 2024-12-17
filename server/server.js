"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const route_1 = __importDefault(require("./routes/route"));
dotenv_1.default.config();
const port = process.env.PORT || 8080;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/employee", route_1.default);
app.get("/", (_, res) => {
    res.status(200).json({ statusCode: 200, msg: "working....." });
});
app.listen(port, () => {
    console.log(`Port is listening at ${port}`);
});
