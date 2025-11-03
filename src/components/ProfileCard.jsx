// src/utils/profileService.js
const KEY = "resipn_profile_v1";

/**
 * profile = {
 *   id: string,
 *   name: string,
 *   bio: string,
 *   avatarDataUrl: string, // base64 data url atau empty string
 *   updatedAt: ISOString
 * }
 */

export function getProfile() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("getProfile error", err);
    return null;
  }
}

export function saveProfile(profile) {
  try {
    const withMeta = { ...profile, updatedAt: new Date().toISOString() };
    localStorage.setItem(KEY, JSON.stringify(withMeta));
    return withMeta;
  } catch (err) {
    console.error("saveProfile error", err);
    return null;
  }
}

export function deleteProfile() {
  try {
    localStorage.removeItem(KEY);
    return true;
  } catch (err) {
    console.error("deleteProfile error", err);
    return false;
  }
}
