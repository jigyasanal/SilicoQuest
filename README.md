 
 # SilicoQuest: The Rock That Became a Brain

An interactive educational web application that teaches students (Class 8-12) about semiconductor fabrication and computer science through engaging storytelling, animations, and mini-games.

## 🎯 Overview

SilicoQuest takes students on a journey from sand to silicon chips, explaining how ordinary quartz becomes the "brain" of modern computers. Through 8 interactive chapters, students learn about:

- Silicon extraction and purification
- Crystal growing processes
- Wafer fabrication
- Logic gate construction
- Circuit design
- Programming fundamentals
- The impact of silicon technology

## 🚀 Features

- **Interactive Storytelling**: 8 chapters with animated visuals and voice narration
- **Silico Character**: Cute animated silicon atom guide that evolves through chapters
- **Mini-Games**: Educational games for each chapter (sorting, control, precision, etc.)
- **Progress Tracking**: Visual progress bar and chapter completion tracking
- **Mobile Responsive**: Works on phones, tablets, and desktops
- **Certificate Generation**: Downloadable completion certificate
- **Local Storage**: Saves progress automatically

## 📁 Project Structure

```
/SilicoQuest_v2/
├── index.html              # Main application entry point
├── main.css                # Main stylesheet with animations
├── app.js                  # Core application logic
├── /components/            # Modular JavaScript components
│   ├── SilicoCharacter.js  # Character animation controller
│   ├── ChapterManager.js   # Chapter progression and data management
│   ├── GameLoader.js       # Mini-game loader and implementations
│   └── Certificate.js      # Certificate generation system
├── /data/                  # Application data
│   └── chapters.json       # Chapter content and narration data
├── /assets/                # Static assets
│   ├── /audio/            # Voice narration files (MP3)
│   └── /images/           # Visual assets (SVG, PNG, JPG)
└── README.md              # This file
```

## 🎮 Chapter Overview

1. **The Sand of Intelligence** - Quartz identification and sorting game
2. **The Great Purification** - Furnace temperature control game
3. **Growing the Perfect Crystal** - Crystal growth precision game
4. **Slicing the Silicon Wafer** - Wafer cutting and polishing game
5. **Building Logic Gates** - Gate design puzzle game
6. **Connecting the Brain** - Circuit connection game
7. **Programming the Silicon Brain** - Visual programming game
8. **The Silicon Revolution** - Knowledge quiz and completion

## 🛠️ Setup Instructions

### Quick Start
1. Open `index.html` in a modern web browser
2. Click anywhere on the welcome popup to begin
3. Follow Silico through the 8 chapters

### For Development
1. Clone or download the project files
2. Serve the files through a local web server (recommended for audio playback)
3. Add audio files to `/assets/audio/` directory
4. Customize chapter content in `/data/chapters.json`

### Audio Files Setup
Add MP3 files to `/assets/audio/` with naming convention:
- `scene1_1.mp3` - Chapter 1, Stage 1
- `scene1_2.mp3` - Chapter 1, Stage 2
- etc.

## 🎨 Customization

### Adding New Chapters
1. Edit `/data/chapters.json` to add chapter data
2. Update `ChapterManager.js` if needed for new game types
3. Add corresponding audio files

### Modifying Games
- Edit game implementations in `GameLoader.js`
- Add new game types by extending the `games` object
- Customize difficulty and scoring in individual game methods

### Styling Changes
- Main styles in `main.css`
- Component-specific styles are added dynamically
- Responsive breakpoints at 768px and 480px

## 📱 Browser Compatibility

- **Recommended**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Required Features**: ES6, CSS Grid/Flexbox, Canvas API, Local Storage
- **Optional**: Web Audio API (for narration), Web Share API (for certificate sharing)

## 🎓 Educational Objectives

Students will learn:
- **Chemistry**: Silicon extraction and purification processes
- **Physics**: Crystal structures and semiconductor properties
- **Engineering**: Manufacturing processes and quality control
- **Computer Science**: Logic gates, circuits, and programming
- **Technology**: Impact of semiconductors on modern life

## 🔧 Technical Details

### Dependencies
- **jsPDF**: PDF generation for certificates
- **html2canvas**: Certificate image capture
- **Google Fonts**: Poppins font family

### Performance
- Lazy loading of game components
- Optimized animations using CSS transforms
- Local storage for progress persistence
- Responsive images and scalable graphics

### Accessibility
- Keyboard navigation support
- High contrast color schemes
- Scalable text and UI elements
- Screen reader friendly structure

## 🎯 Target Audience

- **Primary**: Students in Class 8-12 (ages 13-18)
- **Secondary**: Science educators and parents
- **Context**: CSIR Jigyasa Science Outreach Program

## 🚀 Deployment

### Local Deployment
1. Extract files to web server directory
2. Ensure proper MIME types for audio files
3. Test on target devices and browsers

### Web Deployment
1. Upload all files to web hosting service
2. Ensure HTTPS for audio playback (browser requirement)
3. Configure proper caching headers for assets

## 🤝 Contributing

To contribute to SilicoQuest:
1. Fork the repository
2. Create feature branches for new chapters or games
3. Test thoroughly on multiple devices
4. Submit pull requests with clear descriptions

## 📄 License

This project is part of the CSIR Jigyasa Science Outreach Program.
Educational use is encouraged. Commercial use requires permission.

## 🆘 Troubleshooting

### Common Issues

**Audio not playing:**
- Ensure files are in correct format (MP3)
- Check browser autoplay policies
- Serve files over HTTPS for production

**Games not loading:**
- Check browser console for JavaScript errors
- Ensure all component files are loaded
- Verify JSON syntax in chapters.json

**Certificate download fails:**
- Check if jsPDF and html2canvas libraries are loaded
- Try the print option as fallback
- Ensure popup blockers aren't interfering

**Progress not saving:**
- Check if Local Storage is enabled
- Clear browser cache and try again
- Verify browser supports Local Storage API

## 📞 Support

For technical support or educational inquiries:
- Check browser console for error messages
- Verify all files are properly uploaded
- Test on different browsers and devices

---

**Made with ❤️ for CSIR Jigyasa Science Outreach Program**

*Inspiring the next generation of scientists and engineers through interactive learning!*