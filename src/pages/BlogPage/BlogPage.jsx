// src/pages/BlogPage/BlogPage.jsx
import React, { useState, useEffect } from 'react';
import ArticleCard from '../../components/blog/ArticleCard';
import './BlogPage.css'; // Створіть цей файл для стилів

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('http://localhost:3001/articles');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArticles(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return <div className="blog-page-container">Завантаження статей...</div>;
  }

  if (error) {
    return <div className="blog-page-container error">Помилка завантаження статей: {error}</div>;
  }

  return (
    <div className="blog-page-container">
      <h2>Наш Блог</h2>
      {articles.length === 0 ? (
        <p>Статті поки що відсутні. Створіть першу статтю в адмін-панелі!</p>
      ) : (
        <div className="articles-grid">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogPage;