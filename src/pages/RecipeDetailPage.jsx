import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiClient } from "../config/api";

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchRecipe();
    fetchReviews();
  }, [id]);

  const fetchRecipe = async () => {
    const res = await apiClient.get(`/api/v1/recipes/${id}`);
    setRecipe(res.data);
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setIsFavorite(favorites.some((fav) => fav.id === res.data.id));
  };

  const fetchReviews = async () => {
    const res = await apiClient.get(`/api/v1/reviews?recipe_id=${id}`);
    setReviews(res.data.data || res.data);
  };

  const handleSubmitReview = async () => {
    const userProfile =
      JSON.parse(localStorage.getItem("user_profile")) || {
        id: "guest",
        name: "Pengguna Anonim",
      };

    await apiClient.post(`/api/v1/reviews`, {
      recipe_id: id,
      rating,
      comment,
      user_id: userProfile.id,
      user_name: userProfile.name,
    });

    setRating(0);
    setComment("");
    fetchReviews();
  };

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

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="w-full h-64 object-cover rounded-2xl"
      />
      <div className="flex justify-between items-center mt-4">
        <h1 className="text-3xl font-bold">{recipe.title}</h1>
        <button
          onClick={toggleFavorite}
          className={`px-4 py-2 rounded-lg font-semibold ${
            isFavorite ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          {isFavorite ? "❤️ Hapus dari Favorit" : "🤍 Tambah ke Favorit"}
        </button>
      </div>

      <p className="text-gray-600 mt-2">{recipe.description}</p>

      <hr className="my-6" />
      <h2 className="text-2xl font-semibold mb-3">Ulasan ({reviews.length})</h2>

      <div className="space-y-4 mb-6">
        {reviews.map((rev, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm">
            <p className="font-semibold text-gray-800">{rev.user_name}</p>
            <div className="text-yellow-500">
              {"★".repeat(rev.rating) + "☆".repeat(5 - rev.rating)}
            </div>
            <p className="text-gray-700">{rev.comment}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-100 p-4 rounded-xl">
        <h3 className="font-semibold mb-2">Tulis Ulasan</h3>
        <div className="flex space-x-1 mb-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              onClick={() => setRating(num)}
              className={`text-2xl ${
                num <= rating ? "text-yellow-500" : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>
        <textarea
          className="w-full p-2 border rounded-lg"
          placeholder="Tulis komentar..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          onClick={handleSubmitReview}
          className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}
