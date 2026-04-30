import './header.css';
import logo from '../../images/logo/bulldog_logo.png';
import { useEffect, useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

function Header() {
  const [isShrink, setIsShrink] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMasterMenuOpen, setIsMasterMenuOpen] = useState(false); // СТАН для випадаючого меню майстра

  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    setIsMasterMenuOpen(false);
  };

  const toggleMasterMenu = () => {
    setIsMasterMenuOpen(prev => !prev);
  };

  // Функція, яка закриває бургер-меню і меню майстра при навігації
  

  return (
    <header className={`header ${isShrink ? 'shrink' : ''}`}>
      <div className='conteiner'>
        <div className='header__row'>
          <Link to="/" className='header__logo' onClick={handleNavLinkClick}>
            <img src={logo} alt="Bulldog logo" />
            <span>BulldogPC</span>
          </Link>

           {/* Бургер меню для мобільних */}
          <div className='burger' onClick={() => setIsOpen(!isOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>

          <nav className={`header__nav ${isOpen ? 'open' : ''}`}>
            <ul>
              <li><NavLink to="/" exact="true" onClick={handleNavLinkClick}>Головна</NavLink></li>
              <li><NavLink to="/aboutus" onClick={handleNavLinkClick}>Про нас</NavLink></li>
              <li><NavLink to="/repair" onClick={handleNavLinkClick}>Заявка на ремонт</NavLink></li>
              
              {user && user.role === 'user' && (
                <ul>
                
                <li><NavLink to="/client-orders" onClick={handleNavLinkClick}>Мої заявки</NavLink></li>
                </ul>
              )}
              {user && user.role === 'admin' && (
                <ul>
                <li><NavLink to="/admin-register" onClick={handleNavLinkClick}>Реєстрація користувачів</NavLink></li>
                <li><NavLink to="/blog" onClick={handleNavLinkClick}>Блог</NavLink></li>
                </ul>
              )}

              {user ? (
                <>
                  {user.role === 'master' ? (
                    <li className="master-menu-container">
                      <button onClick={toggleMasterMenu} className='header__nav-btn master-btn'>
                        Панель Майстра
                        <span className={`dropdown-arrow ${isMasterMenuOpen ? 'open' : ''}`}>&#9660;</span>
                      </button>
                      {isMasterMenuOpen && (
                        <ul className="master-dropdown-menu">
                          
                          <li><NavLink to="/master-dashboard?view=dashboard" onClick={handleNavLinkClick}>Моя панель</NavLink></li>
                          <li><NavLink to="/master-dashboard?view=requests" onClick={handleNavLinkClick}>Мої заявки</NavLink></li>
                          <li><NavLink to="/master-dashboard?view=available" onClick={handleNavLinkClick}>Доступні заявки</NavLink></li>
                          <li><NavLink to="/master-dashboard?view=profile" onClick={handleNavLinkClick}>Мій профіль</NavLink></li>
                          
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li className="header__username">Привіт, {user.username}!</li>
                  )}
                  <li>
                    <button onClick={handleLogout} className='header__nav-btn logout-btn'>
                      Вийти
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
  to="/login"
  className="header__nav-btn"
  style={{color: 'white' }}
  onClick={handleNavLinkClick}
>
  Увійти
</NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;