// src/components/ProfileForm.jsx
import React, { useState, useEffect } from "react";

export default function ProfileForm({ initial = null, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [avatarDataUrl, setAvatarDataUrl] = useState(initial?.avatarDataUrl ?? "");
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    // keep form controlled when initial changes (edit mode)
    setName(initial?.name ?? "");
    setBio(initial?.bio ?? "");
    setAvatarDataUrl(initial?.avatarDataUrl ?? "");
  }, [initial]);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingImage(true);
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarDataUrl(reader.result.toString());
      setLoadingImage(false);
    };
    reader.onerror = () => {
      console.error("Error reading image");
      setLoadingImage(false);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) {
      alert("Nama tidak boleh kosong");
      return;
    }
    onSave({
      ...initial,
      id: initial?.id ?? "user_" + Date.now(),
      name: name.trim(),
      bio: bio.trim(),
      avatarDataUrl: avatarDataUrl ?? "",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nama</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Nama kamu"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Tuliskan bio singkat..."
          rows={4}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Foto Profil</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {loadingImage && <p className="text-xs mt-1">Memproses gambar...</p>}
        {avatarDataUrl && (
          <img
            src={avatarDataUrl}
            alt="avatar preview"
            className="mt-2 w-28 h-28 object-cover rounded-full border"
          />
        )}
      </div>

      <div className="flex gap-2">
        <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">
          Simpan
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
