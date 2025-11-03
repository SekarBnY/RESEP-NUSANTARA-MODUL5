import React, { useEffect, useState } from "react";

export default function FavoritePage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Resep Favorit Saya</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">Kamu belum menambahkan resep ke favorit.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
              onClick={() => (window.location.href = `/recipe/${r.id}`)}
            >
              <img
                src={r.image_url}
                alt={r.title}
                className="w-full h-40 object-cover rounded-t-2xl"
              />
              <div className="p-4">
                <h2 className="font-semibold text-gray-800">{r.title}</h2>
                <p className="text-gray-500 text-sm">{r.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
