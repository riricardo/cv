# CV

An interactive online resume built with React, TypeScript and Vite.

The goal of this project is to provide a modern, responsive and reusable resume platform where multiple versions can be generated from files while sharing the same layout and components.

---

## ✨ Features

- 📄 Multiple resume versions
- 🌎 Multi-language support
- ⚡ Fast loading with Vite
- 🎨 Tailwind CSS + DaisyUI
- 📱 Responsive design
- 🖨️ Print-friendly layout
- ♿ Accessibility-first approach
- 🚀 Automatic deployment with GitHub Pages

---

## 🛠️ Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- DaisyUI
- Font Awesome
- Oxlint
- Prettier
- GitHub Actions
- GitHub Pages

---

## 🌐 Deployment

The project is automatically deployed to GitHub Pages through GitHub Actions.

## 🔌 API integration

The public resume page loads data from an ASP.NET Core Web API:

```env
VITE_API_BASE_URL=http://localhost:5255
```

Run the API locally, then start the site:

```sh
npm run dev
```

The site calls:

```txt
GET /api/resumes/by-link/{linkId}
```

The public resume page requires `VITE_API_BASE_URL`. If the API URL is not configured, or if the API request fails, the site shows an error state instead of loading local JSON data.

Important: `VITE_API_BASE_URL` is a Vite build-time environment variable and is visible in the browser bundle. Do not store master keys or private secrets in `VITE_*` variables. The public resume request does not send `X-MASTER-KEY`; admin/write operations must be protected and validated by the API.
