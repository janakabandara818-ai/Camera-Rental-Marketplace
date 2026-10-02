export type GearCategory = 'Cameras' | 'Lenses' | 'Lighting' | 'Audio' | 'Stabilizers' | 'Accessories';

export type AvailabilityStatus = 'Available' | 'On Rental' | 'Reserved' | 'Maintenance';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: GearCategory;
  tagline: string;
  description: string;
  images: string[];
  rentPricePerDay: number;
  buyPrice: number;
  rating: number;
  reviewCount: number;
  availableForRent: boolean;
  availableForSale: boolean;
  status: AvailabilityStatus;
  condition: 'Brand New' | 'Like New (Mint)' | 'Production Certified' | 'Good';
  location: string;
  specs: ProductSpec[];
  includedInCase: string[];
  depositRequired: number;
  featured?: boolean;
  reviews?: Review[];
  owner?: {
    id: string;
    name: string;
    badge: string;
    rating: number;
  };
}

export type OrderType = 'rent' | 'buy';

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  type: OrderType;
  quantity: number;
  startDate?: string;
  endDate?: string;
  rentalDays?: number;
  includeDamageProtection?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'creator' | 'vendor';
  avatar?: string;
  phone?: string;
  company?: string;
  verified: boolean;
  memberSince: string;
  credits: number;
}

export interface RentalBooking {
  id: string;
  product: Product;
  startDate: string;
  endDate: string;
  totalDays: number;
  totalAmount: number;
  depositAmount: number;
  status: 'Active' | 'Upcoming' | 'Completed' | 'Returned';
  trackingNumber: string;
  deliveryType: 'Courier Delivery' | 'Studio Pickup';
}

export interface PurchaseOrder {
  id: string;
  product: Product;
  orderDate: string;
  quantity: number;
  totalAmount: number;
  status: 'Processing' | 'Dispatched' | 'Delivered';
  trackingNumber: string;
  shippingAddress: string;
}
