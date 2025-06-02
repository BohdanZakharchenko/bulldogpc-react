import React from 'react';
import './aboutus.css';
import Andrii from '../../images/logo/Andrii.png';
import Maryna from '../../images/logo/Maryna.png';
import Ihor from '../../images/logo/Ihor.png';

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1>Про компанію BulldogPC</h1>
      <p>
        BulldogPC — це надійний сервіс з ремонту та збірки комп’ютерів, який працює з 2018 року. 
        Ми спеціалізуємося на діагностиці, модернізації, збірці ПК під ключ та вирішенні апаратних і програмних проблем будь-якої складності.
      </p>
      <p>
        Наша місія — забезпечити кожного клієнта якісним та швидким обслуговуванням, 
        орієнтованим на індивідуальні потреби.
      </p>

      <div className="team-section">
        <h2>Наша команда</h2>
        <div className="team-members">
          <div className="member">
            <img src={Andrii} alt="Андрій" />
            <h3>Андрій</h3>
            <p>Засновник та головний інженер</p>
          </div>
          <div className="member">
            <img src={Maryna} alt="Марина" />
            <h3>Марина</h3>
            <p>Майстер з ремонту ноутбуків</p>
          </div>
          <div className="member">
            <img src={Ihor} alt="Ігор" />
            <h3>Ігор</h3>
            <p>Фахівець із збірки та діагностики ПК</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;