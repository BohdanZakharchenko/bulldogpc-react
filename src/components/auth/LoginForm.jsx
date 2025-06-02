// src/components/LoginForm.js
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './auth.css';
import logo from '../../images/logo/bulldog_logo.png';
import { AuthContext } from '../../contexts/AuthContext';

function LoginForm() {
  const [formData, setFormData] = useState({
    // Змінено 'username' на 'email'
    email: '', 
    password: ''
  });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        
        body: JSON.stringify(formData) 
      });

      const result = await response.json();

      if (response.ok) {
        alert("Вхід успішний!");
        console.log("Користувач:", result.user);
        login(result.user); 

        // ЛОГІКА ПЕРЕНАПРАВЛЕННЯ ЗА РОЛЮ 
        switch (result.user.role) {
          case 'admin':
            navigate('/admin-dashboard');
            break;
          case 'master':
            navigate('/master-dashboard');
            break;
          case 'user':
          default:
            navigate('/');
            break;
        }
       

      } else {
        alert(result.message || "Помилка авторизації.");
      }
    } catch (error) {
      console.error("Помилка мережі або сервера:", error);
      alert("Не вдалося підключитися до сервера. Спробуйте пізніше.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <img className="form_logo" src={logo} alt="Логотип Bulldog PC" />
      <h3>Вхід</h3>
      
      <input 
        type="email" 
        name="email" 
        placeholder="Електронна пошта" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="password" 
        name="password" 
        placeholder="Пароль" 
        onChange={handleChange} 
        required 
      />
      <button type="submit">Увійти</button>
    </form>
  );
}

export default LoginForm;