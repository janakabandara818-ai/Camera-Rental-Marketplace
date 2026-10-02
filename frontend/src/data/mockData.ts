import { Product, User, RentalBooking, PurchaseOrder } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_cinematic_camera_rig_1790871007617.jpg';
export const CATEGORY_CAMERAS_IMG = '/src/assets/images/cat_cinema_cameras_1790871019087.jpg';
export const CATEGORY_LENSES_IMG = '/src/assets/images/cat_cine_lenses_1790871036799.jpg';
export const CATEGORY_LIGHTING_IMG = '/src/assets/images/cat_studio_lighting_1790871048172.jpg';
export const CATEGORY_STABILIZERS_IMG = '/src/assets/images/cat_audio_stabilizers_1790871059905.jpg';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-arri-alexa-mini-lf',
    name: 'ARRI Alexa Mini LF Production Package',
    brand: 'ARRI',
    category: 'Cameras',
    tagline: 'Large-Format 4.5K cinema sensor with legendary ARRI color science and 16 stops dynamic range',
    description: 'The industry-standard large-format camera combining the compact size and low weight of the popular Alexa Mini with the large-format ALEXA LF sensor. Features built-in motorized full-spectrum ND filters, ProRes & ARRIRAW internal recording up to 90fps, and native LPL & PL mount compatibility.',
    images: [
      CATEGORY_CAMERAS_IMG,
      HERO_IMAGE,
      CATEGORY_LENSES_IMG
    ],
    rentPricePerDay: 850,
    buyPrice: 58000,
    rating: 4.98,
    reviewCount: 42,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Production Certified',
    location: 'Los Angeles / Brooklyn Studios',
    depositRequired: 2500,
    featured: true,
    specs: [
      { label: 'Sensor Size', value: 'Large Format 36.70 x 25.54 mm' },
      { label: 'Resolution', value: '4448 x 3096 (4.5K LF)' },
      { label: 'Dynamic Range', value: '16+ Stops EI 800 Native' },
      { label: 'Lens Mount', value: 'LPL with PL-to-LPL Adapter' },
      { label: 'Internal NDs', value: 'Motorized 0.6, 1.2, 1.8' },
      { label: 'Recording Formats', value: 'ARRIRAW & Apple ProRes 4444 XQ' },
      { label: 'Power Input', value: 'V-Mount or Gold Mount Plates' },
      { label: 'Weight', value: '2.6 kg / 5.7 lbs (body only)' }
    ],
    includedInCase: [
      'ARRI Alexa Mini LF Brain with MVF-2 Viewfinder',
      '3x Codex Compact 1TB Media Drives + USB-C Reader',
      'Wooden Camera Master Accessory Rigging & Baseplate',
      'Bebob Micro V-Mount Power Distribution Bracket',
      'Pelican 1510 TrekPak Flight Case'
    ],
    reviews: [
      {
        id: 'rev-1',
        author: 'Marcus Vance',
        role: 'Commercial Cinematographer',
        rating: 5,
        date: '2026-09-14',
        comment: 'Top-tier package. Sensor calibration was flawless and the camera came with updated SUP firmware. Dispatched on time for our Nike shoot.'
      },
      {
        id: 'rev-2',
        author: 'Elena Rostova',
        role: 'DP / Indie Director',
        rating: 5,
        date: '2026-08-28',
        comment: 'Unbeatable skin tones. Renting with the included Codex reader made on-set DIT transfers a breeze.'
      }
    ],
    owner: {
      id: 'usr-vault-la',
      name: 'Apex Cinema Rentals LA',
      badge: 'Certified Gear Partner',
      rating: 4.99
    }
  },
  {
    id: 'prod-sony-fx6-cinema',
    name: 'Sony FX6 Full-Frame Cinema Line Camera',
    brand: 'Sony',
    category: 'Cameras',
    tagline: 'Lightweight full-frame 4K capture with Dual Base ISO (800 / 12,800) and Fast Hybrid AF',
    description: 'Designed for solo shooters and documentary cinematography, the Sony FX6 packs a high-sensitivity 10.2MP full-frame backside-illuminated sensor, electronically variable ND system, 4K 120p slow motion, and real-time eye tracking autofocus into an ultra-portable 890g body.',
    images: [
      CATEGORY_CAMERAS_IMG,
      CATEGORY_STABILIZERS_IMG
    ],
    rentPricePerDay: 195,
    buyPrice: 5998,
    rating: 4.92,
    reviewCount: 68,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Like New (Mint)',
    location: 'Atlanta / Chicago Hub',
    depositRequired: 600,
    featured: true,
    specs: [
      { label: 'Sensor', value: '35mm Full-Frame 10.2MP Exmor R CMOS' },
      { label: 'Base ISO', value: 'Dual Base ISO 800 & 12,800' },
      { label: 'Max Frame Rates', value: '4K DCI up to 120fps, FHD 240fps' },
      { label: 'ND Filter', value: 'Electronic Variable ND 1/4 to 1/128' },
      { label: 'Color Profiles', value: 'S-Cinetone, S-Log3, HLG' },
      { label: 'Mount', value: 'Sony E-Mount' }
    ],
    includedInCase: [
      'Sony FX6 Body + Smart Handle + 3.5" LCD Viewfinder',
      '4x BP-U60 High Capacity Batteries + Dual Fast Charger',
      '2x Sony Tough 160GB CFexpress Type A + Card Reader',
      'Tilta Cage Rig with V-mount Battery Plate',
      'Custom Cut Nanuk Hard Case'
    ],
    reviews: [
      {
        id: 'rev-3',
        author: 'Darnell Hayes',
        role: 'Documentary Filmmaker',
        rating: 5,
        date: '2026-09-20',
        comment: 'The low light capability at ISO 12,800 is miraculous. Rented for a 4-day outdoor night shoot and it delivered clean shadows without noise.'
      }
    ],
    owner: {
      id: 'usr-atlanta-cam',
      name: 'SouthCoast Gear Hub',
      badge: 'Gold Verified Partner',
      rating: 4.95
    }
  },
  {
    id: 'prod-red-v-raptor-8k',
    name: 'RED V-RAPTOR 8K VV Multi-Format Camera',
    brand: 'RED',
    category: 'Cameras',
    tagline: 'Flagship DSMC3 multi-format 8K VistaVision sensor capturing 8K 120fps with 17+ stops dynamic range',
    description: 'The most powerful cinema system from RED Digital Cinema. The revolutionary multi-format 35.4 Megapixel sensor allows shooting in 8K VistaVision, 6K Super 35, or 4K with extreme high-frame rates and internal 16-bit REDCODE RAW recording onto CFexpress Type B media.',
    images: [
      CATEGORY_CAMERAS_IMG,
      HERO_IMAGE
    ],
    rentPricePerDay: 620,
    buyPrice: 24500,
    rating: 4.94,
    reviewCount: 31,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Production Certified',
    location: 'Los Angeles / San Francisco',
    depositRequired: 2000,
    featured: true,
    specs: [
      { label: 'Sensor Format', value: 'VistaVision 35.4MP CMOS (40.96 x 21.60 mm)' },
      { label: 'Max Resolution', value: '8192 x 4320 at 120 fps' },
      { label: 'Dynamic Range', value: '17+ Stops' },
      { label: 'RAW Format', value: '16-bit REDCODE RAW (HQ, MQ, LQ)' },
      { label: 'Mount', value: 'Integrated RF Mount (Adaptable to PL & EF)' },
      { label: 'Audio', value: '2x Locking 5-Pin XLR with 48V Phantom' }
    ],
    includedInCase: [
      'RED V-RAPTOR 8K Brain',
      'RED Touch 7.0" High-Bright Monitor',
      '2x RED PRO 2TB CFexpress Type B Cards + Reader',
      'Tilta V-Mount Production Cage with Side Ribs',
      'Wooden Camera A-Box for XLR Audio',
      'Hard Flight Case with TSA Locks'
    ],
    reviews: [
      {
        id: 'rev-4',
        author: 'Soren Lindqvist',
        role: 'VFX Supervisor',
        rating: 5,
        date: '2026-09-08',
        comment: '8K 120fps VistaVision gave us crystal-clear plates for heavy CG tracking. Pristine sensor condition.'
      }
    ],
    owner: {
      id: 'usr-vault-la',
      name: 'Apex Cinema Rentals LA',
      badge: 'Certified Gear Partner',
      rating: 4.99
    }
  },
  {
    id: 'prod-cooke-s4i-prime-set',
    name: 'Cooke S4/i Cine Prime 5-Lens Set (PL Mount)',
    brand: 'Cooke',
    category: 'Lenses',
    tagline: 'Timeless "Cooke Look" with organic warmth, gentle roll-off, and i/Technology lens metadata capture',
    description: 'Renowned worldwide for cinematic portraits and dramatic films, this matched 5-lens prime set (18mm, 25mm, 35mm, 50mm, 75mm T2.0) delivers velvety skin tones, subtle flare suppression, calibrated 300-degree focus rotation, and electronic metadata communication to modern cinema cameras.',
    images: [
      CATEGORY_LENSES_IMG,
      HERO_IMAGE
    ],
    rentPricePerDay: 580,
    buyPrice: 62000,
    rating: 4.99,
    reviewCount: 29,
    availableForRent: true,
    availableForSale: false,
    status: 'Available',
    condition: 'Production Certified',
    location: 'New York / Brooklyn Cine',
    depositRequired: 2200,
    featured: true,
    specs: [
      { label: 'Focal Lengths', value: '18mm, 25mm, 35mm, 50mm, 75mm' },
      { label: 'Aperture Range', value: 'T2.0 to T22 across all lenses' },
      { label: 'Mount', value: 'Arri PL Mount' },
      { label: 'Focus Rotation', value: '300 Degrees Geared 0.8 Mod' },
      { label: 'Front Diameter', value: '110mm Uniform Outer Diameter' },
      { label: 'Metadata', value: '/i Technology Protocol' }
    ],
    includedInCase: [
      '5x Matched Cooke S4/i Primes with front/rear caps',
      'Pelican Storm 5-Lens Custom Foam Case',
      '110mm to 95mm and 80mm step rings',
      'Lens cloth & calibration certificate'
    ],
    reviews: [
      {
        id: 'rev-5',
        author: 'Chloe Dupont',
        role: 'Director of Photography',
        rating: 5,
        date: '2026-09-18',
        comment: 'Nothing beats the Cooke Look for narrative features. The focus puller loved the clear 300-degree marks.'
      }
    ],
    owner: {
      id: 'usr-ny-cine',
      name: 'Gotham Cine Vault',
      badge: 'Premier Vendor',
      rating: 5.0
    }
  },
  {
    id: 'prod-sony-gm-trinity',
    name: 'Sony G Master Cine Zoom Trio (16-35, 24-70, 70-200 f2.8 GM II)',
    brand: 'Sony',
    category: 'Lenses',
    tagline: 'The holy trinity of fast f/2.8 zoom lenses with XD linear focus motors and zero focus breathing',
    description: 'The second generation of Sony G Master zoom lenses: FE 16-35mm F2.8 GM II, FE 24-70mm F2.8 GM II, and FE 70-200mm F2.8 GM OSS II. Up to 22% lighter than predecessors with unmatched edge-to-edge sharpness, circular 11-blade aperture, and de-clickable manual aperture rings.',
    images: [
      CATEGORY_LENSES_IMG,
      CATEGORY_CAMERAS_IMG
    ],
    rentPricePerDay: 145,
    buyPrice: 6890,
    rating: 4.88,
    reviewCount: 54,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Like New (Mint)',
    location: 'Chicago / Austin',
    depositRequired: 450,
    featured: false,
    specs: [
      { label: 'Focal Coverage', value: '16mm to 200mm continuous f/2.8' },
      { label: 'Max Aperture', value: 'Constant f/2.8' },
      { label: 'Autofocus', value: '4x XD Linear Motors per lens' },
      { label: 'Aperture Ring', value: 'De-clickable Linear Click Switch' },
      { label: 'Stabilization', value: 'Optical SteadyShot on 70-200mm' },
      { label: 'Filter Threads', value: '82mm (16-35 & 24-70), 77mm (70-200)' }
    ],
    includedInCase: [
      'Sony 16-35mm f/2.8 GM II + Hood',
      'Sony 24-70mm f/2.8 GM II + Hood',
      'Sony 70-200mm f/2.8 GM OSS II + Tripod Foot',
      '3x B+W Polarizing MRC Nano Filters',
      'Tenba Cineluxe Rigid Doctor Bag'
    ],
    reviews: [
      {
        id: 'rev-6',
        author: 'Julian Ramos',
        role: 'Commercial DP',
        rating: 5,
        date: '2026-08-30',
        comment: 'Lightweight enough for all-day handheld work on the FX6. Zero breathing on the 24-70 II.'
      }
    ],
    owner: {
      id: 'usr-atlanta-cam',
      name: 'SouthCoast Gear Hub',
      badge: 'Gold Verified Partner',
      rating: 4.95
    }
  },
  {
    id: 'prod-aputure-600d-pro',
    name: 'Aputure LS 600d Pro Daylight LED Kit',
    brand: 'Aputure',
    category: 'Lighting',
    tagline: 'Weather-resistant 600W daylight point-source LED punching 29,300+ lux at 3m with F10 Fresnel',
    description: 'Engineered for punishing production environments with an IP54 dust and rain resistant design. Powered by standard AC or dual V-Mount batteries, the 600d Pro delivers continuous 5600K daylight with CRI/TLCI $\ge 96$, Sidus Link wireless Bluetooth app control, and wireless DMX.',
    images: [
      CATEGORY_LIGHTING_IMG,
      HERO_IMAGE
    ],
    rentPricePerDay: 135,
    buyPrice: 1890,
    rating: 4.95,
    reviewCount: 77,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Production Certified',
    location: 'Nationwide Courier / LA / NYC / Chicago',
    depositRequired: 300,
    featured: true,
    specs: [
      { label: 'Color Temperature', value: '5600K Daylight Balanced ($\pm 200K$)' },
      { label: 'Max Output', value: '720W Max Power Consumption' },
      { label: 'Output Lux', value: '29,300 lux @ 3m with F10 Fresnel' },
      { label: 'Weather Rating', value: 'IP54 Dust & Water Resistant' },
      { label: 'Control Protocols', value: 'Sidus Link App, 2.4GHz, 5-Pin DMX, CRMX' },
      { label: 'Mount', value: 'Bowens Mount' }
    ],
    includedInCase: [
      'Aputure LS 600d Pro Lamp Head & Protection Cover',
      'Control Box with Dual V-Mount Battery Plate',
      'Hyper Reflector + F10 Fresnel Modifier',
      'Heavy-Duty Rolling Padded Flight Case',
      'Heavy-Duty Baby Pin C-Stand Clamp'
    ],
    reviews: [
      {
        id: 'rev-7',
        author: 'Sarah Lin',
        role: 'Gaffer',
        rating: 5,
        date: '2026-09-22',
        comment: 'Super bright key light. Cut right through afternoon sunlight through double-diffused diffusion frame. Excellent condition.'
      }
    ],
    owner: {
      id: 'usr-ny-cine',
      name: 'Gotham Cine Vault',
      badge: 'Premier Vendor',
      rating: 5.0
    }
  },
  {
    id: 'prod-astera-titan-8-kit',
    name: 'Astera Titan Tube 8-Light Wireless Kit with PowerBox',
    brand: 'Astera',
    category: 'Lighting',
    tagline: '8x 1-meter wireless pixel-controllable RGBMA tubes with internal battery and AsteraApp control',
    description: 'The gold standard in LED film tube lighting. Titan Tubes feature 16 individually controllable pixels, ultra-high color rendering (TLCI 96+ / CRI 96+), tunable white from 1750K to 20,000K, and 20 hours runtime on internal lithium-ion batteries. Includes charging PowerBox in a hard flight case.',
    images: [
      CATEGORY_LIGHTING_IMG,
      CATEGORY_CAMERAS_IMG
    ],
    rentPricePerDay: 280,
    buyPrice: 4950,
    rating: 4.97,
    reviewCount: 45,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Like New (Mint)',
    location: 'Los Angeles / Miami',
    depositRequired: 800,
    featured: false,
    specs: [
      { label: 'Color Engine', value: 'RGBMA (Red, Green, Blue, Mint, Amber)' },
      { label: 'Pixel Count', value: '16 Pixels per Tube' },
      { label: 'Battery Runtime', value: 'Up to 20 Hours Seamless Power' },
      { label: 'Wireless Control', value: 'CRMX Wireless DMX & AsteraApp RF' },
      { label: 'Waterproof Rating', value: 'IP65 Wet Location Rated' }
    ],
    includedInCase: [
      '8x Astera Titan Tubes (FP1)',
      'Astera PowerBox with 8x Charging Cables',
      '16x Tube Clamps with 3/8" spigots + 8x Floor Stands',
      'Astera ART7 CRMX Wireless Transmitter Box',
      'Rugged Charging Flight Case on Wheels'
    ],
    reviews: [
      {
        id: 'rev-8',
        author: 'Leo Sterling',
        role: 'Music Video Director',
        rating: 5,
        date: '2026-09-11',
        comment: 'Synced with our light console wirelessly in 5 minutes. The battery life is phenomenal for all-day mobile location shoots.'
      }
    ],
    owner: {
      id: 'usr-vault-la',
      name: 'Apex Cinema Rentals LA',
      badge: 'Certified Gear Partner',
      rating: 4.99
    }
  },
  {
    id: 'prod-dji-ronin-4d-6k',
    name: 'DJI Ronin 4D 6K Cinema Gimbal Camera Combo',
    brand: 'DJI',
    category: 'Stabilizers',
    tagline: 'World first 4-axis cinema system with built-in LiDAR focusing, 6K 60fps ProRes RAW and wireless video',
    description: 'An all-in-one cinema powerhouse that eliminates the need for separate gimbals, follow-focus motors, and wireless transmitters. Integrates full-frame 6K imaging, active 4-axis Z-axis vertical stabilization, LiDAR automated focus tracking, and high-bright remote monitoring into a single handheld rig.',
    images: [
      CATEGORY_STABILIZERS_IMG,
      HERO_IMAGE
    ],
    rentPricePerDay: 320,
    buyPrice: 6799,
    rating: 4.91,
    reviewCount: 38,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Production Certified',
    location: 'Los Angeles / Brooklyn',
    depositRequired: 900,
    featured: true,
    specs: [
      { label: 'Stabilization System', value: 'Active 4-Axis (Pan, Tilt, Roll + Z-Axis Vertical)' },
      { label: 'Sensor Format', value: 'Full-Frame Zenmuse X9-6K' },
      { label: 'Focus System', value: 'Automated LiDAR Range Finder Focus' },
      { label: 'Recording Formats', value: 'Apple ProRes 422HQ & ProRes 4444XQ' },
      { label: 'Wireless Range', value: '20,000 ft O3 Pro Video Transmission' }
    ],
    includedInCase: [
      'DJI Ronin 4D 6K Main Body with Gimbal Camera',
      'LiDAR Range Finder Unit + Focus Motor Cable',
      'High-Bright Main Monitor + Left/Right Control Handgrips',
      '4x TB50 Intelligent Batteries + Quad Charging Hub',
      'DJI PROSSD 1TB + Mount + Hard Pelican Case'
    ],
    reviews: [
      {
        id: 'rev-9',
        author: 'Kofi Mensah',
        role: 'Steadicam Operator / DP',
        rating: 5,
        date: '2026-09-02',
        comment: 'Z-axis active stabilization completely eliminates footsteps. The LiDAR focus tracker nailed actor marks even in low light.'
      }
    ],
    owner: {
      id: 'usr-vault-la',
      name: 'Apex Cinema Rentals LA',
      badge: 'Certified Gear Partner',
      rating: 4.99
    }
  },
  {
    id: 'prod-sennheiser-mkh416-kit',
    name: 'Sennheiser MKH 416 Boom Mic & Sound Devices Field Kit',
    brand: 'Sennheiser',
    category: 'Audio',
    tagline: 'Broadcast standard interference tube shotgun microphone paired with 32-bit float audio recorder',
    description: 'The gold standard dialogue capture microphone for film and high-end television worldwide. Compact RF condenser capsule with exceptional directivity, moisture resistance, and flat acoustic response. Packaged with a Sound Devices MixPre-6 II 32-bit float field recorder, Rycote blimp windshield, and K-Tek carbon fiber boom pole.',
    images: [
      CATEGORY_STABILIZERS_IMG,
      CATEGORY_LIGHTING_IMG
    ],
    rentPricePerDay: 110,
    buyPrice: 2450,
    rating: 4.96,
    reviewCount: 52,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Production Certified',
    location: 'Austin / Seattle / New York',
    depositRequired: 350,
    featured: false,
    specs: [
      { label: 'Transducer Principle', value: 'RF Condenser Interference Tube' },
      { label: 'Directional Pattern', value: 'Supercardioid / Lobar' },
      { label: 'Audio Recorder', value: 'Sound Devices MixPre-6 II (32-Bit Float)' },
      { label: 'Wind Protection', value: 'Full Rycote Super-Shield Blimp System' },
      { label: 'Boom Pole', value: 'K-Tek KlassicPro 12ft Carbon Fiber' }
    ],
    includedInCase: [
      'Sennheiser MKH 416-P48 Shotgun Microphone',
      'Sound Devices MixPre-6 II Field Recorder with Bag',
      'Rycote Super-Shield Shockmount & Furry Windjammer',
      'K-Tek Avalon Coiled XLR Internal Carbon Pole',
      '4x Anker High-Capacity USB-PD Power Banks'
    ],
    reviews: [
      {
        id: 'rev-10',
        author: 'Tara Washington',
        role: 'Production Sound Mixer',
        rating: 5,
        date: '2026-08-19',
        comment: 'Crystal dialogue rejection of ambient city traffic. 32-bit float meant zero digital clipping when actors shouted.'
      }
    ],
    owner: {
      id: 'usr-sound-pro',
      name: 'Sonic Wave Broadcast Rentals',
      badge: 'Audio Specialist',
      rating: 4.98
    }
  },
  {
    id: 'prod-smallhd-cine-7-wireless',
    name: 'SmallHD Cine 7 4K Wireless On-Camera Monitor (Teradek Bolt 4K RX)',
    brand: 'SmallHD',
    category: 'Accessories',
    tagline: '1800 nit daylight-viewable 7-inch touchscreen with integrated Teradek Bolt 4K wireless receiver',
    description: 'The preferred focus puller and director handheld monitor. Boasting 1800 nits of peak brightness for direct sunlight visibility, 100% DCI-P3 color gamut, PageOS 5 toolset with custom 3D LUTs, false color, and built-in Teradek 4K zero-delay wireless receiver module.',
    images: [
      CATEGORY_STABILIZERS_IMG,
      CATEGORY_CAMERAS_IMG
    ],
    rentPricePerDay: 125,
    buyPrice: 2899,
    rating: 4.89,
    reviewCount: 36,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Like New (Mint)',
    location: 'Los Angeles / Brooklyn',
    depositRequired: 300,
    featured: false,
    specs: [
      { label: 'Display Screen', value: '7.0-inch IPS LCD 1920 x 1200 Touchscreen' },
      { label: 'Brightness', value: '1800 nits Sunlight Viewable' },
      { label: 'Wireless Engine', value: 'Built-in Teradek Bolt 4K Receiver (750ft range)' },
      { label: 'Software', value: 'SmallHD PageOS 5 Tools & EL Zone Exposure' },
      { label: 'Power', value: 'Sony L-Series / V-Mount Plate' }
    ],
    includedInCase: [
      'SmallHD Cine 7 Monitor with Bolt 4K Module',
      'Dual Handle Director Monitor Cage with Neck Strap',
      '4x Sony NP-F970 Batteries + Dual Charger',
      'Matte Sunhood & Ultra-Thin BNC SDI Cable',
      'Pelican 1450 Case'
    ],
    reviews: [
      {
        id: 'rev-11',
        author: 'Nico Bell',
        role: '1st AC',
        rating: 5,
        date: '2026-09-12',
        comment: '1800 nits was bright enough in blazing midday desert sun. PageOS peaking and false color are the fastest tools in the industry.'
      }
    ],
    owner: {
      id: 'usr-vault-la',
      name: 'Apex Cinema Rentals LA',
      badge: 'Certified Gear Partner',
      rating: 4.99
    }
  },
  {
    id: 'prod-teradek-bolt-4k-lt-max',
    name: 'Teradek Bolt 4K LT MAX Zero-Delay Wireless Kit (1 TX + 2 RX)',
    brand: 'Teradek',
    category: 'Accessories',
    tagline: 'Zero-delay 4K HDR wireless video transmission with up to 5,000 ft line-of-sight range',
    description: 'The pinnacle of wireless video for modern video village and focus puller setups. Sends uncompressed 10-bit 4:2:2 video up to 4K30 or 1080p60 with zero visible latency (<0.001 sec). Cross-compatible with the entire Teradek Bolt 4K ecosystem.',
    images: [
      CATEGORY_STABILIZERS_IMG,
      HERO_IMAGE
    ],
    rentPricePerDay: 260,
    buyPrice: 7990,
    rating: 4.93,
    reviewCount: 24,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Production Certified',
    location: 'Los Angeles / New York',
    depositRequired: 800,
    featured: false,
    specs: [
      { label: 'Wireless Range', value: 'Up to 5,000 ft (1,500 m) Line of Sight' },
      { label: 'Latency', value: 'Zero Latency (< 1 millisecond)' },
      { label: 'Video Formats', value: '4K DCI, UHD, 1080p up to 60fps 10-bit 4:2:2' },
      { label: 'Encryption', value: 'AES-256 with RSA 1024 Key Pairing' },
      { label: 'Inputs/Outputs', value: '12G-SDI & HDMI 2.0 In/Out' }
    ],
    includedInCase: [
      '1x Teradek Bolt 4K LT MAX Transmitter',
      '2x Teradek Bolt 4K LT MAX Receivers with Gold Mount Plates',
      'Antenna Array + 5GHz Mushroom Omnis',
      'D-Tap to 2-pin LEMO Power Cables + AC Adapters',
      'Pelican Storm Transport Case'
    ],
    reviews: [
      {
        id: 'rev-12',
        author: 'Chris Palmer',
        role: 'DIT / Video Assist',
        rating: 5,
        date: '2026-08-25',
        comment: 'Signal never dropped once on our 3-story warehouse stunt shoot. Robust build quality.'
      }
    ],
    owner: {
      id: 'usr-ny-cine',
      name: 'Gotham Cine Vault',
      badge: 'Premier Vendor',
      rating: 5.0
    }
  },
  {
    id: 'prod-canon-c70-cinema-eos',
    name: 'Canon EOS C70 4K Cinema Camera (RF Mount)',
    brand: 'Canon',
    category: 'Cameras',
    tagline: 'Super 35mm Dual Gain Output sensor with 16+ stops dynamic range in a mirrorless form factor',
    description: 'Combining the imaging prowess of Canon Cinema EOS with the flexibility of the compact RF mount. Features 4K 120p recording, Dual Pixel CMOS AF with EOS iTR AF X head tracking, motorized 10-stop ND filter system, and dual SD card slots.',
    images: [
      CATEGORY_CAMERAS_IMG,
      CATEGORY_LENSES_IMG
    ],
    rentPricePerDay: 160,
    buyPrice: 5499,
    rating: 4.88,
    reviewCount: 49,
    availableForRent: true,
    availableForSale: true,
    status: 'Available',
    condition: 'Like New (Mint)',
    location: 'San Francisco / Chicago',
    depositRequired: 500,
    featured: false,
    specs: [
      { label: 'Sensor', value: 'Super 35mm Dual Gain Output (DGO) CMOS' },
      { label: 'Dynamic Range', value: '16+ Stops in DGO Mode' },
      { label: 'Max Frame Rates', value: '4K DCI 120p, 2K Crop 180p' },
      { label: 'Lens Mount', value: 'Canon RF Mount (0.71x EF-RF Speedbooster optional)' },
      { label: 'Built-in ND', value: 'Motorized Mechanical ND 2, 4, 6, 8, 10 Stops' }
    ],
    includedInCase: [
      'Canon EOS C70 Body + Handle Unit with Mic Holder',
      '3x Canon BP-A60 High Capacity Batteries + Charger',
      '2x Angelbird 256GB V90 UHS-II SDXC Cards + Reader',
      'Canon EF to EOS R 0.71x Focal Reducer Adapter',
      'Nanuk 935 Wheeled Case'
    ],
    reviews: [
      {
        id: 'rev-13',
        author: 'Mina Sato',
        role: 'Commercial Videographer',
        rating: 5,
        date: '2026-09-17',
        comment: 'The C70 with the 0.71x booster gave us full-frame look with legendary Canon skin colors.'
      }
    ],
    owner: {
      id: 'usr-atlanta-cam',
      name: 'SouthCoast Gear Hub',
      badge: 'Gold Verified Partner',
      rating: 4.95
    }
  }
];

