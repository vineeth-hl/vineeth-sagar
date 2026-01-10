# High-End Portfolio (React + Tailwind)

This project has been refactored to use React, Tailwind CSS, and GSAP for premium animations.

## Structure

- **src/components**: Reusable UI components (Navbar, Hero, Skills, etc.).
- **src/App.jsx**: Main application layout and Smooth Scroll configuration.
- **src/index.css**: Global styles and Tailwind directives.
- **public/**: Static assets like `resume.pdf`.

## Getting Started

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    ```

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Customization

- **Resume**: Replace `public/resume.pdf` with your actual file.
- **Hero Image**: Update the image URL in `src/components/Hero.jsx`.
- **Skills**: Add more items to the array in `src/components/Skills.jsx`.

## Deployment Guide (GitHub + Vercel)

Follow these steps to deploy your portfolio and connect your domain **vineethsagar.co.in**.

### Phase 1: Push to GitHub
1.  Initialize Git (if not already done):
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
2.  Create a new repository on [GitHub](https://github.com/new).
3.  Link your local project to GitHub:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

### Phase 2: Deploy to Vercel
1.  Go to [Vercel](https://vercel.com) and sign up/login with GitHub.
2.  Click **"Add New"** > **"Project"**.
3.  Import your GitHub repository (`portfolio` or whatever you named it).
4.  Leave the build settings as default (Framework Preset: **Vite**).
5.  Click **"Deploy"**.

### Phase 3: Connect Custom Domain
1.  Once deployed, go to the **Settings** tab of your Vercel project by clicking on the project name in the Vercel dashboard.
2.  Select **Domains** from the left sidebar.
3.  Enter `vineethsagar.co.in` in the input box and click **Add**.
4.  Vercel will provide DNS records (A Record and CNAME).
5.  **Configure your Domain Provider (GoDaddy, Namecheap, etc.)**:
    -   Log in to where you bought your domain.
    -   Go to **DNS Management**.
    -   **A Record**:
        -   Type: `A`
        -   Name: `@`
        -   Value: `76.76.21.21` (Create this record)
    -   **CNAME Record**:
        -   Type: `CNAME`
        -   Name: `www`
        -   Value: `cname.vercel-dns.com` (Create this record)
6.  Wait for verification (usually takes a few minutes to an hour). Once the icons turn green on Vercel, your site is live at [vineethsagar.co.in](https://vineethsagar.co.in).
