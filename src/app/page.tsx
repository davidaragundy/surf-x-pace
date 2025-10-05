"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { format, subDays, addDays } from "date-fns";
import {
  Calendar,
  Layers,
  MapPin,
  Search,
  Download,
  Upload,
  Info,
  Tag,
  Clock,
  Satellite,
  Globe,
  Moon,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { GIBS_LAYERS, getLayerById, type GIBSLayer } from "@/lib/gibs-layers";
import { createAnnotationStore, type Annotation } from "@/lib/annotations";
import { FEATURED_LOCATIONS } from "@/lib/featured-locations";
import { Badge } from "@/components/ui/badge";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";

// Dynamic import of map to avoid SSR issues
const NASAMap = dynamic(() => import("@/components/NASAMap"), { ssr: false });

export default function Home() {
  const [selectedLayer, setSelectedLayer] = useState<GIBSLayer>(GIBS_LAYERS[0]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [compareLayer, setCompareLayer] = useState<GIBSLayer | null>(null);
  const [compareDate, setCompareDate] = useState<Date>(subDays(new Date(), 7));
  const [splitView, setSplitView] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationStore] = useState(() => createAnnotationStore());
  const [searchLat, setSearchLat] = useState("");
  const [searchLng, setSearchLng] = useState("");
  const [newAnnotation, setNewAnnotation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
  const [layerOpacity, setLayerOpacity] = useState(100);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setAnnotations(annotationStore.getAnnotations());
  }, [annotationStore]);

  const handleMapClick = (lat: number, lng: number) => {
    setNewAnnotation({ lat, lng });
    setIsAnnotationDialogOpen(true);
  };

  const handleAddAnnotation = (
    title: string,
    description: string,
    category: Annotation["category"],
    tags: string[]
  ) => {
    if (!newAnnotation) return;

    annotationStore.addAnnotation({
      lat: newAnnotation.lat,
      lng: newAnnotation.lng,
      title,
      description,
      category,
      layerId: selectedLayer.id,
      date: format(selectedDate, "yyyy-MM-dd"),
      tags,
    });

    setAnnotations(annotationStore.getAnnotations());
    setNewAnnotation(null);
  };

  const handleLayerChange = (layerId: string) => {
    const layer = getLayerById(layerId);
    if (layer) {
      setSelectedLayer(layer);
    }
  };

  const handleCompareLayerChange = (layerId: string) => {
    if (layerId === "none") {
      setCompareLayer(null);
      setSplitView(false);
    } else {
      const layer = getLayerById(layerId);
      if (layer) {
        setCompareLayer(layer);
        setSplitView(true);
      }
    }
  };

  const handleCoordinateSearch = () => {
    const lat = parseFloat(searchLat);
    const lng = parseFloat(searchLng);
    if (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      // In a real implementation, this would pan the map to these coordinates
      alert(`Navigating to coordinates: ${lat}, ${lng}`);
    } else {
      alert(
        "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180."
      );
    }
  };

  const handleExportAnnotations = () => {
    const data = annotationStore.exportAnnotations();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nasa-annotations-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportAnnotations = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        annotationStore.importAnnotations(content);
        setAnnotations(annotationStore.getAnnotations());
      };
      reader.readAsText(file);
    }
  };

  const startTimeAnimation = () => {
    if (!selectedLayer.temporal) return;

    setIsAnimating(true);
    let currentDate = new Date(selectedDate);

    const interval = setInterval(() => {
      currentDate = subDays(currentDate, 1);
      setSelectedDate(new Date(currentDate));
    }, animationSpeed);

    setTimeout(() => {
      clearInterval(interval);
      setIsAnimating(false);
    }, 10000); // Run for 10 seconds
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "earth":
        return <Globe className="h-4 w-4" />;
      case "mars":
        return <Satellite className="h-4 w-4" />;
      case "moon":
        return <Moon className="h-4 w-4" />;
      case "space":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <KeyboardShortcuts
        onPreviousDay={() =>
          selectedLayer.temporal && setSelectedDate(subDays(selectedDate, 1))
        }
        onNextDay={() =>
          selectedLayer.temporal && setSelectedDate(addDays(selectedDate, 1))
        }
        onToday={() => selectedLayer.temporal && setSelectedDate(new Date())}
      />
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Satellite className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                SurfXpace
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Explore Earth and Space Through NASA&apos;s Eyes
              </p>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Info className="h-4 w-4 mr-2" />
                About
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>SurfXpace</DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-2 mt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      This application provides interactive exploration of
                      NASA&apos;s massive imagery datasets from the Global
                      Imagery Browse Services (GIBS).
                    </p>
                    <p className="font-semibold mt-4">Features:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>
                        Real-time satellite imagery from multiple NASA missions
                      </li>
                      <li>Time-based exploration with daily updates</li>
                      <li>Layer comparison tools</li>
                      <li>Feature annotation and labeling system</li>
                      <li>Coordinate-based navigation</li>
                      <li>Export and share your discoveries</li>
                    </ul>
                    <p className="font-semibold mt-4">Keyboard Shortcuts:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>← Previous day</li>
                      <li>→ Next day</li>
                      <li>T - Jump to today</li>
                    </ul>
                    <p className="text-xs mt-4">
                      Data provided by NASA&apos;s Global Imagery Browse
                      Services (GIBS), part of NASA&apos;s Earth Science Data
                      and Information System (ESDIS).
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-96 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
          <Tabs defaultValue="layers" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="layers">
                <Layers className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="time">
                <Clock className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="search">
                <Search className="h-4 w-4" />
              </TabsTrigger>
              <TabsTrigger value="annotations">
                <Tag className="h-4 w-4" />
              </TabsTrigger>
            </TabsList>

            {/* Layers Tab */}
            <TabsContent value="layers" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Active Layer</CardTitle>
                  <CardDescription>
                    Select the imagery layer to display
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Layer</Label>
                    <Select
                      value={selectedLayer.id}
                      onValueChange={handleLayerChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {GIBS_LAYERS.map((layer) => (
                          <SelectItem key={layer.id} value={layer.id}>
                            <div className="flex items-center gap-2">
                              {getCategoryIcon(layer.category)}
                              <span>{layer.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {selectedLayer.description}
                    </p>
                    {selectedLayer.temporal && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Available from {selectedLayer.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Opacity ({layerOpacity}%)</Label>
                    <Slider
                      value={[layerOpacity]}
                      onValueChange={(v) => setLayerOpacity(v[0])}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Compare Layers</CardTitle>
                  <CardDescription>
                    Compare two layers side by side
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Compare With</Label>
                    <Select
                      value={compareLayer?.id || "none"}
                      onValueChange={handleCompareLayerChange}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {GIBS_LAYERS.filter(
                          (l) => l.id !== selectedLayer.id
                        ).map((layer) => (
                          <SelectItem key={layer.id} value={layer.id}>
                            {layer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Time Tab */}
            <TabsContent value="time" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Temporal Controls</CardTitle>
                  <CardDescription>Navigate through time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Date</Label>
                    <Input
                      type="date"
                      value={format(selectedDate, "yyyy-MM-dd")}
                      onChange={(e) =>
                        setSelectedDate(new Date(e.target.value))
                      }
                      max={format(new Date(), "yyyy-MM-dd")}
                      min={selectedLayer.startDate}
                      disabled={!selectedLayer.temporal}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                      disabled={!selectedLayer.temporal}
                    >
                      Previous Day
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                      disabled={
                        !selectedLayer.temporal || selectedDate >= new Date()
                      }
                    >
                      Next Day
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedDate(subDays(new Date(), 7))}
                      disabled={!selectedLayer.temporal}
                    >
                      1 Week Ago
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedDate(subDays(new Date(), 30))}
                      disabled={!selectedLayer.temporal}
                    >
                      1 Month Ago
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedDate(subDays(new Date(), 90))}
                      disabled={!selectedLayer.temporal}
                    >
                      3 Months Ago
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedDate(new Date())}
                      disabled={!selectedLayer.temporal}
                    >
                      Today
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {splitView && compareLayer && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Comparison Date</CardTitle>
                    <CardDescription>Date for comparison layer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="date"
                      value={format(compareDate, "yyyy-MM-dd")}
                      onChange={(e) => setCompareDate(new Date(e.target.value))}
                      max={format(new Date(), "yyyy-MM-dd")}
                      min={compareLayer.startDate}
                    />
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Time Animation</CardTitle>
                  <CardDescription>Animate changes over time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Animation Speed (ms)</Label>
                    <Slider
                      value={[animationSpeed]}
                      onValueChange={(v) => setAnimationSpeed(v[0])}
                      min={100}
                      max={2000}
                      step={100}
                      className="mt-2"
                      disabled={!selectedLayer.temporal}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {animationSpeed}ms per frame
                    </p>
                  </div>
                  <Button
                    onClick={startTimeAnimation}
                    disabled={!selectedLayer.temporal || isAnimating}
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {isAnimating ? "Animating..." : "Animate Last 10 Days"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Search Tab */}
            <TabsContent value="search" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Coordinate Search</CardTitle>
                  <CardDescription>
                    Navigate to specific coordinates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Latitude (-90 to 90)</Label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={searchLat}
                      onChange={(e) => setSearchLat(e.target.value)}
                      min="-90"
                      max="90"
                      step="0.000001"
                    />
                  </div>
                  <div>
                    <Label>Longitude (-180 to 180)</Label>
                    <Input
                      type="number"
                      placeholder="0.0"
                      value={searchLng}
                      onChange={(e) => setSearchLng(e.target.value)}
                      min="-180"
                      max="180"
                      step="0.000001"
                    />
                  </div>
                  <Button onClick={handleCoordinateSearch} className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Go to Location
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Featured Locations</CardTitle>
                  <CardDescription>
                    Explore interesting places on Earth
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 max-h-96 overflow-y-auto">
                  {FEATURED_LOCATIONS.map((location) => (
                    <div
                      key={location.name}
                      className="p-3 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      onClick={() => {
                        setSearchLat(location.lat.toString());
                        setSearchLng(location.lng.toString());
                        const layer = getLayerById(location.recommendedLayer);
                        if (layer) setSelectedLayer(layer);
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            <h4 className="font-medium text-sm">
                              {location.name}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {location.description}
                          </p>
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {location.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Annotations Tab */}
            <TabsContent value="annotations" className="p-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Feature Annotations</CardTitle>
                  <CardDescription>
                    Click on the map to add annotations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportAnnotations}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <label>
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={handleImportAnnotations}
                        />
                      </label>
                    </Button>
                  </div>

                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Total Annotations</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {annotations.length}
                        </p>
                      </div>
                      <Tag className="h-8 w-8 text-blue-600 opacity-50" />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {annotations.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No annotations yet. Click on the map to add one!
                      </p>
                    ) : (
                      annotations.map((annotation) => (
                        <div
                          key={annotation.id}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-sm">
                                  {annotation.title}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {annotation.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                {annotation.description}
                              </p>
                              <div className="flex gap-1 mt-2 flex-wrap">
                                {annotation.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <p className="text-xs text-gray-400 mt-2">
                                📍 {annotation.lat.toFixed(4)},{" "}
                                {annotation.lng.toFixed(4)} • 📅{" "}
                                {annotation.date}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                annotationStore.removeAnnotation(annotation.id);
                                setAnnotations(
                                  annotationStore.getAnnotations()
                                );
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </aside>

        {/* Main Map Area */}
        <main className="flex-1 relative z-0">
          <NASAMap
            selectedLayer={selectedLayer}
            selectedDate={selectedDate}
            onMapClick={handleMapClick}
            annotations={annotations}
            compareLayer={compareLayer}
            compareDate={compareDate}
            splitView={splitView}
          />
        </main>
      </div>

      {/* Annotation Dialog */}
      <Dialog
        open={isAnnotationDialogOpen}
        onOpenChange={setIsAnnotationDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Annotation</DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Add a label or note about a feature you&apos;ve discovered
              </div>
            </DialogDescription>
          </DialogHeader>
          {newAnnotation && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get("title") as string;
                const description = formData.get("description") as string;
                const category = formData.get(
                  "category"
                ) as Annotation["category"];
                const tags = (formData.get("tags") as string)
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean);
                handleAddAnnotation(title, description, category, tags);
                setIsAnnotationDialogOpen(false);
              }}
              className="space-y-4"
            >
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="E.g., Hurricane Formation"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Describe what you see"
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" defaultValue="natural" required>
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="natural">Natural Feature</SelectItem>
                    <SelectItem value="weather">Weather Event</SelectItem>
                    <SelectItem value="human">Human Activity</SelectItem>
                    <SelectItem value="astronomical">Astronomical</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="e.g., storm, ocean, climate"
                />
              </div>
              <div className="text-sm text-gray-500">
                Location: {newAnnotation.lat.toFixed(4)},{" "}
                {newAnnotation.lng.toFixed(4)}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAnnotationDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Annotation</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
