import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import recipeService from "../services/recipeService"; // ✅ Correct import

const EditRecipePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- State management ---
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    ingredients: [],
    steps: [],
    image_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // --- Fetch recipe data when page loads ---
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getRecipeById(id);
        const data = response?.data?.data || response?.data;
        setRecipe(data);
      } catch (err) {
        console.error("❌ Error loading recipe:", err);
        setError("Failed to load recipe data.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id]);

  // --- Handle input changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- Handle ingredients and steps ---
  const handleArrayChange = (e, field, index) => {
    const newArr = [...recipe[field]];
    newArr[index] = e.target.value;
    setRecipe((prev) => ({ ...prev, [field]: newArr }));
  };

  const handleAddField = (field) => {
    setRecipe((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const handleRemoveField = (field, index) => {
    const newArr = recipe[field].filter((_, i) => i !== index);
    setRecipe((prev) => ({ ...prev, [field]: newArr }));
  };

  // --- Handle image upload (optional) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
  };

  // --- Submit form to update recipe ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      let imageUrl = recipe.image_url;

      // If new image selected, upload it first
      if (selectedImage) {
        const uploadRes = await recipeService.uploadImage(selectedImage);
        imageUrl = uploadRes?.data?.url || uploadRes?.data?.image_url;
      }

      // Combine updated data
      const updatedRecipe = {
        ...recipe,
        image_url: imageUrl,
      };

      await recipeService.updateRecipe(id, updatedRecipe);

      alert("✅ Recipe updated successfully!");
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error("❌ Error updating recipe:", err);
      alert("Failed to update recipe. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading recipe...</p>;
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">Edit Recipe</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={recipe.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={recipe.description}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg p-2"
            required
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="block font-medium mb-1">Ingredients</label>
          {recipe.ingredients.map((item, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange(e, "ingredients", index)}
                className="flex-1 border rounded-lg p-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveField("ingredients", index)}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("ingredients")}
            className="text-blue-600"
          >
            + Add Ingredient
          </button>
        </div>

        {/* Steps */}
        <div>
          <label className="block font-medium mb-1">Steps</label>
          {recipe.steps.map((step, index) => (
            <div key={index} className="flex mb-2">
              <textarea
                value={step}
                onChange={(e) => handleArrayChange(e, "steps", index)}
                rows="2"
                className="flex-1 border rounded-lg p-2"
              />
              <button
                type="button"
                onClick={() => handleRemoveField("steps", index)}
                className="ml-2 text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAddField("steps")}
            className="text-blue-600"
          >
            + Add Step
          </button>
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1">Recipe Image</label>
          {recipe.image_url && (
            <img
              src={recipe.image_url}
              alt="Recipe"
              className="w-32 h-32 object-cover rounded mb-2"
            />
          )}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          {loading ? "Updating..." : "Update Recipe"}
        </button>
      </form>
    </div>
  );
};

export default EditRecipePage;
