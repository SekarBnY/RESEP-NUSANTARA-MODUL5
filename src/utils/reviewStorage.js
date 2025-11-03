// src/utils/reviewStorage.js

export const getReviews = (recipeId) => {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '{}')
  return reviews[recipeId] || []
}

export const addReview = (recipeId, newReview) => {
  const reviews = JSON.parse(localStorage.getItem('reviews') || '{}')
  if (!reviews[recipeId]) reviews[recipeId] = []
  reviews[recipeId].push(newReview)
  localStorage.setItem('reviews', JSON.stringify(reviews))
}

export const getAverageRating = (recipeId) => {
  const reviews = getReviews(recipeId)
  if (reviews.length === 0) return 0
  const total = reviews.reduce((sum, r) => sum + r.rating, 0)
  return (total / reviews.length).toFixed(1)
}