export const MOCK_USERS: User[] = [
  {
    id: 'usr-demo-filmmaker',
    name: 'Janaka Bandara',
    email: 'janakabandara818@gmail.com',
    role: 'creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (555) 782-9012',
    company: 'Light & Lens Productions',
    verified: true,
    memberSince: 'March 2024',
    credits: 350
  },
  {
    id: 'usr-admin-demo',
    name: 'Vault Administrator',
    email: 'admin@cinevault.io',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    phone: '+1 (800) 555-CINE',
    company: 'CineVault Global Operations',
    verified: true,
    memberSince: 'January 2023',
    credits: 5000
  }
];

export const INITIAL_USER_RENTALS: RentalBooking[] = [
  {
    id: 'RNT-2026-8812',
    product: INITIAL_PRODUCTS[0], // ARRI Alexa Mini LF
    startDate: '2026-10-03',
    endDate: '2026-10-07',
    totalDays: 4,
    totalAmount: 3400,
    depositAmount: 2500,
    status: 'Active',
    trackingNumber: 'FDX-9941-8201-US',
    deliveryType: 'Courier Delivery'
  },
  {
    id: 'RNT-2026-8790',
    product: INITIAL_PRODUCTS[5], // Aputure 600d Pro
    startDate: '2026-10-12',
    endDate: '2026-10-15',
    totalDays: 3,
    totalAmount: 405,
    depositAmount: 300,
    status: 'Upcoming',
    trackingNumber: 'Pending Dispatch',
    deliveryType: 'Studio Pickup'
  },
  {
    id: 'RNT-2026-8431',
    product: INITIAL_PRODUCTS[1], // Sony FX6
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    totalDays: 4,
    totalAmount: 780,
    depositAmount: 600,
    status: 'Completed',
    trackingNumber: 'FDX-7712-4019-US',
    deliveryType: 'Courier Delivery'
  }
];

