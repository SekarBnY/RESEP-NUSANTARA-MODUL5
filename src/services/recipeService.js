import { apiClient } from "../config/api";

class RecipeService {
  /**
   * Get all recipes with optional filters
   * @param {Object} params - Query parameters
   */
  async getRecipes(params = {}) {
    try {
      const response = await apiClient.get("/api/v1/recipes", { params });
      return response;
    } catch (error) {
      console.error("❌ Error fetching recipes:", error);
      throw error;
    }
  }

  /**
   * Get recipe by ID
   * @param {string} id - Recipe ID
   */
  async getRecipeById(id) {
    try {
      const response = await apiClient.get(`/api/v1/recipes/${id}`);
      return response;
    } catch (error) {
      console.error("❌ Error fetching recipe:", error);
      throw error;
    }
  }

  /**
   * Create a new recipe
   * @param {Object} recipeData - Recipe data
   */
  async createRecipe(recipeData) {
    try {
      const response = await apiClient.post("/api/v1/recipes", recipeData);
      return response;
    } catch (error) {
      console.error("❌ Error creating recipe:", error);
      throw error;
    }
  }

  /**
   * Update an existing recipe — ensures image, ingredients, and steps are preserved if not updated
   * @param {string} id - Recipe ID
   * @param {Object} recipeData - Partial or full recipe data
   */
  async updateRecipe(id, recipeData) {
    try {
      // Step 1: Get current recipe
      const existing = await this.getRecipeById(id);
      const currentData = existing?.data?.data || existing?.data;

      if (!currentData) throw new Error("Recipe not found for update");

      // Step 2: Merge with existing data
      const mergedData = {
        ...currentData,
        ...recipeData,
        ingredients: recipeData.ingredients?.length
          ? recipeData.ingredients
          : currentData.ingredients,
        steps: recipeData.steps?.length ? recipeData.steps : currentData.steps,
        image_url: recipeData.image_url || currentData.image_url,
      };

      // Step 3: Send merged data (PATCH for partial update)
      const response = await apiClient.patch(`/api/v1/recipes/${id}`, mergedData);
      return response;
    } catch (error) {
      console.error("❌ Error updating recipe:", error);
      throw error;
    }
  }

  /**
   * Partially update recipe (explicitly use PATCH)
   * @param {string} id - Recipe ID
   * @param {Object} partialData - Only fields to update
   */
  async patchRecipe(id, partialData) {
    try {
      const response = await apiClient.patch(`/api/v1/recipes/${id}`, partialData);
      return response;
    } catch (error) {
      console.error("❌ Error patching recipe:", error);
      throw error;
    }
  }

  /**
   * Delete recipe
   * @param {string} id - Recipe ID
   */
  async deleteRecipe(id) {
    try {
      const response = await apiClient.delete(`/api/v1/recipes/${id}`);
      return response;
    } catch (error) {
      console.error("❌ Error deleting recipe:", error);
      throw error;
    }
  }

  /**
   * Upload image (used in create/edit)
   * @param {File} file
   */
  async uploadImage(file) {
    if (!file) throw new Error("No file provided");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await apiClient.post("/api/v1/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response;
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      throw error;
    }
  }
}

// ✅ Export as default instance
export default new RecipeService();
