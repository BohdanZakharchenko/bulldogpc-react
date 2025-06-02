import React, { useState, useEffect } from 'react';
import '../auth/auth.css';
import './articles.css';

function ArticleForm({ initialData = {}, onSubmit, onCancel, authorId }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '',
    });
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (initialData?.id) {
            setFormData({
                title: initialData.title || '',
                content: initialData.content || '',
                image: initialData.image || '',
            });
        } else {
            setFormData({ title: '', content: '', image: '' });
            setImageFile(null);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setFormData(prev => ({ ...prev, image: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, authorId });
    };

    return (
        <form onSubmit={handleSubmit} className="article-form">
            <h2>{initialData?.id ? 'Редагувати статтю' : 'Створити нову статтю'}</h2>
            <input
                type="text"
                name="title"
                placeholder="Заголовок статті"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <textarea
                name="content"
                placeholder="Зміст статті"
                value={formData.content}
                onChange={handleChange}
                required
            />
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
            />
            {formData.image && (
                <div className="image-preview-container">
                    <img src={formData.image} alt="Попередній перегляд" className="image-preview" />
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="clear-image-button"
                    >
                        Очистити зображення
                    </button>
                </div>
            )}
            <div className="form-buttons">
                <button type="submit">{initialData?.id ? 'Зберегти зміни' : 'Створити статтю'}</button>
                {onCancel && <button type="button" onClick={onCancel}>Скасувати</button>}
            </div>
        </form>
    );
}

export default ArticleForm;
