import React, { useState, useEffect } from 'react';
import PublicArticlePreview from '../../components/articles/PublicArticlePreview';
import '../../components/articles/articles.css'; // Використовуємо існуючі стилі

function BlogListPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:3001/articles';

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                // Сортуємо статті за датою створення (новіші спочатку)
                const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setArticles(sortedData);
            } catch (err) {
                console.error("Помилка завантаження статей:", err);
                setError("Не вдалося завантажити статті. Спробуйте пізніше.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);

    if (loading) {
        return <p className="loading-message">Завантаження статей...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (articles.length === 0) {
        return <p className="no-articles-message">Наразі немає доступних статей.</p>;
    }

    return (
        <div className="blog-list-page">
            <h1>Наш Блог</h1>
            <div className="article-list">
                {articles.map(article => (
                    <PublicArticlePreview key={article.id} article={article} />
                ))}
            </div>
        </div>
    );
}

export default BlogListPage;