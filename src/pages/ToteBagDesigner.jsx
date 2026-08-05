import { useState, useRef, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Stage, Layer, Image as KonvaImage, Transformer, Rect, Line, Text as KonvaText, Group } from 'react-konva'
import useImage from 'use-image'
import Konva from 'konva'
import {
  Upload, RotateCcw, Trash2, ZoomIn, ZoomOut, Save,
  ArrowLeft, Maximize2, Move, CheckCircle2, Loader2, ImagePlus, X,
  Palette, Type, Sliders, LayoutGrid, RotateCw, AlignCenter, AlignLeft,
  AlignRight, Bold, Italic, Layers, Undo, Redo, Download, Sparkles, Plus, Check
} from 'lucide-react'
import { useOtpAuth } from '../context/OtpAuthContext'
import { designAPI, productAPI, API_BASE } from '../services/api'
import { getImageUrl } from '../utils/imageUrl'
import toast from 'react-hot-toast'

// ─── Preset Google Fonts to load ──────────────────────────────────────────────
const GOOGLE_FONTS = [
  'Montserrat',
  'Pacifico',
  'Outfit',
  'Playfair Display',
  'Inter',
  'Roboto Mono',
  'Lobster',
  'Bebas Neue',
  'Caveat'
];

// Helper to load Google Fonts dynamically
const loadGoogleFont = (fontFamily) => {
  const linkId = `google-font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return;

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
};

// Load all fonts initially
GOOGLE_FONTS.forEach(loadGoogleFont);

// ─── Color Preset Options for Text and Products ──────────────────────────────
const TEXT_COLORS = [
  { name: 'Pitch Black', hex: '#000000' },
  { name: 'Warm White', hex: '#ffffff' },
  { name: 'Royal Gold', hex: '#c9a84c' },
  { name: 'Crimson Red', hex: '#b71c1c' },
  { name: 'Navy Blue', hex: '#0d47a1' },
  { name: 'Forest Green', hex: '#1b5e20' },
  { name: 'Burnt Orange', hex: '#e65100' },
  { name: 'Soft Rose', hex: '#ec407a' },
  { name: 'Plum Purple', hex: '#4a148c' },
];

const TOTE_COLORS = {
  natural: { name: 'Natural Jute', hex: 'transparent', overlay: false },
  cream: { name: 'Soft Cream', hex: '#fffbf0', opacity: 0.45, blend: 'multiply' },
  white: { name: 'Optic White', hex: '#ffffff', opacity: 0.55, blend: 'multiply' },
  black: { name: 'Charcoal Black', hex: '#1c1c1c', opacity: 0.78, blend: 'source-atop' },
  navy: { name: 'Classic Navy', hex: '#111f3d', opacity: 0.65, blend: 'source-atop' },
  red: { name: 'Crimson Red', hex: '#8a1321', opacity: 0.6, blend: 'source-atop' },
  green: { name: 'Forest Green', hex: '#18361b', opacity: 0.6, blend: 'source-atop' },
};

// ─── Artwork Layer Component ──────────────────────────────────────────────────
function ArtworkLayer({ id, src, x, y, width, height, rotation, opacity, filter, isSelected, onSelect, onTransformEnd }) {
  const [img] = useImage(src, 'anonymous')
  const imageRef = useRef(null)

  useEffect(() => {
    if (imageRef.current && img) {
      try {
        const node = imageRef.current;
        node.cache();
        const filters = [];
        if (filter === 'greyscale') filters.push(Konva.Filters.Grayscale);
        else if (filter === 'sepia') filters.push(Konva.Filters.Sepia);
        else if (filter === 'invert') filters.push(Konva.Filters.Invert);
        
        node.filters(filters);
        node.getLayer()?.batchDraw();
      } catch (err) {
        console.warn('Konva filter/cache warning:', err);
      }
    }
  }, [filter, img, width, height])

  if (!img) return null

  return (
    <KonvaImage
      id={id}
      ref={imageRef}
      image={img}
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      opacity={opacity}
      offsetX={width / 2}
      offsetY={height / 2}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onTransformEnd({
          x: e.target.x(),
          y: e.target.y(),
        })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onTransformEnd({
          x: node.x(),
          y: node.y(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
          rotation: node.rotation(),
        })
      }}
    />
  )
}

// ─── Text Layer Component ─────────────────────────────────────────────────────
function TextLayer({ id, text, x, y, width, height, rotation, fill, fontFamily, fontSize, align, fontWeight, fontStyle, isSelected, onSelect, onTransformEnd }) {
  const textRef = useRef(null)

  return (
    <KonvaText
      id={id}
      ref={textRef}
      text={text}
      x={x}
      y={y}
      width={width}
      height={height}
      rotation={rotation}
      fill={fill}
      fontFamily={fontFamily}
      fontSize={fontSize}
      align={align}
      fontStyle={`${fontWeight} ${fontStyle}`.trim()}
      offsetX={width / 2}
      offsetY={height / 2}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onTransformEnd({
          x: e.target.x(),
          y: e.target.y(),
        })
      }}
      onTransformEnd={(e) => {
        const node = e.target
        const scaleX = node.scaleX()
        const scaleY = node.scaleY()
        node.scaleX(1)
        node.scaleY(1)
        onTransformEnd({
          x: node.x(),
          y: node.y(),
          width: Math.max(10, node.width() * scaleX),
          height: Math.max(10, node.height() * scaleY),
          rotation: node.rotation(),
        })
      }}
      wrap="char"
    />
  )
}

// ─── Print Area Bounding Box ──────────────────────────────────────────────────
function PrintAreaOverlay({ printArea }) {
  return (
    <>
      <Rect
        x={printArea.x}
        y={printArea.y}
        width={printArea.w}
        height={printArea.h}
        stroke="rgba(201, 168, 76, 0.45)"
        strokeWidth={1.5}
        dash={[6, 4]}
        listening={false}
      />
      {/* Target Crosshairs in Corners */}
      {[
        [printArea.x, printArea.y],
        [printArea.x + printArea.w, printArea.y],
        [printArea.x, printArea.y + printArea.h],
        [printArea.x + printArea.w, printArea.y + printArea.h],
      ].map(([cx, cy], i) => (
        <Rect key={i} x={cx - 4} y={cy - 4} width={8} height={8}
          fill="rgba(201, 168, 76, 0.8)" cornerRadius={1} listening={false} />
      ))}
    </>
  )
}

// ─── Studio Grid Pattern Background ───────────────────────────────────────────
function StageGrid({ width, height }) {
  const lines = []
  const grid = 20
  for (let i = 0; i < width; i += grid) {
    lines.push(<Line key={`v-${i}`} points={[i, 0, i, height]} stroke="rgba(255, 255, 255, 0.03)" strokeWidth={1} name="grid" listening={false} />)
  }
  for (let j = 0; j < height; j += grid) {
    lines.push(<Line key={`h-${j}`} points={[0, j, width, j]} stroke="rgba(255, 255, 255, 0.03)" strokeWidth={1} name="grid" listening={false} />)
  }
  return <>{lines}</>
}

// ─── Main Designer Studio ─────────────────────────────────────────────────────
export default function ToteBagDesigner() {
  const { id: bagId } = useParams()
  const navigate = useNavigate()
  const { token, mobile, isVerified } = useOtpAuth()

  const containerRef = useRef(null)
  const stageRef = useRef(null)
  const transformerRef = useRef(null)
  const fileInputRef = useRef(null)

  // Product model states
  const [product, setProduct] = useState(null)
  const [productLoading, setProductLoading] = useState(true)
  const [customizableProducts, setCustomizableProducts] = useState([])

  // Layout & Settings State
  const [activeTab, setActiveTab] = useState('product') // 'product' | 'art' | 'text' | 'finish'
  const [bagColor, setBagColor] = useState('natural')
  const [showGrid, setShowGrid] = useState(true)
  const [showPrintGuide, setShowPrintGuide] = useState(true)
  const [snapToGrid, setSnapToGrid] = useState(false)
  const [zoomScale, setZoomScale] = useState(1)
  
  // Design Layers State
  const [layers, setLayers] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [gallery, setGallery] = useState([]) // uploaded images list

  // History stack for Undo/Redo
  const [history, setHistory] = useState([[]])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Status
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [savedDesignId, setSavedDesignId] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [savedUser, setSavedUser] = useState({ name: '', mobile: '' })

  // Stage details
  const [stageSize, setStageSize] = useState({ w: 500, h: 500 })
  const printArea = {
    x: stageSize.w * 0.22,
    y: stageSize.h * 0.28,
    w: stageSize.w * 0.56,
    h: stageSize.h * 0.50,
  }

  // Fetch customizable products list for dropdown
  useEffect(() => {
    const fetchCustomizableList = async () => {
      try {
        const res = await productAPI.getAll({ customizableOnly: true })
        setCustomizableProducts(res.data)
        // If we are on /customize (no ID in URL), redirect to the first customizable product automatically
        if (!bagId && res.data.length > 0) {
          navigate(`/customize/${res.data[0].id}`, { replace: true })
        }
      } catch (err) {
        console.error('Failed to load customizable products list:', err)
      }
    }
    fetchCustomizableList()
  }, [bagId, navigate])

  // Fetch product specifications from database
  useEffect(() => {
    const fetchProduct = async () => {
      if (!bagId) {
        setProductLoading(false)
        return
      }
      try {
        const res = await productAPI.getOne(bagId)
        setProduct(res.data)
      } catch (err) {
        console.error('Failed to load product specifications:', err)
        toast.error('Failed to load product information.')
      } finally {
        setProductLoading(false)
      }
    }
    fetchProduct()
  }, [bagId])

  // Compute active bag image path dynamically (support both absolute frontend assets and uploads)
  const bagImageUrl = product?.images?.length
    ? getImageUrl(product.images[0])
    : '/tote-bag.png'
  const [bagImage] = useImage(bagImageUrl, 'anonymous')

  // Redraw stage when document fonts are loaded
  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        stageRef.current?.batchDraw()
      })
    }
  }, [layers])

  // Sync Konva Transformer to selectedId
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = stageRef.current
      const selectedNode = stage.findOne(`#${selectedId}`)
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode])
        transformerRef.current.getLayer().batchDraw()
      } else {
        transformerRef.current.nodes([])
      }
    }
  }, [selectedId, layers])

  // Responsive stage sizing
  useEffect(() => {
    const updateSize = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const paddingX = 24
      const paddingY = 90 // Spacing for top settings bar and bottom tips
      const size = Math.min(rect.width - paddingX, rect.height - paddingY, 520)
      if (size > 0) {
        setStageSize({ w: size, h: size })
      }
    }
    updateSize()
    const obs = new ResizeObserver(updateSize)
    if (containerRef.current) obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  // Redirect check disabled so users can design before entering their details
  // useEffect(() => {
  //   if (!isVerified) navigate('/')
  // }, [isVerified, navigate])

  // ─── Undo / Redo & History management ──────────────────────────────────────────
  const pushHistory = useCallback((newLayers) => {
    const nextHistory = history.slice(0, historyIndex + 1)
    setHistory([...nextHistory, newLayers])
    setHistoryIndex(nextHistory.length)
  }, [history, historyIndex])

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setLayers(history[historyIndex - 1])
      setSelectedId(null)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setLayers(history[historyIndex + 1])
      setSelectedId(null)
    }
  }

  // ─── Content Helpers ──────────────────────────────────────────────────────────
  const handleStageMouseDown = (e) => {
    // clicked outer stage background -> deselect active node
    const clickedOnEmpty = e.target === e.target.getStage() ||
      e.target.name() === 'bgBacking' ||
      e.target.name() === 'grid' ||
      e.target.name() === 'bagGroup';
    if (clickedOnEmpty) {
      setSelectedId(null)
    }
  }

  const handleLayerTransform = (id, newAttrs) => {
    // Grid snapping helper inside drag end / transform end
    let attrs = { ...newAttrs }
    if (snapToGrid) {
      const grid = 15
      if (attrs.x !== undefined) attrs.x = Math.round(attrs.x / grid) * grid
      if (attrs.y !== undefined) attrs.y = Math.round(attrs.y / grid) * grid
    }

    const updated = layers.map(l => l.id === id ? { ...l, ...attrs } : l)
    setLayers(updated)
    pushHistory(updated)
  }

  // Add a generic Text Layer
  const handleAddText = () => {
    const cx = printArea.x + printArea.w / 2
    const cy = printArea.y + printArea.h / 2
    const newText = {
      id: `text_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: 'text',
      text: 'Custom Text',
      x: cx,
      y: cy,
      width: 250, // Expanded default width to prevent wrapping/clipping
      height: 35,
      rotation: 0,
      fill: '#000000',
      fontFamily: 'Montserrat',
      fontSize: 22,
      align: 'center',
      fontWeight: 'bold',
      fontStyle: '',
    }
    const updated = [...layers, newText]
    setLayers(updated)
    setSelectedId(newText.id)
    pushHistory(updated)
    toast.success('Text line added!')
  }

  // Upload custom PNG/JPG
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/png', 'image/jpeg', 'image/jpg']
    if (!allowed.includes(file.type)) {
      toast.error('Only PNG, JPG, and JPEG files are allowed.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB.')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('artwork', file)
      const res = await designAPI.upload(formData, token)
      const url = getImageUrl(res.data.url)
      
      // Save upload to gallery
      setGallery(prev => [url, ...prev])
      addArtworkLayer(url)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const addArtworkLayer = (url) => {
    const cx = printArea.x + printArea.w / 2
    const cy = printArea.y + printArea.h / 2
    const maxDim = Math.min(printArea.w, printArea.h) * 0.65

    const newImage = {
      id: `img_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      type: 'image',
      src: url,
      x: cx,
      y: cy,
      width: maxDim,
      height: maxDim,
      rotation: 0,
      opacity: 1,
      filter: 'none',
    }
    const updated = [...layers, newImage]
    setLayers(updated)
    setSelectedId(newImage.id)
    pushHistory(updated)
    toast.success('Image added to design!')
  }

  const handleRemoveLayer = (id) => {
    const updated = layers.filter(l => l.id !== id)
    setLayers(updated)
    setSelectedId(null)
    pushHistory(updated)
    toast('Layer removed', { icon: '🗑️' })
  }

  const handleClearWorkspace = () => {
    if (window.confirm('Are you sure you want to clear your entire design?')) {
      setLayers([])
      setSelectedId(null)
      pushHistory([])
      toast('Canvas cleared', { icon: '🧹' })
    }
  }

  // ─── Alignment & Layers Ordering ──────────────────────────────────────────────
  const centerHorizontally = () => {
    if (!selectedId) return
    const cx = printArea.x + printArea.w / 2
    const updated = layers.map(l => l.id === selectedId ? { ...l, x: cx } : l)
    setLayers(updated)
    pushHistory(updated)
  }

  const centerVertically = () => {
    if (!selectedId) return
    const cy = printArea.y + printArea.h / 2
    const updated = layers.map(l => l.id === selectedId ? { ...l, y: cy } : l)
    setLayers(updated)
    pushHistory(updated)
  }

  const bringToFront = () => {
    if (!selectedId) return
    const index = layers.findIndex(l => l.id === selectedId)
    if (index === -1) return
    const newLayers = [...layers]
    const [layer] = newLayers.splice(index, 1)
    newLayers.push(layer)
    setLayers(newLayers)
    pushHistory(newLayers)
  }

  const sendToBack = () => {
    if (!selectedId) return
    const index = layers.findIndex(l => l.id === selectedId)
    if (index === -1) return
    const newLayers = [...layers]
    const [layer] = newLayers.splice(index, 1)
    newLayers.unshift(layer)
    setLayers(newLayers)
    pushHistory(newLayers)
  }

  // ─── Export & Save handlers ──────────────────────────────────────────────────
  const downloadPreview = () => {
    try {
      setSelectedId(null)
      // Small timeout to allow transformer to disappear
      setTimeout(() => {
        const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2.5 })
        const link = document.createElement('a')
        link.download = `annalakshimi-custom-${product?.name || 'tote'}-${bagColor}.png`
        link.href = dataUrl
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Preview PNG downloaded!')
      }, 50)
    } catch (err) {
      toast.error('Failed to export. Check image CORS configuration.')
    }
  }

  const handleSaveDesign = async (userName, userMobile) => {
    if (layers.length === 0) {
      toast.error('Your canvas is currently empty. Add text or artwork first!')
      return
    }
    setSaving(true)
    try {
      setSelectedId(null)
      // wait for selection box to render out
      await new Promise(r => setTimeout(r, 80))

      const dataUrl = stageRef.current.toDataURL({ pixelRatio: 2 })
      const firstImageLayer = layers.find(l => l.type === 'image')

      const payload = {
        bagId: bagId || null,
        name: userName,
        mobile: userMobile,
        artworkUrl: firstImageLayer ? firstImageLayer.src : '',
        previewImage: dataUrl,
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 },
        rotation: 0,
        layers: JSON.stringify(layers),
        bagColor,
      }

      const res = await designAPI.saveDesign(payload)
      setSavedDesignId(res.data.designId)
      setSavedUser({ name: userName, mobile: userMobile })

      // Auto-trigger PNG download for user
      downloadPreview()

      setShowSaveModal(false)
      setShowSuccess(true)
      toast.success('Design saved successfully!')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save design.')
    } finally {
      setSaving(false)
    }
  }

  // Get active selected item details
  const activeLayer = layers.find(l => l.id === selectedId)

  return (
    <div className="designer-page min-h-screen text-[#e2e2e9] flex flex-col bg-[#0d0d0f] font-sans">
      {/* ─── Topbar ───────────────────────────────────────────────────────────── */}
      <header className="designer-topbar flex items-center justify-between border-b border-[#222226] bg-[#121215] px-3 md:px-6 py-2 md:py-3 h-[55px] md:h-[65px] shrink-0 sticky top-0 z-50 gap-2">
        <button className="designer-back-btn flex items-center gap-1 md:gap-2 text-xs md:text-sm text-[#e8d5b7]/80 hover:text-white transition-colors px-2.5 py-1.5 md:px-4 md:py-2" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} /> <span className="hidden sm:inline">Back</span>
        </button>

        {/* Customizable Bag Model Dropdown Switcher */}
        <div className="flex items-center gap-1.5 md:gap-3">
          <label htmlFor="bag-model-select" className="text-xs font-bold uppercase tracking-wider text-[#c9a84c] hidden md:block">
            Choose Bag Model:
          </label>
          <select
            id="bag-model-select"
            className="bg-[#1b1b22] border border-[#30303a] text-[#e8d5b7] rounded-xl px-2.5 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold focus:outline-none focus:border-[#c9a84c] cursor-pointer shadow-md transition-all hover:bg-[#22222c] max-w-[130px] sm:max-w-none truncate"
            value={bagId}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedId(null);
              navigate(`/customize/${newId}`);
            }}
          >
            {customizableProducts.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="text-[10px] md:text-xs text-[#a2a2ac] border border-[#2c2c31] rounded-full px-2 md:px-3 py-1 bg-[#1a1a1f] flex items-center gap-1 md:gap-1.5 shrink-0 max-w-[120px] sm:max-w-none truncate">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span className="truncate">{mobile ? `Testing (+91 ${mobile})` : 'Design Studio'}</span>
        </div>
      </header>

      {/* ─── Core Editor Layout ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-55px)] md:h-[calc(100vh-65px)] overflow-hidden">
        
        {/* Horizontal/Vertical Tab strip */}
        <div className="w-full md:w-20 bg-[#121215] border-t md:border-t-0 md:border-r border-[#222226] flex flex-row md:flex-col items-center justify-around md:justify-start py-2 md:py-6 px-4 md:px-0 gap-2 md:gap-6 shrink-0 select-none order-last md:order-first">
          {[
            { id: 'product', label: 'Color', icon: <Palette size={20} /> },
            { id: 'art', label: 'Artwork', icon: <Upload size={20} /> },
            { id: 'text', label: 'Add Text', icon: <Type size={20} /> },
            { id: 'save', label: 'Finish', icon: <Save size={20} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex flex-col items-center gap-1 md:gap-1.5 py-2 md:py-3.5 px-1 md:px-2 w-[70px] rounded-xl transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-gradient-to-br from-[#2c1a0e] to-[#6b4423]/30 text-[#e8d5b7] border border-[#c9a84c]/20 shadow-[0_4px_16px_rgba(201,168,76,0.08)]'
                  : 'text-[#82828c] hover:text-white'
              }`}
            >
              {t.icon}
              <span className="text-[0.65rem] font-medium tracking-wide">{t.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Sidebar Adjustment Panel */}
        <aside className="w-full h-[32vh] md:h-auto md:w-80 bg-[#16161a] border-t md:border-t-0 md:border-r border-[#222226] p-4 md:p-6 flex flex-col gap-4 md:gap-6 overflow-y-auto shrink-0 select-none order-2 md:order-none">
          
          {/* Contextual Properties Panel (shows if a layer is selected) */}
          {activeLayer ? (
            <div className="bg-[#1c1c22] border border-[#c9a84c]/15 rounded-2xl p-4 flex flex-col gap-4 animate-fade-in shadow-md animate-duration-150">
              <div className="flex justify-between items-center pb-2 border-b border-[#2c2c36]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#c9a84c] flex items-center gap-1.5">
                  <Sliders size={13} /> Edit Selected Layer
                </span>
                <button
                  className="p-1 rounded hover:bg-[#2d2d3a] text-[#8e8e9a] hover:text-white transition-colors"
                  onClick={() => setSelectedId(null)}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Specific Properties: TEXT LAYER */}
              {activeLayer.type === 'text' && (
                <div className="flex flex-col gap-3.5 text-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#8e8e9a]">TEXT CONTENT</label>
                    <input
                      type="text"
                      className="bg-[#24242e] border border-[#373747] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
                      value={activeLayer.text}
                      onChange={(e) => handleLayerTransform(activeLayer.id, { text: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#8e8e9a]">FONT FAMILY</label>
                    <select
                      className="bg-[#24242e] border border-[#373747] text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c9a84c]"
                      value={activeLayer.fontFamily}
                      onChange={(e) => handleLayerTransform(activeLayer.id, { fontFamily: e.target.value })}
                    >
                      {GOOGLE_FONTS.map(f => (
                        <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-[#8e8e9a]">FONT SIZE</label>
                      <input
                        type="number"
                        className="bg-[#24242e] border border-[#373747] text-white rounded-lg px-3 py-2 focus:outline-none"
                        value={activeLayer.fontSize}
                        min={8}
                        max={120}
                        onChange={(e) => handleLayerTransform(activeLayer.id, { fontSize: Number(e.target.value) })}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-[#8e8e9a]">ALIGNMENT</label>
                      <div className="grid grid-cols-3 bg-[#24242e] p-0.5 rounded-lg border border-[#373747]">
                        {[
                          { id: 'left', icon: <AlignLeft size={14} /> },
                          { id: 'center', icon: <AlignCenter size={14} /> },
                          { id: 'right', icon: <AlignRight size={14} /> }
                        ].map(a => (
                          <button
                            key={a.id}
                            className={`p-1.5 flex justify-center rounded transition-colors ${activeLayer.align === a.id ? 'bg-[#c9a84c] text-black' : 'text-[#8e8e9a] hover:text-white'}`}
                            onClick={() => handleLayerTransform(activeLayer.id, { align: a.id })}
                          >
                            {a.icon}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className={`flex-1 py-1.5 flex justify-center items-center gap-1 rounded-lg border text-xs font-semibold ${
                        activeLayer.fontWeight === 'bold'
                          ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#e8d5b7]'
                          : 'border-[#373747] text-[#8e8e9a]'
                      }`}
                      onClick={() => handleLayerTransform(activeLayer.id, { fontWeight: activeLayer.fontWeight === 'bold' ? 'normal' : 'bold' })}
                    >
                      <Bold size={13} /> Bold
                    </button>
                    <button
                      className={`flex-1 py-1.5 flex justify-center items-center gap-1 rounded-lg border text-xs font-semibold ${
                        activeLayer.fontStyle === 'italic'
                          ? 'bg-[#c9a84c]/20 border-[#c9a84c] text-[#e8d5b7]'
                          : 'border-[#373747] text-[#8e8e9a]'
                      }`}
                      onClick={() => handleLayerTransform(activeLayer.id, { fontStyle: activeLayer.fontStyle === 'italic' ? '' : 'italic' })}
                    >
                      <Italic size={13} /> Italic
                    </button>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-[#8e8e9a]">COLOR PRESETS</label>
                    <div className="flex flex-wrap gap-1.5">
                      {TEXT_COLORS.map(c => (
                        <button
                          key={c.hex}
                          style={{ backgroundColor: c.hex }}
                          className={`w-6 h-6 rounded-full border ${activeLayer.fill === c.hex ? 'border-white scale-110 shadow-md ring-2 ring-[#c9a84c]/30' : 'border-[#3c3c46]'}`}
                          onClick={() => handleLayerTransform(activeLayer.id, { fill: c.hex })}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Specific Properties: IMAGE LAYER */}
              {activeLayer.type === 'image' && (
                <div className="flex flex-col gap-3.5 text-sm">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#8e8e9a]">OPACITY</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        className="flex-1 accent-[#c9a84c]"
                        value={activeLayer.opacity ?? 1}
                        onChange={(e) => handleLayerTransform(activeLayer.id, { opacity: Number(e.target.value) })}
                      />
                      <span className="text-xs font-semibold w-8 text-right">{Math.round((activeLayer.opacity ?? 1) * 100)}%</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-[#8e8e9a]">IMAGE FILTERS</label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[
                        { id: 'none', label: 'Original' },
                        { id: 'greyscale', label: 'Grayscale' },
                        { id: 'sepia', label: 'Sepia' },
                        { id: 'invert', label: 'Invert' },
                      ].map(f => (
                        <button
                          key={f.id}
                          className={`py-1.5 rounded-lg border text-center transition-colors ${
                            activeLayer.filter === f.id
                              ? 'bg-[#c9a84c]/10 border-[#c9a84c] text-[#e8d5b7] font-semibold'
                              : 'border-[#2d2d3a] hover:bg-[#23232c] text-[#8e8e9a]'
                          }`}
                          onClick={() => handleLayerTransform(activeLayer.id, { filter: f.id })}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Shared Element Tools (Alignment & Arrangement) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#2c2c36]">
                <label className="text-[0.68rem] font-bold text-[#8e8e9a] uppercase tracking-wider">ALIGNMENT</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button className="py-2 bg-[#24242e] text-[#e2e2e9] rounded-lg hover:bg-[#2d2d3a] flex items-center justify-center gap-1 transition-colors" onClick={centerHorizontally}>
                    Center Horiz.
                  </button>
                  <button className="py-2 bg-[#24242e] text-[#e2e2e9] rounded-lg hover:bg-[#2d2d3a] flex items-center justify-center gap-1 transition-colors" onClick={centerVertically}>
                    Center Vert.
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="text-[0.68rem] font-bold text-[#8e8e9a] uppercase tracking-wider">ORDERING / DEPTH</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button className="py-2 bg-[#24242e] text-[#e2e2e9] rounded-lg hover:bg-[#2d2d3a] flex items-center justify-center gap-1 transition-colors" onClick={bringToFront}>
                    Bring to Front
                  </button>
                  <button className="py-2 bg-[#24242e] text-[#e2e2e9] rounded-lg hover:bg-[#2d2d3a] flex items-center justify-center gap-1 transition-colors" onClick={sendToBack}>
                    Send to Back
                  </button>
                </div>
              </div>

              <button
                className="w-full mt-2 py-2.5 bg-red-950/20 text-red-400 hover:bg-red-950/40 border border-red-900/30 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                onClick={() => handleRemoveLayer(activeLayer.id)}
              >
                <Trash2 size={13} /> Delete Layer
              </button>
            </div>
          ) : null}

          {/* ─── Sidebar TAB 1: PRODUCT OPTIONS ────────────────────────────────── */}
          {activeTab === 'product' && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Product Color Adjust</h3>
                <p className="text-xs text-[#82828c]">Tint this mockup bag shade dynamically</p>
              </div>

              <div className="flex flex-col gap-2.5">
                {Object.entries(TOTE_COLORS).map(([key, col]) => (
                  <button
                    key={key}
                    onClick={() => { setBagColor(key); setSelectedId(null); }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                      bagColor === key
                        ? 'bg-gradient-to-br from-[#2c1a0e] to-[#472d17]/40 border-[#c9a84c]/40 text-[#e8d5b7]'
                        : 'bg-[#1b1b20] border-[#25252b] hover:bg-[#22222a] text-[#a2a2ac]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: key === 'natural' ? '#d4b795' : col.hex }}
                        className={`w-6 h-6 rounded-full border border-black/25 ${key === 'natural' ? 'bg-[radial-gradient(#b89975_1px,transparent_1px)] [background-size:4px_4px]' : ''}`}
                      />
                      <span className="font-semibold">{col.name}</span>
                    </div>
                    {bagColor === key && <Check size={16} className="text-[#c9a84c]" />}
                  </button>
                ))}
              </div>

              <div className="bg-[#1b1b20] border border-[#25252b] rounded-2xl p-4 mt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Model Specifications</h4>
                <div className="text-xs text-[#8e8e9a] space-y-1">
                  <div className="flex justify-between"><span>Model Style:</span><span className="text-white font-medium capitalize">{product?.category || 'tote'} bag</span></div>
                  <div className="flex justify-between"><span>Tags:</span><span className="text-white font-medium">{product?.tags?.join(', ') || 'plain'}</span></div>
                  <div className="flex justify-between"><span>Material:</span><span className="text-white font-medium">Cotton Canvas</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ─── Sidebar TAB 2: ARTWORK UPLOAD ─────────────────────────────────── */}
          {activeTab === 'art' && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Add Artwork Logo</h3>
                <p className="text-xs text-[#82828c]">Upload transparent PNG or clean vectors</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="art-uploader"
              />

              <button
                className="w-full h-32 border-2 border-dashed border-[#34343d] hover:border-[#c9a84c] rounded-2xl bg-[#1b1b20] flex flex-col items-center justify-center gap-2.5 transition-all text-[#8e8e9a] hover:text-[#e2e2e9] cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 size={32} className="animate-spin text-[#c9a84c]" />
                    <span className="text-xs font-medium">Uploading to workspace...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus size={32} className="text-[#a2a2ac]/50" />
                    <span className="text-xs font-semibold">Drop image or click to upload</span>
                    <span className="text-[0.68rem] text-[#8e8e9a]/60">PNG, JPG, JPEG · Max 5MB</span>
                  </>
                )}
              </button>

              {/* Uploads Gallery */}
              {gallery.length > 0 && (
                <div className="flex flex-col gap-2.5 pt-2 border-t border-[#222226]">
                  <h4 className="text-xs font-bold text-[#8e8e9a] uppercase tracking-wider">Uploaded Images</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {gallery.map((url, i) => (
                      <button
                        key={i}
                        className="aspect-square bg-white border border-[#2d2d3a] rounded-xl overflow-hidden relative group hover:border-[#c9a84c] cursor-pointer transition-all"
                        onClick={() => addArtworkLayer(url)}
                      >
                        <img src={url} className="w-full h-full object-contain p-1.5" alt="Uploaded graphic" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <Plus size={16} className="text-white" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── Sidebar TAB 3: ADD TEXT LAYERS ────────────────────────────────── */}
          {activeTab === 'text' && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Add Customized Text</h3>
                <p className="text-xs text-[#82828c]">Design slogans, names, or brand statements</p>
              </div>

              <button
                className="w-full py-3 bg-gradient-to-br from-[#c9a84c] to-[#9a7a2e] text-black hover:opacity-90 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md"
                onClick={handleAddText}
              >
                <Type size={18} /> Add Text Line
              </button>

              <div className="bg-[#1b1b20] border border-[#25252b] rounded-2xl p-4 mt-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Formatting Tip</h4>
                <p className="text-xs text-[#8e8e9a] leading-relaxed">
                  Click on text nodes on the canvas. Adjust their alignment, font spacing, and choose from Google's premium cursive or varsity fonts.
                </p>
              </div>
            </div>
          )}

          {/* ─── Sidebar TAB 4: FINISH & EXPORT ────────────────────────────────── */}
          {activeTab === 'save' && (
            <div className="flex flex-col gap-5">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Review & Finish</h3>
                <p className="text-xs text-[#82828c]">Review design elements and download mockups</p>
              </div>

              {/* Design breakdown */}
              <div className="flex flex-col gap-3">
                <div className="bg-[#1b1b20] rounded-xl p-3 border border-[#2c2c36] text-xs space-y-2">
                  <div className="flex justify-between border-b border-[#2c2c36]/40 pb-1">
                    <span className="text-[#8e8e9a]">Bag Color Tint</span>
                    <span className="font-semibold text-white capitalize">{bagColor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8e8e9a]">Design Layers</span>
                    <span className="font-semibold text-white">{layers.length} active</span>
                  </div>
                </div>

                {layers.length > 0 ? (
                  <button
                    className="w-full py-3 bg-[#1e293b] border border-[#334155] text-white hover:bg-[#334155] font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-sm"
                    onClick={downloadPreview}
                  >
                    <Download size={16} /> Download PNG Mockup
                  </button>
                ) : null}

                <button
                  className="w-full py-3.5 bg-gradient-to-br from-[#27ae60] to-[#1e8449] text-white hover:opacity-90 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all text-sm shadow-[0_4px_16px_rgba(39,174,96,0.2)]"
                  onClick={() => setShowSaveModal(true)}
                  disabled={layers.length === 0}
                >
                  <Save size={16} /> Submit & Save Design
                </button>
                <p className="text-[0.68rem] text-center text-[#8e8e9a]">Your custom workspace setup will be saved to your mobile number details</p>
              </div>

              <div className="border-t border-[#222226] pt-4 flex flex-col gap-2">
                <button
                  className="w-full py-2.5 bg-red-950/15 border border-red-900/20 text-red-400 hover:bg-red-950/20 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex justify-center items-center gap-1.5"
                  onClick={handleClearWorkspace}
                >
                  <Trash2 size={13} /> Reset Entire Canvas
                </button>
              </div>
            </div>
          )}

        </aside>

        {/* ─── Studio Workspace / Center Area ───────────────────────────────────── */}
        <main ref={containerRef} className="flex-1 flex flex-col items-center justify-center bg-[#09090b] relative p-2 md:p-4 h-auto md:h-[calc(100vh-65px)] overflow-hidden select-none order-1 md:order-none">
          
          {/* Action / Settings Toolbar */}
          <div className="absolute top-2 md:top-4 bg-[#121215]/95 border border-[#232328] rounded-2xl md:rounded-full px-2.5 md:px-4 py-1.5 md:py-2 flex flex-wrap md:flex-nowrap items-center justify-center gap-2 md:gap-4 text-[#8e8e9a] shadow-2xl z-20 backdrop-blur-md max-w-[95%]">
            
            {/* Undo / Redo */}
            <div className="flex items-center gap-0.5 md:gap-1 border-r border-[#222228] pr-1.5 md:pr-3">
              <button
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${historyIndex > 0 ? 'text-white hover:bg-[#24242e]' : 'opacity-30 cursor-not-allowed'}`}
                onClick={handleUndo}
                title="Undo"
                disabled={historyIndex === 0}
              >
                <Undo size={16} />
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${historyIndex < history.length - 1 ? 'text-white hover:bg-[#24242e]' : 'opacity-30 cursor-not-allowed'}`}
                onClick={handleRedo}
                title="Redo"
                disabled={historyIndex === history.length - 1}
              >
                <Redo size={16} />
              </button>
            </div>

            {/* Guides Toggles */}
            <div className="flex items-center gap-0.5 md:gap-1 border-r border-[#222228] pr-1.5 md:pr-3">
              <button
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showGrid ? 'text-[#c9a84c] hover:bg-[#24242e]' : 'hover:bg-[#24242e]'}`}
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Grid Guide"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${showPrintGuide ? 'text-[#c9a84c] hover:bg-[#24242e]' : 'hover:bg-[#24242e]'}`}
                onClick={() => setShowPrintGuide(!showPrintGuide)}
                title="Toggle Print Area Guide"
              >
                <Maximize2 size={16} />
              </button>
              <button
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${snapToGrid ? 'text-[#c9a84c] hover:bg-[#24242e]' : 'hover:bg-[#24242e]'}`}
                onClick={() => setSnapToGrid(!snapToGrid)}
                title="Snap to Grid"
              >
                <Move size={16} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1 md:gap-2">
              <button className="p-1 rounded-lg hover:bg-[#24242e] text-white cursor-pointer" onClick={() => setZoomScale(z => Math.max(0.6, z - 0.1))} title="Zoom Out">
                <ZoomOut size={16} />
              </button>
              <span className="text-xs font-semibold tracking-wider text-white select-none w-10 text-center">{Math.round(zoomScale * 100)}%</span>
              <button className="p-1 rounded-lg hover:bg-[#24242e] text-white cursor-pointer" onClick={() => setZoomScale(z => Math.min(1.6, z + 0.1))} title="Zoom In">
                <ZoomIn size={16} />
              </button>
              <button className="text-[10px] uppercase font-bold text-[#c9a84c] hover:text-white cursor-pointer" onClick={() => setZoomScale(1)}>
                Fit
              </button>
            </div>

          </div>

          {/* Tote Bag Canvas Center Board */}
          <div className="designer-canvas-card border border-[#222226] bg-[#fbf9f5] rounded-3xl overflow-hidden relative shadow-[0_30px_90px_rgba(0,0,0,0.85)] max-w-full max-h-full select-none">
            
            <Stage
              ref={stageRef}
              width={stageSize.w}
              height={stageSize.h}
              scaleX={zoomScale}
              scaleY={zoomScale}
              onMouseDown={handleStageMouseDown}
              onTouchStart={handleStageMouseDown}
            >
              {/* Layer 1: Background & Checkerboard Studio Grid */}
              <Layer name="background">
                {/* Solid white canvas background to block grid behind the bag */}
                <Rect x={0} y={0} width={stageSize.w} height={stageSize.h} fill="#ffffff" name="bgBacking" />
                {showGrid && <StageGrid width={stageSize.w} height={stageSize.h} />}
              </Layer>

              {/* Layer 2: Design elements (bag mockup image, color tinting and text/artwork layers, clipped strictly to bag outline) */}
              <Layer name="design">
                {/* Bag Base Graphics Group */}
                <Group name="bagGroup">
                  {/* Dynamic Base bag model mockup */}
                  {bagImage && (
                    <KonvaImage
                      image={bagImage}
                      x={0}
                      y={0}
                      width={stageSize.w}
                      height={stageSize.h}
                    />
                  )}

                  {/* Tint Overlay (restricted exactly to bag outline via composite operation) */}
                  {bagColor !== 'natural' && TOTE_COLORS[bagColor]?.overlay && (
                    <Rect
                      x={0}
                      y={0}
                      width={stageSize.w}
                      height={stageSize.h}
                      fill={TOTE_COLORS[bagColor].hex}
                      opacity={TOTE_COLORS[bagColor].opacity}
                      globalCompositeOperation={TOTE_COLORS[bagColor].blend}
                    />
                  )}
                </Group>

                {/* Design elements group: clips everything within the group to the bag shape using source-atop composition */}
                <Group globalCompositeOperation="source-atop">
                  {layers.map((layer) => {
                    if (layer.type === 'image') {
                      return (
                        <ArtworkLayer
                          key={layer.id}
                          id={layer.id}
                          src={layer.src}
                          x={layer.x}
                          y={layer.y}
                          width={layer.width}
                          height={layer.height}
                          rotation={layer.rotation}
                          opacity={layer.opacity}
                          filter={layer.filter}
                          isSelected={layer.id === selectedId}
                          onSelect={() => setSelectedId(layer.id)}
                          onTransformEnd={(newAttrs) => handleLayerTransform(layer.id, newAttrs)}
                        />
                      )
                    } else if (layer.type === 'text') {
                      return (
                        <TextLayer
                          key={layer.id}
                          id={layer.id}
                          text={layer.text}
                          x={layer.x}
                          y={layer.y}
                          width={layer.width}
                          height={layer.height}
                          rotation={layer.rotation}
                          fill={layer.fill}
                          fontFamily={layer.fontFamily}
                          fontSize={layer.fontSize}
                          align={layer.align}
                          fontWeight={layer.fontWeight}
                          fontStyle={layer.fontStyle}
                          isSelected={layer.id === selectedId}
                          onSelect={() => setSelectedId(layer.id)}
                          onTransformEnd={(newAttrs) => handleLayerTransform(layer.id, newAttrs)}
                        />
                      )
                    }
                    return null
                  })}
                </Group>
              </Layer>

              {/* Layer 3: UI Controls & Guides Overlay (not clipped by composite operation) */}
              <Layer name="ui">
                {/* Print area guide overlay box */}
               

                {/* Resizing anchor boxes overlay */}
                {selectedId && activeLayer && (
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      if (newBox.width < 25 || newBox.height < 25) return oldBox
                      return newBox
                    }}
                    rotateEnabled={true}
                    keepRatio={activeLayer.type === 'image'}
                    enabledAnchors={activeLayer.type === 'text'
                      ? ['middle-left', 'middle-right', 'top-left', 'top-right', 'bottom-left', 'bottom-right']
                      : ['top-left', 'top-right', 'bottom-left', 'bottom-right']
                    }
                    borderStroke="#c9a84c"
                    borderStrokeWidth={1.5}
                    anchorFill="#ffffff"
                    anchorStroke="#c9a84c"
                    anchorSize={8}
                    anchorCornerRadius={2}
                  />
                )}
              </Layer>
            </Stage>

            {/* Prompt when empty */}
            {layers.length === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                <div className="w-[320px] bg-black/55 backdrop-blur-md border border-[#c9a84c]/20 p-5 rounded-2xl text-center flex flex-col gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#c9a84c]/15 text-[#c9a84c] flex items-center justify-center mx-auto mb-1">
                    <Sparkles size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Canvas is Empty</h4>
                  <p className="text-[0.7rem] text-[#8e8e9a] leading-normal">
                    Select the <strong>Artwork</strong> tab to upload a logo/image, or select the <strong>Add Text</strong> tab to start styling slogans.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Quick tips label at the bottom */}
          <div className="mt-4 flex items-center gap-4 text-[0.7rem] text-[#8e8e9a]">
            <span>💡 Drag handles to scale/rotate</span>
            <span>•</span>
            <span>Click element to configure properties</span>
            <span>•</span>
            <span>Prints clip to actual bag outline</span>
          </div>

        </main>
      </div>

      {/* ─── Save Lead Details Modal ─────────────────────────────────────────── */}
      <SaveDetailsModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        onSave={handleSaveDesign}
        saving={saving}
      />

      {/* ─── Success Modal ────────────────────────────────────────────────────── */}
      {showSuccess && (
        <div className="designer-success-overlay" onClick={() => setShowSuccess(false)}>
          <div className="designer-success-card bg-[#16161a] border border-[#c9a84c]/30 text-white rounded-3xl p-8 max-w-md w-full text-center shadow-[0_32px_80px_rgba(0,0,0,0.6)]" onClick={e => e.stopPropagation()}>
            <button className="designer-success-close text-white/50 hover:text-white" onClick={() => setShowSuccess(false)}><X size={18} /></button>
            <div className="designer-success-icon text-green-500 mb-2 flex justify-center"><CheckCircle2 size={54} /></div>
            <h2 className="font-display font-bold text-2xl text-[#e8d5b7] mb-2">Design Saved!</h2>
            <p className="text-sm text-[#a2a2ac] leading-relaxed mb-6">
              Your custom design workspace has been successfully registered. Our styling team will review your order requirements and contact you at <strong>+91 {savedUser.mobile || mobile}</strong>.
            </p>
            <div className="bg-[#212128] border border-[#2d2d3a] rounded-xl p-3 text-xs mb-6">
              <span className="text-[#8e8e9a]">DESIGN REFERENCE ID</span>
              <p className="font-mono text-white text-sm font-semibold tracking-wide mt-1">{savedDesignId}</p>
            </div>
            <button
              className="w-full py-3 bg-gradient-to-br from-[#c9a84c] to-[#9a7a2e] text-black font-bold rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
              onClick={() => { setShowSuccess(false); navigate(-1); }}
            >
              Back to Catalog
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SaveDetailsModal({ isOpen, onClose, onSave, saving }) {
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')

  if (!isOpen) return null

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Name is required')
    if (!mobile.trim() || mobile.length < 10) return toast.error('Please enter a valid 10-digit mobile number')
    onSave(name, mobile)
  }

  return (
    <div className="fixed inset-0 z-[1200] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#16161a] border border-[#c9a84c]/30 text-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-fade-in" onClick={e => e.stopPropagation()}>
        <button type="button" className="absolute top-4 right-4 text-white/50 hover:text-white" onClick={onClose}>
          <X size={18} />
        </button>
        <h3 className="font-display font-bold text-xl text-[#e8d5b7] mb-2">Save & Submit Design</h3>
        <p className="text-xs text-[#a2a2ac] mb-6">
          Enter your name and mobile number to save your custom workspace and download your mockup.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-4 text-left">
          <div className="flex flex-col gap-1.5 text-sm">
            <label className="text-xs font-bold text-[#8e8e9a] uppercase">Your Name</label>
            <input
              type="text"
              required
              placeholder="e.g. John Doe"
              className="bg-[#24242e] border border-[#373747] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#c9a84c] text-sm"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5 text-sm">
            <label className="text-xs font-bold text-[#8e8e9a] uppercase">Mobile Number</label>
            <input
              type="tel"
              required
              pattern="[0-9]{10}"
              placeholder="e.g. 9876543210"
              className="bg-[#24242e] border border-[#373747] text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#c9a84c] text-sm"
              value={mobile}
              onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 bg-gradient-to-br from-[#c9a84c] to-[#9a7a2e] text-black font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex justify-center items-center gap-2 text-sm"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving Workspace...
              </>
            ) : (
              'Save & Download Mockup'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