export const INITIAL_USER_ORDERS: PurchaseOrder[] = [
  {
    id: 'ORD-2026-9041',
    product: INITIAL_PRODUCTS[4], // Sony GM Trinity
    orderDate: '2026-09-15',
    quantity: 1,
    totalAmount: 6890,
    status: 'Delivered',
    trackingNumber: 'UPS-1Z9999999999999999',
    shippingAddress: 'Studio 4B, 742 Evergreen Terrace, Springfield, OR'
  },
  {
    id: 'ORD-2026-9188',
    product: INITIAL_PRODUCTS[8], // Sennheiser MKH416 Kit
    orderDate: '2026-09-28',
    quantity: 1,
    totalAmount: 2450,
    status: 'Dispatched',
    trackingNumber: 'FDX-3829-1082-US',
    shippingAddress: 'Studio 4B, 742 Evergreen Terrace, Springfield, OR'
  }
];

export const CATEGORIES = [
  {
    name: 'Cameras',
    count: 24,
    description: 'Large-format, Super 35, and 8K cinema camera bodies',
    image: CATEGORY_CAMERAS_IMG
  },
  {
    name: 'Lenses',
    count: 48,
    description: 'Anamorphic, Cine Primes, and fast f/2.8 zoom packages',
    image: CATEGORY_LENSES_IMG
  },
  {
    name: 'Lighting',
    count: 36,
    description: 'High-output COB LEDs, softboxes, and wireless tube kits',
    image: CATEGORY_LIGHTING_IMG
  },
  {
    name: 'Stabilizers',
    count: 18,
    description: 'Motorized 3-axis & 4-axis gimbals, easy-rigs, and car mounts',
    image: CATEGORY_STABILIZERS_IMG
  },
  {
    name: 'Audio',
    count: 22,
    description: '32-bit float recorders, broadcast shotgun mics, and wireless lavs',
    image: CATEGORY_STABILIZERS_IMG
  },
  {
    name: 'Accessories',
    count: 65,
    description: 'Wireless video transmitters, 1800-nit monitors, and follow focus',
    image: HERO_IMAGE
  }
];

export const TESTIMONIALS = [
  {
    id: 'test-1',
    name: 'Marcus Vance',
    role: 'Commercial Cinematographer (ASC Associate)',
    company: 'Vance Visuals LA',
    content: 'We rented an Alexa Mini LF and Cooke primes for a 5-day car commercial in the Mojave desert. Every single piece arrived thoroughly tested, sensor cleaned, with latest firmware. CineVault saved us $45k over purchasing.',
    highlight: 'Saved $45,000 on camera package'
  },
  {
    id: 'test-2',
    name: 'Elena Rostova',
    role: 'Feature Film Director',
    company: 'Sundance Horizon Films',
    content: 'The insurance and verification workflow took less than 15 minutes. Being able to combine rental equipment with outright purchases of memory cards and filters in one unified cart is revolutionary for indie crews.',
    highlight: 'Instant COI verification in 15 mins'
  },
  {
    id: 'test-3',
    name: 'Darnell Hayes',
    role: 'Lead DP & Executive Producer',
    company: 'Apex Media Group',
    content: 'Listing my FX6 and Aputure 600d during production downtime brings in $3,200/month passively. Payments are on time and every renter is strictly ID-checked with full equipment damage coverage.',
    highlight: '$3,200/mo passive gear revenue'
  }
];
