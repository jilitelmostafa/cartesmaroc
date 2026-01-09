
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Map as MapIcon, Download, Heart, Info, Menu, X, 
  Globe, Table as TableIcon, Eye, EyeOff, Plus, Minus, RotateCcw, Move 
} from 'lucide-react';
import { MAP_DATA, INDEX_IMAGE_URL } from './constants';
import { MapArea } from './types';

// --- Sidebar Component ---
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
    <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl overflow-hidden z-10">
      <div className="p-4 border-b border-gray-100 bg-indigo-50/30">
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
            خريطة تفاعلية
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
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.01]' 
                    : 'bg-white border-transparent hover:border-indigo-100 text-gray-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-10 h-8 rounded-lg text-[11px] font-black ${isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                    {map.id}
                  </span>
                  <p className="font-bold text-sm truncate max-w-[130px]">{map.name}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(map.id); }}
                  className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'text-rose-500' : isSelected ? 'text-white/40' : 'text-gray-300'}`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Search className="w-12 h-12 text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold">لا توجد نتائج مطابقة</p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- InteractiveMap Component ---
const InteractiveMap: React.FC<{
  selectedId: string | null;
  onSelect: (id: string) => void;
  showBg: boolean;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}> = ({ selectedId, onSelect, showBg, pan, setPan, scale, setScale }) => {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const img = new Image();
    img.src = INDEX_IMAGE_URL;
    img.onload = () => setNaturalSize({ w: img.width, h: img.height });
  }, []);

  useEffect(() => {
    if (selectedId && naturalSize) {
      setPan({ x: 0, y: 0 });
      setScale(3.5);
    }
  }, [selectedId, naturalSize, setPan, setScale]);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: clientX, y: clientY };
  };

  const transformStyle = useMemo(() => {
    if (!naturalSize) return { transform: 'scale(1)', transformOrigin: 'center' };
    let origin = 'center';
    if (selectedId) {
      const map = MAP_DATA.find(m => m.id === selectedId);
      if (map) {
        let cx = 0, cy = 0;
        if (map.shape === 'rect') {
          cx = (map.coords[0] + map.coords[2]) / 2;
          cy = (map.coords[1] + map.coords[3]) / 2;
        } else {
          for (let i = 0; i < map.coords.length; i += 2) {
            cx += map.coords[i]; cy += map.coords[i+1];
          }
          cx /= (map.coords.length / 2); cy /= (map.coords.length / 2);
        }
        origin = `${cx}px ${cy}px`;
      }
    }
    return {
      transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
      transformOrigin: origin
    };
  }, [selectedId, naturalSize, pan, scale]);

  return (
    <div 
      className="relative w-full h-full overflow-hidden bg-slate-200 flex items-center justify-center p-4 map-container select-none"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div 
        className={`relative transition-transform duration-500 ease-out pointer-events-auto rounded-xl overflow-hidden ${showBg ? 'shadow-2xl' : 'bg-white border-4 border-dashed border-slate-300'}`}
        style={transformStyle}
      >
        <img
          src={INDEX_IMAGE_URL}
          alt="Index Map"
          className={`block max-w-none transition-opacity duration-500 pointer-events-none select-none ${showBg ? 'opacity-100' : 'opacity-0 h-[716px] w-[778px]'}`}
        />
        {naturalSize && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-auto" viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}>
            {MAP_DATA.map((map) => {
              const isSelected = selectedId === map.id;
              const shapeProps = {
                onClick: (e: any) => { e.stopPropagation(); onSelect(isSelected ? '' : map.id); },
                className: `cursor-pointer transition-all duration-300 ${isSelected ? 'fill-indigo-600/60 stroke-indigo-600' : 'fill-transparent stroke-indigo-500/30 hover:fill-indigo-500/10'}`,
                strokeWidth: isSelected ? "1.5" : "0.5"
              };

              if (map.shape === 'rect') {
                return (
                  <g key={map.id}>
                    <rect x={map.coords[0]} y={map.coords[1]} width={map.coords[2] - map.coords[0]} height={map.coords[3] - map.coords[1]} {...shapeProps} />
                    {!showBg && <text x={(map.coords[0]+map.coords[2])/2} y={(map.coords[1]+map.coords[3])/2} textAnchor="middle" dominantBaseline="central" fontSize="6" fontWeight="bold" fill={isSelected ? "white" : "#4f46e5"} className="pointer-events-none">{map.id}</text>}
                  </g>
                );
              } else if (map.shape === 'poly') {
                const pts = [];
                for(let i=0; i<map.coords.length; i+=2) pts.push(`${map.coords[i]},${map.coords[i+1]}`);
                return (
                  <g key={map.id}>
                    <polygon points={pts.join(' ')} {...shapeProps} />
                    {!showBg && <text x={map.coords[0]} y={map.coords[1]} fontSize="6" fontWeight="bold" fill={isSelected ? "white" : "#4f46e5"} className="pointer-events-none">{map.id}</text>}
                  </g>
                );
              }
              return null;
            })}
          </svg>
        )}
      </div>

      {/* Control Buttons HUD */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        <button onClick={() => setScale(s => Math.min(s+0.5, 10))} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:bg-indigo-50 active:scale-90 transition-all border border-slate-100"><Plus/></button>
        <button onClick={() => setScale(s => Math.max(s-0.5, 0.5))} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:bg-indigo-50 active:scale-90 transition-all border border-slate-100"><Minus/></button>
        <button onClick={() => { setPan({x:0, y:0}); setScale(1); onSelect(''); }} className="w-12 h-12 bg-indigo-600 rounded-2xl shadow-xl flex items-center justify-center text-white hover:bg-indigo-700 active:scale-90 transition-all"><RotateCcw className="w-5 h-5"/></button>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm text-[10px] font-black text-slate-500 flex items-center gap-2">
        <Move className="w-3 h-3" /> اسحب للاستكشاف | {Math.round(scale * 100)}%
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [showBg, setShowBg] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => JSON.parse(localStorage.getItem('m-maps-favs') || '[]'));

  useEffect(() => localStorage.setItem('m-maps-favs', JSON.stringify(favorites)), [favorites]);

  const filteredMaps = useMemo(() => MAP_DATA.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.id.includes(searchQuery)
  ), [searchQuery]);

  const toggleFavorite = (id: string) => setFavorites(f => f.includes(id) ? f.filter(i => i !== id) : [...f, id]);
  const selectedMap = useMemo(() => MAP_DATA.find(m => m.id === selectedId), [selectedId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden text-slate-900 antialiased">
      {/* Mobile Toolbar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-xl"><Menu /></button>
        <h1 className="font-black text-indigo-900">خرائط المغرب</h1>
        <div className="w-10"></div>
      </div>

      <div className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-40 w-full lg:w-80 h-full transition-transform duration-500 ease-in-out`}>
        <Sidebar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredMaps={filteredMaps} 
          selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setViewMode('map'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
          favorites={favorites} toggleFavorite={toggleFavorite} viewMode={viewMode} setViewMode={setViewMode}
        />
      </div>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {viewMode === 'map' && (
          <div className="absolute top-6 left-6 z-20">
            <button onClick={() => setShowBg(!showBg)} className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm shadow-2xl transition-all ${showBg ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'}`}>
              {showBg ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBg ? 'الوضع المخطط' : 'وضع القمر الصناعي'}
            </button>
          </div>
        )}

        {viewMode === 'map' ? (
          <InteractiveMap selectedId={selectedId} onSelect={setSelectedId} showBg={showBg} pan={pan} setPan={setPan} scale={scale} setScale={setScale} />
        ) : (
          <div className="flex-1 overflow-auto bg-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
              <div className="mb-10 border-b pb-6 border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">الفهرس الرقمي للخرائط</h2>
                  <p className="text-slate-500 font-bold mt-1">طوبوغرافية 1/50,000 للمملكة المغربية</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {filteredMaps.map(map => (
                  <div key={map.id} className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-2xl hover:border-indigo-400 transition-all group relative overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform -z-0 opacity-50"></div>
                    <div className="relative z-10 flex justify-between items-start mb-8">
                      <div className="flex items-center gap-4">
                        <span className="bg-indigo-600 text-white min-w-[45px] h-10 flex items-center justify-center rounded-2xl font-black text-xs shadow-lg shadow-indigo-200">{map.id}</span>
                        <h3 className="font-black text-slate-800 text-xl leading-tight">{map.name}</h3>
                      </div>
                      <button onClick={() => toggleFavorite(map.id)} className={`transition-all ${favorites.includes(map.id) ? 'text-rose-500 scale-125' : 'text-slate-200 hover:text-rose-400'}`}>
                        <Heart className={`w-6 h-6 ${favorites.includes(map.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="relative z-10 flex gap-3">
                      <a href={map.href} target="_blank" rel="noreferrer" className="flex-1 bg-slate-900 text-white hover:bg-indigo-600 py-4 rounded-2xl text-[13px] font-black flex items-center justify-center gap-2 transition-all shadow-xl active:translate-y-1"><Download className="w-4 h-4" /> تحميل PDF</a>
                      <button onClick={() => { setSelectedId(map.id); setViewMode('map'); }} className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 p-4 rounded-2xl transition-all"><MapIcon className="w-6 h-6" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedMap && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-[480px] bg-slate-900/95 backdrop-blur-xl text-white rounded-[40px] shadow-2xl border border-white/20 z-50 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="p-8">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-14 bg-indigo-500 rounded-3xl flex items-center justify-center text-base font-black shadow-2xl shadow-indigo-500/40">{selectedMap.id}</div>
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{selectedMap.name}</h3>
                    <p className="text-xs text-indigo-300 font-black uppercase tracking-widest mt-1">تحديد طوبوغرافي مباشر</p>
                  </div>
                </div>
                <button onClick={() => setSelectedId(null)} className="p-3 bg-white/10 hover:bg-rose-500 rounded-full transition-all group"><X className="w-6 h-6 group-hover:rotate-90 transition-transform" /></button>
              </div>
              <div className="flex gap-4">
                <a href={selectedMap.href} target="_blank" rel="noreferrer" className="flex-1 bg-white text-slate-950 hover:bg-indigo-400 hover:text-white py-5 rounded-3xl font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl shadow-white/5"><Download className="w-6 h-6" /> تحميل النسخة عالية الدقة</a>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
