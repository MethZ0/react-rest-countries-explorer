---

# 🌍 Amazing World - Countries API

A modern web application built with **React** that allows users to explore countries around the world 🌐 — including features like searching 🔍, filtering 🎯, and favoriting ❤️ countries. Built with Redux for state management and mock authentication.

---

## ✨ Features

* 🌎 **Country Exploration**: Browse detailed information about countries
* 🔍 **Search & Filters**: Search by name, filter by region and language
* 🔐 **User Authentication**: Mock login using Redux (frontend only)
* ❤️ **Favorite Countries**: Save and manage your favorites
* 📱 **Responsive Design**: Works beautifully on all devices
* 💫 **Interactive UI**: Smooth animations and transitions

---

## 🌐 Live Demo

👉 [Amazing World](https://amazing-worlds.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/79cc6eea-dc17-4c9d-8644-7e850bc50729/deploy-status)](https://app.netlify.com/sites/amazing-worlds/deploys)

---

## 🛠️ Tech Stack

* ⚛️ **React** – Frontend library
* 🧠 **Redux** – State management
* 🌐 **React Router** – Routing
* 🎨 **Tailwind CSS** – Styling
* 🖼️ **Lucide Icons** – Icon library
* 📡 **REST Countries API** – Country data
* 🧪 **Vitest & Jest** – Testing
* 🧪 **React Testing Library** – Component testing

---

## 🚀 Getting Started

### ✅ Prerequisites

* Node.js (v14 or higher)
* npm or yarn

### 📦 Installation

```bash
git clone https://github.com/yourusername/react-rest-countries-explorer.git
cd react-rest-countries-explorer
```

```bash
npm install
# or
yarn install
```

### ▶️ Run the app

```bash
npm run dev
# or
yarn dev
```

🔗 Visit: `http://localhost:5173`

---

## 📁 Project Structure

```
countries-explorer/
├── src/
│   ├── components/        # 🔁 Reusable UI components
│   ├── pages/             # 📄 Main views/pages
│   ├── redux/             # 🧠 State management
│   ├── __tests__/         # 🧪 Unit & integration tests
│   ├── App.jsx            # 🚪 Main app shell
│   └── main.jsx           # 🧾 Entry point
```

---

## 🔐 Authentication (Mock)

This project uses Redux to simulate login with the following mock user:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

No backend is required — all data is frontend-only.

---

## 🧠 State Management

Redux handles:

* 👤 Authentication
* ❤️ Favorite countries
* 🔄 Loading states
* ❌ Error handling

---

## 🌍 API Integration

Uses the [REST Countries API](https://restcountries.com) to fetch:

* 🏳️ Flags
* 👥 Population
* 🗣️ Languages
* 📍 Region & Subregion
* 📜 Country details

---

## 🧪 Testing

Built with robust testing setup:

### 🔧 Tools

* **Vitest** 🧪
* **Jest** 🔍
* **React Testing Library** 🧰
* **Mock Service Worker (MSW)** 🎭

### ✅ Covered

* 🔁 Redux store and slices
* 🧩 Component rendering
* 🤝 Integration flows
* 🔍 User interactions

### 🧪 Run Tests

```bash
npm test               # Run all tests
npm run test:watch     # Watch mode
npm run test:coverage  # Coverage report
```

---

## 🎨 Styling

Styled using **Tailwind CSS**:

* ⚡ Fast and responsive
* 🌀 Custom animations
* 🧩 Modular design
* 📱 Mobile-first layout

---

## 🤝 Contributing

1. 🍴 Fork the repo
2. 🔧 Create your branch: `git checkout -b feature/AmazingFeature`
3. 💾 Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. 🚀 Push to GitHub: `git push origin feature/AmazingFeature`
5. 📝 Open a Pull Request

---

## 📄 License

Licensed under the MIT License – see `LICENSE.md` for details.

---

## 🙏 Acknowledgments

* [REST Countries API](https://restcountries.com)
* [Tailwind CSS](https://tailwindcss.com)
* [Redux Toolkit](https://redux-toolkit.js.org)
* [React Router](https://reactrouter.com)
* [Lucide Icons](https://lucide.dev)
* [Vitest](https://vitest.dev)
* [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

Would you like me to help you format this directly in your actual README file or generate it as a `.md` file?
