import users from '@/services/mockData/users.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Simple token generation
const generateToken = () => Math.random().toString(36).substr(2) + Date.now().toString(36);

// Mock user storage (in real app, this would be handled by backend)
let userStorage = [...users];
let nextId = Math.max(...users.map(u => u.Id)) + 1;

export const userService = {
  async login(email, password) {
    await delay(800); // Simulate network delay
    
    const user = userStorage.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found. Please check your email address.');
    }
    
    if (user.password !== password) {
      throw new Error('Invalid password. Please try again.');
    }
    
    if (!user.isActive) {
      throw new Error('Account is deactivated. Please contact support.');
    }
    
    const token = generateToken();
    const userResponse = {
      Id: user.Id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: new Date().toISOString()
    };
    
    // Update last login
    const userIndex = userStorage.findIndex(u => u.Id === user.Id);
    if (userIndex !== -1) {
      userStorage[userIndex].lastLogin = userResponse.lastLogin;
    }
    
    return {
      user: userResponse,
      token
    };
  },

  async signup(userData) {
    await delay(1000); // Simulate network delay
    
    // Check if user already exists
    const existingUser = userStorage.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('An account with this email already exists.');
    }
    
    // Create new user
    const newUser = {
      Id: nextId++,
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      role: userData.role,
      company: userData.company,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    userStorage.push(newUser);
    
    const token = generateToken();
    const userResponse = {
      Id: newUser.Id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
      isActive: newUser.isActive,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin
    };
    
    return {
      user: userResponse,
      token
    };
  },

  async getCurrentUser() {
    await delay(300);
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    // In a real app, we would validate the token with the backend
    // For now, we'll just return a mock user based on stored data
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    
    throw new Error('Invalid or expired token');
  },

  async logout() {
    await delay(200);
    // In real app, invalidate token on server
    localStorage.removeItem('currentUser');
    return { success: true };
  },

  async getAllUsers() {
    await delay(500);
    // Return users without passwords for admin view
    return userStorage.map(user => ({
      Id: user.Id,
      name: user.name,
      email: user.email,
      role: user.role,
      company: user.company,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }));
  },

  async updateUserStatus(userId, isActive) {
    await delay(400);
    
    const userIndex = userStorage.findIndex(u => u.Id === parseInt(userId));
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    userStorage[userIndex].isActive = isActive;
    
    return {
      Id: userStorage[userIndex].Id,
      name: userStorage[userIndex].name,
      email: userStorage[userIndex].email,
      role: userStorage[userIndex].role,
      company: userStorage[userIndex].company,
      isActive: userStorage[userIndex].isActive,
      createdAt: userStorage[userIndex].createdAt,
      lastLogin: userStorage[userIndex].lastLogin
    };
  }
};

export default userService;