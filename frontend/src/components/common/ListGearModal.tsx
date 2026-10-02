import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { GearCategory, Product } from '../../types';
import { useEquipment } from '../../context/EquipmentContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORY_CAMERAS_IMG, CATEGORY_LENSES_IMG, CATEGORY_LIGHTING_IMG, CATEGORY_STABILIZERS_IMG } from '../../data/mockData';
import { Camera, DollarSign, UploadCloud, CheckCircle2 } from 'lucide-react';

interface ListGearModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ListGearModal: React.FC<ListGearModalProps> = ({ isOpen, onClose }) => {
  const { addProduct } = useEquipment();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('Sony');
  const [category, setCategory] = useState<GearCategory>('Cameras');
  const [rentPrice, setRentPrice] = useState('180');
  const [buyPrice, setBuyPrice] = useState('4500');
  const [allowRent, setAllowRent] = useState(true);
  const [allowBuy, setAllowBuy] = useState(true);
  const [condition, setCondition] = useState<Product['condition']>('Like New (Mint)');
  const [location, setLocation] = useState('Los Angeles / Brooklyn Hub');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Pick appropriate generated category image
      let defaultImage = CATEGORY_CAMERAS_IMG;
      if (category === 'Lenses') defaultImage = CATEGORY_LENSES_IMG;
      if (category === 'Lighting') defaultImage = CATEGORY_LIGHTING_IMG;
      if (category === 'Audio' || category === 'Stabilizers') defaultImage = CATEGORY_STABILIZERS_IMG;

      addProduct({
        name,
        brand,
        category,
        tagline: tagline || `Professional ${brand} ${category} package in ${condition} condition`,
        description: description || `Verified cinematography gear listed by ${user?.name || 'Partner'}. Complete with rugged hard case, accessories, and clean sensor check.`,
        images: [defaultImage],
        rentPricePerDay: Number(rentPrice) || 150,
        buyPrice: Number(buyPrice) || 3500,
        rating: 5.0,
        reviewCount: 1,
        availableForRent: allowRent,
        availableForSale: allowBuy,
        status: 'Available',
        condition,
        location,
        depositRequired: Math.round(Number(rentPrice) * 3) || 450,
        specs: [
          { label: 'Category', value: category },
          { label: 'Brand', value: brand },
          { label: 'Condition Grade', value: condition },
          { label: 'Dispatch Location', value: location }
        ],
        includedInCase: [
          `${name} Main Unit`,
          'Heavy-Duty Flight Case',
          'Certified Power Kit & Fast Charger'
        ],
        owner: {
          id: user?.id || 'usr-partner',
          name: user?.name || 'Verified Creator',
          badge: 'Verified Gear Partner',
          rating: 5.0
        }
      });

      setLoading(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        setName('');
        setTagline('');
        setDescription('');
      }, 1800);
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="List Equipment on CineVault"
      subtitle="Earn rental revenue or sell your cinema gear with full insurance coverage"
      maxWidth="2xl"
    >
      {submitted ? (
        <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Equipment Listed Successfully!</h3>
          <p className="text-sm text-gray-400 max-w-md">
            Your listing is live on CineVault. Renters can now book it with instant ID and insurance verification.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Equipment Title / Model *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sony FX3 Cinema Line Camera"
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GearCategory)}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Cameras">Cameras</option>
                <option value="Lenses">Lenses</option>
                <option value="Lighting">Lighting</option>
                <option value="Stabilizers">Stabilizers</option>
                <option value="Audio">Audio</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Sony, ARRI, RED"
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Daily Rent Fee ($) *
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  required
                  min="10"
                  value={rentPrice}
                  onChange={(e) => setRentPrice(e.target.value)}
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Outright Buy Price ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="number"
                  min="0"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(e.target.value)}
                  className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-white font-mono"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Condition Grade
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as Product['condition'])}
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Brand New">Brand New</option>
                <option value="Like New (Mint)">Like New (Mint)</option>
                <option value="Production Certified">Production Certified</option>
                <option value="Good">Good Working Condition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                Hub / Dispatch City
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Los Angeles / NYC / Chicago"
                className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Key Highlights / Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Complete cage rig with 4x V-mount batteries & monitor"
              className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Detailed Description & Included Accessories
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="List camera firmware, sensor condition, included cables, and flight cases..."
              className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Availability Checkboxes */}
          <div className="flex gap-6 py-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={allowRent}
                onChange={(e) => setAllowRent(e.target.checked)}
                className="rounded border-gray-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-gray-900"
              />
              <span>Available for Daily/Weekly Rental</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={allowBuy}
                onChange={(e) => setAllowBuy(e.target.checked)}
                className="rounded border-gray-700 text-amber-500 focus:ring-amber-500 w-4 h-4 bg-gray-900"
              />
              <span>Open to Outright Purchase</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" variant="primary" size="md" isLoading={loading}>
              Publish Gear to Marketplace
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
