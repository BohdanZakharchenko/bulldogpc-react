import { useState, useContext } from 'react'; 
import './ClientRepairForm.css';
import logo from '../../images/logo/bulldog_logo.png';
import { AuthContext } from '../../contexts/AuthContext'; 

function ClientRepairForm() {
    // Отримуємо user з AuthContext
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        clientEmail: '',
        deviceType: '',
        deviceBrand: '',
        deviceModel: '',
        issueDescription: '',
        preferredDate: '',
        preferredTime: '',
        consentToProcessing: false,
        issueImage: null
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, issueImage: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, issueImage: null }));
            setImagePreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.consentToProcessing) {
            alert("Будь ласка, дайте згоду на обробку персональних даних.");
            return;
        }

        // Перевірка, чи користувач авторизований і має userId
        if (!user || !user.id) {
            alert("Будь ласка, увійдіть, щоб створити заявку на ремонт.");
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/repair-request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    userId: user.id // Передається userId з контексту
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                console.log("Заявка успішно відправлена:", result.request);
                setFormData({
                    clientName: '',
                    clientPhone: '',
                    clientEmail: '',
                    deviceType: '',
                    deviceBrand: '',
                    deviceModel: '',
                    issueDescription: '',
                    preferredDate: '',
                    preferredTime: '',
                    consentToProcessing: false,
                    issueImage: null
                });
                setImagePreview(null);
            } else {
                alert(result.message || "Помилка при відправці заявки.");
            }
        } catch (error) {
            console.error("Помилка мережі або сервера:", error);
            alert("Не вдалося підключитися до сервера. Спробуйте пізніше.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="repair-form">
            <img src={logo} className='form_logo' alt="BulldogPC Logo" />
            <h3>Заявка на ремонт комп'ютера</h3>

            <input
                type="text"
                name="clientName"
                placeholder="Ваше ім'я"
                value={formData.clientName}
                onChange={handleChange}
                required
            />
            <input
                type="tel"
                name="clientPhone"
                placeholder="Номер телефону (+380XXXXXXXXX)"
                value={formData.clientPhone}
                onChange={handleChange}
                pattern="\+380[0-9]{9}"
                title="Будь ласка, введіть номер у форматі +380XXXXXXXXX"
                required
            />
            <input
                type="email"
                name="clientEmail"
                placeholder="Ваш Email (необов'язково)"
                value={formData.clientEmail}
                onChange={handleChange}
            />

            <h4>Інформація про пристрій:</h4>
            <select
                name="deviceType"
                value={formData.deviceType}
                onChange={handleChange}
                required
            >
                <option value="">Виберіть тип пристрою</option>
                <option value="ПК">Настільний ПК</option>
                <option value="Ноутбук">Ноутбук</option>
                <option value="Монітор">М</option>
                <option value="Планшет">Планшет</option>
                <option value="Інше">Інше</option>
            </select>

            <input
                type="text"
                name="deviceBrand"
                placeholder="Марка пристрою (наприклад, ASUS, HP)"
                value={formData.deviceBrand}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="deviceModel"
                placeholder="Модель пристрою (наприклад, Legion 5, Aspire 3)"
                value={formData.deviceModel}
                onChange={handleChange}
                required
            />
            <textarea
                name="issueDescription"
                placeholder="Детальний опис проблеми (що сталося, коли, симптоми)"
                value={formData.issueDescription}
                onChange={handleChange}
                rows="5"
                required
            ></textarea>

            <label htmlFor="issueImage">Зображення проблеми (необов'язково):</label>
            <input
                type="file"
                id="issueImage"
                name="issueImage"
                accept="image/*"
                onChange={handleImageChange}
            />
            {imagePreview && (
                <div className="image-preview-container">
                    <img src={imagePreview} alt="Попередній перегляд" className="image-preview" />
                    <p>Попередній перегляд зображення</p>
                </div>
            )}

            <h4>Бажана дата та час для візиту:</h4>
            <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
            />
            <input
                type="time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
            />

            <label className="checkbox-container">
                <input
                    type="checkbox"
                    name="consentToProcessing"
                    checked={formData.consentToProcessing}
                    onChange={handleChange}
                    required
                />
                Я даю згоду на обробку моїх персональних даних.
            </label>

            <button type="submit">Відправити заявку на ремонт</button>
        </form>
    );
}

export default ClientRepairForm;