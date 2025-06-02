import React from 'react';
import { Link } from 'react-router-dom';
import './articles.css'; 

function PublicArticlePreview({ article }) {
    const previewContentLength = 150; 

    return (
        <div className="article-item public-article-preview"> 
            {article.image && (
                <div className="article-image-wrapper">
                    <Link to={`/blog/${article.id}`}>
                        <img src={article.image} alt={article.title} className="article-image" />
                    </Link>
                </div>
            )}
            <div className="article-content-wrapper">
                <h3>
                    <Link to={`/blog/${article.id}`}>{article.title}</Link>
                </h3>
                <p>
                    {article.content.length > previewContentLength 
                        ? `${article.content.substring(0, previewContentLength)}...` 
                        : article.content}
                </p>
                <div className="article-meta">
                    
                   
                    <span>Опубліковано: {new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="article-actions">
                    <Link to={`/blog/${article.id}`} className="button-like">
                        Детальніше
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default PublicArticlePreview;