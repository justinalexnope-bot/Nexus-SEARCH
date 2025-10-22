# Nexus Search

Nexus Search is a modern, AI-powered search engine frontend concept built with React and Tailwind CSS. It features a sleek, responsive interface and integrates with various APIs to provide web, image, and code search results, enhanced with AI-driven summaries and community-driven content ranking.

## Features

- **Multi-faceted Search:** Seamlessly switch between Web, Image, and Code search tabs.
- **AI-Powered Summaries:** Get instant AI-generated summaries for your web searches, with an optional "Deep Dive" mode for more comprehensive analysis.
- **Infinite Scrolling:** Smoothly browse through web and image results without pagination.
- **User Authentication:** A complete sign-up and login system, allowing users to create profiles with custom avatars and banners.
- **Community Interaction:** Upvote/downvote results, add tags, and comment on search items to help curate the best content.
- **Instant View:** Preview web pages directly within the app in a modal window.
- **Developer API:** A client-side API to programmatically access search functionality.
- **Safe Search:** Filter or blur explicit content with three levels of Safe Search control.
- **Responsive Design:** A clean, dark-themed UI that works beautifully on all screen sizes.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS
- **AI/APIs:**
    - Google Gemini API (for AI Summaries, Code Search)
    - Google Imagen API (for Image Generation)
    - LibreX/SearXNG (for Web Search, with fallbacks)
- **Persistence:** Browser `localStorage` for user sessions, search history, and community data.

## Deployment to GitHub Pages

You can deploy this project as a static site on GitHub Pages.

### Prerequisites

- A GitHub account.
- Git installed on your local machine.
- **Important:** An environment that can replace `process.env.API_KEY` during a build step. This project references this environment variable for the Google GenAI API key. GitHub Pages itself does not support environment variables, but you can achieve this using **GitHub Actions**. You would need to:
    1.  Create a build step in your workflow file (e.g., `build.yml`).
    2.  Store your API key as a repository secret (e.g., `GEMINI_API_KEY`).
    3.  Use a tool like `esbuild`, `vite`, or simple text replacement (`sed`, `awk`) in your workflow to replace `process.env.API_KEY` in the JavaScript/TypeScript files with the value of your secret before deploying the static files.

### Deployment Steps

1.  **Create a Repository:** Create a new public repository on your GitHub account.

2.  **Initialize Git:** Open your terminal in the project's root directory and run the following commands:
    ```bash
    git init -b main
    git add .
    git commit -m "Initial commit"
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
    git push -u origin main
    ```
    (Replace `YOUR_USERNAME` and `YOUR_REPOSITORY` with your details).

3.  **Configure GitHub Pages:**
    - In your GitHub repository, go to `Settings` > `Pages`.
    - Under "Build and deployment", for the "Source", select `Deploy from a branch`.
    - Select your `main` branch and the `/(root)` folder, then click `Save`.

4.  **Wait for Deployment:** GitHub will start a deployment process. After a few minutes, your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`.

### Potential Issue: Asset Paths

This project has been configured with relative paths (e.g., `./index.tsx`) to ensure it works correctly when deployed to a subdirectory on GitHub Pages. If you encounter any issues with files not loading, please ensure all paths in `index.html` are relative.
