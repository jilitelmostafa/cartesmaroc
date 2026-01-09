
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Map as MapIcon, Download, Heart, Info, Menu, X, ChevronRight, Globe, Table as TableIcon, ExternalLink } from 'lucide-react';
import { MAP_DATA, INDEX_IMAGE_URL } from './constants';
import { MapArea } from './types';

const Sidebar: React.FC<{
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filteredMaps: MapArea[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  viewMode: 'map' | 'list';
  setViewMode: (m: 'map' | 'list') => void;
}> = ({ searchQuery, setSearchQuery, filteredMaps, selectedId, onSelect, favorites, toggleFavorite, viewMode, setViewMode }) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-xl overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h1 className="text-xl font-bold text-indigo-900 flex items-center gap-2 mb-4">
          <Globe className="w-6 h-6" />
          Carte du Maroc
        </h1>
        
        <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
          <button 
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            Mode Carte
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            Mode Liste
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredMaps.length > 0 ? (
          filteredMaps.map((map) => {
            const isSelected = selectedId === map.id;
            const isFavorite = favorites.includes(map.id);
            return (
              <div
                key={map.id}
                onClick={() => onSelect(map.id)}
                className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-indigo-50 border-indigo-100 text-indigo-900 shadow-sm' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-10 h-8 rounded text-[10px] font-bold ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {map.id}
                  </span>
                  <div>
                    <p className="font-medium text-sm leading-tight truncate max-w-[140px]">{map.name}</p>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">Échelle 1/50,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(map.id);
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      isFavorite ? 'text-rose-500 bg-rose-50' : 'text-gray-300 hover:text-rose-400 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100 text-indigo-400' : 'text-gray-300'}`} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Search className="w-12 h-12 text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Aucune carte trouvée</p>
          </div>
        )}
      </div>
    </div>
  );
};

const InteractiveMap: React.FC<{
  selectedId: string | null;
  onSelect: (id: string) => void;
}> = ({ selectedId, onSelect }) => {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = INDEX_IMAGE_URL;
    img.onload = () => setNaturalSize({ w: img.width, h: img.height });
  }, []);

  const handleAreaClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    onSelect(id);
  };

  return (
    <div className="relative w-full h-full overflow-auto bg-gray-100 flex items-center justify-center p-8">
      <div className="relative shadow-2xl rounded-lg overflow-hidden bg-white">
        <img
          ref={imgRef}
          src={INDEX_IMAGE_URL}
          alt="Index map"
          className="block max-w-none opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
        />
        {naturalSize && (
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}
          >
            {MAP_DATA.map((map) => {
              const isSelected = selectedId === map.id;
              if (map.shape === 'rect') {
                const [x1, y1, x2, y2] = map.coords;
                return (
                  <rect
                    key={map.id}
                    x={x1}
                    y={y1}
                    width={x2 - x1}
                    height={y2 - y1}
                    fill={isSelected ? "rgba(79, 70, 229, 0.4)" : "rgba(0,0,0,0.05)"}
                    stroke={isSelected ? "rgba(79, 70, 229, 1)" : "rgba(0,0,0,0.1)"}
                    strokeWidth={isSelected ? "2" : "0.5"}
                    className="transition-all duration-300 pointer-events-auto cursor-pointer hover:fill-indigo-500/20"
                    onClick={(e) => handleAreaClick(e, map.id)}
                  >
                    <title>{map.title}</title>
                  </rect>
                );
              } else if (map.shape === 'poly') {
                const points = [];
                for (let i = 0; i < map.coords.length; i += 2) {
                  points.push(`${map.coords[i]},${map.coords[i+1]}`);
                }
                return (
                  <polygon
                    key={map.id}
                    points={points.join(' ')}
                    fill={isSelected ? "rgba(79, 70, 229, 0.4)" : "rgba(0,0,0,0.05)"}
                    stroke={isSelected ? "rgba(79, 70, 229, 1)" : "rgba(0,0,0,0.1)"}
                    strokeWidth={isSelected ? "2" : "0.5"}
                    className="transition-all duration-300 pointer-events-auto cursor-pointer hover:fill-indigo-500/20"
                    onClick={(e) => handleAreaClick(e, map.id)}
                  >
                    <title>{map.title}</title>
                  </polygon>
                );
              }
              return null;
            })}
          </svg>
        )}
      </div>
    </div>
  );
};

const ListView: React.FC<{
  filteredMaps: MapArea[];
  onSelect: (id: string) => void;
  favorites: string[];
  toggleFavorite: (id: string) => void;
}> = ({ filteredMaps, onSelect, favorites, toggleFavorite }) => {
  return (
    <div className="w-full h-full overflow-auto bg-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Index Complet des Cartes</h2>
          <p className="text-sm text-gray-500">{filteredMaps.length} cartes affichées</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaps.map(map => (
            <div 
              key={map.id} 
              className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-indigo-600 text-white w-10 h-7 flex items-center justify-center rounded font-bold text-xs">
                    {map.id}
                  </span>
                  <h3 className="font-bold text-gray-900 leading-tight">{map.name}</h3>
                </div>
                <button 
                  onClick={() => toggleFavorite(map.id)}
                  className={`transition-colors ${favorites.includes(map.id) ? 'text-rose-500' : 'text-gray-300 hover:text-rose-400'}`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(map.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="flex gap-2">
                <a 
                  href={map.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white border border-gray-200 text-indigo-600 hover:bg-indigo-50 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Télécharger PDF
                </a>
                <button 
                  onClick={() => onSelect(map.id)}
                  className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 p-2 rounded-lg transition-colors"
                  title="Voir sur la carte"
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list'); // Default to list as per user request for "links names numbers"
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('morocco-maps-favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('morocco-maps-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredMaps = useMemo(() => {
    return MAP_DATA.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const selectedMap = useMemo(() => MAP_DATA.find(m => m.id === selectedId), [selectedId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
        <h1 className="text-lg font-bold text-indigo-900">Map Index 1:50,000</h1>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-40 w-full lg:w-80 h-full transition-transform duration-300 ease-in-out`}>
        <Sidebar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredMaps={filteredMaps}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full bg-gray-50">
        <div className="bg-white/90 backdrop-blur-md border-b border-gray-200 p-4 flex items-center justify-between z-10 sticky top-0 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center justify-center w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
              {viewMode === 'map' ? <MapIcon className="w-5 h-5" /> : <TableIcon className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 leading-tight">Index des Cartes Topographiques (1:50,000)</h2>
              <p className="text-xs text-gray-500">{viewMode === 'map' ? 'Exploration visuelle par grille' : 'Accès direct aux liens et données'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              {MAP_DATA.length} Éléments Importés
            </span>
          </div>
        </div>

        <div className="flex-1 relative">
          {viewMode === 'map' ? (
            <InteractiveMap selectedId={selectedId} onSelect={setSelectedId} />
          ) : (
            <ListView 
              filteredMaps={filteredMaps} 
              onSelect={(id) => {
                setSelectedId(id);
                setViewMode('map');
              }}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          )}
        </div>

        {selectedMap && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] md:w-[420px] bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden z-20 animate-in slide-in-from-bottom-4 fade-in duration-300">
            <div className="p-5 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center text-xs font-black">
                    {selectedMap.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 leading-tight">{selectedMap.name}</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Moroccan Topo Archive</p>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-1 text-gray-300 hover:text-gray-500"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex gap-3">
                <a
                  href={selectedMap.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-100"
                >
                  <Download className="w-4 h-4" />
                  Accéder au lien
                </a>
                <button
                  onClick={() => toggleFavorite(selectedMap.id)}
                  className={`px-4 rounded-xl border transition-all ${
                    favorites.includes(selectedMap.id) ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-white border-gray-100 text-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(selectedMap.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
