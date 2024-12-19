import { Request, Response } from "express";
import prisma from "../db/config";
import z from "zod";

const allowedRoles = ["Manager", "Developer", "Designer", "Analyst"];

const employeeSchema = z.object({
  empId: z
    .string()
    .min(1, "EmpId is required")
    .max(20, "Maximum length is 20")
    .regex(/^[a-zA-Z0-9]+$/, "Invalid Employee ID"),
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name length must be less than 50")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and space"),
  email: z.string().min(1, "Email is required").email("Invalid Email"),
  phone: z
    .string()
    .min(1, "Phone No is required")
    .regex(/^\d{10}$/, "Must be 10 digits"),
  dept: z.enum(["HR", "Engineering", "Marketing", "Sales"], {
    required_error: "Department is required",
    invalid_type_error: "Invalid Department",
  }),
  Doj: z
    .date()
    .refine((value) => value <= new Date(), "Future Dates are not accepted"),
  Role: z
    .string()
    .min(1, "Role is required")
    .refine(
      (role) => allowedRoles.includes(role),
      `Role must be one of: ${allowedRoles.join(", ")}`
    ),
});

export const addEmployee = async (req: Request, res: Response) => {
  try {
    const validData = employeeSchema.parse({
      ...req.body,
      Doj: new Date(req.body.Doj),
    });
    const existingEmployee = await prisma.employee.findFirst({
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
    await prisma.employee.create({ data: validData });
    res.status(201).json({
      success: true,
      message: "Employee added Successfully",
    });
    return;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: error.errors[0]?.message || "Validation Error",
      });
      return;
    }
    console.error("Internal Server Error", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    return;
  }
};
