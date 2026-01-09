
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Map as MapIcon, Download, Heart, Menu, X, 
  Globe, Table as TableIcon, Plus, Minus, RotateCcw, Move 
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
      <div className="p-4 border-b border-gray-100 bg-amber-50/30">
        <h1 className="text-xl font-black text-amber-900 flex items-center gap-2 mb-4 leading-tight">
          <Globe className="w-6 h-6 text-[#ffae00]" />
          أرشيف الخرائط الطبوغرافية بالمغرب
        </h1>
        
        <div className="flex bg-gray-200 p-1 rounded-xl mb-4">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <TableIcon className="w-4 h-4" />
            قائمة الروابط
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all ${viewMode === 'map' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <MapIcon className="w-4 h-4" />
            الخريطة التفاعلية
          </button>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            dir="rtl"
            placeholder="بحث (بالفرنسية، العربية أو الرقم)..."
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm font-medium"
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
                    ? 'bg-[#ffae00] border-[#ffae00] text-white shadow-lg scale-[1.01]' 
                    : 'bg-white border-transparent hover:border-amber-100 text-gray-700 hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 text-xs font-black ${isSelected ? 'text-white' : 'text-black'}`}>
                    {map.id}
                  </span>
                  <div className="overflow-hidden text-right">
                    <p className="font-bold text-sm truncate max-w-[130px]">{map.name}</p>
                    <p className={`text-[12px] leading-tight ${isSelected ? 'text-white' : 'text-gray-500'} font-black`}>{map.nameAr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={map.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`p-1.5 rounded-full transition-colors ${isSelected ? 'text-white hover:bg-white/10' : 'text-amber-500 hover:bg-amber-50'}`}
                    title="تحميل"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(map.id); }}
                    className={`p-1.5 rounded-full transition-colors ${isFavorite ? 'text-rose-500' : isSelected ? 'text-white/40' : 'text-gray-300'}`}
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
            <p className="text-gray-400 font-bold">لم يتم العثور على نتائج</p>
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
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}> = ({ selectedId, onSelect, pan, setPan, scale, setScale }) => {
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [quickSearchQuery, setQuickSearchQuery] = useState('');
  
  const lastPos = useRef({ x: 0, y: 0 });
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const img = new Image();
    img.src = INDEX_IMAGE_URL;
    img.onload = () => setNaturalSize({ w: img.width, h: img.height });
  }, []);

  useEffect(() => {
    if (isQuickSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isQuickSearchOpen]);

  useEffect(() => {
    if (selectedId && naturalSize) {
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
        setPan({ x: (naturalSize.w/2 - cx), y: (naturalSize.h/2 - cy) });
        setScale(2.5);
      }
    }
  }, [selectedId, naturalSize, setPan, setScale]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    const delta = -e.deltaY * zoomSpeed;
    setScale(prev => Math.min(Math.max(prev + delta, 0.4), 10));
  };

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    lastPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    setMousePos({ x: clientX, y: clientY });
    if (!isDragging) return;
    const dx = clientX - lastPos.current.x;
    const dy = clientY - lastPos.current.y;
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    lastPos.current = { x: clientX, y: clientY };
  };

  const transformStyle = useMemo(() => {
    if (!naturalSize) return { transform: 'scale(1)', transformOrigin: 'center' };
    return {
      transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
      transformOrigin: 'center'
    };
  }, [naturalSize, pan, scale]);

  const hoveredMap = useMemo(() => MAP_DATA.find(m => m.id === hoveredId), [hoveredId]);

  const quickSearchResults = useMemo(() => {
    if (!quickSearchQuery) return [];
    const q = quickSearchQuery.toLowerCase();
    return MAP_DATA.filter(m => 
      m.name.toLowerCase().includes(q) || 
      (m.nameAr && m.nameAr.includes(q)) || 
      m.id.includes(q)
    ).slice(0, 5);
  }, [quickSearchQuery]);

  return (
    <div 
      ref={mapContainerRef}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden flex items-center justify-center p-4 map-container select-none bg-slate-300"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => { setIsDragging(false); setHoveredId(null); }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => setIsDragging(false)}
    >
      {/* HUD Controls - TOP LEFT */}
      <div className="absolute left-6 top-6 flex flex-col gap-3 z-30">
        <button 
          onClick={() => setIsQuickSearchOpen(!isQuickSearchOpen)} 
          className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#ffae00] hover:bg-amber-50 active:scale-90 transition-all border border-slate-100" 
          title="بحث سريع"
        >
          <Search className="w-5 h-5" />
        </button>
        <button onClick={() => setScale(s => Math.min(s+0.5, 10))} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:bg-amber-50 active:scale-90 transition-all border border-slate-100" title="Agrandir"><Plus/></button>
        <button onClick={() => setScale(s => Math.max(s-0.5, 0.4))} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:bg-amber-50 active:scale-90 transition-all border border-slate-100" title="Réduire"><Minus/></button>
        <button onClick={() => { setPan({x:0, y:0}); setScale(1); onSelect(''); }} className="w-12 h-12 bg-[#ffae00] rounded-2xl shadow-xl flex items-center justify-center text-white hover:bg-amber-600 active:scale-90 transition-all" title="Reset"><RotateCcw className="w-5 h-5"/></button>
      </div>

      {/* Floating Search Bar (Mobile/Map Mode Search) */}
      {isQuickSearchOpen && (
        <div className="absolute top-6 left-20 right-6 sm:right-auto sm:w-80 z-40 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-100 overflow-hidden">
            <div className="relative p-2">
              <input
                ref={searchInputRef}
                type="text"
                dir="rtl"
                placeholder="ابحث بالاسم أو الرقم..."
                className="w-full pl-10 pr-4 py-3 bg-transparent outline-none font-bold text-slate-800"
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => setIsQuickSearchOpen(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {quickSearchResults.length > 0 && (
              <div className="border-t border-slate-50 bg-white/50">
                {quickSearchResults.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { onSelect(m.id); setIsQuickSearchOpen(false); setQuickSearchQuery(''); }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-50 transition-colors border-b border-slate-50 last:border-0 text-right"
                  >
                    <span className="text-xs font-black text-amber-500">{m.id}</span>
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-black text-slate-800 leading-none">{m.name}</span>
                      <span className="text-[10px] font-bold text-slate-500 mt-1">{m.nameAr}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {quickSearchQuery && quickSearchResults.length === 0 && (
              <div className="p-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white">
                لا توجد نتائج
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tooltip on mouse hover */}
      {hoveredMap && !isDragging && (
        <div 
          className="fixed pointer-events-none z-[100] bg-white/95 backdrop-blur-md px-6 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-amber-200/50 -translate-x-1/2 -translate-y-[110%] flex flex-col items-center min-w-[160px] animate-in fade-in zoom-in duration-200"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-amber-200/50"></div>
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest mb-1">{hoveredMap.id}</span>
          <span className="text-slate-900 text-lg font-black tracking-tight leading-none mb-1 text-center font-sans">{hoveredMap.name}</span>
          <span className="text-slate-500 text-sm font-bold text-center">{hoveredMap.nameAr}</span>
        </div>
      )}

      <div 
        className="relative transition-transform duration-300 ease-out pointer-events-auto rounded-xl overflow-hidden shadow-2xl border-4 border-white/20"
        style={transformStyle}
      >
        <img
          src={INDEX_IMAGE_URL}
          alt="Morocco Index Map"
          className="block max-w-none pointer-events-none select-none h-[716px] w-[778px]"
        />
        
        {naturalSize && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-auto" viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}>
            {MAP_DATA.map((map) => {
              const isSelected = selectedId === map.id;
              const isHovered = hoveredId === map.id;
              const shapeProps = {
                onClick: (e: any) => { e.stopPropagation(); onSelect(isSelected ? '' : map.id); },
                onMouseEnter: () => setHoveredId(map.id),
                onMouseLeave: () => setHoveredId(null),
                style: {
                    fill: (isSelected || isHovered) ? '#ffae0066' : '#ffae0008',
                    stroke: (isSelected || isHovered) ? '#ffae00' : '#ffae0033',
                    transition: 'all 0.2s ease-in-out'
                },
                className: "cursor-pointer",
                strokeWidth: (isSelected || isHovered) ? "1.5" : "0.5"
              };

              if (map.shape === 'rect') {
                return (
                  <rect key={map.id} x={map.coords[0]} y={map.coords[1]} width={map.coords[2] - map.coords[0]} height={map.coords[3] - map.coords[1]} {...shapeProps} />
                );
              } else if (map.shape === 'poly') {
                const pts = [];
                for(let i=0; i<map.coords.length; i+=2) pts.push(`${map.coords[i]},${map.coords[i+1]}`);
                return (
                  <polygon key={map.id} points={pts.join(' ')} {...shapeProps} />
                );
              }
              return null;
            })}
          </svg>
        )}
      </div>

      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm text-[10px] font-black text-slate-500 items-center gap-3">
        <div className="flex items-center gap-1"><Move className="w-3 h-3" /> اسحب للتحريك</div>
        <div className="w-px h-3 bg-slate-300"></div>
        <div className="flex items-center gap-1">عجلة الفأرة للتقريب</div>
        <div className="w-px h-3 bg-slate-300"></div>
        <div className="text-amber-600 font-bold">{Math.round(scale * 100)}%</div>
      </div>
    </div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); 
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('m-maps-favs') || '[]'); } catch { return []; }
  });

  useEffect(() => localStorage.setItem('m-maps-favs', JSON.stringify(favorites)), [favorites]);

  const filteredMaps = useMemo(() => MAP_DATA.filter(m => {
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || 
           (m.nameAr && m.nameAr.includes(q)) || 
           m.id.toLowerCase().includes(q);
  }), [searchQuery]);

  const toggleFavorite = (id: string) => setFavorites(f => f.includes(id) ? f.filter(i => i !== id) : [...f, id]);
  const selectedMap = useMemo(() => MAP_DATA.find(m => m.id === selectedId), [selectedId]);

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden text-slate-900 antialiased" dir="rtl">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm z-50">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-xl transition-colors hover:bg-amber-50"><Menu /></button>
        <h1 className="font-black text-[#ffae00] text-lg">أرشيف الخرائط الطبوغرافية بالمغرب</h1>
        <div className="w-10"></div>
      </div>

      {/* Sidebar Area */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-40 w-full lg:w-80 h-full transition-transform duration-500 ease-in-out shadow-2xl lg:shadow-none`}>
        <Sidebar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredMaps={filteredMaps} 
          selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setViewMode('map'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
          favorites={favorites} toggleFavorite={toggleFavorite} viewMode={viewMode} setViewMode={setViewMode}
        />
      </div>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden">
        {viewMode === 'map' ? (
          <InteractiveMap selectedId={selectedId} onSelect={setSelectedId} pan={pan} setPan={setPan} scale={scale} setScale={setScale} />
        ) : (
          <div className="flex-1 overflow-auto bg-white p-4 sm:p-6 md:p-12 scroll-smooth text-right">
            <div className="max-w-6xl mx-auto">
              <div className="mb-10 border-b pb-6 border-slate-100">
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">الفهرس الرقمي للخرائط</h2>
                <p className="text-[#ffae00] font-black mt-1 uppercase tracking-widest text-[10px] sm:text-xs">طوبوغرافية 1/50,000 للمملكة المغربية</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMaps.map(map => (
                  <div key={map.id} className="bg-white border border-slate-200 rounded-[2rem] p-5 sm:p-6 flex flex-col justify-between hover:shadow-2xl hover:border-[#ffae00] transition-all group relative overflow-hidden">
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-amber-50 rounded-full group-hover:scale-150 transition-transform -z-0 opacity-50"></div>
                    <div className="relative z-10 flex justify-between items-start mb-6 flex-row-reverse">
                      <div className="flex items-center gap-4 flex-row-reverse">
                        <span className="text-black min-w-[32px] h-10 flex items-center justify-center font-black text-sm">{map.id}</span>
                        <div className="text-right">
                          <h3 className="font-black text-slate-800 text-lg leading-tight">{map.name}</h3>
                          <p className="text-[14px] text-gray-500 font-black mt-0.5 uppercase tracking-wide">{map.nameAr}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleFavorite(map.id)} className={`transition-all p-2 ${favorites.includes(map.id) ? 'text-rose-500 scale-125' : 'text-slate-200 hover:text-rose-400'}`}>
                        <Heart className={`w-5 h-5 ${favorites.includes(map.id) ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <div className="relative z-10 flex gap-3 flex-row-reverse">
                      <a href={map.href} target="_blank" rel="noreferrer" className="flex-1 bg-[#99FF33] text-black hover:brightness-110 py-3.5 sm:py-4 rounded-2xl text-[14px] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#99FF33]/20 active:translate-y-1"><Download className="w-4 h-4" /> تحميل</a>
                      <button onClick={() => { setSelectedId(map.id); setViewMode('map'); }} className="bg-amber-50 text-[#ffae00] hover:bg-amber-100 p-4 rounded-2xl transition-all shadow-sm"><MapIcon className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* COMPACT BOTTOM POPUP */}
        {selectedMap && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[90%] sm:w-auto min-w-[300px] max-w-[400px] bg-slate-900/90 backdrop-blur-xl text-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 z-50 animate-in slide-in-from-bottom-full duration-500 ease-out">
            <div className="p-4 text-right flex flex-col gap-3" dir="rtl">
              <div className="flex items-start justify-between gap-4">
                 <div className="flex items-center gap-3">
                   <div className="w-7 h-7 flex items-center justify-center bg-[#ffae00] rounded-lg text-[10px] font-black text-white shrink-0 shadow-lg">{selectedMap.id}</div>
                   <div className="overflow-hidden">
                     <h3 className="text-sm sm:text-base font-black leading-none truncate">{selectedMap.name}</h3>
                     <p className="text-[11px] text-amber-300 font-bold mt-1 leading-none">{selectedMap.nameAr}</p>
                   </div>
                 </div>
                 <button onClick={() => setSelectedId(null)} className="p-1.5 bg-white/10 hover:bg-rose-500 rounded-full transition-all shrink-0"><X className="w-3.5 h-3.5" /></button>
              </div>
              
              <a href={selectedMap.href} target="_blank" rel="noreferrer" className="w-full bg-[#99FF33] text-black hover:brightness-110 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-[#99FF33]/20">
                <Download className="w-4 h-4" /> تنزيل الخريطة
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
