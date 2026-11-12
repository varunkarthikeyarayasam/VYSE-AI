import React, { useState, useEffect } from "react";
import { ShoppingBag, Plus, Tag, IndianRupee, User, Search } from "lucide-react";
import { Card, Badge, Button, Modal } from "../../ui";
import { getMarketplaceItems, createMarketplaceItem } from "../../../lib/api/marketplace";
import { useAuth } from "../../../store/authContext";
import type { MarketplaceItem } from "../../../types/database";

export function MarketplaceView() {
  const { profile, user } = useAuth();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("books");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [category]);

  async function loadData() {
    setLoading(true);
    try {
      const data = await getMarketplaceItems(category);
      setItems(data);
    } catch (err) {
      console.error("Error loading marketplace items:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const sellerId = profile?.id || user?.id;
    if (!sellerId) return;

    setSubmitting(true);
    try {
      await createMarketplaceItem({
        sellerId,
        title,
        description,
        price: parseFloat(price) || 0,
        category: itemCategory,
      });
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setPrice("");
      await loadData();
    } catch (err: any) {
      alert(`Listing failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  }

  const categories = ["all", "books", "electronics", "uniform", "furniture", "other"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Student Peer-to-Peer Marketplace</h2>
          <p className="text-xs text-slate-400">
            Verified campus listings for textbooks, hardware, components, and uniforms
          </p>
        </div>
        <Button variant="glow" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4" /> List Item for Sale
        </Button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-full capitalize font-medium transition-all ${
              category === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-[#11141E] text-slate-400 hover:text-slate-200 border border-[#212738]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {loading ? (
        <Card className="text-center py-10 text-slate-400 text-sm">
          Loading marketplace items...
        </Card>
      ) : items.length === 0 ? (
        <Card className="text-center py-12 text-slate-400 text-sm space-y-3">
          <p>No listings found in this category.</p>
          <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(true)}>
            Post the first item
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Card key={item.id} className="space-y-3 flex flex-col justify-between hover:border-[#333D56] transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="glow">{item.category.toUpperCase()}</Badge>
                  <span className="text-base font-bold text-emerald-400 font-mono flex items-center">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {item.price.toFixed(2)}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-100 text-base line-clamp-2">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[#212738] flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {item.seller?.full_name || "Campus Student"}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => alert(`Contact seller via campus email: ${item.seller?.email || "student@demo.campora.edu"}`)}
                >
                  Contact
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Post Item Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Post Item for Sale"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Item Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems 5th Edition Textbook"
              required
              className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Price (INR)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450"
                required
                className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
              >
                <option value="books">Books</option>
                <option value="electronics">Electronics / Hardware</option>
                <option value="uniform">Uniform / Lab Coat</option>
                <option value="furniture">Furniture</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Provide condition, edition, or details..."
              required
              className="w-full bg-[#090B10] border border-[#252E46] text-slate-200 text-sm rounded-lg p-2.5 outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-[#212738]">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="glow" loading={submitting}>
              List Item
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}