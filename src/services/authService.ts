
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

axios.defaults.withCredentials = true;

export type User = {
  id: number;
  email: string;
  total_points: number;
  level: number;
  created_at: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type SignupData = {
  email: string;
  password: string;
};

// Login user
export const login = async (credentials: LoginData): Promise<{ user: User }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register new user
export const signup = async (userData: SignupData): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

// Logout user
export const logout = async (): Promise<{ message: string }> => {
  try {
    const response = await axios.post(`${API_URL}/auth/logout`);
    return response.data;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Get current user data
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`);
    return response.data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};
