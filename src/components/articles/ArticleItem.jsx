import React from 'react';
import './articles.css';

function ArticleItem({ article, onEdit, onDelete }) {
    return (
        <div className="article-item" style={{ backgroundImage: 'white' }}>

            {article.image && (
                <div className="article-image-wrapper">
                    <img src={article.image} alt={article.title} className="article-image" />
                </div>
            )}
            <div className="article-content-wrapper">
                <h3>{article.title}</h3>
                <p>{article.content.substring(0, 200)}...</p> 
                <div className="article-meta">
                    <span>Автор: {article.authorId}</span> 
                    <span>Опубліковано: {new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="article-actions">
                    <button onClick={() => onEdit(article)}>Редагувати</button>
                    <button onClick={() => onDelete(article.id)}>Видалити</button>
                </div>
            </div>
        </div>
    );
}

export default ArticleItem;