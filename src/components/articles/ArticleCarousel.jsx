import React from 'react';

import { Carousel } from 'react-bootstrap';

function ArticleCarousel({ articles }) {
  return (
    <Carousel>
      {articles.map((article) => (
        <Carousel.Item key={article.id}>
          <img
            className="d-block w-100"
            src={article.image}
            alt={article.title}
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
          <Carousel.Caption>
            <h3>{article.title}</h3>
            <p>{article.content.substring(0, 100)}...</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ArticleCarousel;
