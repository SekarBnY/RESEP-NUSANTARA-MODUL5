// src/components/ProfileCard.jsx
import React from "react";

export default function ProfileCard({ profile, onEdit, onDelete }) {
  if (!profile) return null;
  return (
    <div className="max-w-xl p-6 border rounded shadow-sm bg-white">
      <div className="flex items-center gap-4">
        <img
          src={profile.avatarDataUrl || "/default-avatar.png"}
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-gray-600">{profile.bio}</p>
          <p className="text-xs text-gray-400 mt-2">Terakhir diperbarui: {new Date(profile.updatedAt ?? Date.now()).toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={onEdit} className="px-3 py-1 rounded bg-yellow-400 text-white">Edit</button>
        <button onClick={onDelete} className="px-3 py-1 rounded bg-red-500 text-white">Hapus</button>
      </div>
    </div>
  );
}
