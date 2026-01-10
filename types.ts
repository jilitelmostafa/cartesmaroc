
export type Shape = 'rect' | 'poly' | 'circle';

export interface MapArea {
  id: string;
  name: string;      // French Name
  nameAr?: string;   // Arabic Name (Optional)
  coords?: number[]; // Optional coordinates
  shape: Shape;
  href: string;
  title: string;
}

export interface AppState {
  searchQuery: string;
  selectedId: string | null;
  favorites: string[];
}
