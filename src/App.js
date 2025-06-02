
import React, { useState, useContext } from 'react'; // React та хуки
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Тільки потрібні компоненти з react-router-dom

import Header from "./components/header/Header";
import Footer from "./components/footer/footer";
import AdminRegisterForm from "./components/auth/AdminRegisterForm";
import HomePage from "./pages/HomePage/HomePage";
import FixPCpage from './pages/ClientPages/FixPCpage'; // Переконайтеся, що шлях правильний
import AuthPage from './pages/AuthPage/AuthPage'; // Переконайтеся, що шлях правильний
import SupportChat from './components/SupportChat/SupportChat.jsx';
import BlogListPage from './pages/BlogPage/BlogListPage';
import ArticleDetailPage from './pages/BlogPage/ArticleDetailPage';
import ManageArticlesPage from './pages/AdminPages/ManageArticlesPage.jsx'
import ClientOrdersPage from './pages/ClientPages/ClientOrdersPage.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider, AuthContext } from './contexts/AuthContext';
import MasterDashboardPage from './pages/MasterDashboardPage/MasterDashboardPage.jsx';
import './styles/common.css'; 
import AboutUs from './components/AboutUs/AboutUs.jsx';

// Компонент для захищених маршрутів
const PrivateRoute = ({ children, allowedRoles }) => {
   
    const { user } = useContext(AuthContext);

    if (!user) {
        // Якщо користувач не авторизований, перенаправляємо на сторінку входу
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Якщо роль користувача не дозволена, перенаправляємо на головну
        alert('У вас немає доступу до цієї сторінки.');
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    const [headerHeight, setHeaderHeight] = useState(0);
    const additionalGap = 20;

    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <Header setHeaderHeight={setHeaderHeight} />

                    <main
                        className="app-main-content"
                        style={{ paddingTop: `${headerHeight + additionalGap}px` }}
                    >
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            
                            
                            <Route path="/repair" element={<FixPCpage />} />
                           
                            <Route path="/login" element={<AuthPage />} />
                            
                            <Route path = "/blog" element = {<ManageArticlesPage />}/>

                            <Route path = "/blogpage" element = {<BlogListPage />}/>

                            <Route path="/blog/:articleId" element={<ArticleDetailPage />} />

                            <Route path="/aboutus" element={<AboutUs />} />

                       

                            {/* Захищені маршрути для майстрів */}
                            <Route path="/master-dashboard" element={
                                <PrivateRoute allowedRoles={['master']}>
                                    <MasterDashboardPage />
                                </PrivateRoute>
                            } />

                            {/* Захищені маршрути для адмінів */}
                            <Route path="/admin-register" element={
                                <PrivateRoute allowedRoles={['admin']}>
                                    <AdminRegisterForm />
                                </PrivateRoute>
                            } />

                            <Route path="/client-orders" element={
                                <PrivateRoute allowedRoles={['user']}>
                                    <ClientOrdersPage />
                                </PrivateRoute>
                            } />

                            <Route path="*" element={<h2>404 - Сторінку не знайдено</h2>} />
                        </Routes>

                            <SupportChat />

                    </main>

                    <Footer />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
