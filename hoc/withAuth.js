"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (Component) => {
  return function ProtectedComponent(props) {
    const router = useRouter();

    useEffect(() => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/nova");
      }
    }, []);

    return <Component {...props} />;
  };
};

export default withAuth;
