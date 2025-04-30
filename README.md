# ✈️ JetSetGo

Welcome to **JetSetGo**, the smarter way to find your next adventure!  
Rather than choosing your destination first, simply tell us what *you* want — budget, holiday style, weather preferences — and we'll show you the perfect options across the world. 🌍  

JetSetGo even checks visa and passport requirements for you, ensuring every journey suggestion is realistic and tailored to your needs.  

---

## ✨ Features

- 🔎 Search for flights based on **preferences**, not destinations.
- 💵 Filter results by **maximum budget**.
- 🌞 Choose your ideal **climate** (hot, mild, or cold).
- 🏖️ Select from **holiday styles** like city breaks, beaches, cultural escapes, and more.
- 🛂 **Visa and travel requirement checks** via AI after flight selection.
- 📋 Save your **profile** (name, date of birth, passport country) for a personalised experience.
- 🔐 Fully authenticated user system (login/register with Firebase).
- 🎨 Responsive, modern user interface with a clean, themed design.

---

## 🚀 Installation & Setup

These instructions assume you have `Node.js`, `npm`, and `Python 3.11+` installed on your machine.

### 1. Clone the repository

```bash
git clone https://github.com/tadhgsavageplymouth/JetSetGo.git
cd JetSetGo
```

---

### 2. Set up the Frontend (React Client)

```bash
cd client
npm install
```

- This will install all required packages (React, React Router, Firebase SDK, etc.).

To start the React development server:

```bash
npm start
```
- The app will be available at `http://localhost:3000/`

---

### 3. Set up the Backend (FastAPI Server)

```bash
cd ../server
python -m venv venv
source venv/bin/activate  # (or venv\Scripts\activate on Windows)

pip install -r requirements.txt
```

> If `requirements.txt` is missing, manually install:
> ```bash
> pip install fastapi uvicorn openai pandas numpy faiss-cpu scikit-learn python-dotenv
> ```

---

### 4. Create your `.env` file

In the `server/` directory, create a `.env` file:

```env
OPENAI_API_KEY=your-openai-api-key-here
```

This API key is used for fetching visa and travel information dynamically via OpenAI.

---

### 5. Start the Backend Server

From the `server/` directory:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
- The FastAPI server will now run on `http://localhost:8000/`.

---

## 🔥 Technologies Used

- **Frontend**: React.js, React Router, Firebase Authentication, Firebase Firestore
- **Backend**: FastAPI (Python), FAISS for fast vector similarity search, OpenAI API
- **Data**: Synthetic flight datasets (`synthetic_weighted_global_flights_50k.csv`)
- **Hosting/Storage**: Firebase, Google Cloud Console (for future deployment plans)

---

## 📚 User Journey

1. **Sign up** or **Log in** to JetSetGo.
2. **Create your profile** — input your name, date of birth, and passport country.
3. **Search for flights** based on what you love: budget, climate, holiday type.
4. **View matched flights** and select one.
5. **Instantly see visa and travel requirements** based on your passport.
6. **Plan your trip stress-free** knowing your destinations are accessible!

---

## 🛠 Future Improvements

- 🛬 Direct flight booking integration
- 👥 Group travel planner
- 🧳 Hotel and activity recommendations
- 🌐 Full production deployment on Firebase Hosting and Cloud Run

---

## 📄 License

This project is currently for educational purposes under the University of Plymouth Computing Project module (COMP3000).  
**All rights reserved © Tadhg Savage 2025.**

---

## 💬 Contact

Questions, ideas, or feedback? Feel free to get in touch via the GitHub Issues page or open a pull request!

---

## ✈️ Let JetSetGo take you places you never expected — smarter, faster, happier!
