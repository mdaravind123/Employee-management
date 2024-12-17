import { Router } from "express";
import { addEmployee } from "../controllers/employeeController";

const route = Router();

route.post("/add", addEmployee);

export default route;
