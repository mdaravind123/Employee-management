import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const apiClient = axios.create({
  baseURL: "https://employee-manaagement-api.onrender.com/",
});

interface Employee {
  empId: string;
  name: string;
  email: string;
  phone: string;
  dept: string;
  Doj: Date;
  Role: string;
}

interface EmployeeState {
  addEmployee: (employeeData: Employee) => Promise<void>;
}

export const useEmployeeStore = create<EmployeeState>(() => ({
  addEmployee: async (employeeData: Employee) => {
    try {
      const response = await apiClient.post("/api/employee/add", employeeData);
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error occurred");
    }
  },
}));
