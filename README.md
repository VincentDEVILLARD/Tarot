# Tarot Web App

Hi! This is my final project for CS50x: a modern Tarot card web app built with React and Vite. I wanted to create something beautiful, interactive, and a bit magical—an experience that makes you want to explore the Tarot, even if you’re a total beginner.

## Why I Built This

I’ve always been fascinated by the symbolism of Tarot cards. My goal was to design an app that feels smooth, poetic, and fun to use, while still respecting the depth of the Major Arcana. I focused on making the UI visually appealing and the interactions satisfying.

## Features

- **Draw Past / Present / Future**: Click the central circle to draw three cards, each revealed with a smooth animation.
- **3D Card Effects**: Cards tilt and react to your mouse, as if you could pick them up.
- **Coverflow Gallery**: Browse all 22 Major Arcana cards in a slick, animated coverflow.
- **Detailed Descriptions**: Each card comes with a custom-written description inspired by Tarot tradition.
- **Glassmorphic UI**: Modern design with transparency, blur, and a custom font.
- **Responsive**: Works on both desktop and mobile.

## How to Run

1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd Website-Tarot
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/App.jsx` – Main app logic and UI
- `src/TiltedCard.jsx` – Reusable 3D card component
- `src/CircularText.jsx` – Animated circular text for the home screen
- `src/Silk.jsx` – Animated silk background
- `public/cards/` – The 22 Major Arcana card images

## Tech Stack

- **React** (with Vite) for fast, modular development
- **Framer Motion** for all the smooth animations
- **Three.js** (via @react-three/fiber) for the animated background
- **CSS glassmorphism** for the modern look

## What I’m Proud Of

- The interactive 3D card effect
- The overall user experience: everything feels fluid and intuitive
- The custom card descriptions
- The coverflow gallery that makes you want to explore every card

## Notes

- All images are local; there’s no backend or API
- The app is fully client-side

Thanks for checking out my project! If you have feedback or want to fork it, go ahead. 