<!-- PROJECT SHIELDS -->
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://www.w3.org/Style/CSS/Overview.en.html)

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h3 align="center">Retro MC | Pixel Clothing</h3>

  <p align="center">
    An immersive, retro-gaming-inspired e-commerce platform where fashion is forged in pixels. Features a gamified 2D RPG merchant storefront, interactive inventory UI, and custom CSS animations.
    <br />
    <br />
    <strong>Tags:</strong> <code>nextjs</code>, <code>react</code>, <code>ecommerce</code>, <code>mongodb</code>, <code>retro-ui</code>, <code>pixel-art</code>, <code>gamified-ui</code>, <code>css-animations</code>, <code>full-stack</code>
    <br />
    <br />
    <a href="https://pixel-clothing-website.vercel.app/"><strong>View Live Demo »</strong></a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#live-preview">Live Preview</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

Retro MC reimagines the traditional e-commerce shopping experience as a classic 8-bit RPG adventure. Instead of scrolling through a standard grid of products, users enter a "Merchant House," interact with the shopkeeper, and browse items through a gamified inventory UI. Built with Next.js and MongoDB, the application pairs robust full-stack architecture with a highly stylized, nostalgic frontend.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* **Frontend Architecture:** Next.js (App Router), React 19
* **Backend Runtime:** Next.js Serverless API Routes
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Styling & Animation:** Native CSS (Custom Keyframe Animations, Pixel Fonts)
* **Deployment:** Vercel

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE PREVIEW -->
## Live Preview

This e-commerce platform is fully deployed and accessible online. There is no need to clone the repository or configure a local database to experience the storefront.

You can interact with the merchant, browse the pixel-art inventory, and experience the gamified checkout flow directly in your browser:

* 🔗 **[Visit the Live Store - www.pixel-clothing-website.vercel.app](https://pixel-clothing-website.vercel.app/)**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- KEY FEATURES -->
## Key Features

### Gamified Storefront
* **RPG Merchant Interaction:** Users interact with a shopkeeper ("EJ") featuring dynamic, typewriter-effect dialogue that reacts to user browsing states.
* **Keeper's Inventory:** A stylized UI where users "equip" clothing items to view their high-res pixel art, descriptions, and "passive stats" before adding them to their cart.

### Immersive Retro UI/UX
* **Authentic Aesthetics:** Utilizes custom pixel fonts (`Depixel`, `Jersey 10`), custom cursor sprites, and 8-bit background audio with a built-in persistent mute controller.
* **Cinematic Animations:** Features deep CSS keyframe usage for boot-up sequences, floating elements, hologram glitches, and sliding modal panels.
* **Responsive Modals:** Thematic "Scroll" menus for the About Us page, FAQ Guide, and interactive Daily Quests (social links).

### Full-Stack Architecture
* **MongoDB Integration:** The product catalog (names, prices, descriptions, images) is fetched dynamically from a MongoDB cluster via custom API routes.
* **Cart & Checkout Engine:** The "Merchant's Ledger" handles cart state management, dynamic total calculations, and a simulated checkout processing sequence ("Forging your order...").

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->
## Project Structure

```text
├── public/
│   └── assets/                 # Static images, icons, and 8-bit audio files
├── src/
│   ├── app/                    # Next.js App Router (Pages & API)
│   │   ├── api/items/          # Serverless API endpoints for MongoDB
│   │   │   └── route.js
│   │   ├── checkout/           # Checkout flow routes and styles
│   │   │   ├── Checkout.css
│   │   │   └── page.jsx
│   │   ├── house/              # Main RPG Merchant Storefront
│   │   │   ├── House.css
│   │   │   ├── layout.jsx
│   │   │   └── page.jsx
│   │   ├── globals.css         # Global styles & custom cursor definitions
│   │   ├── icon.png            # Application favicon
│   │   ├── layout.jsx          # Root application layout
│   │   ├── page.jsx            # Landing page sequence component
│   │   ├── page.module.css     # Landing page CSS modules
│   │   └── StartPage.css       # Boot-up animation styles
│   ├── components/             # Reusable React components
│   │   ├── AudioController/    # Background music manager
│   │   │   ├── AudioController.css
│   │   │   └── AudioController.jsx
│   │   └── Popups/             # Interactive UI modals
│   │       ├── AboutPopup.css
│   │       ├── AboutPopup.jsx  # Lore and brand info
│   │       ├── Guide.css
│   │       ├── Guide.jsx       # FAQ system
│   │       ├── QuestPopup.css
│   │       └── QuestPopup.jsx  # Daily quests (social links)
│   ├── lib/
│   │   └── mongodb.js          # Database connection utility
│   └── models/
│       └── Item.js             # Mongoose schema for clothing items
├── .gitignore
├── eslint.config.mjs           # Linter configuration
├── jsconfig.json               # Path alias configuration
├── package-lock.json
├── package.json                # Project scripts and dependencies
└── README.md                   # Project documentation
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Sean Rhani Jarin Dela Cruz

Project Link: https://github.com/SeanRDC/beaded-by-unknown <br />
LinkedIn Link: https://www.linkedin.com/in/sean-rhani-dela-cruz-834573334/

<p align="right">(<a href="#readme-top">back to top</a>)</p>
