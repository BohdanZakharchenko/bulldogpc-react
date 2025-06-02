import LogoDescription from "../../components/LogoDescription/LogoDescription";
import LogoDescriptionCreate from "../../components/LogoDescription/LogoDescriptionCreate";
import './home-page.css';
import myMainLogo from '../../images/logo/Untitled87.png';
import myMainLogo2 from '../../images/logo/Untitled89.png';
import PublicArticleList from '../../components/articles/PublicArticleList';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function HomePage() {
  
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/articles')
      .then(response => setArticles(response.data))
      .catch(error => console.error('Помилка при завантаженні статей:', error));
  }, []);

  return (
    <div className="home-page">
      <div className="home-content">
        
        
        <PublicArticleList articles={articles} />
       
        <LogoDescription
          logoSrc={myMainLogo}
          logoAlt="Логотип компанії"
          title="BulldogPC"
          description="Твій ПК гальмує, як Бульдог після щільного обіду? Принеси його нам!"
        />
        
      </div>
    </div>
  );
}

export default HomePage;
