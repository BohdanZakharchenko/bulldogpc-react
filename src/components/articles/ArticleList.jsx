

import React from 'react';
import ArticleItem from './ArticleItem';
import './articles.css'; 

function ArticleList({ articles, onEdit, onDelete }) {
    if (!articles || articles.length === 0) {
        return <p className="no-articles-message">Статті відсутні. Створіть першу статтю!</p>;
    }

    return (
        <div className="article-list">
            {articles.map(article => (
                <ArticleItem
                    key={article.id}
                    article={article}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default ArticleList; 