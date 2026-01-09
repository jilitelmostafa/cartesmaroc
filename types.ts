
export type Shape = 'rect' | 'poly' | 'circle';

export interface MapArea {
  id: string;
  name: string;
  coords: number[];
  shape: Shape;
  href: string;
  title: string;
}

export interface AppState {
  searchQuery: string;
  selectedId: string | null;
  favorites: string[];
}
