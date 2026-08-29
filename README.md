# Frontside 🚀

A modern, responsive, and feature-rich React frontend application built with **Vite**, **Tailwind CSS**, and **Google OAuth**.

---

## 🛠️ Tech Stack & Key Dependencies

- **Core Library:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite (`vite`, `@vitejs/plugin-react`)
- **Styling:** Tailwind CSS 4 (`tailwindcss`, `@tailwindcss/vite`)
- **Routing:** React Router v7 (`react-router-dom`)
- **Authentication:** Google OAuth (`@react-oauth/google`)
- **HTTP Client:** Axios (`axios`)
- **File Uploads:** FilePond (`filepond`, `react-filepond`) & React Dropzone (`react-dropzone`)
- **UI Components & Icons:** Lucide React (`lucide-react`), React Icons (`react-icons`), React Modal (`react-modal`), React Spinners (`react-spinners`)
- **Code Quality:** ESLint (`eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

---

## ✨ Features

- ⚡ **Lightning Fast:** Powered by Vite for instant HMR and optimized production builds.
- 🎨 **Modern UI:** Styled using Tailwind CSS v4 and interactive UI components.
- 🔑 **Google Authentication:** Integrated Google Sign-In via `@react-oauth/google`.
- 📁 **Advanced File Uploads:** Seamless drag-and-drop file upload capabilities powered by **FilePond** and **React Dropzone**.
- 🔀 **Dynamic Routing:** Multi-page client-side routing implemented with React Router.
- 🌐 **API Integration:** Asynchronous data fetching handled cleanly with Axios.

---

## 💻 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Ensure you have **Node.js** (v18 or higher) and **npm** installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/frontside.git
   ```

2. **Navigate into the project directory:**
   ```bash
   cd frontside
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up Environment Variables:**
   Create a `.env` file in the root folder and add your configuration details (e.g., Google OAuth Client ID):
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   VITE_API_BASE_URL=your_backend_api_url
   ```

---

## 🚀 Available Scripts

In the project directory, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server using Vite. |
| `npm run build` | Builds the app for production in the `dist` folder. |
| `npm run preview` | Previews the local production build. |
| `npm run lint` | Runs ESLint to check for code quality and syntax errors. |

---

## 📂 Folder Structure

```
frontside/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, icons, global styles
│   ├── components/      # Reusable UI components (Modals, Spinners, File Uploaders)
│   ├── pages/           # Route views / Application pages
│   ├── App.jsx          # Root component
│   └── main.jsx         # Entry point
├── .env                 # Environment variables
├── package.json         # Project dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md
```

---

## 📜 License

This project is private and intended for internal or authorized use only.