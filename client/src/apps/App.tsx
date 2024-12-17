// src/App.tsx
import React from "react";
import EmployeeForm from "../components/EmployeeForm";
import { Toaster } from "react-hot-toast";
import "../styles/App.css";

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <Toaster />
      <EmployeeForm />
    </div>
  );
};

export default App;
