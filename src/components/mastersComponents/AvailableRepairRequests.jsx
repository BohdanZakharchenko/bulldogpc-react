
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './RepairList.css';


function AvailableRepairRequests({ onAssignSuccessGlobal }) {
    const [availableRequests, setAvailableRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchAvailableRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            // ЗАПИТ ДО ДОСТУПНИХ ЗАЯВОК (непризначених)
            const response = await fetch('http://localhost:3001/repair-requests/available');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setAvailableRequests(data);
        } catch (err) {
            setError('Не вдалося завантажити доступні заявки: ' + err.message);
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailableRequests();
    }, []); // Завантажується один раз при монтуванні, або коли оновлюється refreshKey з батьківського компонента через prop

    const handleAssignToMe = async (requestId) => {
        if (!user || user.role !== 'master' || !user.id || !user.username) {
            alert('Ви повинні бути авторизовані як майстер, щоб взяти заявку.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:3001/repair-requests/${requestId}/assign`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ masterId: user.id, masterUsername: user.username })
            });

            const result = await response.json();

            if (response.ok) {
                alert('Заявку успішно призначено вам!');
                fetchAvailableRequests(); 
                if (onAssignSuccessGlobal) {
                    onAssignSuccessGlobal();
                }
            } else {
                alert(result.message || 'Помилка при призначенні заявки.');
            }
        } catch (error) {
            console.error('Помилка при призначенні заявки:', error);
            alert('Помилка мережі при призначенні заявки.');
        }
    };

    if (loading) return <p>Завантаження доступних заявок...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (availableRequests.length === 0) return <p>Наразі немає доступних заявок для ремонту.</p>;

    return (
        <div className="repair-list-container">
            <h2>Доступні заявки на ремонт</h2>
            <ul className="repair-list">
                {availableRequests.map(request => (
                    <li key={request.id} className="repair-item">
                        <p><strong>Клієнт:</strong> {request.clientName}</p>
                        <p><strong>Пристрій:</strong> {request.deviceBrand} {request.deviceModel} ({request.deviceType})</p>
                        <p><strong>Опис проблеми:</strong> {request.issueDescription}</p>
                        {request.issueImage && (
                            <div className="issue-image-display">
                                <p><strong>Зображення проблеми:</strong></p>
                                <img src={request.issueImage} alt="Зображення проблеми" style={{ maxWidth: '100%', height: 'auto', maxHeight: '150px', borderRadius: '5px', marginTop: '10px' }} />
                            </div>
                        )}
                        <p><strong>Бажана дата/час:</strong> {request.preferredDate} {request.preferredTime}</p>
                        <p><strong>Статус:</strong> {request.status}</p>
                        <button onClick={() => handleAssignToMe(request.id)} className="assign-button">Взяти в роботу</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AvailableRepairRequests;