import React from 'react';
import { Carousel } from 'react-bootstrap';
import PublicArticlePreview from './PublicArticlePreview';
import './articles.css';

function PublicArticleList({ articles }) {
  if (!articles || articles.length === 0) {
    return <p className="no-articles-message">Поки що немає публікацій.</p>;
  }

  return (
    <Carousel>
      {articles.map(article => (
        <Carousel.Item key={article.id}>
          <PublicArticlePreview article={article} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default PublicArticleList;

