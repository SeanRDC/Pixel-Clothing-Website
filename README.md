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
* **Code-Drawn Pixel Art:** Wooden frames, parchment scrolls, icons, and the logo wordmark are drawn in code (9-slice SVG frames and grid-based SVG icons), so they stay crisp at any screen size and weigh a few KB instead of megabytes.
* **Living Title Scene:** Procedurally generated pixel clouds drift across the night sky, with twinkling stars and a glowing moon, all GPU-composited for smooth motion.
* **Authentic Aesthetics:** Pixel fonts (`Depixel`, `Pixelify Sans`, `Jersey 10`), custom cursor sprites, and 8-bit background audio with a persistent mute toggle.
* **Responsive Everywhere:** A three-column shop on desktop that turns into bottom sheets on tablets and phones, plus scroll popups (About, Guide, Quests) that fit any screen and close with Escape.

### Full-Stack Architecture
* **MongoDB Integration:** The product catalog (names, prices, descriptions, images) is fetched dynamically from a MongoDB cluster via custom API routes.
* **Cart & Checkout Engine:** The "Merchant's Ledger" handles cart state management, dynamic total calculations, and a simulated checkout processing sequence ("Forging your order...").

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT STRUCTURE -->
## Project Structure

```text
├── public/
│   └── assets/
│       ├── audio/              # 8-bit background music
│       ├── images/             # Scene paintings, characters, and product art
│       └── ui/                 # Generated 9-slice pixel frames (SVG)
├── scripts/
│   └── generate-ui-frames.cjs  # Draws the UI frames in public/assets/ui
├── src/
│   ├── app/                    # Next.js App Router (Pages & API)
│   │   ├── api/items/route.js  # Product catalog endpoint (MongoDB)
│   │   ├── checkout/           # Standalone checkout page
│   │   ├── house/              # Merchant House storefront
│   │   ├── globals.css         # Design tokens, pixel frames, buttons
│   │   ├── layout.jsx          # Root layout and fonts
│   │   └── page.jsx            # Title screen
│   ├── components/
│   │   ├── AudioController/    # Background music toggle
│   │   ├── Popups/             # ScrollPopup plus About, Guide, Quest
│   │   ├── Scene/              # Animated night sky (clouds, stars, moon)
│   │   └── ui/                 # PixelIcon, IconButton, Logo
│   ├── lib/                    # MongoDB connection, cart storage, hooks
│   └── models/Item.js          # Mongoose schema for clothing items
├── eslint.config.mjs
├── jsconfig.json
└── package.json
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Sean Rhani Jarin Dela Cruz

Project Link: https://github.com/SeanRDC/beaded-by-unknown <br />
LinkedIn Link: https://www.linkedin.com/in/sean-rhani-dela-cruz-834573334/

<p align="right">(<a href="#readme-top">back to top</a>)</p>
