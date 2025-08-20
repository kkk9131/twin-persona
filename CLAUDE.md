# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TwinPersona (ツインパーソナ) is a personality diagnosis web application that combines MBTI personality testing with Character Code visual impression analysis. The app reveals the gap between users' inner personality and outer impression, creating shareable results with unique character visualizations.

## Key Commands

Since this appears to be a React application without package.json setup yet, here are the necessary commands to set up and run the project:

### Initial Setup (if not done)
```bash
# Initialize npm project
npm init -y

# Install required dependencies
npm install react react-dom
npm install -D vite @vitejs/plugin-react
npm install lucide-react

# Install TailwindCSS (based on requirements doc)
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install GitHub Pages deployment tool
npm install -D gh-pages
```

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## Architecture & Code Structure

### Core Application Flow
1. **Start Screen** → User begins diagnosis
2. **MBTI Questions** (28 questions) → Determines personality type (E/I, S/N, T/F, J/P)
3. **Character Code Questions** (12 questions) → Determines visual impression (gentle/natural/dynamic/cool)
4. **Photo Upload** → Optional face photo for future AI integration
5. **AI Generation Mock** → 3-second loading animation
6. **Results Display** → Combined analysis with character visualization

### Key Technical Patterns

#### Unified Color System
The app uses MBTI group-based color palettes defined in `unifiedColorPalette`:
- **Analysts (NT)**: Purple shades (#8B5CF6, #A78BFA, #6D28D9)
- **Diplomats (NF)**: Cyan shades (#06B6D4, #67E8F9, #0891B2)
- **Sentinels (SJ)**: Green shades (#10B981, #6EE7B7, #059669)
- **Explorers (SP)**: Amber shades (#F59E0B, #FCD34D, #D97706)

#### Character Generation System
- **Current**: SVG-based character generation with unified colors and impression-based patterns
- **Future**: AI image generation with Low Poly 3D style (prompt system already implemented)

#### Data Flow
- All diagnostic data is stored in React state (no localStorage)
- Results are calculated client-side using scoring algorithms
- Share functionality uses Canvas API for image generation

### Important Implementation Details

#### Question Structure
- **MBTI Questions**: 7 questions per axis (E/I, S/N, T/F, J/P) = 28 total
- **Character Questions**: 12 questions mapping to 4 impression types
- Each question has specific type mappings for accurate scoring

#### Result Calculation
- **MBTI Type**: Determined by majority answers in each axis
- **Character Type**: Determined by highest score among 4 types
- **Gap Analysis**: Combines MBTI + Character Type with rarity percentages
- **Compatibility**: Based on MBTI dual relationships theory
- **Entertainment Scores**: 6 metrics (Charisma, Friendliness, Mystery, Gap, Rarity, Attractiveness)

#### Share & Export Features
- Canvas-based image generation (800×800px)
- Native share API integration
- Clipboard copy functionality
- PNG download option

## Current Status & Next Steps

### Completed Features
- Full question sets for MBTI and Character Code
- Complete result calculation logic
- SVG character generation with unified colors
- Gap analysis and compatibility system
- Entertainment score calculations
- AI prompt generation system (ready for API integration)

### Setup Required
1. Create proper React project structure with Vite
2. Add package.json with dependencies
3. Configure TailwindCSS
4. Set up GitHub Pages deployment

### Future Enhancements (Phase 2)
- Integrate actual AI image generation API
- Add user data persistence
- Implement analytics
- Add custom domain

## Deployment Target
- **Platform**: GitHub Pages
- **Repository**: github.com/kkk9131/twin-persona
- **Constraints**: Static site only (no server-side processing)

## Notes
- The app is designed mobile-first with responsive layouts
- All text is in Japanese
- No personal data is stored (privacy-first approach)
- Results are session-only (no persistence)