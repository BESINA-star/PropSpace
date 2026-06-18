const API_URL = "http://localhost:5000/api/auth";

const persistAuth = (user) => {
  if (user?.token) {
    localStorage.setItem("propspace_user", JSON.stringify(user));
  }
};

const getAuthHeaders = () => {
  const user = getCurrentUser();
  const headers = { "Content-Type": "application/json" };
  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`;
  }
  return headers;
};

export const loginUser = async (userData) => {
  const response = await fetch(API_URL + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  persistAuth(data);
  return data;
};

export const registerUser = async (userData) => {
  const response = await fetch(API_URL + "/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  persistAuth(data);
  return data;
};

export const getProfile = async () => {
  const response = await fetch(API_URL + "/profile", {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to load profile");
  }
  return data;
};

export const updateProfile = async (profileData) => {
  const response = await fetch(API_URL + "/profile", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update profile");
  }
  const currentUser = getCurrentUser();
  const updatedUser = { ...currentUser, ...data };
  persistAuth({ ...updatedUser, token: currentUser?.token });
  return data;
};

export const changePassword = async (passwordData) => {
  const response = await fetch(API_URL + "/password", {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(passwordData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to update password");
  }
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem("propspace_user");
};

export const getCurrentUser = () => {
  const saved = localStorage.getItem("propspace_user");
  return saved ? JSON.parse(saved) : null;
};
