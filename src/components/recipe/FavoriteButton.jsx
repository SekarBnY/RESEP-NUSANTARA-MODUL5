import { useState, useEffect } from "react";

export default function FavoriteButton({ recipe }) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some((fav) => fav.id === recipe.id));
  }, [recipe.id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    let updated;

    if (isFavorite) {
      updated = favorites.filter((fav) => fav.id !== recipe.id);
    } else {
      updated = [...favorites, recipe];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
        isFavorite ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {isFavorite ? "❤️ Favorit" : "🤍 Tambah Favorit"}
    </button>
  );
}
