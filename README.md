# SurfXpace 🛰️

An interactive platform for exploring NASA's massive imagery datasets through the Global Imagery Browse Services (GIBS) API. Built with Next.js 15, React 19, TypeScript, and Leaflet.

## 🌟 Features

### Core Capabilities

- **Real-Time Satellite Imagery**: Access to NASA's GIBS service with multiple Earth observation layers including:

  - VIIRS True Color and False Color imagery
  - MODIS Terra and Aqua imagery
  - Day/Night Band (Earth at Night)
  - Blue Marble composite
  - ASTER Global Elevation maps

- **Time-Based Exploration**:

  - Browse imagery from different dates
  - Navigate day-by-day through historical data
  - Quick jumps (1 week, 1 month, 3 months ago)
  - Animated time-lapse visualization

- **Layer Comparison**:

  - Compare two different layers simultaneously
  - Split-view mode for side-by-side analysis
  - Compare same location across different dates
  - Adjustable layer opacity

- **Feature Annotation System**:

  - Click-to-add annotations on discovered features
  - Categorize annotations (Natural, Weather, Human Activity, Astronomical)
  - Add tags and descriptions
  - Export annotations as JSON
  - Import previously saved annotations
  - Persistent storage using localStorage

- **Advanced Navigation**:
  - Coordinate-based search (latitude/longitude)
  - Quick jump to interesting locations
  - Interactive map with zoom and pan
  - Scale indicator and attribution

### UI/UX

- Modern, responsive design using Shadcn UI components
- Dark mode support
- Intuitive tabbed interface
- Real-time layer information display
- Comprehensive help documentation

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📖 How to Use

### 1. Select a Layer

Navigate to the **Layers** tab to:

- Choose from available NASA GIBS imagery layers
- Read descriptions about each layer
- Adjust layer opacity
- Enable layer comparison mode

### 2. Navigate Through Time

Use the **Time** tab to:

- Select a specific date
- Jump forward/backward by days
- Use quick shortcuts (1 week, 1 month ago, etc.)
- Animate changes over time
- Set custom animation speeds

### 3. Search Locations

In the **Search** tab:

- Enter specific coordinates (latitude/longitude)
- Use quick location shortcuts for interesting places
- Navigate to custom locations

### 4. Annotate Features

Using the **Annotations** tab:

- Click anywhere on the map to create an annotation
- Add title, description, category, and tags
- View all saved annotations
- Export annotations for sharing
- Import previously saved annotations

## 🛠️ Technical Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Shadcn UI, Tailwind CSS v4
- **Mapping**: Leaflet + React Leaflet
- **Data Source**: NASA GIBS WMTS Service
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Type Safety**: TypeScript

## 🌍 Data Attribution

This application uses imagery from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS).

> We acknowledge the use of imagery provided by services from NASA's Global Imagery Browse Services (GIBS), part of NASA's Earth Science Data and Information System (ESDIS).

For more information:

- [NASA GIBS Documentation](https://nasa-gibs.github.io/gibs-api-docs/)
- [NASA Worldview](https://worldview.earthdata.nasa.gov/)

## 🔍 Key NASA Datasets Used

1. **VIIRS (Visible Infrared Imaging Radiometer Suite)**

   - Daily global coverage since 2015
   - True color and false color imagery
   - Day/Night Band for nighttime phenomena

2. **MODIS (Moderate Resolution Imaging Spectroradiometer)**

   - Terra: Data from 2000
   - Aqua: Data from 2002
   - Multiple spectral bands for various analyses

3. **Blue Marble**

   - Monthly global composite imagery
   - 500m resolution

4. **ASTER GDEM**
   - Global elevation data
   - Topographic relief visualization

## 🎯 Challenge Requirements Met

This application addresses the NASA Space Apps Challenge by:

- ✅ Allowing zoom in/out of massive imagery datasets
- ✅ Enabling feature labeling and annotation
- ✅ Supporting pattern discovery through layer comparison
- ✅ Handling temporal data sequences
- ✅ Providing coordinate-based search
- ✅ Offering layer overlay capabilities
- ✅ Implementing user-friendly interface
- ✅ Using real NASA data (no mocking)
- ✅ Supporting export/import of discoveries
- ✅ Adaptive image serving (tiles loaded on-demand)

## 📱 Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Modern mobile browsers

## 🤝 Contributing

This project was created for the NASA Space Apps Challenge. Feel free to fork and enhance!

## 📄 License

This project is open source and available for educational and research purposes.

## 🙏 Acknowledgments

- NASA GIBS Team for providing the incredible imagery service
- OpenStreetMap contributors
- The open-source community for the amazing tools and libraries

---

Built with ❤️ for space exploration and Earth observation
