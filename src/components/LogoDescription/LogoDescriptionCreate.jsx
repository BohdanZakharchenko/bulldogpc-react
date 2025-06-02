import React from 'react';
import { useNavigate } from 'react-router-dom';
import stylesCreate from './LogoDescriptionCreate.module.css';

const LogoDescriptionCreate = ({ logoSrc, logoAlt = "Логотип", title, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/repair');
  };

  return (
    <div className={stylesCreate.logoDescription}>
      <button onClick={handleClick} className={stylesCreate.btngoFix}>
        Віддати
      </button>

      <div className={stylesCreate.descriptionWrapper}>
        {title && <h2 className={stylesCreate.title}>{title}</h2>}
        {description && <p className={stylesCreate.description}>{description}</p>}
      </div>

      <div className={stylesCreate.logoWrapper}>
        <img src={logoSrc} alt={logoAlt} className={stylesCreate.logo} />
      </div>
    </div>
  );
};

export default LogoDescriptionCreate;