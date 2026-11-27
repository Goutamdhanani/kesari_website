import React, { useEffect, useMemo, useState } from 'react';
import { Coffee, Plus, RotateCcw, Save, Search, Trash2 } from 'lucide-react';
import {
  DEFAULT_CAFE_MENU,
  MENU_CATEGORIES,
  MenuCategoryId,
  MenuItem,
} from '../data/cafeMenu';

export const CafeAdminTab: React.FC = () => {
  const [items, setItems] = useState<MenuItem[]>(DEFAULT_CAFE_MENU);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState<'all' | MenuCategoryId>('all');

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('120');
  const [newCategoryId, setNewCategoryId] = useState<MenuCategoryId>('mains');
  const [newBadge, setNewBadge] = useState('');

  useEffect(() => {
    fetch('/api/cafe-menu')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
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

  const getAuthHeaders = () => {
    const token = window.sessionStorage.getItem('kesari_admin_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const showNotice = (msg: string) => {
    setSavedMsg(msg);
    setTimeout(() => setSavedMsg(''), 3000);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newName.trim();
    const price = Number(newPrice);
    if (!cleanName || !Number.isFinite(price) || price <= 0) return;

    const cat = MENU_CATEGORIES.find((c) => c.id === newCategoryId);
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cafe-menu', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: cleanName,
          category: cat?.shortLabel || 'Mains',
          categoryId: newCategoryId,
          price,
          badge: newBadge.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok && data?.item) {
        setItems((prev) => [data.item, ...prev]);
        setNewName('');
        setNewBadge('');
        showNotice(`Added "${cleanName}" to Café menu!`);
      } else {
        showNotice(data?.error || 'Failed to add item');
      }
    } catch {
      showNotice('Network error adding item');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveItemPrice = async (item: MenuItem) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cafe-menu/${encodeURIComponent(item.id)}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(item),
      });
      if (res.ok) {
        showNotice(`Updated "${item.name}" (₹${item.price})`);
      } else {
        showNotice('Failed to update item');
      }
    } catch {
      showNotice('Network error updating item');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/cafe-menu/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setItems((prev) => prev.filter((it) => it.id !== id));
        showNotice('Item removed from Café menu!');
      } else {
        showNotice('Failed to remove item');
      }
    } catch {
      showNotice('Network error removing item');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefault = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/cafe-menu/reset', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data?.items)) {
        setItems(data.items);
        showNotice('Reset to default 61-item Café menu!');
      }
    } catch {
      showNotice('Network error resetting menu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section aria-label="Café Menu Manager" className="space-y-4">
      <form
        onSubmit={handleAddItem}
        className="surface-charcoal rounded-[26px] p-5 space-y-4"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
              CAFÉ MENU MANAGER (REST API)
            </p>
            <h3 className="text-base font-bold text-white flex items-center gap-2 mt-0.5">
              <Coffee className="w-4 h-4 text-[#D8FF48]" />
              <span>Add, Edit Price, or Remove Café Items ({items.length} active)</span>
            </h3>
          </div>
          <button
            type="button"
            onClick={() => void handleResetDefault()}
            disabled={saving}
            className="h-9 px-3.5 rounded-full bg-white/8 hover:bg-white/15 border border-white/10 text-xs font-medium text-white/80 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Default</span>
          </button>
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
            className="sm:col-span-1 h-10 rounded-xl bg-[#D8FF48] text-black text-xs font-bold inline-flex items-center justify-center gap-1 hover:bg-[#C8EE38]"
          >
            <Plus className="w-4 h-4" />
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {savedMsg && <p className="text-xs font-semibold text-[#D8FF48]">{savedMsg}</p>}
      </form>

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
                className="flex items-center justify-between gap-2.5 p-3 rounded-2xl bg-black/35 border border-white/10"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">{item.name}</div>
                  <div className="text-[10.5px] text-white/50 truncate">
                    {item.category}
                    {item.badge ? ` · ${item.badge}` : ''}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2 h-8">
                    <span className="text-[11px] text-white/45 mr-1">₹</span>
                    <input
                      type="number"
                      min="1"
                      value={item.price}
                      onChange={(e) => {
                        const price = Number(e.target.value);
                        if (!Number.isFinite(price) || price < 0) return;
                        setItems((prev) =>
                          prev.map((it) => (it.id === item.id ? { ...it, price } : it))
                        );
                      }}
                      className="w-12 bg-transparent text-xs font-mono font-bold text-white focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSaveItemPrice(item)}
                    aria-label={`Save ${item.name}`}
                    className="w-8 h-8 rounded-lg bg-white/8 hover:bg-[#D8FF48] text-white/75 hover:text-black flex items-center justify-center transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteItem(item.id)}
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
