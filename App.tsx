
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, Map as MapIcon, Download, Heart, Menu, X, 
  Globe, Table as TableIcon, Plus, Minus, RotateCcw, Move, ExternalLink,
  Facebook, Linkedin, LayoutList, Maximize
} from 'lucide-react';
import { MAP_DATA, INDEX_IMAGE_URL } from './constants.ts';
import { MapArea } from './types.ts';

// WhatsApp SVG Icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.431 5.631 1.432h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
  incrementDownload: (id: string) => void;
}> = ({ searchQuery, setSearchQuery, filteredMaps, selectedId, onSelect, favorites, toggleFavorite, viewMode, setViewMode, incrementDownload }) => {
  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200 shadow-xl overflow-hidden z-[70]">
      <div className="p-4 border-b border-gray-100 bg-amber-50/30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-black text-amber-900 flex flex-wrap items-center gap-1 leading-tight text-right">
            <Globe className="w-5 h-5 text-[#ffae00]" />
            أرشيف خرائط شمال المغرب
            <span className="text-[#ffae00] text-sm">#jilit_maps</span>
          </h1>
          <div className="flex flex-col items-end">
            <span className="text-black text-[10px] font-black bg-white px-2 py-0.5 rounded-md border border-black/10 shadow-sm" dir="ltr">1/50 000</span>
          </div>
        </div>
        
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
            placeholder="بحث (اسم، رقم)..."
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
                    <p className={`text-[11px] leading-tight ${isSelected ? 'text-white' : 'text-gray-500'} font-black`}>{map.nameAr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <a
                    href={map.href}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => { e.stopPropagation(); incrementDownload(map.id); }}
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

      <div className="p-3 border-t border-gray-100 bg-white flex flex-col items-center gap-1.5 shrink-0">
        <div className="flex items-center justify-center gap-4">
          <a 
            href="https://www.facebook.com/jilitsig/" 
            target="_blank" 
            rel="noreferrer"
            className="social-icon facebook-bg"
            title="Facebook"
          >
            <Facebook className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </a>
          <a 
            href="https://www.linkedin.com/in/Jilitelmostafa" 
            target="_blank" 
            rel="noreferrer"
            className="social-icon linkedin-bg"
            title="LinkedIn"
          >
            <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
          </a>
        </div>
        <span className="text-[9px] sm:text-[10px] font-black text-gray-400">jilitsig@gmail.com</span>
      </div>
    </div>
  );
};

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
  
  const handleFitToScreen = () => {
    if (!naturalSize || !mapContainerRef.current) return;
    const { width, height } = mapContainerRef.current.getBoundingClientRect();
    const scaleW = width / naturalSize.w;
    const scaleH = height / naturalSize.h;
    const fitScale = Math.min(scaleW, scaleH) * 0.95;
    setScale(fitScale);
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    const img = new Image();
    img.src = INDEX_IMAGE_URL;
    img.onload = () => {
      setNaturalSize({ w: img.width, h: img.height });
    };
  }, []);

  useEffect(() => {
    if (naturalSize && mapContainerRef.current) {
      handleFitToScreen();
      const resizeObserver = new ResizeObserver(() => handleFitToScreen());
      resizeObserver.observe(mapContainerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, [naturalSize]);

  useEffect(() => {
    if (isQuickSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isQuickSearchOpen]);

  useEffect(() => {
    if (selectedId && naturalSize) {
      const map = MAP_DATA.find(m => m.id === selectedId);
      if (map && map.coords) {
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
        setScale(prev => Math.max(prev, 2.0));
      }
    }
  }, [selectedId, naturalSize, setPan, setScale]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSpeed = 0.001;
    const delta = -e.deltaY * zoomSpeed;
    setScale(prev => Math.min(Math.max(prev + delta, 0.1), 10));
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
    if (!quickSearchQuery || quickSearchQuery.trim().length === 0) return [];
    const q = quickSearchQuery.toLowerCase().trim();
    return MAP_DATA.filter(m => 
      m.name.toLowerCase().includes(q) || 
      (m.nameAr && m.nameAr.includes(q)) || 
      m.id.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [quickSearchQuery]);

  return (
    <div 
      ref={mapContainerRef}
      onWheel={handleWheel}
      className="relative w-full h-full overflow-hidden flex items-center justify-center map-container select-none bg-slate-300"
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => { setIsDragging(false); setHoveredId(null); }}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <div className="absolute left-4 sm:left-6 top-4 sm:top-6 flex flex-col gap-2 sm:gap-3 z-30">
        <button 
          onClick={() => { setIsQuickSearchOpen(!isQuickSearchOpen); setQuickSearchQuery(''); }} 
          className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-[#ffae00] hover:bg-amber-50 active:scale-90 transition-all border border-slate-100" 
          title="بحث سريع"
        >
          {isQuickSearchOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        <button onClick={() => setScale(s => Math.min(s+0.5, 10))} className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:bg-amber-50 active:scale-90 transition-all border border-slate-100" title="Agrandir"><Plus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
        <button onClick={() => setScale(s => Math.max(s-0.5, 0.1))} className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:bg-amber-50 active:scale-90 transition-all border border-slate-100" title="Réduire"><Minus className="w-4 h-4 sm:w-5 sm:h-5"/></button>
        <button onClick={handleFitToScreen} className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-slate-800 hover:bg-amber-50 active:scale-90 transition-all border border-slate-100" title="ملائمة الشاشة"><Maximize className="w-4 h-4 sm:w-5 sm:h-5"/></button>
        <button onClick={() => { setPan({x:0, y:0}); onSelect(''); }} className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffae00] rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center text-white hover:bg-amber-600 active:scale-90 transition-all" title="Reset"><RotateCcw className="w-4 h-4 sm:w-5 sm:h-5"/></button>
      </div>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-slate-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-2xl z-30 border border-white/10" dir="ltr">
        1/50 000
      </div>

      {isQuickSearchOpen && (
        <div className="absolute top-4 sm:top-6 left-16 sm:left-20 right-4 sm:right-auto sm:w-80 z-40 animate-in fade-in slide-in-from-left-4 duration-300">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-100 overflow-hidden flex flex-col">
            <div className="relative p-2">
              <input
                ref={searchInputRef}
                type="text"
                dir="rtl"
                placeholder="ابحث بالاسم (Ar/Fr) أو الرقم..."
                className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-transparent outline-none font-bold text-slate-800 text-sm sm:text-base"
                value={quickSearchQuery}
                onChange={(e) => setQuickSearchQuery(e.target.value)}
              />
              <button 
                onClick={() => { setIsQuickSearchOpen(false); setQuickSearchQuery(''); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {quickSearchResults.length > 0 && (
              <div className="border-t border-slate-100 max-h-[60vh] overflow-y-auto bg-white/50">
                {quickSearchResults.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { onSelect(m.id); setIsQuickSearchOpen(false); setQuickSearchQuery(''); }}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-50 transition-colors border-b border-slate-50 last:border-0 text-right group"
                  >
                    <span className="text-xs font-black text-amber-500 bg-amber-50 px-2 py-1 rounded group-hover:bg-amber-100 transition-colors">{m.id}</span>
                    <div className="flex flex-col items-end overflow-hidden ml-4">
                      <span className="text-sm font-black text-slate-800 leading-tight truncate w-full">{m.name}</span>
                      {m.nameAr && <span className="text-xs font-bold text-slate-500 leading-tight mt-0.5 truncate w-full">{m.nameAr}</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {quickSearchQuery.trim().length > 0 && quickSearchResults.length === 0 && (
              <div className="p-4 text-center text-xs font-bold text-slate-400 border-t border-slate-100 bg-white/50">
                لا توجد نتائج
              </div>
            )}
          </div>
        </div>
      )}

      {hoveredMap && !isDragging && (
        <div 
          className="fixed pointer-events-none z-[100] bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-amber-200/50 -translate-x-1/2 -translate-y-[110%] flex flex-col items-center min-w-[140px] sm:min-w-[180px] animate-in fade-in zoom-in duration-200"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-amber-200/50"></div>
          <span className="text-amber-500 text-[9px] sm:text-[10px] font-black uppercase tracking-widest mb-1">{hoveredMap.id}</span>
          <span className="text-slate-900 text-base sm:text-lg font-black tracking-tight leading-none mb-1 text-center font-sans">{hoveredMap.name}</span>
          {hoveredMap.nameAr && <span className="text-slate-500 text-xs sm:text-sm font-bold text-center">{hoveredMap.nameAr}</span>}
        </div>
      )}

      <div 
        className="relative transition-transform duration-300 ease-out pointer-events-auto rounded-xl overflow-hidden shadow-2xl border-4 border-white/20 origin-center"
        style={transformStyle}
      >
        <img
          src={INDEX_IMAGE_URL}
          alt="Morocco Index Map"
          className="block max-w-none pointer-events-none select-none"
          style={{ width: naturalSize?.w, height: naturalSize?.h }}
        />
        
        {naturalSize && (
          <svg className="absolute top-0 left-0 w-full h-full pointer-events-auto" viewBox={`0 0 ${naturalSize.w} ${naturalSize.h}`}>
            {MAP_DATA.map((map) => {
              if (!map.coords) return null;
              const isSelected = selectedId === map.id;
              const isHovered = hoveredId === map.id;
              const shapeProps = {
                onClick: (e: any) => { e.stopPropagation(); onSelect(map.id); },
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

              if (map.shape === 'rect' && map.coords.length === 4) {
                return <rect key={map.id} x={map.coords[0]} y={map.coords[1]} width={map.coords[2] - map.coords[0]} height={map.coords[3] - map.coords[1]} {...shapeProps} />;
              } else if (map.shape === 'poly') {
                const pts = [];
                for(let i=0; i<map.coords.length; i+=2) pts.push(`${map.coords[i]},${map.coords[i+1]}`);
                return <polygon key={map.id} points={pts.join(' ')} {...shapeProps} />;
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

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); 
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSourceToast, setShowSourceToast] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('m-maps-favs') || '[]'); } catch { return []; }
  });
  
  const [downloadCounts, setDownloadCounts] = useState<Record<string, number>>(() => {
    try { 
      const stored = localStorage.getItem('m-maps-downloads');
      if (stored) return JSON.parse(stored);
      return MAP_DATA.reduce((acc, map) => ({ ...acc, [map.id]: Math.floor(Math.random() * 50) + 10 }), {});
    } catch { return {}; }
  });

  useEffect(() => localStorage.setItem('m-maps-favs', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('m-maps-downloads', JSON.stringify(downloadCounts)), [downloadCounts]);

  const filteredMaps = useMemo(() => MAP_DATA.filter(m => {
    const q = searchQuery.toLowerCase();
    return m.name.toLowerCase().includes(q) || (m.nameAr && m.nameAr.includes(q)) || m.id.toLowerCase().includes(q);
  }), [searchQuery]);

  const toggleFavorite = (id: string) => setFavorites(f => f.includes(id) ? f.filter(i => i !== id) : [...f, id]);
  const incrementDownload = (id: string) => setDownloadCounts(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const selectedMap = useMemo(() => MAP_DATA.find(m => m.id === selectedId), [selectedId]);
  const whatsappLink = `https://wa.me/212668090285?text=${encodeURIComponent("مرحبا ، أنا اتواصل معك من منصة أرشيف الخرائط الطبوغرافية بالمغرب شكرا لك .")}`;

  const handleSourceClick = () => {
    setShowSourceToast(true);
    setTimeout(() => setShowSourceToast(false), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-50 overflow-hidden text-slate-900 antialiased" dir="rtl">
      
      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col bg-white border-b border-slate-200 shadow-sm z-50 shrink-0">
        <div className="flex items-center justify-between p-3 sm:p-4">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-100 rounded-xl transition-colors hover:bg-amber-50">
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="text-center">
            <h1 className="font-black text-[#ffae00] text-sm sm:text-base leading-tight">
             أرشيف خرائط شمال المغرب<span className="text-xs">#jilit</span>
            </h1>
          </div>
          <button 
            onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
            className="p-2 bg-amber-50 text-amber-600 rounded-xl transition-colors border border-amber-100 flex items-center gap-1.5"
          >
            {viewMode === 'map' ? <LayoutList className="w-4 h-4" /> : <MapIcon className="w-4 h-4" />}
            <span className="text-[10px] font-bold">{viewMode === 'map' ? 'القائمة' : 'الخريطة'}</span>
          </button>
        </div>
      </div>

      {/* Sidebar Container */}
      <div className={`${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:static inset-0 z-[100] w-full lg:w-80 h-full transition-transform duration-500 ease-in-out shadow-2xl lg:shadow-none`}>
        <Sidebar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} filteredMaps={filteredMaps} 
          selectedId={selectedId} onSelect={(id) => { setSelectedId(id); setViewMode('map'); if(window.innerWidth < 1024) setIsSidebarOpen(false); }}
          favorites={favorites} toggleFavorite={toggleFavorite} viewMode={viewMode} setViewMode={setViewMode}
          incrementDownload={incrementDownload}
        />
      </div>

      <main className="flex-1 relative flex flex-col h-full overflow-hidden bg-slate-200">
        
        {/* Source Logo Floating */}
        <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-[80] flex flex-col items-center">
          {showSourceToast && (
            <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <a href="https://jemecasseausoleil.blogspot.com/" target="_blank" rel="noreferrer" className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl border border-amber-100 flex items-center gap-2 group whitespace-nowrap">
                <span className="text-slate-800 text-xs font-black">المصدر: Je Me Casse Au Soleil</span>
                <ExternalLink className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          )}
          <button onClick={handleSourceClick} className="w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all overflow-hidden border border-slate-200" title="المصدر">
            <img src="https://jemecasseausoleil.blogspot.com/favicon.ico" alt="Source" className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        </div>

        {/* WhatsApp Floating */}
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 w-10 h-10 sm:w-14 sm:h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[80]" title="واتساب">
          <WhatsAppIcon />
        </a>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {viewMode === 'map' ? (
            <InteractiveMap selectedId={selectedId} onSelect={setSelectedId} pan={pan} setPan={setPan} scale={scale} setScale={setScale} />
          ) : (
            <div className="flex-1 overflow-auto bg-white p-4 sm:p-8 md:p-12 scroll-smooth text-right">
              <div className="max-w-6xl mx-auto pb-24">
                <div className="mb-8 border-b pb-6 border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                      الفهرس الرقمي للخرائط <span className="text-amber-500 text-lg sm:text-2xl">#jilit_maps</span>
                    </h2>
                    <p className="text-[#ffae00] font-black mt-1 uppercase tracking-widest text-[9px] sm:text-xs">طوبوغرافية المملكة المغربية</p>
                  </div>
                  <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-black text-sm sm:text-base self-start sm:self-auto shadow-lg" dir="ltr">
                    1/50 000
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {filteredMaps.map(map => (
                    <div key={map.id} className="bg-white border border-slate-200 rounded-[2rem] p-5 sm:p-8 flex flex-col justify-between hover:shadow-2xl hover:border-[#ffae00] transition-all group relative overflow-hidden">
                      <div className="absolute -top-4 -left-4 w-16 h-16 bg-amber-50 rounded-full group-hover:scale-150 transition-transform -z-0 opacity-50"></div>
                      <div className="relative z-10 flex justify-between items-start mb-5 flex-row-reverse">
                        <div className="flex items-center gap-3 sm:gap-4 flex-row-reverse">
                          <span className="text-black min-w-[32px] sm:min-w-[36px] h-9 sm:h-11 flex items-center justify-center font-black text-sm sm:text-base bg-slate-50 rounded-xl shadow-sm border border-slate-100">{map.id}</span>
                          <div className="text-right">
                            <h3 className="font-black text-slate-800 text-lg sm:text-xl leading-tight">{map.name}</h3>
                            {map.nameAr && <p className="text-[12px] sm:text-[14px] text-gray-500 font-black mt-1">{map.nameAr}</p>}
                          </div>
                        </div>
                        <button onClick={() => toggleFavorite(map.id)} className={`transition-all p-2 ${favorites.includes(map.id) ? 'text-rose-500 scale-125' : 'text-slate-200 hover:text-rose-400'}`}>
                          <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${favorites.includes(map.id) ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      <div className="relative z-10 flex gap-3 flex-row-reverse">
                        <div className="flex-1 flex flex-col gap-1 items-center">
                          <a 
                            href={map.href} 
                            target="_blank" 
                            rel="noreferrer" 
                            onClick={() => incrementDownload(map.id)}
                            className="w-full bg-[#99FF33] text-black hover:brightness-110 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-sm sm:text-[15px] font-black flex items-center justify-center gap-2 transition-all shadow-xl shadow-[#99FF33]/20 active:translate-y-1"
                          >
                            <Download className="w-4 h-4 sm:w-5 sm:h-5" /> تحميل
                          </a>
                        </div>
                        <button onClick={() => { setSelectedId(map.id); setViewMode('map'); }} className="bg-amber-50 text-[#ffae00] hover:bg-amber-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-all shadow-sm h-[48px] sm:h-[56px]"><MapIcon className="w-5 h-5 sm:w-6 sm:h-6" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* POPUP - Map mode only */}
        {selectedMap && viewMode === 'map' && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-transparent pointer-events-none">
            <div className="ol-popup relative pointer-events-auto animate-in zoom-in-95 duration-200">
               <button onClick={() => setSelectedId(null)} className="absolute -top-3 -left-3 w-8 h-8 bg-white border border-slate-200 text-slate-400 hover:text-rose-500 rounded-full flex items-center justify-center shadow-lg transition-all"><X className="w-4 h-4" /></button>
               <div className="flex flex-col items-center w-full">
                  <span className="popup-title">{selectedMap.name}</span>
                  {selectedMap.nameAr && <span className="popup-arabic">{selectedMap.nameAr}</span>}
                  <button onClick={() => { window.open(selectedMap.href, '_blank'); incrementDownload(selectedMap.id); }} className="download-btn"><Download className="w-4 h-4" /> تنزيل الخريطة</button>
                  <div className="mt-4 pt-3 border-t border-slate-900/5 w-full flex justify-between items-center text-[10px] text-slate-400 font-black">
                    <span className="bg-slate-100 px-2 py-0.5 rounded">ID: {selectedMap.id}</span>
                    <span>{downloadCounts[selectedMap.id] || 0} تحميل</span>
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
