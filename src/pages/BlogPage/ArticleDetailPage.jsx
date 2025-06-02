import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../../components/articles/articles.css'; // Використовуємо існуючі стилі

function ArticleDetailPage() {
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { articleId } = useParams(); // Отримуємо ID статті з URL

    const API_URL = `http://localhost:3001/articles/${articleId}`;

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("Статтю не знайдено.");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setArticle(data);
            } catch (err) {
                console.error(`Помилка завантаження статті ${articleId}:`, err);
                setError(err.message || "Не вдалося завантажити статтю. Спробуйте пізніше.");
            } finally {
                setLoading(false);
            }
        };

        if (articleId) {
            fetchArticle();
        }
    }, [articleId, API_URL]);

    if (loading) {
        return <p className="loading-message">Завантаження статті...</p>;
    }

    if (error) {
        return <p className="error-message">{error} <Link to="/blog">Повернутися до блогу</Link></p>;
    }

    if (!article) {
        return <p className="no-articles-message">Стаття не знайдена. <Link to="/blog">Повернутися до блогу</Link></p>;
    }

    return (
        <div className="article-detail-page">
            <Link  className="back-to-blog-link"  onClick={() => window.history.back()}>← Назад до блогу</Link>
            <h1>{article.title}</h1>
            {article.image && (
                <div className="article-detail-image-wrapper">
                    <img src={article.image} alt={article.title} className="article-detail-image" />
                </div>
            )}
            <div className="article-meta">
                {/* <span>Автор: {article.authorId}</span> */}
                <span>Опубліковано: {new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="article-full-content">
                {/* Для безпечного відображення HTML контенту, якщо він є */}
                {/* <div dangerouslySetInnerHTML={{ __html: article.content }} /> */}
                {/* Або якщо контент це простий текст з переносами рядків: */}
                {article.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
        </div>
    );
}

export default ArticleDetailPage;