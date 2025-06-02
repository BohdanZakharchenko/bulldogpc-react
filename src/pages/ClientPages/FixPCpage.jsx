
import ClientRepairForm from "../../components/ClientRepairForm/ClientRepairForm.jsx";
import './clientPages.css';
import myMainLogo from '../../images/logo/Untitled87.png';

import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function FixPCpage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Перевірка доступу
    if (!user) {
      navigate('/login');
    } else if (user.role !== 'user') {
      alert('Лише авторизовані користувачі з роллю "user" можуть створювати заявку.');
      console.error('Лише авторизовані користувачі з роллю "user" можуть створювати заявку.');
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="home-page">
      <div className="home-content">
        <h1>Створення заявки на ремонт</h1>
        <ClientRepairForm />
      </div>
    </div>
  );
}

export default FixPCpage;
