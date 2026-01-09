
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Map as MapIcon, Download, Heart, Info, Menu, X, Globe, Table as TableIcon, Eye, EyeOff } from 'lucide-react';
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
      <div className="p-4 border-b border-gray-100 bg-indigo-50/50">
        <h1 className="text-xl font-black text-indigo-900 flex items-center gap-2 mb-4">
          <Globe className="w-6 h-6 text-indigo-600" />
          أرشيف خرائط المغرب
        </h1>
        
        <div className="flex bg-gray-200 p-1 rounded-xl mb-4">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <TableIcon className="w-4 h-4" />
            عرض الروابط
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'map' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MapIcon className="w-4 h-4" />
            وضع الشبكة
          </button>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            dir="rtl"
            placeholder="بحث بالاسم أو الرقم..."
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-gray-50">
        {filteredMaps.length > 0 ? (
          filteredMaps.map((map) => {
            const isSelected = selectedId === map.id;
            const isFavorite = favorites.includes(map.id);
            return (
              <div
                key={map.id}
                onClick={() => onSelect(map.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.02] z-10' 
                    : 'bg-white border-transparent hover:border-indigo-100 text-gray-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-10 h-8 rounded-lg text-[11px] font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                    {map.id}
                  </span>
                  <p className="font-bold text-sm truncate max-w-[130px]">{map.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(map.id);
                    }}
                    className={`p-1.5 rounded-full transition-colors ${
                      isFavorite ? 'text-rose-500' : isSelected ? 'text-white/40' : 'text-gray-300'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Search className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
};

const InteractiveMap: React.FC<{
  selectedId: string | null;
  onSelect: (id: string) => void;
  showBg: boolean;
}> = ({ selectedId, onSelect, showBg }) => {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = INDEX_IMAGE_URL;
    img.onload = () => setNaturalSize({ w: img.width, h: img.height });
  }, []);

  return (
    <div className="relative w-full h-full overflow-auto bg-slate-100 flex items-center justify-center p-12">
      <div className={`relative rounded-lg overflow-hidden transition-all duration-500 ${showBg ? 'shadow-2xl' : 'bg-white border-2 border-dashed border-gray-200 shadow-sm'}`}>
        <img
          ref={imgRef}
          src={INDEX_IMAGE_URL}
          alt="Map Background"
          className={`block max-w-none transition-opacity duration-500 ${showBg ? 'opacity-100' : 'opacity-0 h-[716px] w-[778px]'}`}
          style={{ visibility: showBg ? 'visible' : 'hidden' }}
        />
        {naturalSize && (
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}
          >
            {MAP_DATA.map((map) => {
              const isSelected = selectedId === map.id;
              const content = (
                <>
                  <title>{map.title}</title>
                  {!showBg && (
                    <text
                      x={map.coords[0] + (map.coords[2] - map.coords[0]) / 2}
                      y={map.coords[1] + (map.coords[3] - map.coords[1]) / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="6"
                      fontWeight="900"
                      fill={isSelected ? "white" : "indigo"}
                      className="pointer-events-none select-none"
                    >
                      {map.id}
                    </text>
                  )}
                </>
              );

              if (map.shape === 'rect') {
                const [x1, y1, x2, y2] = map.coords;
                return (
                  <g key={map.id} onClick={() => onSelect(map.id)} className="cursor-pointer group">
                    <rect
                      x={x1} y={y1} width={x2 - x1} height={y2 - y1}
                      fill={isSelected ? "rgba(79, 70, 229, 0.7)" : (showBg ? "transparent" : "rgba(79, 70, 229, 0.05)")}
                      stroke={isSelected ? "indigo" : (showBg ? "transparent" : "rgba(0,0,0,0.1)")}
                      strokeWidth="0.5"
                      className="transition-all duration-200 group-hover:fill-indigo-500/20"
                    />
                    {content}
                  </g>
                );
              } else if (map.shape === 'poly') {
                const points = [];
                for (let i = 0; i < map.coords.length; i += 2) {
                  points.push(`${map.coords[i]},${map.coords[i+1]}`);
                }
                return (
                  <g key={map.id} onClick={() => onSelect(map.id)} className="cursor-pointer group">
                    <polygon
                      points={points.join(' ')}
                      fill={isSelected ? "rgba(79, 70, 229, 0.7)" : (showBg ? "transparent" : "rgba(79, 70, 229, 0.05)")}
                      stroke={isSelected ? "indigo" : (showBg ? "transparent" : "rgba(0,0,0,0.1)")}
                      strokeWidth="0.5"
                      className="transition-all duration-200 group-hover:fill-indigo-500/20"
                    />
                    {content}
                  </g>
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
    <div className="w-full h-full overflow-auto bg-white p-4 md:p-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6 border-gray-100">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">فهرس الروابط المباشرة</h2>
            <p className="text-slate-500 font-bold mt-1">وصول سريع لبيانات {filteredMaps.length} منطقة طوبوغرافية</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaps.map(map => (
            <div 
              key={map.id} 
              className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:border-indigo-300 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-bl-full -z-0 transition-all group-hover:scale-150" />
              
              <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <span className="bg-indigo-600 text-white min-w-[45px] h-9 flex items-center justify-center rounded-xl font-black text-xs shadow-md shadow-indigo-100">
                    {map.id}
                  </span>
                  <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-indigo-700 transition-colors">{map.name}</h3>
                </div>
                <button 
                  onClick={() => toggleFavorite(map.id)}
                  className={`transition-all active:scale-90 ${favorites.includes(map.id) ? 'text-rose-500 scale-110' : 'text-slate-200 hover:text-rose-400'}`}
                >
                  <Heart className={`w-6 h-6 ${favorites.includes(map.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <div className="relative z-10 flex gap-2">
                <a 
                  href={map.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-slate-900 text-white hover:bg-indigo-600 py-3 rounded-xl text-[13px] font-black flex items-center justify-center gap-2 transition-all shadow-lg active:translate-y-1"
                >
                  <Download className="w-4 h-4" />
                  رابط التحميل
                </a>
                <button 
                  onClick={() => onSelect(map.id)}
                  className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-3 rounded-xl transition-all"
                  title="تحديد الموقع"
                >
                  <MapIcon className="w-5 h-5" />
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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list'); 
  const [showBg, setShowBg] = useState(false); // Default to FALSE to fulfill "remove background"
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
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden font-sans bg-gray-50 antialiased text-slate-900">
      {/* Mobile Nav */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 z-50 shadow-sm">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-100 rounded-xl">
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="font-black text-indigo-900">أرشيف الخرائط</span>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-40 w-full lg:w-80 h-full transition-transform duration-500 ease-in-out`}>
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

      {/* Content */}
      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {/* Top bar for map mode controls */}
        {viewMode === 'map' && (
          <div className="absolute top-4 left-4 z-20 flex gap-2">
            <button 
              onClick={() => setShowBg(!showBg)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm shadow-xl transition-all ${showBg ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}
            >
              {showBg ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBg ? 'إخفاء صورة الخلفية' : 'إظهار صورة الخلفية'}
            </button>
          </div>
        )}

        <div className="flex-1 relative">
          {viewMode === 'map' ? (
            <InteractiveMap selectedId={selectedId} onSelect={setSelectedId} showBg={showBg} />
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

        {/* Selected Info Modal */}
        {selectedMap && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[92%] md:w-[450px] bg-slate-900 text-white rounded-3xl shadow-2xl border border-white/10 overflow-hidden z-30 animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-sm font-black shadow-lg shadow-indigo-500/20">
                    {selectedMap.id}
                  </div>
                  <div>
                    <h3 className="text-xl font-black leading-tight">{selectedMap.name}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Échelle 1/50,000</p>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="flex gap-3">
                <a
                  href={selectedMap.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-white text-slate-900 hover:bg-indigo-400 hover:text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-white/5"
                >
                  <Download className="w-5 h-5" />
                  فتح الرابط المباشر
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
