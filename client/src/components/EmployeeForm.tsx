import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEmployeeStore } from "../hooks/store";
import { toast } from "react-hot-toast";

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
    .string()
    .refine((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime()) && date <= new Date();
    }, "Future Dates are not accepted")
    .transform((value) => new Date(value)),
  Role: z
    .string()
    .min(1, "Role is required")
    .refine(
      (role) => allowedRoles.includes(role),
      `Role must be one of: ${allowedRoles.join(", ")}`
    ),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

const EmployeeForm: React.FC = () => {
  const { addEmployee } = useEmployeeStore();
  const {
    register,
    handleSubmit,
    reset, // Import reset from react-hook-form to reset the form
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: EmployeeFormData) => {
    await addEmployee(data); // Add employee logic
    reset(); // Reset form fields after successful submission
  };

  const onError = (errors: any) => {
    const errorMessages = Object.values(errors)
      .map((error) =>
        error && typeof error === "object" && "message" in error
          ? (error as { message: string }).message
          : "An unknown error occurred"
      )
      .join(", "); // Combine error messages into a single string

    if (errorMessages) {
      toast.error(errorMessages); // Show a single toast
    }
  };

  return (
    <div className="w-[30%] mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Add New Employee
      </h2>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Employee ID
          </label>
          <input
            {...register("empId")}
            type="text"
            autoComplete="off"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.empId && (
            <p className="text-red-500 text-base">{errors.empId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name")}
            autoComplete="off"
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            {...register("email")}
            autoComplete="off"
            type="email"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            {...register("phone")}
            autoComplete="off"
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            {...register("dept")}
            autoComplete="off"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
          </select>
          {errors.dept && (
            <p className="text-red-500 text-xs">{errors.dept.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date of Joining
          </label>
          <input
            {...register("Doj")}
            type="date"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            max={new Date().toISOString().split("T")[0]}
          />
          {errors.Doj && (
            <p className="text-red-500 text-xs">{errors.Doj.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <input
            {...register("Role")}
            autoComplete="off"
            type="text"
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {errors.Role && (
            <p className="text-red-500 text-xs">{errors.Role.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeForm;
