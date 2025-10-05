// Featured locations with interesting phenomena to explore

export interface FeaturedLocation {
  name: string;
  lat: number;
  lng: number;
  description: string;
  recommendedLayer: string;
  zoom?: number;
  category: "natural" | "climate" | "geological" | "urban" | "ocean";
}

export const FEATURED_LOCATIONS: FeaturedLocation[] = [
  {
    name: "Amazon Rainforest",
    lat: -3.4653,
    lng: -62.2159,
    description:
      "The world's largest rainforest, vital for global climate regulation",
    recommendedLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    zoom: 6,
    category: "natural",
  },
  {
    name: "Sahara Desert",
    lat: 23.8,
    lng: 25.0,
    description: "Earth's largest hot desert with distinctive sand formations",
    recommendedLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    zoom: 5,
    category: "geological",
  },
  {
    name: "Antarctic Ice Sheet",
    lat: -75.0,
    lng: 0.0,
    description: "Massive ice sheet containing 90% of world's ice",
    recommendedLayer: "MODIS_Aqua_CorrectedReflectance_TrueColor",
    zoom: 4,
    category: "climate",
  },
  {
    name: "Himalayas",
    lat: 28.0,
    lng: 84.0,
    description: "World's highest mountain range with dramatic topography",
    recommendedLayer: "ASTER_GDEM_Greyscale_Shaded_Relief",
    zoom: 6,
    category: "geological",
  },
  {
    name: "Great Barrier Reef",
    lat: -18.2871,
    lng: 147.6992,
    description: "World's largest coral reef system visible from space",
    recommendedLayer: "MODIS_Aqua_CorrectedReflectance_TrueColor",
    zoom: 7,
    category: "ocean",
  },
  {
    name: "Nile River Delta",
    lat: 31.0,
    lng: 31.5,
    description:
      "Historic delta showing contrast between desert and agriculture",
    recommendedLayer: "VIIRS_SNPP_CorrectedReflectance_TrueColor",
    zoom: 7,
    category: "natural",
  },
  {
    name: "Iceland Volcanoes",
    lat: 64.0,
    lng: -19.0,
    description: "Active volcanic region with glaciers and geothermal features",
    recommendedLayer: "MODIS_Terra_CorrectedReflectance_Bands721",
    zoom: 6,
    category: "geological",
  },
  {
    name: "Tokyo Megalopolis",
    lat: 35.6762,
    lng: 139.6503,
    description: "One of world's largest urban areas visible at night",
    recommendedLayer: "VIIRS_SNPP_DayNightBand_ENCC",
    zoom: 8,
    category: "urban",
  },
  {
    name: "Greenland Ice Sheet",
    lat: 72.0,
    lng: -40.0,
    description: "Second largest ice sheet, showing effects of climate change",
    recommendedLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    zoom: 4,
    category: "climate",
  },
  {
    name: "Ganges River",
    lat: 25.5,
    lng: 85.0,
    description: "Sacred river supporting millions, showing seasonal changes",
    recommendedLayer: "VIIRS_SNPP_CorrectedReflectance_TrueColor",
    zoom: 7,
    category: "natural",
  },
  {
    name: "Grand Canyon",
    lat: 36.1069,
    lng: -112.1129,
    description:
      "Spectacular geological formation carved by the Colorado River",
    recommendedLayer: "ASTER_GDEM_Greyscale_Shaded_Relief",
    zoom: 9,
    category: "geological",
  },
  {
    name: "Aral Sea",
    lat: 45.0,
    lng: 60.0,
    description: "Shrinking lake showing dramatic environmental change",
    recommendedLayer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    zoom: 7,
    category: "climate",
  },
];

export function getLocationsByCategory(
  category: FeaturedLocation["category"]
): FeaturedLocation[] {
  return FEATURED_LOCATIONS.filter((loc) => loc.category === category);
}
