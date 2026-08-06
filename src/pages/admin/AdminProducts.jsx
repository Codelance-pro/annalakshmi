import { useState, useEffect, useRef } from 'react'
import { Plus, Pencil, Trash2, X, Upload, Image as ImageIcon, Search, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { productAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUrl'

const CATEGORIES = ['jute', 'tote', 'wedding']

function ProductModal({ product, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category || 'jute',
    tags: product?.tags?.join(', ') || '',
    isNew: product?.isNew || false,
    featured: product?.featured || false,
    isCustomizableOnly: product?.isCustomizableOnly || false,
  })
  const [newImages, setNewImages] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [removeImages, setRemoveImages] = useState([])
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const handle = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const onFileChange = (e) => {
    const files = Array.from(e.target.files)
    setNewImages(f => [...f, ...files])
    const previews = files.map(f => URL.createObjectURL(f))
    setNewPreviews(p => [...p, ...previews])
  }

  const toggleRemoveExisting = (imgPath) => {
    setRemoveImages(r => r.includes(imgPath) ? r.filter(x => x !== imgPath) : [...r, imgPath])
  }

  const removeNewImage = (i) => {
    setNewImages(imgs => imgs.filter((_, idx) => idx !== i))
    setNewPreviews(ps => ps.filter((_, idx) => idx !== i))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.category) return toast.error('Name and category are required')
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (removeImages.length > 0) fd.append('removeImages', JSON.stringify(removeImages))
      newImages.forEach(img => fd.append('images', img))

      if (product) {
        await productAPI.update(product.id || product._id, fd)
        toast.success('Product updated!')
      } else {
        await productAPI.create(fd)
        toast.success('Product created!')
      }
      onSaved()
      onClose()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1100] bg-[#2c3e50]/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-[600px] max-h-[90vh] flex flex-col shadow-[0_24px_60px_rgba(0,0,0,0.2)] animate-fade-up" onClick={e => e.stopPropagation()}>
        <div className="px-6 py-5 border-b border-[#e1e8ed] flex items-center justify-between">
          <h2 className="font-display text-[1.4rem] font-bold text-text-primary m-0 leading-none">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center text-text-muted transition-colors hover:bg-[#e1e8ed] hover:text-text-primary" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={submit} className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="form-group mb-0">
              <label>Product Name *</label>
              <input name="name" className="form-control" value={form.name} onChange={handle} required placeholder="e.g. Natural Weave Jute Tote" />
            </div>
            <div className="form-group mb-0">
              <label>Category *</label>
              <select name="category" className="form-control" value={form.category} onChange={handle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)} Bags</option>)}
              </select>
            </div>
          </div>

          <div className="form-group mb-0">
            <label>Description</label>
            <textarea name="description" className="form-control min-h-[100px]" value={form.description} onChange={handle} placeholder="Describe the bag's features, materials, and use cases..." rows={4} />
          </div>

          <div className="form-group mb-0">
            <label>Tags (comma separated)</label>
            <input name="tags" className="form-control" value={form.tags} onChange={handle} placeholder="natural, handwoven, eco-friendly" />
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-[0.9rem] font-medium text-text-secondary select-none group">
              <input type="checkbox" name="isNew" checked={form.isNew} onChange={handle} className="peer hidden" />
              <span className="w-[18px] h-[18px] border-2 border-[#bdc3c7] rounded flex items-center justify-center text-white transition-colors peer-checked:bg-[#3498db] peer-checked:border-[#3498db] group-hover:border-[#3498db]"><Check size={12} className={form.isNew ? 'opacity-100' : 'opacity-0'} /></span>
              Mark as New Arrival
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[0.9rem] font-medium text-text-secondary select-none group">
              <input type="checkbox" name="featured" checked={form.featured} onChange={handle} className="peer hidden" />
              <span className="w-[18px] h-[18px] border-2 border-[#bdc3c7] rounded flex items-center justify-center text-white transition-colors peer-checked:bg-[#f1c40f] peer-checked:border-[#f1c40f] group-hover:border-[#f1c40f]"><Check size={12} className={form.featured ? 'opacity-100' : 'opacity-0'} /></span>
              Mark as Featured
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-[0.9rem] font-medium text-[#2c3e50] select-none group">
              <input type="checkbox" name="isCustomizableOnly" checked={form.isCustomizableOnly} onChange={handle} className="peer hidden" />
              <span className="w-[18px] h-[18px] border-2 border-[#bdc3c7] rounded flex items-center justify-center text-white transition-colors peer-checked:bg-[#9b59b6] peer-checked:border-[#9b59b6] group-hover:border-[#9b59b6]"><Check size={12} className={form.isCustomizableOnly ? 'opacity-100' : 'opacity-0'} /></span>
              Customizer Template Bag (Hide in Catalog)
            </label>
          </div>

          {/* Existing images */}
          {product?.images?.length > 0 && (
            <div className="form-group mb-0 pt-4 border-t border-[#e1e8ed]">
              <label>Existing Images (click to mark for removal)</label>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 mt-2">
                {product.images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${removeImages.includes(img) ? 'border-[#e74c3c]' : 'border-[#e1e8ed]'}`}
                    onClick={() => toggleRemoveExisting(img)}
                    title={removeImages.includes(img) ? 'Click to keep' : 'Click to remove'}
                  >
                    <img src={getImageUrl(img)} alt="" className={`w-full h-full object-cover transition-opacity ${removeImages.includes(img) ? 'opacity-40 grayscale' : ''}`} />
                    {removeImages.includes(img) && <div className="absolute inset-0 bg-[#e74c3c]/10 flex items-center justify-center text-[#e74c3c]"><X size={20} /></div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New images */}
          <div className="form-group mb-0">
            <label>Add New Images (max 6)</label>
            <div className="border-2 border-dashed border-[#bdc3c7] rounded-xl p-8 text-center cursor-pointer transition-colors bg-[#f8f9fa] hover:border-[#3498db] hover:bg-[#3498db]/5 flex flex-col items-center justify-center gap-2" onClick={() => fileRef.current?.click()}>
              <Upload size={24} className="text-[#95a5a6]" />
              <p className="font-semibold text-text-primary text-[0.95rem] m-0">Click to upload images</p>
              <span className="text-[0.8rem] text-text-muted">JPG, PNG, WebP up to 5MB each</span>
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={onFileChange} style={{ display: 'none' }} />
            </div>
            {newPreviews.length > 0 && (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-3 mt-3">
                {newPreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#e1e8ed]">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#e74c3c] text-white flex items-center justify-center transition-transform hover:scale-110"
                      onClick={() => removeNewImage(i)}
                    ><X size={12} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-4 border-t border-[#e1e8ed] bg-[#fafbfc] rounded-b-2xl flex items-center justify-end gap-3 mt-auto -mx-6 -mb-6">
            <button type="button" className="px-5 py-2.5 rounded-lg font-medium text-[0.9rem] transition-colors text-text-secondary hover:bg-[#e1e8ed]" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-5 py-2.5 rounded-lg font-medium text-[0.9rem] transition-all bg-[#3498db] text-white hover:bg-[#2980b9] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed" disabled={saving}>
              {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')
  const [modal, setModal] = useState(null) // null | 'new' | product object

  const load = () => {
    setLoading(true)
    productAPI.getAll({ includeCustomizable: true }).then(r => setProducts(r.data)).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This action cannot be undone.')) return
    try {
      await productAPI.delete(id)
      toast.success('Product deleted')
      load()
    } catch (e) {
      toast.error('Failed to delete product')
    }
  }

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'all' || p.category === catFilter
    const matchSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <h1 className="font-display text-[2rem] font-bold text-text-primary mb-1 tracking-tight">Products</h1>
      <p className="text-[0.95rem] text-text-secondary mb-8">Manage your jute, tote, and wedding bag listings.</p>

      <div className="bg-white rounded-2xl border border-[#e1e8ed] shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e1e8ed] flex items-center justify-between flex-wrap gap-4 bg-[#fafbfc]">
          <div className="flex gap-3 flex-1 flex-wrap items-center">
            {/* Search */}
            <div className="relative min-w-[200px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="w-full bg-white border border-[#e1e8ed] rounded-lg py-2 pl-9 pr-3 text-[0.85rem] text-text-primary transition-colors focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-[#3498db]/20 h-[38px]"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {/* Filter */}
            <div className="flex bg-[#e1e8ed] p-1 rounded-lg">
              {['all', ...CATEGORIES].map(c => (
                <button
                  key={c}
                  className={`px-3.5 py-1.5 rounded-md text-[0.82rem] font-medium transition-colors ${catFilter === c ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                  onClick={() => setCatFilter(c)}
                >
                  {c === 'all' ? 'All' : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3498db] text-white rounded-lg text-[0.88rem] font-medium transition-colors hover:bg-[#2980b9] whitespace-nowrap" onClick={() => setModal('new')}>
            <Plus size={16} /> Add Product
          </button>
        </div>

        {loading ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-[120px] rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center">
            <ImageIcon size={40} className="opacity-20 mb-3" />
            <p>No products found. <button className="text-[#3498db] font-medium hover:underline ml-1" onClick={() => setModal('new')}>Add your first product →</button></p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e1e8ed]">
                  <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Product</th>
                  <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Category</th>
                  <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Images</th>
                  <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Status</th>
                  <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Added</th>
                  <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const pid = p.id || p._id
                  const img = p.images?.[0] ? getImageUrl(p.images[0]) : null
                  return (
                    <tr key={pid} className="border-b border-[#e1e8ed] last:border-b-0 transition-colors hover:bg-[#fafbfc]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-[#f8f9fa] border border-[#e1e8ed] overflow-hidden shrink-0 flex items-center justify-center text-[1.2rem]">
                            {img ? <img src={img} alt={p.name} className="w-full h-full object-cover" /> : <span>📦</span>}
                          </div>
                          <div>
                            <div className="font-semibold text-[0.95rem] text-text-primary mb-1">{p.name}</div>
                            {p.description && (
                              <div className="text-[0.8rem] text-text-secondary leading-[1.4] max-w-[300px] truncate">{p.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="inline-block px-2.5 py-1 bg-[#f8f9fa] border border-[#e1e8ed] rounded-md text-[0.75rem] font-semibold text-text-secondary capitalize">{p.category}</span></td>
                      <td className="px-6 py-4"><span className="text-[0.85rem] text-text-muted">{p.images?.length || 0} image{p.images?.length !== 1 ? 's' : ''}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {p.isCustomizableOnly && <span className="px-2 py-0.5 bg-[#9b59b6]/10 text-[#8e44ad] rounded border border-[#9b59b6]/20 text-[0.65rem] font-bold uppercase tracking-[1px]">Template</span>}
                          {p.isNew && <span className="px-2 py-0.5 bg-[#3498db]/10 text-[#2980b9] rounded border border-[#3498db]/20 text-[0.65rem] font-bold uppercase tracking-[1px]">New</span>}
                          {p.featured && <span className="px-2 py-0.5 bg-[#f1c40f]/10 text-[#f39c12] rounded border border-[#f1c40f]/20 text-[0.65rem] font-bold uppercase tracking-[1px]">Featured</span>}
                          {!p.isNew && !p.featured && !p.isCustomizableOnly && <span className="text-[0.8rem] text-text-muted">–</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[0.82rem] text-text-muted whitespace-nowrap">
                        {new Date(p.createdAt).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-text-secondary hover:bg-[#3498db]/10 hover:text-[#3498db]"
                            onClick={() => setModal(p)}
                            title="Edit"
                          ><Pencil size={15} /></button>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-text-secondary hover:bg-[#e74c3c]/10 hover:text-[#e74c3c]"
                            onClick={() => handleDelete(pid)}
                            title="Delete"
                          ><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={load}
        />
      )}
    </div>
  )
}
