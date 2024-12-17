import { Router } from "express";
import { addEmployee } from "../controllers/employeeController";

const route = Router();
route.get("/add", (_, res) => {
  res.status(200).json({ statusCode: 200, msg: "this route is working" });
});
route.post("/add", addEmployee);

export default route;
