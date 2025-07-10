# Tarot Web App

A modern, animated Tarot card web application built with React and Vite. Features elegant glassmorphic UI, 3D card effects, and an interactive coverflow for browsing all 22 Major Arcana cards.

## Features

- **Interactive Card Drawing**: Click the central circle to draw 3 cards (Past, Present, Future) with smooth animations
- **3D Card Effects**: TiltedCard component with realistic 3D transformations and hover effects
- **Coverflow Gallery**: Browse all 22 Major Arcana cards in an elegant 3D coverflow interface
- **Card Information Modal**: Click any card to view detailed information in a side-by-side layout
- **Glassmorphic UI**: Modern glass effects with subtle transparency and blur
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions

## Technologies Used

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics and effects
- **CSS3** - Modern styling with glassmorphism effects

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Website-Tarot
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Main Interface
- **Central Circle**: Click to draw 3 Tarot cards
- **Back Button** (top-left): Return to previous state
- **List Button** (top-right): Open the coverflow gallery
- **Reload Button** (bottom-right): Reset the current draw

### Coverflow Gallery
- **Navigation**: Click on side cards to navigate through all 22 Major Arcana
- **Card Information**: Click the central card to view detailed information
- **Close**: Use the exit button to return to the main interface

### Card Information Modal
- **Layout**: Side-by-side view with card image and information
- **Close**: Click the exit button to return to the previous view

## Project Structure

```
Website-Tarot/
├── public/           # Static assets (images, icons)
├── src/
│   ├── App.jsx      # Main application component
│   ├── CircularText.jsx  # Animated circular text component
│   ├── Silk.jsx     # Background silk effect
│   ├── TiltedCard.jsx    # 3D card component
│   └── main.jsx     # Application entry point
├── package.json      # Dependencies and scripts
└── README.md        # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Key Components

- **App.jsx**: Main application logic and state management
- **TiltedCard.jsx**: Reusable 3D card component with tilt effects
- **CircularText.jsx**: Animated circular text for the main interface
- **Silk.jsx**: Background silk effect component

## Features in Detail

### Card Drawing System
- Fisher-Yates shuffle algorithm for true randomness
- Sequential reveal animations
- Unique card selection (no duplicates in a single draw)

### UI/UX Design
- Glassmorphism effects with backdrop blur
- Premium gradient hover effects
- Subtle animations and micro-interactions
- Apple-style minimalism and attention to detail

### Responsive Design
- Optimized for desktop and mobile
- Touch-friendly interactions
- Adaptive layouts and sizing

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Tarot card images and interpretations
- Three.js community for 3D effects
- Framer Motion for smooth animations 