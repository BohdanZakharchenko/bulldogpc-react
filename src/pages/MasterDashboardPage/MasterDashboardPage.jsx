// MasterDashboardPage.jsx
import React, { useState, useContext, useEffect } from 'react'; // Add useEffect
import AvailableRepairRequests from '../../components/mastersComponents/AvailableRepairRequests';
import MasterRepairTasks from '../../components/mastersComponents/MasterRepairTasks';

import { AuthContext } from '../../contexts/AuthContext';
import './MasterDashboardPage.css'; // Додано імпорт CSS

function MasterDashboardPage() {
    const [activeComponent, setActiveComponent] = useState('dashboard');
    const { user } = useContext(AuthContext);

    // NEW: Use a refreshKey to force re-fetch in child components
    const [refreshKey, setRefreshKey] = useState(0);

    // Function to trigger a refresh in child components
    const triggerRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };

    // Set default active component based on user role on initial load
    useEffect(() => {
        if (user) {
            if (user.role === 'master') {
                setActiveComponent('available');
            } else if (user.role === 'master') {
                setActiveComponent('requests');
            }
        }
    }, [user]); // Run once when user data is available

    if (!user || (user.role !== 'master' && user.role !== 'admin')) { // Allow admin to access
        return <p>У вас немає доступу до цієї сторінки. Будь ласка, увійдіть як майстер або адміністратор.</p>;
    }

    return (
        <div className="master-dashboard-container">
            <h1>Панель {user.role === 'admin' ? 'Адміністратора' : 'Майстра'}</h1>

            <div className="dashboard-navigation">
                <button
                    onClick={() => setActiveComponent('dashboard')}
                    className={activeComponent === 'dashboard' ? 'active' : ''}
                >
                    Загальна інформація
                </button>
                {user.role === 'master' && (
                    <button
                        onClick={() => setActiveComponent('available')}
                        className={activeComponent === 'available' ? 'active' : ''}
                    >
                        Доступні заявки
                    </button>
                )}
                {user.role === 'master' && (
                    <button
                        onClick={() => setActiveComponent('requests')}
                        className={activeComponent === 'requests' ? 'active' : ''}
                    >
                        Мої заявки
                    </button>
                )}
                <button
                    onClick={() => setActiveComponent('profile')}
                    className={activeComponent === 'profile' ? 'active' : ''}
                >
                    Мій профіль
                </button>
            </div>

            <div className="dashboard-content">
                {activeComponent === 'dashboard' && (
                    <>
                        <h2>Ласкаво просимо на панель {user.role === 'admin' ? 'адміністратора' : 'майстра'}, {user.username}!</h2>
                        <p>Тут ви можете керувати {user.role === 'admin' ? 'заявками' : 'своїми заявками'}, переглядати профіль та інші дані.</p>
                    </>
                )}

                {user.role === 'master' && activeComponent === 'available' && (
                    <AvailableRepairRequests
                        onAssignSuccessGlobal={triggerRefresh} // Pass the refresh function
                        key={`available-${refreshKey}`} // Use key to force remount
                    />
                )}

                {user.role === 'master' && activeComponent === 'requests' && (
                    <MasterRepairTasks AvailableRepairRequests
                        onTaskAssigned={refreshKey} // Pass refreshKey as a dependency
                        key={`master-${refreshKey}`} // Use key to force remount
                    />
                )}

                {/* NOTE: You had MasterRepairTasks for 'profile' which is likely incorrect.
                         You might want a separate Profile component here.
                         For now, I'm removing it to avoid confusion. */}
                {activeComponent === 'profile' && (
                    <>
                        <h2>Мій Профіль</h2>
                        <p>Ім'я користувача: {user.username}</p>
                        <p>Email: {user.email}</p>
                        <p>Роль: {user.role}</p>
                        {user.phone && <p>Телефон: {user.phone}</p>}
                        {user.address && <p>Адреса: {user.address}</p>}
                        {user.description && <p>Опис: {user.description}</p>}
                        {/* Add more profile details as needed */}
                    </>
                )}
            </div>
        </div>
    );
}

export default MasterDashboardPage;