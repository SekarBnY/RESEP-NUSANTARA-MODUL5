import React, { useEffect, useState } from "react";
import { apiClient } from "../config/api";
import { ArrowLeft, Upload, UserCircle } from "lucide-react";

const EditProfilePage = ({ userId, onBack }) => {
  const [user, setUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // --------------------------
  // 🔹 Fetch user data
  // --------------------------
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient.get(`/api/v1/users/${userId}`);
        setUser(response.data.data || response.data);
        setPreview(response.data.data?.avatar_url);
      } catch (error) {
        console.error("❌ Error loading profile:", error);
        alert("Gagal memuat profil");
      }
    };
    fetchUser();
  }, [userId]);

  // --------------------------
  // 🖼️ Handle image upload
  // --------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUser((prev) => ({ ...prev, avatarFile: file }));
    const reader = new FileReader();
    reader.onload = (event) => setPreview(event.target.result);
    reader.readAsDataURL(file);
  };

  // --------------------------
  // 💾 Save profile changes
  // --------------------------
  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      let avatarUrl = user.avatar_url;

      // Jika user mengganti foto, upload dulu
      if (user.avatarFile) {
        const formData = new FormData();
        formData.append("file", user.avatarFile);
        const uploadRes = await apiClient.post("/api/v1/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        avatarUrl = uploadRes.data.url;
      }

      // Update profil
      const updated = {
        name: user.name,
        bio: user.bio,
        avatar_url: avatarUrl,
      };
      await apiClient.patch(`/api/v1/users/${userId}`, updated);

      alert("✅ Profil berhasil diperbarui!");
      if (onBack) onBack();
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      alert("Gagal memperbarui profil");
    } finally {
      setIsSaving(false);
    }
  };

  // --------------------------
  // 🧱 Render UI
  // --------------------------
  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Memuat data profil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-100 to-white flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
        {/* 🔙 Back button */}
        <button
          onClick={onBack}
          className="absolute left-4 top-4 flex items-center text-gray-600 hover:text-orange-500"
        >
          <ArrowLeft size={20} className="mr-1" /> Kembali
        </button>

        {/* 🧑 Profile Picture */}
        <div className="flex flex-col items-center mt-8">
          <div className="relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-orange-300 shadow-md"
              />
            ) : (
              <UserCircle className="w-28 h-28 text-gray-400" />
            )}
            <label className="absolute bottom-1 right-1 bg-orange-500 p-2 rounded-full cursor-pointer shadow-lg hover:bg-orange-600 transition">
              <Upload className="text-white w-4 h-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
          <p className="text-gray-500 text-sm">Ubah profil kamu</p>
        </div>

        {/* ✏️ Edit Form */}
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nama</label>
            <input
              type="text"
              value={user.name || ""}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={user.bio || ""}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="w-full border rounded-lg p-2 mt-1 h-24 resize-none focus:ring-2 focus:ring-orange-400 outline-none"
              placeholder="Tulis sedikit tentang dirimu..."
            ></textarea>
          </div>
        </div>

        {/* 💾 Save Button */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded-lg shadow-md transition"
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </div>
  );
};

export default EditProfilePage;
