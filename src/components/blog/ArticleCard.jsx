// src/components/Blog/ArticleCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ArticleCard.css'; 

const ArticleCard = ({ article }) => {
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate(`/blog/${article.id}`);
  };

  return (
    <div className="article-card">
      {article.image && ( 
        <img src={article.image} alt={article.title} className="article-card-image" />
      )}
      <div className="article-card-content">
        <h3>{article.title}</h3>
        <p className="article-card-meta">
          {new Date(article.createdAt).toLocaleDateString()} 
        </p>
        <button onClick={handleReadMore} className="article-card-button">
          Детальніше
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;