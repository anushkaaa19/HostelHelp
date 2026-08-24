import axios from "axios";

const API_URL = "/api/hostels";

// Helper to append Authorization header
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getHostels = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const getHostelById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createHostel = async (hostelData) => {
  const response = await axios.post(API_URL, hostelData, getAuthHeaders());
  return response.data;
};

export const updateHostel = async (id, hostelData) => {
  const response = await axios.put(`${API_URL}/${id}`, hostelData, getAuthHeaders());
  return response.data;
};

export const deleteHostel = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};