"use client";
import withAuth from "@/hoc/withAuth";
import AdminDashboard from "@/app/components/AdminDashboard";

const ProtectedDashboard = withAuth(AdminDashboard);
export default ProtectedDashboard;
