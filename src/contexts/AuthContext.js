import React, { createContext, useState, useEffect } from 'react';


export const AuthContext = createContext();

// Компонент-провайдер для контексту
export const AuthProvider = ({ children }) => {
  // useState для зберігання інформації про користувача.
  // Спочатку пробуємо завантажити з localStorage, якщо користувач вже був авторизований.
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  // useEffect для синхронізації стану user з localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]); 

  // Функція для входу
  const login = (userData) => {
    setUser(userData);
  };

  // Функція для виходу
  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};