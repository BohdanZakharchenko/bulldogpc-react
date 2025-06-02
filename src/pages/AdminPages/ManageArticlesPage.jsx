import React, { useState, useEffect, useContext } from 'react';
import ArticleForm from '../../components/articles/ArticleForm';
import ArticleList from '../../components/articles/ArticleList';
import { AuthContext } from '../../contexts/AuthContext'; // Для отримання authorId
import '../../components/articles/articles.css'; // Застосовуємо стилі

function ManageArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [editingArticle, setEditingArticle] = useState(null); // Стаття, яка редагується
    const { user } = useContext(AuthContext); // Отримуємо інформацію про поточного користувача

    const API_URL = 'http://localhost:3001/articles';

    // Завантаження статей при завантаженні компонента
    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setArticles(data);
        } catch (error) {
            console.error("Помилка завантаження статей:", error);
            alert("Не вдалося завантажити статті.");
        }
    };

    const handleCreateArticle = async (articleData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...articleData, authorId: user.id }), // Додаємо authorId
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            alert(result.message);
            fetchArticles(); // Оновлюємо список
            setEditingArticle(null); // Скидаємо форму
        } catch (error) {
            console.error("Помилка створення статті:", error);
            alert("Не вдалося створити статтю.");
        }
    };

    const handleUpdateArticle = async (articleData) => {
        if (!editingArticle) return;

        try {
            const response = await fetch(`${API_URL}/${editingArticle.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(articleData),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            alert(result.message);
            fetchArticles(); // Оновлюємо список
            setEditingArticle(null); // Скидаємо форму
        } catch (error) {
            console.error("Помилка оновлення статті:", error);
            alert("Не вдалося оновити статтю.");
        }
    };

    const handleDeleteArticle = async (id) => {
        if (window.confirm("Ви впевнені, що хочете видалити цю статтю?")) {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                alert(result.message);
                fetchArticles(); // Оновлюємо список
            } catch (error) {
                console.error("Помилка видалення статті:", error);
                alert("Не вдалося видалити статтю.");
            }
        }
    };

    return (
        <div className="manage-articles-page">
            <h1>Управління статтями</h1>
            <ArticleForm
                initialData={editingArticle}
                onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
                onCancel={() => setEditingArticle(null)}
                authorId={user ? user.id : ''} // Передаємо ID автора
            />
            <h2>Список статей</h2>
            <ArticleList
                articles={articles}
                onEdit={setEditingArticle}
                onDelete={handleDeleteArticle}
            />
        </div>
    );
}

export default ManageArticlesPage;