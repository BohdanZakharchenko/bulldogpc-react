import { useState } from 'react';
import './auth.css';
import logo from '../../images/logo/bulldog_logo.png';


function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    address: '',
    masterName: '',
    description: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3001/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <form onSubmit={handleSubmit}>
        <img src={logo} className='form_logo'/>
      <input 
        type="text" 
        name="username" 
        placeholder="Ім’я користувача" 
        onChange={handleChange} 
        required 
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
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


      {formData.role === 'user' && (
        <>
          <input 
            type="tel" 
            name="phone" 
            placeholder="Номер телефону (+380XXXXXXXXX)" 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="address" 
            placeholder="Адреса" 
            onChange={handleChange} 
            required 
          />
        </>
      )}

      

     

      <button type="submit">Зареєструватися</button>
    </form>
  );
}

export default RegisterForm;
