import React, { useEffect, useState } from "react";
import { apiClient } from "../config/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState(
    JSON.parse(localStorage.getItem("user_profile")) || {
      id: "user_" + Date.now(),
      name: "User Baru",
      nim: "0000000000",
      updated_at: new Date().toISOString(),
    }
  );
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    localStorage.setItem("user_profile", JSON.stringify(profile));
    fetchUserReviews();
  }, [profile]);

  const fetchUserReviews = async () => {
    try {
      const res = await apiClient.get(`/api/v1/reviews?user_id=${profile.id}`);
      setReviews(res.data.data || res.data);
    } catch {
      setReviews([]);
    }
  };

  const handleEditProfile = () => {
    const newName = prompt("Masukkan nama baru:", profile.name);
    if (newName && newName.trim() !== "") {
      const updated = { ...profile, name: newName, updated_at: new Date() };
      setProfile(updated);
      localStorage.setItem("user_profile", JSON.stringify(updated));
      alert("Profil berhasil diperbarui!");
    }
  };

  const handleDeleteProfile = () => {
    if (confirm("Yakin ingin menghapus profil ini?")) {
      localStorage.removeItem("user_profile");
      setProfile(null);
    }
  };

  if (!profile)
    return <p className="text-center mt-20 text-gray-600">Profil belum dibuat.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>

      <div className="bg-white border rounded-2xl p-6 flex items-center space-x-4 shadow-sm">
        <img
          src="/default-avatar.png"
          alt="Avatar"
          className="w-24 h-24 rounded-full border"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <p className="text-gray-600">{profile.nim}</p>
          <p className="text-gray-400 text-sm">
            Terakhir diperbarui:{" "}
            {new Date(profile.updated_at).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleEditProfile}
            className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            Edit
          </button>
          <button
            onClick={handleDeleteProfile}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Hapus
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">Riwayat Review Saya</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500">Belum ada review yang kamu buat.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 border rounded-xl shadow-sm cursor-pointer"
              onClick={() => (window.location.href = `/recipe/${r.recipe_id}`)}
            >
              <p className="font-semibold">{r.recipe_title}</p>
              <div className="text-yellow-500">
                {"★".repeat(r.rating) + "☆".repeat(5 - r.rating)}
              </div>
              <p className="text-gray-600">{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
