# Interactive Storybook in WebGL

This project is a simple storybook built using WebGL, where the scenes combines 3D models, animated text, transitions, and custom shaders. 
The goal was to create a proper storybook with animation, but due to timming, I had to choose change for a basic approach.

---

## Project Overview & Design Decisions

### Features

- 3D objects rendered with WebGL (via Three.js)
- Animated text elements floating or fading in context
- Custom shaders for effects (e.g., icons, stars, transitions)
- Modular scene architecture (each scene is its own file)
- Central logic in `App.js` controls flow, transitions, and state

### Why I Made These Choices

- **Scene modularization**: Keeping each scene in a separate file made the system easier to extend and test.
- **Navigation**: Navigation happens via animation and scene control logic.
- **Single entry point**: Centralizing logic in `App.js` simplifies management of shared variables, timers, and scene transitions.

### Next Steps / Ideas
- Create a proper story
- Add background audio or narration for each scene
- Add a visual progress bar
- Add effects

### Tech Stack

- WebGL via [Three.js](https://threejs.org/)
- GLSL shaders (fragment + vertex)
- Vite (for development/build)
- JavaScript (ESModules)

---

