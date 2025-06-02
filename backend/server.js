const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;
const USERS_FILE = './users.json';
const REPAIR_REQUESTS_FILE = './repairRequests.json';
const SALT_ROUNDS = 10;


app.use(express.json({ limit: '10mb' }));
app.use(cors());



app.use(cors());
app.use(express.json());



const ARTICLES_FILE = './articles.json';

function readArticles() {
    try {
        const data = fs.readFileSync(ARTICLES_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading articles file:", error.message);
        return [];
    }
}

function writeArticles(articles) {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2));
}


app.post('/articles', (req, res) => {
    const { title, content, image, authorId } = req.body;

    if (!title || !content || !authorId) {
        return res.status(400).json({ message: 'Назва, контент і authorId обов’язкові.' });
    }

    const articles = readArticles();

    const newArticle = {
        id: uuidv4(),
        title,
        content,
        image: image || null, // Base64 або URL
        authorId,
        createdAt: new Date().toISOString()
    };

    articles.push(newArticle);
    writeArticles(articles);

    res.status(201).json({ message: 'Стаття успішно додана.', article: newArticle });
});

app.get('/articles', (req, res) => {
    const articles = readArticles();
    res.json(articles);
});

app.get('/articles/:id', (req, res) => {
    const { id } = req.params;
    const articles = readArticles();
    const article = articles.find(a => a.id === id);

    if (!article) {
        return res.status(404).json({ message: 'Стаття не знайдена.' });
    }

    res.json(article);
});

app.delete('/articles/:id', (req, res) => {
    const { id } = req.params;
    const articles = readArticles();
    const index = articles.findIndex(article => article.id === id);

    if (index === -1) {
        return res.status(404).json({ message: 'Стаття не знайдена.' });
    }

    articles.splice(index, 1);
    writeArticles(articles);

    res.json({ message: 'Стаття успішно видалена.' });
});


app.patch('/articles/:id', (req, res) => {
    const { id } = req.params;
    const { title, content, image } = req.body;

    const articles = readArticles();
    const article = articles.find(article => article.id === id);

    if (!article) {
        return res.status(404).json({ message: 'Стаття не знайдена.' });
    }

    if (title !== undefined) article.title = title;
    if (content !== undefined) article.content = content;
    if (image !== undefined) article.image = image;

    writeArticles(articles);

    res.json({ message: 'Стаття оновлена.', article });
});


//  API-ключ Gemini
const genAI = new GoogleGenerativeAI("AIzaSyChg26u_LS3LWCHGD-KUD_qtwGSClweYDU");

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(`Ти технічна підтримка сайту. Відповідай ввічливо і без зайвих слів. Користувач питає: ${message}`);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Помилка при виклику Gemini API" });
  }
});


// --- Функції для роботи з користувачами  ---
function readUsers() {
    try {
        const data = fs.readFileSync(USERS_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading users file:", error.message);
        return [];
    }
}

function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// --- Функції для роботи з заявками на ремонт  ---
function readRepairRequests() {
    try {
        const data = fs.readFileSync(REPAIR_REQUESTS_FILE);
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading repair requests file:", error.message);
        return [];
    }
}

function writeRepairRequests(requests) {
    fs.writeFileSync(REPAIR_REQUESTS_FILE, JSON.stringify(requests, null, 2));
}

// Маршрут для реєстрації
app.post('/register', async (req, res) => {
    const { username, email, password, role, phone, address, description } = req.body;
    const users = readUsers();

    // Перевірка, чи користувач з таким ім'ям або email вже існує
    if (users.some(u => u.username === username)) {
        return res.status(409).json({ message: 'Користувач з таким ім’ям вже існує' });
    }
    if (users.some(u => u.email === email)) {
        return res.status(409).json({ message: 'Користувач з таким email вже існує' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = {
            id: uuidv4(),
            username,
            email,
            password: hashedPassword,
            role: role || 'user', // За замовчуванням 'user'
            phone: role === 'user' || role === 'master' ? phone : undefined,
            address: role === 'user' ? address : undefined,
            description: role === 'master' ? description : undefined, 
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        writeUsers(users);

        res.status(201).json({ message: 'Реєстрація успішна!', user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role } });
    } catch (error) {
        console.error('Помилка при реєстрації:', error);
        res.status(500).json({ message: 'Помилка сервера при реєстрації' });
    }
});


// Авторизація
app.post('/login', async (req, res) => {
    
    const { email, password } = req.body; 
    const users = readUsers();

    
    const user = users.find(u => u.email === email); 

    if (!user) {
       
        return res.status(401).json({ message: 'Невірна пошта або пароль' }); 
    }

    try {
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            res.json({
                message: 'Вхід успішний',
                user: {
                    id: user.id,
                    username: user.username, 
                    email: user.email,
                    role: user.role,
                    
                },
            });
        } else {
            res.status(401).json({ message: 'Невірна пошта або пароль' });
        }
    } catch (error) {
        console.error('Помилка при авторизації:', error);
        res.status(500).json({ message: 'Помилка сервера при авторизації' });
    }
});

// --- ОНОВЛЕНИЙ Маршрут для подачі заявки на ремонт ---


    

    // Створюємо нову заявку
    app.post('/repair-request', (req, res) => {
    const {
        clientName,
        clientPhone,
        clientEmail,
        deviceType,
        deviceBrand,
        deviceModel,
        issueDescription,
        preferredDate,
        preferredTime,
        issueImage,
        userId // 🔹 ДОДАНО: ID користувача, який створює заявку
    } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'Необхідно вказати userId' });
    }

    const repairRequests = readRepairRequests();

    const newRequest = {
        id: uuidv4(),
        clientName,
        clientPhone,
        clientEmail,
        deviceType,
        deviceBrand,
        deviceModel,
        issueDescription,
        preferredDate,
        preferredTime,
        issueImage: issueImage || null,
        userId, // 🔹 ДОДАНО: ID користувача
        status: 'Очікує на ремонт',
        assignedMasterId: null,
        assignedMasterUsername: null,
        createdAt: new Date().toISOString(),
    };

    repairRequests.push(newRequest);
    writeRepairRequests(repairRequests);

    res.status(201).json({ message: 'Вашу заявку на ремонт прийнято!', request: newRequest });
});




