"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmployee = void 0;
const config_1 = __importDefault(require("../db/config"));
const zod_1 = __importDefault(require("zod"));
const allowedRoles = ["Manager", "Developer", "Designer", "Analyst"];
const employeeSchema = zod_1.default.object({
    empId: zod_1.default
        .string()
        .min(1, "EmpId is required")
        .max(20, "Maximum length is 20")
        .regex(/^[a-zA-Z0-9]+$/, "Invalid Employee ID"),
    name: zod_1.default
        .string()
        .min(1, "Name is required")
        .max(50, "Name length must be less than 50")
        .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and space"),
    email: zod_1.default.string().min(1, "Email is required").email("Invalid Email"),
    phone: zod_1.default
        .string()
        .min(1, "Phone No is required")
        .regex(/^\d{10}$/, "Must be 10 digits"),
    dept: zod_1.default.enum(["HR", "Engineering", "Marketing", "Sales"], {
        required_error: "Department is required",
        invalid_type_error: "Invalid Department",
    }),
    Doj: zod_1.default
        .date()
        .refine((value) => value <= new Date(), "Future Dates are not accepted"),
    Role: zod_1.default
        .string()
        .min(1, "Role is required")
        .refine((role) => allowedRoles.includes(role), `Role must be one of: ${allowedRoles.join(", ")}`),
});
const addEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const validData = employeeSchema.parse(Object.assign(Object.assign({}, req.body), { Doj: new Date(req.body.Doj) }));
        const existingEmployee = yield config_1.default.employee.findFirst({
            where: {
                OR: [{ empId: validData.empId }, { email: validData.email }],
            },
        });
        if (existingEmployee) {
            res.status(400).json({
                success: false,
                message: "Employee Id or email already Exists",
            });
            return;
        }
        yield config_1.default.employee.create({ data: validData });
        res.status(201).json({
            success: true,
            message: "Employee added Successfully",
        });
        return;
    }
    catch (error) {
        if (error instanceof zod_1.default.ZodError) {
            res.status(400).json({
                success: false,
                message: ((_a = error.errors[0]) === null || _a === void 0 ? void 0 : _a.message) || "Validation Error",
            });
            return;
        }
        console.error("Unexpected Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
        return;
    }
});
exports.addEmployee = addEmployee;
