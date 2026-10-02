import React, { useState } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { HowItWorks } from '../components/home/HowItWorks';
import { FeaturedEquipment } from '../components/home/FeaturedEquipment';
import { Testimonials } from '../components/home/Testimonials';
import { Newsletter } from '../components/home/Newsletter';
import { ListGearModal } from '../components/common/ListGearModal';
import { useEquipment } from '../context/EquipmentContext';

export const HomePage: React.FC = () => {
  const { products } = useEquipment();
  const [listGearModalOpen, setListGearModalOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection onOpenListGearModal={() => setListGearModalOpen(true)} />
      <CategoryGrid />
      <FeaturedEquipment products={products} />
      <HowItWorks />
      <Testimonials />
      <Newsletter />

      <ListGearModal
        isOpen={listGearModalOpen}
        onClose={() => setListGearModalOpen(false)}
      />
    </div>
  );
};
