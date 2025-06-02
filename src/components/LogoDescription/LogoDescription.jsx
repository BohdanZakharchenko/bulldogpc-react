import React from 'react';
import stylesFix from './LogoDescription.module.css'; // Імпортуємо модульні стилі
import { useNavigate } from 'react-router-dom';



const LogoDescription = ({ logoSrc, logoAlt = "Логотип", title, description }) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/repair');
  };

  return (
    <div className={stylesFix.logoDescription}>
      <div className={stylesFix.logoWrapper}>
        <img src={logoSrc} alt={logoAlt} className={stylesFix.logo} />
      </div>
      <div className={stylesFix.descriptionWrapper}>
        {title && <h2 className={stylesFix.title}>{title}</h2>}
        {description && <p className={stylesFix.description}>{description}</p>}
        
      </div>
      <button onClick={handleClick} className={stylesFix.btngoFix}>Віддати</button>
    </div>
    
  );
};

export default LogoDescription;