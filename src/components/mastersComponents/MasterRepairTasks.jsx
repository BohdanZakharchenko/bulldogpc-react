import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './RepairList.css';

function MasterRepairTasks() {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reports, setReports] = useState({});

    const fetchMasterTasks = async () => {
        if (!user || !user.id) {
            setError('Користувач не авторизований або не має ID.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/repair-requests/master/${user.id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTasks(data);
        } catch (err) {
            console.error("Помилка завантаження завдань майстра:", err);
            setError('Не вдалося завантажити завдання. Спробуйте пізніше.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMasterTasks();
    }, [user]);

    const handleStatusChange = async (requestId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:3001/repair-requests/${requestId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Статус оновлено!');
                fetchMasterTasks();
            } else {
                alert(result.message || 'Помилка при оновленні статусу.');
            }
        } catch (error) {
            console.error('Помилка при оновленні статусу:', error);
            alert('Помилка мережі при оновленні статусу.');
        }
    };

    const handleDelete = async (requestId) => {
        if (!window.confirm('Ви впевнені, що хочете видалити цю заявку?')) return;

        try {
            const response = await fetch(`http://localhost:3001/repair-requests/${requestId}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (response.ok) {
                alert('Заявку видалено!');
                fetchMasterTasks();
            } else {
                alert(result.message || 'Помилка при видаленні заявки.');
            }
        } catch (error) {
            console.error('Помилка при видаленні заявки:', error);
            alert('Помилка мережі при видаленні заявки.');
        }
    };

    const handleSaveReport = async (taskId) => {
        const { serviceReport, price } = reports[taskId] || {};

        try {
            const response = await fetch(`http://localhost:3001/repair-requests/${taskId}/report`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serviceReport, price })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Звіт оновлено успішно!');
                fetchMasterTasks();
            } else {
                alert(result.message || 'Помилка при збереженні звіту.');
            }
        } catch (error) {
            console.error('Помилка при збереженні звіту:', error);
            alert('Помилка мережі.');
        }
    };

    if (loading) return <p>Завантаження ваших завдань...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!user || user.role !== 'master') return <p>Ця сторінка доступна лише для майстрів.</p>;
    if (tasks.length === 0) return <p>Наразі у вас немає призначених завдань.</p>;

    return (
        <div className="repair-list-container">
            <h2>Ваші завдання на ремонт</h2>
            <ul className="repair-list">
                {tasks.map(task => (
                    <li key={task.id} className="repair-item">
                        <p><strong>Клієнт:</strong> {task.clientName}</p>
                        <p><strong>Телефон:</strong> {task.clientPhone}</p>
                        <p><strong>Пристрій:</strong> {task.deviceBrand} {task.deviceModel} ({task.deviceType})</p>
                        <p><strong>Опис проблеми:</strong> {task.issueDescription}</p>
                        {task.issueImage && (
                            <div className="issue-image-display">
                                <p><strong>Зображення проблеми:</strong></p>
                                <img
                                    src={task.issueImage}
                                    alt="Зображення проблеми"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        maxHeight: '150px',
                                        borderRadius: '5px',
                                        marginTop: '10px'
                                    }}
                                />
                            </div>
                        )}
                        <p><strong>Бажана дата/час:</strong> {task.preferredDate} {task.preferredTime}</p>

                        <p><strong>Статус:</strong></p>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        >
                            <option value="Очікує на ремонт">Очікує на ремонт</option>
                            <option value="В роботі">В роботі</option>
                            <option value="Виконано">Виконано</option>
                            <option value="Ремонт не було виконано">Ремонт не було виконано</option>
                        </select>

                        <p><strong>Звіт про виконану роботу:</strong></p>
                        <textarea
                            rows="3"
                            placeholder="Що було зроблено..."
                            value={(reports[task.id]?.serviceReport !== undefined ? reports[task.id]?.serviceReport : task.serviceReport) || ''}
                            onChange={(e) => setReports(prev => ({
                                ...prev,
                                [task.id]: {
                                    ...prev[task.id],
                                    serviceReport: e.target.value
                                }
                            }))}
                        />

                        <p><strong>Ціна ремонту:</strong></p>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={(reports[task.id]?.price !== undefined ? reports[task.id]?.price : task.price) || ''}
                            onChange={(e) => setReports(prev => ({
                                ...prev,
                                [task.id]: {
                                    ...prev[task.id],
                                    price: e.target.value
                                }
                            }))}
                        />

                        <button onClick={() => handleSaveReport(task.id)} className="save-button">
                            Зберегти звіт і ціну
                        </button>

                        <div className="task-actions">
                            <button onClick={() => handleDelete(task.id)} className="delete-button">
                                Видалити
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MasterRepairTasks;
