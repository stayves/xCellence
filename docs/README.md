# xCellence FTC Team Website

A modern, responsive website for the xCellence FIRST Tech Challenge (FTC) robotics team. Built with React, TypeScript, and Vite.

## 🎨 Design Features

- **Modern Black & Orange Theme**: Sleek, professional design with orange accent colors
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Engaging transitions and hover effects
- **Intuitive Navigation**: Easy-to-use header with mobile menu support
- **SEO Friendly**: Clean semantic HTML structure

## 📄 Pages

### Home Page
- Full-screen hero section with team photo
- FIRST Tech Challenge mission statement
- News & achievements section (easily populatable)
- Sponsors showcase
- Footer with social media links

### Team Page
- Team member profiles with photos
- Role descriptions
- Hover effects for interactive experience

### Events Page
- Upcoming events calendar
- Past events timeline with achievements
- Competition history

### Robot Page
- Robot showcase with main photo
- Technical specifications
- Key features and innovations
- Image gallery

### Contact Page
- Contact form
- Contact information cards
- Social media links
- Email addresses for general inquiries and sponsorships

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## 📁 Project Structure

```
frontend/
├── public/              # Static assets and images
│   └── README.md       # Image requirements guide
├── src/
│   ├── components/     # Reusable components
│   │   ├── Header.tsx
│   │   ├── Header.css
│   │   ├── Footer.tsx
│   │   ├── Footer.css
│   │   └── Layout.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx    # Home page
│   │   ├── Home.css
│   │   ├── Team.tsx    # Team members
│   │   ├── Team.css
│   │   ├── Events.tsx  # Events & competitions
│   │   ├── Events.css
│   │   ├── Robot.tsx   # Robot showcase
│   │   ├── Robot.css
│   │   ├── Contact.tsx # Contact form
│   │   └── Contact.css
│   ├── App.tsx         # Main app component with routing
│   ├── App.css
│   ├── index.css       # Global styles and theme
│   └── main.tsx        # App entry point
├── index.html
├── package.json
└── vite.config.ts
```

## 🎨 Color Scheme

The website uses a consistent black and orange color palette:

- **Primary Black**: `#0a0a0a`
- **Secondary Black**: `#1a1a1a`
- **Primary Orange**: `#ff6b35`
- **Secondary Orange**: `#ff8c42`
- **Accent Orange**: `#ffaa00`
- **Text White**: `#ffffff`
- **Text Gray**: `#b0b0b0`

## 📸 Adding Images

1. Place your images in the `public` folder
2. Follow the naming conventions in `public/README.md`
3. Required images:
   - `logo.png` - Team logo
   - `team-photo.jpg` - Full team photo for hero
   - `news-1.jpg` to `news-4.jpg` - News images
   - `sponsor-1.png` to `sponsor-6.png` - Sponsor logos
   - `team-member-1.jpg` to `team-member-6.jpg` - Team photos
   - `robot-main.jpg` - Main robot image
   - `robot-gallery-1.jpg` to `robot-gallery-6.jpg` - Robot gallery

## 🔧 Customization

### Updating News
Edit the `newsItems` array in `src/pages/Home.tsx`:

```typescript
const [newsItems] = useState([
  {
    id: 1,
    title: "Your Title",
    date: "Date",
    image: "/your-image.jpg",
    description: "Description",
    category: "Category"
  },
  // Add more news items...
]);
```

### Updating Team Members
Edit the `teamMembers` array in `src/pages/Team.tsx`:

```typescript
const teamMembers = [
  { name: "Name", role: "Role", image: "/member-image.jpg" },
  // Add more members...
];
```

### Updating Events
Edit the `upcomingEvents` and `pastEvents` arrays in `src/pages/Events.tsx`

### Updating Robot Specs
Edit the `robotSpecs` and `features` arrays in `src/pages/Robot.tsx`

### Changing Colors
Update CSS variables in `src/index.css`:

```css
:root {
  --primary-black: #0a0a0a;
  --primary-orange: #ff6b35;
  /* etc... */
}
```

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

This project is created for the xCellence FTC Team.

## 🤝 Contributing

Team members can contribute by:
1. Adding new images to the `public` folder
2. Updating content in page files
3. Improving styles and animations
4. Adding new features

## 📧 Contact

For questions about the website, contact the team at info@xcellenceftc.com

---

**Built with ❤️ by the xCellence FTC Team**