// --- Інші маршрути для заявок (GET, PATCH, DELETE) - без змін, вони вже будуть отримувати поле issueImage ---
app.get('/repair-requests', (req, res) => {
    const repairRequests = readRepairRequests();
    res.json(repairRequests);
});

app.get('/repair-requests/available', (req, res) => {
    const repairRequests = readRepairRequests();
    const availableRequests = repairRequests.filter(req => req.assignedMasterId === null);
    res.json(availableRequests);
});

app.get('/repair-requests/master/:masterId', (req, res) => {
    const { masterId } = req.params;
    const repairRequests = readRepairRequests();
    const masterRequests = repairRequests.filter(req => req.assignedMasterId === masterId);
    res.json(masterRequests);
});



// Призначити заявку майстру
app.patch('/repair-requests/:id/assign', (req, res) => {
    const { id } = req.params;
    const { masterId, masterUsername } = req.body;

    if (!masterId || !masterUsername) {
        return res.status(400).json({ message: 'Необхідно вказати ID та ім’я майстра' });
    }

    const repairRequests = readRepairRequests();
    const requestIndex = repairRequests.findIndex(r => r.id === id);

    if (requestIndex === -1) {
        return res.status(404).json({ message: 'Заявку не знайдено' });
    }

    // Оновлюємо заявку
    repairRequests[requestIndex].assignedMasterId = masterId;
    repairRequests[requestIndex].assignedMasterUsername = masterUsername;
    repairRequests[requestIndex].status = 'В роботі';

    writeRepairRequests(repairRequests);

    res.json({ message: 'Заявку призначено майстру', request: repairRequests[requestIndex] });
});


app.patch('/repair-requests/:id/status', (req, res) => {
    const requestId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Новий статус не надано.' });
    }

    const requests = readRepairRequests();
    const requestIndex = requests.findIndex(req => req.id === requestId);

    if (requestIndex === -1) {
        return res.status(404).json({ message: 'Заявку не знайдено.' });
    }

    requests[requestIndex].status = status;
    writeRepairRequests(requests);

    res.json({ message: 'Статус успішно оновлено.' });
});

app.delete('/repair-requests/:id', (req, res) => {
    const requestId = req.params.id;
    const requests = readRepairRequests();
    const newRequests = requests.filter(req => req.id !== requestId);

    if (requests.length === newRequests.length) {
        return res.status(404).json({ message: 'Заявку не знайдено.' });
    }

    writeRepairRequests(newRequests);

    res.json({ message: 'Заявку успішно видалено.' });
});


app.patch('/repair-requests/:id/report', (req, res) => {
    const { id } = req.params;
    const { serviceReport, price } = req.body;

    const requests = JSON.parse(fs.readFileSync(REPAIR_REQUESTS_FILE));
    const request = requests.find(r => r.id === id);

    if (!request) {
        return res.status(404).json({ message: 'Заявка не знайдена.' });
    }

    if (serviceReport !== undefined) request.serviceReport = serviceReport;
    if (price !== undefined) request.price = price;

    fs.writeFileSync(REPAIR_REQUESTS_FILE, JSON.stringify(requests, null, 2));
    res.json({ message: 'Звіт оновлено успішно.', request });
});


app.get('/repair-requests/user/:userId', (req, res) => {
    const { userId } = req.params;
    const repairRequests = readRepairRequests();
    const userRequests = repairRequests.filter(request => request.userId === userId);
    res.json(userRequests);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
