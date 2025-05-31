"use client";
import { useState } from "react";
import { Plus, Camera, Folder } from "lucide-react";
import { useRouter } from 'next/navigation';


export default function ComplaintForm() {
  const [form, setForm] = useState({
    category: "",
    location: "",
    message: "",
    phone: "",
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files].slice(0, 10),
    }));
  };

  const removeImage = (index) => {
    const updated = [...form.photos];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, photos: updated }));
  };
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (key !== "photos") {
        if (value) formData.append(key, value);
      }
    });

    form.photos.forEach((file) => {
      formData.append("photos", file);
    });

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/complaints`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/complaints/success"); // ✅ Make sure this route exists
      } else {
        alert(data.message || "❌ فشل في إرسال الشكوى.");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      alert("❌ تعذر الاتصال بالخادم.");
    }
  };


  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-800 px-4">
      <div className="w-full max-w-2xl bg-white text-right rounded-xl shadow-lg p-8 border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">
          📝 إرسال شكوى
        </h1>

        <form
          className="space-y-6"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div>
            <label className="block mb-1 font-semibold">الفئة</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="">اختر الفئة</option>
              <option>نفايات</option>
              <option>طرقات</option>
              <option>إنارة</option>
              <option>ضوضاء</option>
              <option>مياه </option>
              <option>روائح كريهة</option>
              <option>ازدحام مروري</option>
              <option>مخالفات بناء</option>
              <option>نقص خدمات</option>
              <option>أخرى</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-semibold">الموقع</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              placeholder="مثال: الشارع الرئيسي قرب الحديقة"
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold">محتوى الشكوى</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
              required
              placeholder="أدخل تفاصيل المشكلة هنا..."
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 font-semibold">رقم الهاتف (اختياري)</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+961..."
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">الصور (اختياري)</label>
            <div className="flex flex-wrap justify-center gap-4">
              <label
                htmlFor="photo-gallery"
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition text-center"
              >
                <Folder className="w-7 h-7 text-gray-400" />
                <span className="text-sm text-gray-500 mt-1">من الجهاز</span>
              </label>
              <input
                type="file"
                id="photo-gallery"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <label
                htmlFor="photo-camera"
                className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-400 rounded-lg cursor-pointer hover:bg-gray-100 transition text-center"
              >
                <Camera className="w-7 h-7 text-gray-400" />
                <span className="text-sm text-gray-500 mt-1">استخدام الكاميرا</span>
              </label>
              <input
                type="file"
                id="photo-camera"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {form.photos.length > 0 && (
              <div className="mt-4 border rounded-md p-3 bg-gray-50">
                <h4 className="text-sm font-semibold mb-2">الصور المرفقة:</h4>
                <div className="flex flex-wrap gap-2">
                  {form.photos.map((file, index) => (
                    <div key={index} className="relative w-20 h-20">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="w-full h-full object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">عدد الصور: {form.photos.length}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded"
          >
            إرسال
          </button>
        </form>
      </div>
    </main>
  );
}
