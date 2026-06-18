import { getCurrentUser } from "./authService";

const API_URL = "http://localhost:5000/api/properties";

const getAuthHeaders = () => {
  const user = getCurrentUser();
  if (!user?.token) return {};
  return {
    Authorization: `Bearer ${user.token}`,
    "Content-Type": "application/json",
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

export const fetchProperties = async (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.city) params.append("city", filters.city);
  if (filters.minPrice) params.append("minPrice", filters.minPrice);
  if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);

  const response = await fetch(`${API_URL}?${params.toString()}`);
  return handleResponse(response);
};

export const fetchMyListings = async () => {
  const user = getCurrentUser();
  if (!user) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}?author=${user.id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const createProperty = async (propertyData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(propertyData),
  });
  return handleResponse(response);
};

export const deleteProperty = async (propertyId) => {
  const response = await fetch(`${API_URL}/${propertyId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

export const updateProperty = async (propertyId, propertyData) => {
  const response = await fetch(`${API_URL}/${propertyId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(propertyData),
  });
  return handleResponse(response);
};
