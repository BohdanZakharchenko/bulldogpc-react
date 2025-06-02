import React from 'react';
import './footer.css'; 
import logo from '../../images/logo/bulldog_logo.png'; 

function Footer() {
  return (
    <footer className="footer">
      <div className="conteiner"> 
        <div className="footer__row">
          <div className="footer__logo">
            <img src={logo} alt="BulldogPC logo" />
            <span>BulldogPC</span>
          </div>

          <nav className="footer__nav">
            <ul>
              <li><a href="#!">Послуги</a></li>
              <li><a href="#!">Про нас</a></li>
              <li><a href="#!">Контакти</a></li>
              <li><a href="#!">FAQ</a></li>
            </ul>
          </nav>

          <div className="footer__social">
            
            <a href="#!"><i className="fab fa-facebook"></i></a> 
            <a href="#!"><i className="fab fa-instagram"></i></a> 
            <a href="#!"><i className="fab fa-telegram"></i></a> 
          </div>
        </div>
        <div className="footer__bottom">
          <p>&copy; {new Date().getFullYear()} BulldogPC. Усі права захищені.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;