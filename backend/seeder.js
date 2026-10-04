const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Sony A7 III Full Frame Camera',
    description: 'Professional full-frame mirrorless camera with 24.2MP sensor, perfect for photography and videography.',
    category: 'camera',
    type: 'both',
    rentPrice: 50,
    sellPrice: 2500,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    available: true
  },
  {
    name: 'Canon EOS R5 Mirrorless Camera',
    description: 'High-end mirrorless camera with 45MP sensor and 8K video recording capability.',
    category: 'camera',
    type: 'both',
    rentPrice: 75,
    sellPrice: 3800,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500',
    available: true
  },
  {
    name: 'DJI Ronin RS3 Gimbal',
    description: 'Professional 3-axis camera stabilizer for smooth cinematic shots.',
    category: 'accessory',
    type: 'rent',
    rentPrice: 30,
    image: 'https://images.unsplash.com/photo-1588561840943-a4e08a2a5f3a?w=500',
    available: true
  },
  {
    name: 'Sony FE 24-70mm f/2.8 GM Lens',
    description: 'Professional standard zoom lens with constant f/2.8 aperture.',
    category: 'lens',
    type: 'both',
    rentPrice: 40,
    sellPrice: 2200,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=500',
    available: true
  },
  {
    name: 'Godox SL-60W LED Video Light',
    description: 'Professional LED video light with 60W output, perfect for studio and outdoor shoots.',
    category: 'lighting',
    type: 'both',
    rentPrice: 20,
    sellPrice: 180,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    available: true
  },
  {
    name: 'Nikon Z6 II Mirrorless Camera',
    description: 'Versatile full-frame mirrorless camera with dual card slots and 4K video.',
    category: 'camera',
    type: 'both',
    rentPrice: 60,
    sellPrice: 2000,
    image: 'https://images.unsplash.com/photo-1584038877214-5a5b9e9b74d1?w=500',
    available: true
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Sample products added!');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });