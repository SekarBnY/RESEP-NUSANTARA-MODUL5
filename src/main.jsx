// src/main.jsx
import React, { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import SplashScreen from './pages/SplashScreen';
import HomePage from './pages/HomePage';
import MakananPage from './pages/MakananPage';
import MinumanPage from './pages/MinumanPage';
import ProfilePage from './pages/ProfilePage';
import FavoritePage from './pages/FavoritePage';
import CreateRecipePage from './pages/CreateRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import EditProfilePage from './pages/EditProfilePage';
import RecipeDetail from './components/recipe/RecipeDetail';
import DesktopNavbar from './components/navbar/DesktopNavbar';
import MobileNavbar from './components/navbar/MobileNavbar';
import PWABadge from './PWABadge';

function AppRoot() {
  // ----------------------------
  // 🧩 STATE MANAGEMENT
  // ----------------------------
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');
  const [mode, setMode] = useState('list'); // 'list', 'detail', 'create', 'edit', 'editProfile'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('makanan');
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [user, setUser] = useState(null);

  // ----------------------------
  // ⏳ HANDLE SPLASH
  // ----------------------------
  const handleSplashComplete = () => setShowSplash(false);

  // ----------------------------
  // 🔗 INITIAL LOAD USER DATA (LocalStorage or Dummy)
  // ----------------------------
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('userData'));
    if (savedUser) {
      setUser(savedUser);
    } else {
      const defaultUser = {
        id: 1,
        uid: 'guest',
        name: 'Tamu',
        bio: 'Pecinta masakan nusantara 🍲',
        avatar_url: 'https://i.pravatar.cc/150?img=32',
      };
      setUser(defaultUser);
      localStorage.setItem('userData', JSON.stringify(defaultUser));
    }
  }, []);

  // ----------------------------
  // 🔗 HANDLE SHAREABLE LINK (?recipe=abc123)
  // ----------------------------
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('recipe');
    if (recipeId) {
      setSelectedRecipeId(recipeId);
      setSelectedCategory('makanan');
      setMode('detail');
    }
  }, []);

  // ----------------------------
  // 🧭 NAVIGATION HANDLERS
  // ----------------------------
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    window.history.pushState({}, '', window.location.origin);
  };

  const handleCreateRecipe = () => setMode('create');
  const handleRecipeClick = (recipeId, category) => {
    setSelectedRecipeId(recipeId);
    setSelectedCategory(category || currentPage);
    setMode('detail');
    window.history.pushState({}, '', `${window.location.origin}?recipe=${recipeId}`);
  };
  const handleEditRecipe = (recipeId) => {
    console.log('✏️ Edit clicked for ID:', recipeId);
    setEditingRecipeId(recipeId);
    setMode('edit');
  };
  const handleBack = () => {
    setMode('list');
    setSelectedRecipeId(null);
    setEditingRecipeId(null);
    window.history.pushState({}, '', window.location.origin);
  };

  const handleEditProfile = () => setMode('editProfile');

  // ----------------------------
  // ✅ CREATE / EDIT SUCCESS
  // ----------------------------
  const handleCreateSuccess = (newRecipe) => {
    alert('🎉 Resep berhasil dibuat!');
    setMode('list');
    if (newRecipe && newRecipe.category) setCurrentPage(newRecipe.category);
  };

  const handleEditSuccess = () => {
    alert('✅ Resep berhasil diperbarui!');
    setMode('list');
  };

  const handleProfileSave = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    alert('✅ Profil berhasil diperbarui!');
    setMode('list');
  };

  // ----------------------------
  // 📄 PAGE RENDER LOGIC
  // ----------------------------
  const renderCurrentPage = () => {
    if (!user) return <p className="text-center mt-10">Loading user...</p>;

    if (mode === 'create') {
      return <CreateRecipePage user={user} onBack={handleBack} onSuccess={handleCreateSuccess} />;
    }

    if (mode === 'edit') {
      return (
        <EditRecipePage
          user={user}
          recipeId={editingRecipeId}
          onBack={handleBack}
          onSuccess={handleEditSuccess}
        />
      );
    }

    if (mode === 'detail') {
      return (
        <RecipeDetail
          recipeId={selectedRecipeId}
          category={selectedCategory}
          user={user}
          onBack={handleBack}
          onEdit={handleEditRecipe}
        />
      );
    }

    if (mode === 'editProfile') {
      return (
        <EditProfilePage
          userId={user.id}
          onBack={handleBack}
          onSave={handleProfileSave}
        />
      );
    }

    // Default page routes
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
      case 'makanan':
        return <MakananPage user={user} onRecipeClick={handleRecipeClick} />;
      case 'minuman':
        return <MinumanPage user={user} onRecipeClick={handleRecipeClick} />;
      case 'favorite':
        return <FavoritePage user={user} onRecipeClick={handleRecipeClick} />;
      case 'profile':
        return (
          <ProfilePage
            user={user}
            onEditProfile={handleEditProfile}
            onRecipeClick={handleRecipeClick}
            onUserChange={setUser} // 🔹 Tambahan agar ProfilePage bisa sync user
          />
        );
      default:
        return <HomePage user={user} onRecipeClick={handleRecipeClick} onNavigate={handleNavigation} />;
    }
  };

  // ----------------------------
  // 🚀 SPLASH SCREEN DISPLAY
  // ----------------------------
  if (showSplash) return <SplashScreen onComplete={handleSplashComplete} />;

  // ----------------------------
  // 🧱 MAIN APP STRUCTURE
  // ----------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {mode === 'list' && (
        <>
          <DesktopNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
          <MobileNavbar
            currentPage={currentPage}
            onNavigate={handleNavigation}
            onCreateRecipe={handleCreateRecipe}
          />
        </>
      )}

      <main className="min-h-screen">{renderCurrentPage()}</main>
      <PWABadge />
    </div>
  );
}

// ----------------------------
// 🧠 ROOT RENDER
// ----------------------------
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
);
