// NASA GIBS Layer Definitions
// Based on https://nasa-gibs.github.io/gibs-api-docs/

export interface GIBSLayer {
  id: string;
  name: string;
  description: string;
  category: "earth" | "mars" | "moon" | "space";
  format: string;
  tilematrixset: string;
  temporal: boolean;
  startDate?: string;
  endDate?: string;
}

// Real NASA GIBS layers from their WMTS service
export const GIBS_LAYERS: GIBSLayer[] = [
  // Earth Observation Layers
  {
    id: "VIIRS_SNPP_CorrectedReflectance_TrueColor",
    name: "VIIRS True Color",
    description:
      "True-color corrected reflectance from VIIRS instrument on Suomi-NPP satellite, providing daily global imagery",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level9",
    temporal: true,
    startDate: "2015-11-24",
  },
  {
    id: "MODIS_Terra_CorrectedReflectance_TrueColor",
    name: "MODIS Terra True Color",
    description:
      "True-color imagery from MODIS instrument on Terra satellite, showing Earth as it would appear to human eyes",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level9",
    temporal: true,
    startDate: "2000-02-24",
  },
  {
    id: "MODIS_Aqua_CorrectedReflectance_TrueColor",
    name: "MODIS Aqua True Color",
    description: "True-color imagery from MODIS instrument on Aqua satellite",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level9",
    temporal: true,
    startDate: "2002-07-03",
  },
  {
    id: "VIIRS_SNPP_CorrectedReflectance_BandsM11-I2-I1",
    name: "VIIRS False Color",
    description:
      "False-color imagery using bands M11-I2-I1, useful for identifying fires, vegetation, and water",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level9",
    temporal: true,
    startDate: "2015-11-24",
  },
  {
    id: "MODIS_Terra_CorrectedReflectance_Bands721",
    name: "MODIS Terra False Color (Bands 7-2-1)",
    description:
      "False-color composite ideal for distinguishing burn scars, vegetation, and urban areas",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level9",
    temporal: true,
    startDate: "2000-02-24",
  },
  {
    id: "MODIS_Aqua_CorrectedReflectance_Bands721",
    name: "MODIS Aqua False Color (Bands 7-2-1)",
    description:
      "False-color composite from Aqua satellite for land and fire analysis",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level9",
    temporal: true,
    startDate: "2002-07-03",
  },
  {
    id: "VIIRS_SNPP_DayNightBand_ENCC",
    name: "VIIRS Earth at Night",
    description:
      "Day/Night Band showing city lights, auroras, wildfires, and other nighttime phenomena",
    category: "earth",
    format: "image/png",
    tilematrixset: "GoogleMapsCompatible_Level8",
    temporal: true,
    startDate: "2015-11-24",
  },
  {
    id: "BlueMarble_NextGeneration",
    name: "Blue Marble",
    description:
      "Monthly composite imagery of Earth's surface at 500m resolution",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level8",
    temporal: false,
  },
  {
    id: "ASTER_GDEM_Greyscale_Shaded_Relief",
    name: "ASTER Global Elevation",
    description: "Global topographic relief shading from ASTER GDEM dataset",
    category: "earth",
    format: "image/jpeg",
    tilematrixset: "GoogleMapsCompatible_Level8",
    temporal: false,
  },
];

export const GIBS_BASE_URL =
  "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best";

export function getGIBSTileUrl(layer: GIBSLayer, date?: Date): string {
  const dateStr = date
    ? date.toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0];

  const timeParam = layer.temporal ? dateStr : "default";

  // GIBS WMTS format: {base}/{layer}/default/{time}/{tilematrixset}/{z}/{y}/{x}.{format}
  // The "default" is the STYLE parameter required by GIBS
  return `${GIBS_BASE_URL}/${layer.id}/default/${timeParam}/${
    layer.tilematrixset
  }/{z}/{y}/{x}.${layer.format.split("/")[1]}`;
}

export function getCategoryLayers(
  category: GIBSLayer["category"]
): GIBSLayer[] {
  return GIBS_LAYERS.filter((layer) => layer.category === category);
}

export function getLayerById(id: string): GIBSLayer | undefined {
  return GIBS_LAYERS.find((layer) => layer.id === id);
}

// Helper to check if a date is within layer's temporal range
export function isDateValid(layer: GIBSLayer, date: Date): boolean {
  if (!layer.temporal) return true;

  const checkDate = date.getTime();

  if (layer.startDate) {
    const startTime = new Date(layer.startDate).getTime();
    if (checkDate < startTime) return false;
  }

  if (layer.endDate) {
    const endTime = new Date(layer.endDate).getTime();
    if (checkDate > endTime) return false;
  }

  return true;
}
