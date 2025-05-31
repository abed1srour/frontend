"use client";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ComplaintSuccess() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-white text-gray-800 px-4">
      <div className="bg-white p-6 sm:p-10 rounded-lg shadow-lg text-center w-full max-w-md">
        <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">تم إرسال الشكوى بنجاح</h1>
        <p className="mb-6 text-sm text-gray-600">
          شكراً لتواصلك معنا. سنقوم بمراجعة الشكوى في أقرب وقت ممكن.
        </p>
        <button
          onClick={() => router.push("/complaints")}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition"
        >
          إرسال شكوى جديدة
        </button>
      </div>
    </main>
  );
}
