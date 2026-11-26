import React, { useEffect, useMemo, useState } from 'react';
import { Coffee, Plus, RotateCcw, Save, Search, Trash2 } from 'lucide-react';
import { ALL_ITEMS, MENU_CATEGORIES, MenuCategoryId, MenuItem } from './FoodSection';

export const CafeAdminTab: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>(ALL_ITEMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | MenuCategoryId>('all');

  // New item form
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('120');
  const [newCategoryId, setNewCategoryId] = useState<MenuCategoryId>('mains');
  const [newBadge, setNewBadge] = useState('');

  useEffect(() => {
    fetch('/api/content')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings?.cafeMenu && Array.isArray(data.settings.cafeMenu) && data.settings.cafeMenu.length > 0) {
          setItems(data.settings.cafeMenu);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (catFilter !== 'all' && item.categoryId !== catFilter) return false;
      if (!q) return true;
      return item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
    });
  }, [items, search, catFilter]);

  const persistMenu = async (nextItems: MenuItem[], msg = 'Café menu saved & live!') => {
    setSaving(true);
    setSavedMsg('');
    try {
      const token = window.sessionStorage.getItem('kesari_admin_token');
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ cafeMenu: nextItems }),
      });
      if (res.ok) {
        setSavedMsg(msg);
        setTimeout(() => setSavedMsg(''), 3000);
      } else {
        setSavedMsg('Failed to save Café menu');
      }
    } catch {
      setSavedMsg('Network error saving Café menu');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    const price = Number(newPrice);
    if (!cleanName || !Number.isFinite(price) || price <= 0) return;

    const cat = MENU_CATEGORIES.find((c) => c.id === newCategoryId);
    const created: MenuItem = {
      id: `cafe-${Date.now()}`,
      name: cleanName,
      category: cat?.shortLabel || 'Mains',
      categoryId: newCategoryId,
      price,
      ...(newBadge.trim() ? { badge: newBadge.trim() } : {}),
    };

    const next = [created, ...items];
    setItems(next);
    setNewName('');
    setNewBadge('');
    void persistMenu(next, `Added "${cleanName}" & saved!`);
  };

  const handleUpdatePrice = (id: string, priceStr: string) => {
    const price = Number(priceStr);
    if (!Number.isFinite(price) || price < 0) return;
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, price } : it)));
  };

  const handleDeleteItem = (id: string) => {
    const next = items.filter((it) => it.id !== id);
    setItems(next);
    void persistMenu(next, 'Item removed & saved!');
  };

  const handleResetDefault = () => {
    setItems(ALL_ITEMS);
    void persistMenu(ALL_ITEMS, 'Reset to default 61-item Café menu!');
  };

  return (
    <section aria-label="Café Menu Manager" className="space-y-4">
      {/* Add Item Form */}
      <form
        onSubmit={handleAddItem}
        className="surface-charcoal rounded-[26px] p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
              CAFÉ MENU MANAGER
            </p>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Coffee className="w-4 h-4 text-[#D8FF48]" />
              <span>Add, Edit Price, or Remove Café Items ({items.length} active)</span>
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefault}
              disabled={saving}
              className="h-9 px-3.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/80 inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
            <button
              type="button"
              onClick={() => void persistMenu(items)}
              disabled={saving}
              className="h-9 px-4 rounded-full bg-[#D8FF48] hover:bg-[#C8EE38] text-[#07070A] text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Menu'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Item name (e.g. Cold Coffee)"
            className="sm:col-span-4 h-10 px-3.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D8FF48]"
          />
          <select
            value={newCategoryId}
            onChange={(e) => setNewCategoryId(e.target.value as MenuCategoryId)}
            className="sm:col-span-3 h-10 px-3 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D8FF48]"
          >
            {MENU_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            required
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            placeholder="Price ₹"
            className="sm:col-span-2 h-10 px-3 rounded-xl bg-black/45 border border-white/15 text-xs text-white font-mono focus:outline-none focus:border-[#D8FF48]"
          />
          <input
            type="text"
            value={newBadge}
            onChange={(e) => setNewBadge(e.target.value)}
            placeholder="Badge (optional)"
            className="sm:col-span-2 h-10 px-3 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D8FF48]"
          />
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-1 h-10 rounded-xl bg-white text-black text-xs font-bold inline-flex items-center justify-center gap-1 hover:bg-white/90"
          >
            <Plus className="w-4 h-4" />
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {savedMsg && <p className="text-xs font-semibold text-[#D8FF48]">{savedMsg}</p>}
      </form>

      {/* Search & Category Filter */}
      <div className="surface-charcoal rounded-[26px] p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search café items..."
              className="w-full h-10 pl-10 pr-4 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D8FF48]"
            />
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value as 'all' | MenuCategoryId)}
            className="h-10 px-3.5 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-[#D8FF48]"
          >
            <option value="all">All Categories ({items.length})</option>
            {MENU_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-xs text-white/50 py-4 text-center">Loading menu...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-black/35 border border-white/10"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                  <div className="text-[10.5px] text-white/50 truncate">
                    {item.category}
                    {item.badge ? ` · ${item.badge}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2 h-8">
                    <span className="text-[11px] text-white/45 mr-1">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={item.price}
                      onChange={(e) => handleUpdatePrice(item.id, e.target.value)}
                      className="w-14 bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(item.id)}
                    aria-label={`Remove ${item.name}`}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-rose-500/20 text-white/55 hover:text-rose-300 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
