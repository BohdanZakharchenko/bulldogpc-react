import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import RegisterForm from '../../components/auth/RegisterForm';
import Header from '../../components/header/Header';
import './authpage.css'; // Підключаємо CSS

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const handleLogin = (data) => {
        console.log("Login with", data);
    };

    const handleRegister = (data) => {
        console.log("Register with", data);
    };

    return (
        <div className="auth-page">
           
            <div className="auth-content">
                <div className="auth-form-wrapper">
                    {isLogin ? (
                        <LoginForm onLogin={handleLogin} />
                    ) : (
                        <RegisterForm onRegister={handleRegister} />
                    )}
                    <p
                        className="auth-toggle"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin
                            ? 'Ще не маєте акаунта? Зареєструйтесь'
                            : 'Вже маєте акаунт? Увійдіть'}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
