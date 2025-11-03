// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import ProfileForm from "../components/ProfileForm";
import ProfileCard from "../components/ProfileCard";
import { getProfile, saveProfile, deleteProfile } from "../utils/profileService";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [mode, setMode] = useState("view"); // 'view' | 'edit' | 'create'

  useEffect(() => {
    const p = getProfile();
    if (p) {
      setProfile(p);
      setMode("view");
    } else {
      setMode("create");
    }
  }, []);

  function handleSave(newProfile) {
    const saved = saveProfile(newProfile);
    setProfile(saved);
    setMode("view");
    alert("Profil tersimpan.");
  }

  function handleEdit() {
    setMode("edit");
  }

  function handleDelete() {
    const sure = confirm("Yakin ingin menghapus profil?");
    if (!sure) return;
    deleteProfile();
    setProfile(null);
    setMode("create");
    alert("Profil dihapus.");
  }

  function handleCancel() {
    setMode(profile ? "view" : "create");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profil Saya</h1>

      {mode === "view" && profile && (
        <ProfileCard profile={profile} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {(mode === "create" || mode === "edit") && (
        <ProfileForm initial={mode === "edit" ? profile : null} onSave={handleSave} onCancel={handleCancel} />
      )}
    </div>
  );
}
