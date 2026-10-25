const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Sony A7 III Full Frame Mirrorless Camera',
    description: 'Professional full-frame mirrorless camera with 24.2MP BSI-CMOS sensor. Perfect for photography and videography with 4K video recording, 5-axis image stabilization, and 693 phase-detection AF points.',
    category: 'camera',
    type: 'both',
    rentPrice: 50,
    sellPrice: 2500,
    image: 'https://images.unsplash.com/photo-1621520291095-aa6c7137491a?w=800&q=80',
    available: true
  },
  {
    name: 'Canon EOS R5 Mirrorless Camera',
    description: 'High-end mirrorless camera with 45MP full-frame sensor, 8K RAW video recording, and advanced Dual Pixel CMOS AF II. Industry leading image stabilization up to 8 stops.',
    category: 'camera',
    type: 'both',
    rentPrice: 75,
    sellPrice: 3800,
    image: 'https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80',
    available: true
  },
  {
    name: 'Nikon Z6 II Mirrorless Camera',
    description: 'Versatile full-frame mirrorless camera with dual EXPEED 6 processors, 24.5MP sensor, 4K UHD video and dual card slots for professional workflow.',
    category: 'camera',
    type: 'both',
    rentPrice: 60,
    sellPrice: 2000,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
    available: true
  },
  {
    name: 'Sony FE 24-70mm f/2.8 GM Lens',
    description: 'Professional standard zoom G Master lens with constant f/2.8 maximum aperture. Features two XA elements and one ED glass element for outstanding resolution and beautiful bokeh.',
    category: 'lens',
    type: 'both',
    rentPrice: 40,
    sellPrice: 2200,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=80',
    available: true
  },
  {
    name: 'Canon RF 70-200mm f/2.8L IS USM',
    description: 'Telephoto zoom lens with f/2.8 constant aperture and up to 5 stops of Image Stabilization. Perfect for sports, wildlife and portrait photography.',
    category: 'lens',
    type: 'both',
    rentPrice: 55,
    sellPrice: 2700,
    image: 'https://images.unsplash.com/photo-1606986628270-12a4b9c9066a?w=800&q=80',
    available: true
  },
  {
    name: 'Sigma 35mm f/1.4 DG HSM Art Lens',
    description: 'Award-winning wide-angle prime lens with exceptional optical performance. Features ultra-wide f/1.4 aperture for stunning low-light photography and beautiful depth of field.',
    category: 'lens',
    type: 'both',
    rentPrice: 25,
    sellPrice: 900,
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
    available: true
  },
  {
    name: 'Godox SL-60W LED Video Light',
    description: 'Professional 60W LED video light with 5600K color temperature. Features wireless control, built-in cooling system and compatible with Bowens mount modifiers.',
    category: 'lighting',
    type: 'both',
    rentPrice: 20,
    sellPrice: 180,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    available: true
  },
  {
    name: 'Aputure 120D II LED Light',
    description: 'Professional-grade 135W daylight LED light with CRI/TLCI 96+ rating. Features wireless DMX control, built-in Anton Bauer battery plate and impressive 28,000 lux output.',
    category: 'lighting',
    type: 'rent',
    rentPrice: 35,
    image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
    available: true
  },
  {
    name: 'DJI Ronin RS3 Pro Gimbal',
    description: 'Professional 3-axis camera stabilizer supporting up to 4.5kg payload. Features automated axis locks, 1.8" OLED touchscreen, and Bluetooth shutter control for perfect cinematic shots.',
    category: 'accessory',
    type: 'rent',
    rentPrice: 30,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    available: true
  },
  {
    name: 'Rode VideoMic Pro+ Microphone',
    description: 'Professional on-camera directional microphone with integrated Rycote Lyre shock mounting. Features auto power function, high-pass filter and improved signal to noise ratio.',
    category: 'accessory',
    type: 'both',
    rentPrice: 15,
    sellPrice: 350,
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
    available: true
  },
  {
    name: 'Manfrotto 190X Tripod',
    description: 'Professional aluminum tripod with 4-section legs and center column. Supports up to 7kg payload with maximum height of 163cm. Includes ball head with quick release plate.',
    category: 'accessory',
    type: 'both',
    rentPrice: 10,
    sellPrice: 250,
    image: 'https://images.unsplash.com/photo-1617628488490-e9c4d34d4f17?w=800&q=80',
    available: true
  },
  {
    name: 'DJI Mavic 3 Pro Drone',
    description: 'Professional drone with Hasselblad camera, 4/3 CMOS sensor and omnidirectional obstacle sensing. Features 43-minute flight time, 15km video transmission and 4K/60fps recording.',
    category: 'camera',
    type: 'rent',
    rentPrice: 120,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    available: true
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products added successfully!`);
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });