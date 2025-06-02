import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import '../mastersComponents/RepairList.css';

function ClientOrders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user || !user.id) {
            setError('Користувач не авторизований.');
            setLoading(false);
            return;
        }

        const fetchClientOrders = async () => {
            try {
                const response = await fetch(`http://localhost:3001/repair-requests/user/${user.id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setOrders(data);
            } catch (err) {
                console.error("Помилка завантаження замовлень клієнта:", err);
                setError('Не вдалося завантажити ваші замовлення.');
            } finally {
                setLoading(false);
            }
        };

        fetchClientOrders();
    }, [user]);

    if (loading) return <p>Завантаження замовлень...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!user || user.role !== 'user') return <p>Ця сторінка доступна лише для клієнтів.</p>;
    if (orders.length === 0) return <p>У вас ще немає замовлень.</p>;

    return (
        <div className="repair-list-container">
            <h2>Мої замовлення</h2>
            <ul className="repair-list">
                {orders.map(order => (
                    <li key={order.id} className="repair-item">
                        <p><strong>Тип пристрою:</strong> {order.deviceType}</p>
                        <p><strong>Марка:</strong> {order.deviceBrand}</p>
                        <p><strong>Модель:</strong> {order.deviceModel}</p>
                        <p><strong>Опис проблеми:</strong> {order.issueDescription}</p>
                        {order.issueImage && (
                            <div className="issue-image-display">
                                <p><strong>Зображення:</strong></p>
                                <img
                                    src={order.issueImage}
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
                        <p><strong>Бажана дата:</strong> {order.preferredDate}</p>
                        <p><strong>Бажаний час:</strong> {order.preferredTime}</p>
                        <p><strong>Статус:</strong> {order.status}</p>

                        {order.serviceReport && (
                            <>
                                <p><strong>Звіт від майстра:</strong> {order.serviceReport}</p>
                                <p><strong>Ціна:</strong> {order.price} грн</p>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ClientOrders;
