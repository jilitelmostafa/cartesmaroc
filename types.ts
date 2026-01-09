
export type Shape = 'rect' | 'poly' | 'circle';

export interface MapArea {
  id: string;
  name: string;      // French Name
  nameAr: string;    // Arabic Name
  coords: number[];
  shape: Shape;
  href: string;
  title: string;
  region?: string;
  province?: string;
}

export interface AppState {
  searchQuery: string;
  selectedId: string | null;
  favorites: string[];
}
