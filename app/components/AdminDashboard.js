"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Menu, X, Loader, CheckCircle, AlertCircle, AlertTriangle, Clock,
  Image as ImageIcon, LogOut, MapPin, Phone, FileText, EyeOff, Eye, Download
} from "lucide-react";

function AdminDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("new");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewImages, setPreviewImages] = useState([]);
  const [showConfirm, setShowConfirm] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [hideConfirm, setHideConfirm] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const endpoint =
          filter === "hidden"
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/complaints/hidden`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/complaints`;
        const res = await fetch(endpoint);
        const data = await res.json();
        setComplaints(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching complaints", err);
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [filter]);
  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\s+/g, ""); // Remove spaces
    return cleaned.startsWith("+")
      ? cleaned.replace("+", "")
      : "961" + cleaned;
  };



  const updateStatus = async (id) => {
    if (!selectedStatus || showConfirm !== id) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: selectedStatus }),
      });
      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: selectedStatus } : c))
      );
      setShowConfirm(null);
      setSelectedStatus("");
    } catch (err) {
      alert("فشل التحديث");
    }
  };

  const toggleHideComplaint = async (id, hide) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: hide ? "hidden" : "new" }),
      });
      setComplaints((prev) =>
        hide
          ? prev.filter((c) => c._id !== id)
          : prev.map((c) => (c._id === id ? { ...c, status: "new" } : c))
      );
      setHideConfirm(null);
    } catch (err) {
      alert("فشل في التغيير");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin/nova");
  };

  const downloadAllImages = () => {
    previewImages.forEach((img) => {
      const link = document.createElement("a");
      link.href = `${process.env.NEXT_PUBLIC_API_URL}/download/${encodeURIComponent(img)}`;
      link.download = img;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  const statusIcons = {
    new: (
      <>
        <AlertCircle className="w-4 h-4 text-green-600" />
        <span className="text-sm text-green-700">جديدة</span>
      </>
    ),
    "in-progress": (
      <>
        <Clock className="w-4 h-4 text-yellow-500" />
        <span className="text-sm text-yellow-600">قيد المعالجة</span>
      </>
    ),
    resolved: (
      <>
        <CheckCircle className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-700">تم الحل</span>
      </>
    ),
    ignored: (
      <>
        <AlertTriangle className="w-4 h-4 text-red-600" />
        <span className="text-sm text-red-700">تم التجاهل</span>
      </>
    ),
  };

  const filteredComplaints = filter === "all"
    ? complaints
    : complaints.filter((c) => c.status === filter || (filter === "hidden" && c.status === "hidden"));
  return (
    <div className="flex min-h-screen bg-gray-100 flex-row-reverse" dir="rtl">
      {/* Sidebar */}
      <aside className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-20 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "translate-x-full"} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-blue-800">صندوق شكاوى البازورية</h2>
          <button className="lg:hidden text-black" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-2 text-black">
          {["all", "new", "in-progress", "resolved", "ignored"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`w-full text-right px-4 py-2 rounded ${filter === s ? "bg-blue-100" : "hover:bg-blue-50"}`}
            >
              {s === "new"
                ? "جديدة"
                : s === "in-progress"
                  ? "قيد المعالجة"
                  : s === "resolved"
                    ? "تم الحل"
                    : s === "ignored"
                      ? "تم التجاهل"
                      : s === "all"
                        ? "الكل"
                        : ""}
            </button>
          ))}
          <div className="mt-4 border-t pt-4">
            <button
              onClick={() => setFilter("hidden")}
              className={`w-full text-right px-4 py-2 rounded ${filter === "hidden" ? "bg-red-100 text-red-800" : "text-red-600 hover:bg-red-50"}`}
            >
              الشكاوى المخفية
            </button>
          </div>
        </nav>
        <div className="absolute bottom-4 right-4">
          <button onClick={logout} className="flex items-center text-red-600 hover:text-red-800">
            <LogOut className="w-5 h-5 ml-2" /> <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 p-6 lg:mr-64">
        <div className="relative mb-6">
          {/* Sidebar toggle button (top left on small screens) */}
          <button
            className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6 text-blue-700" />
          </button>

          {/* Centered heading */}
          <h1 className="text-2xl font-bold text-blue-900 text-center">
            صندوق شكاوى البازورية
          </h1>
        </div>


        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : filteredComplaints.length === 0 ? (
          <p className="text-center text-gray-600">لا توجد شكاوى حالياً</p>
        ) : (
          <div className="grid gap-6">
            {filteredComplaints.map((c) => (
              <div key={c._id} className="bg-white p-4 rounded-lg shadow border text-black text-right">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-blue-800">{c.category}</h2>
                  <div className="flex items-center gap-2 text-sm">{statusIcons[c.status]}</div>
                </div>

                {/* Complaint Info */}
                <div className="mb-3 space-y-3 text-right">
                  {/* Message */}
                  <div className="flex flex-row-reverse items-center text-base text-gray-800">
                    <FileText className="w-4 h-4 ml-2" />
                    <span className="ml-auto">{c.message}</span>
                    <span className="font-semibold">محتوى الشكوى: {"  "}</span>
                  </div>
                  {/* Location */}
                  <div className="flex flex-row-reverse items-center text-base text-gray-800">
                    <MapPin className="w-4 h-4 ml-2" />
                    <span className="ml-auto">{c.location}</span>
                    <span className="font-semibold">الموقع: {"  "}</span>
                  </div>
                  {/* Phone */}
                  <div className="flex flex-row-reverse items-center text-base text-gray-800">
                    <Phone className="w-4 h-4 ml-2" />
                    <span className="ml-auto">{c.phone || "غير متوفر"}</span>
                    <span className="font-semibold">الهاتف: {"  "}</span>
                  </div>
                </div>

                {/* Show Images Button */}
                {c.photoUrls?.length > 0 && (
                  <button
                    onClick={() => setPreviewImages(c.photoUrls)}
                    className="text-sm text-blue-700 underline mb-2 flex justify-end items-center gap-1"
                  >
                    <ImageIcon className="w-4 h-4" /> عرض الصور
                  </button>
                )}




                {/* Status Buttons */}
                <div className="flex flex-wrap gap-2 justify-end mt-2">
                  {c.phone && (
                    <a
                      href={`https://wa.me/${formatPhoneForWhatsApp(c.phone)}?text=${encodeURIComponent(
                        "شكرًا لتواصلكم. تم استلام الشكوى وسنعمل على حلّها بأقرب وقت."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 rounded border border-green-500 text-green-700 hover:bg-green-50 ms-auto"
                    >
                      إرسال رد عبر واتساب
                    </a>
                  )}
                  {Object.keys(statusIcons).map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSelectedStatus(s);
                        setShowConfirm(c._id);
                      }}
                      className={`text-xs px-2 py-1 rounded border ${c.status === s
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                    >
                      {s === "new"
                        ? "جديدة"
                        : s === "in-progress"
                          ? "قيد المعالجة"
                          : s === "resolved"
                            ? "تم الحل"
                            : "تم التجاهل"}
                    </button>
                  ))}




                  <button
                    onClick={() => setHideConfirm(c._id)}
                    className="text-xs px-2 py-1 rounded border text-red-600 border-red-400 hover:bg-red-50 flex items-center gap-1"
                  >
                    {filter === "hidden" ? (
                      <>
                        <Eye className="w-4 h-4" /> إظهار
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" /> إخفاء
                      </>
                    )}
                  </button>
                </div>


                {/* Confirm Status */}
                {showConfirm === c._id && (
                  <div className="mt-4 p-2 border border-blue-300 rounded bg-blue-50">
                    <p className="text-sm mb-2">هل أنت متأكد من تغيير الحالة إلى: <strong>{selectedStatus}</strong>؟</p>
                    <button onClick={() => updateStatus(c._id)} className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded text-sm">تأكيد</button>
                    <button onClick={() => setShowConfirm(null)} className="mr-2 text-sm text-gray-600 hover:underline">إلغاء</button>
                  </div>
                )}

                {/* Confirm Hide */}
                {hideConfirm === c._id && (
                  <div className="mt-4 p-2 border border-red-300 rounded bg-red-50">
                    <p className="text-sm mb-2">هل تريد {filter === "hidden" ? "إظهار" : "إخفاء"} هذه الشكوى؟</p>
                    <button
                      onClick={() => toggleHideComplaint(c._id, filter !== "hidden")}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      تأكيد
                    </button>
                    <button onClick={() => setHideConfirm(null)} className="mr-2 text-sm text-gray-600 hover:underline">إلغاء</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Image Preview Modal */}
        {previewImages.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-4xl w-full relative">
              <div className="absolute top-2 left-2 flex items-center gap-2">
                <button
                  onClick={() => setPreviewImages([])}
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 p-1 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    previewImages.forEach((img) => {
                      const link = document.createElement("a");
                      link.href = `${process.env.NEXT_PUBLIC_API_URL}/download/${encodeURIComponent(img)}`;
                      link.download = img;
                      link.target = "_blank";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    });
                  }}
                  className="text-white bg-blue-600 hover:bg-blue-700 p-1 rounded flex items-center gap-1 text-sm"
                >
                  <Download className="w-4 h-4" />
                  تحميل الكل
                </button>
              </div>

              <h3 className="text-lg font-semibold mb-4 text-black border-b pb-2 text-right">الصور المرفقة</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {previewImages.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${img}`} // ✅ dynamic backend path
                      alt={`صورة ${i + 1}`}
                      className="w-full h-48 object-cover rounded border"
                    />
                  </div>
                ))}


              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



export default AdminDashboard
