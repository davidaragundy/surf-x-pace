// Annotation and labeling system for discovered features

export interface Annotation {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  category: "natural" | "weather" | "human" | "astronomical" | "other";
  layerId: string;
  date: string;
  createdAt: number;
  tags: string[];
}

export interface AnnotationStore {
  annotations: Annotation[];
  addAnnotation: (
    annotation: Omit<Annotation, "id" | "createdAt">
  ) => Annotation;
  removeAnnotation: (id: string) => void;
  updateAnnotation: (id: string, updates: Partial<Annotation>) => void;
  getAnnotations: () => Annotation[];
  getAnnotationsByLayer: (layerId: string) => Annotation[];
  exportAnnotations: () => string;
  importAnnotations: (data: string) => void;
}

export function createAnnotationStore(): AnnotationStore {
  let annotations: Annotation[] = [];

  // Load from localStorage if available
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("nasa-explorer-annotations");
    if (stored) {
      try {
        annotations = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load annotations:", e);
      }
    }
  }

  const saveToStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "nasa-explorer-annotations",
        JSON.stringify(annotations)
      );
    }
  };

  return {
    annotations,
    addAnnotation(annotation) {
      const newAnnotation: Annotation = {
        ...annotation,
        id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
      };
      annotations.push(newAnnotation);
      saveToStorage();
      return newAnnotation;
    },
    removeAnnotation(id) {
      annotations = annotations.filter((a) => a.id !== id);
      saveToStorage();
    },
    updateAnnotation(id, updates) {
      const index = annotations.findIndex((a) => a.id === id);
      if (index !== -1) {
        annotations[index] = { ...annotations[index], ...updates };
        saveToStorage();
      }
    },
    getAnnotations() {
      return annotations;
    },
    getAnnotationsByLayer(layerId) {
      return annotations.filter((a) => a.layerId === layerId);
    },
    exportAnnotations() {
      return JSON.stringify(annotations, null, 2);
    },
    importAnnotations(data) {
      try {
        const imported = JSON.parse(data);
        if (Array.isArray(imported)) {
          annotations = imported;
          saveToStorage();
        }
      } catch (e) {
        console.error("Failed to import annotations:", e);
      }
    },
  };
}
