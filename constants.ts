import { Product, Category } from './types';

// Replace with your actual WhatsApp number
export const WHATSAPP_NUMBER = "67078661919"; 

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All' },
  { id: 'mens', name: "Men's Wear" },
  { id: 'womens', name: "Women's Wear" },
  { id: 'accessories', name: 'Accessories' },
];

export const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuCK3K0m8vQtAUVTDBPa-XXPLGfkZb6KjN2T4VVT6QyBLo44iQ3L1mHAvW9PfIspZyci1LEsIY2NRSKaxKARFBJJLGyaCr5mLPOjpMErHj1EsInmT_957onOUNNyoeKcpSGtw-RmMgamosNtFhMxMB8ml279znYyanl7tABJDaX0O0qr8yqLleb0fq8WGmMSV4OlyUtDEqzB40wfbOHRCAwrfVVmi2nM_PCmzpWY65jDGbUx9vwUaPmeYoCt5D5avrlRQv98yJrD3lE";

export const PRODUCTS: Product[] = [
  // Existing Items
  {
    id: '1',
    name: 'Raglan Tee',
    description: 'Premium cotton blend for maximum comfort and style.',
    price: 35.00,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9rf1iSi9AhoIwV5EMuWhBhyz8vj7K52zXg5jYAJLVHFgW0ByaiOWvEqQZxbu6t5w8YbuVws2OdztcnHyxl9XJIIH77sVv40KLl2XmqMkdT9MPvxbUhCdppGyEYqF7A5RABcaXhEufP6Lj-A6X3eesfvklFr6uoRO1bOdpa0AyJHRP59IUhVLl5vWP_mOEQljC90YDOX6f6FH1XNP5xtYxOiiRYAVLdRnEj_OMPScIQ2NgTkZjOZTXkolQdOSG5x6GgTPFO3YyvLo",
    type: 'featured',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'White/Black'
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    price: 99.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuChqqyZx7tcrigHXGO84pYvOSbeXLehYFTdYYin5EgVnkEd4xInS4y_FGFjvYp5HfEgFO9xCBrbONRK-t-vj0WDcQ0wJRlouvPx75WwE8V55OvTm1K-jNrZAXiFAr5nRaH6yd0LGOrlvEunGYNE2VY8MRjZrTd_o6V9A2OR6BzbPF221AAm3-FY9U3PphQ2D67KXmm3htX0qoMSmfpQDaxnr0_MAZrILn5KpS9p858cpfshigHUDx05-Rk9ibUa-29UsW3UgWej1MQ",
    rating: 4.8,
    type: 'grid',
    sizes: ['30', '32', '34', '36'],
    color: 'Dark Blue'
  },
  {
    id: '3',
    name: 'Eco Graphic Tee',
    price: 29.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJPmOl4JKxwvh4plTdjQC5v8HzULVZlmfHvbgaNV1E29ej6zXO_3F4GyWVX7Hz4LOun6h6UyrF95HSz8d2tBlPOOaeQzByYHsUBU60gFq2UBgzKN21U_BpOnyxTJVLJQwajYE2NWMdO1Ffh3IcgyrZYIomOoBGD_u7-k-14iRk85uLZoaoUsRI1AhJVJUliSEQ6exIbtzXpKP11tuOROKnfU7YrRA72UNAHHHLZGy74we4x05Wf35qH5c8BIJSyyPnvfas5igVHFE",
    rating: 4.5,
    type: 'grid',
    sizes: ['XS', 'S', 'M', 'L'],
    color: 'Green'
  },
  {
    id: '4',
    name: 'Oxford Check Shirt',
    price: 54.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5S2HI9poE4dsUfk9rdnzZ8KM-b99smcsdhoamATVNDBAtdIh8ova2ktWJsMcFdlF7EC9Md-j-3Kcipo0jQ-l8ybmXxi8o48U7VZTZEra--mt0-JvGzZee0-kH2WPRpz0jsWQT6F54Ct8CJUElWUSr_bUGX-JXNI-cbd1Q0EBXntgu2HsqECUgnJmjD-c0Sqj_dBosyKLGu3pEGFxOFXVU7JtD_ANn_qIPG3VdNf0f5fuNMCZAq_k9YHW9vPV0L5pC8RCabXfTj64",
    rating: 5.0,
    isHot: true,
    type: 'grid',
    sizes: ['M', 'L', 'XL'],
    color: 'Blue/White'
  },
  {
    id: '5',
    name: 'Summer Blouse',
    price: 39.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjYvg-rp2W7-eMNTmibjfeOoWTllGdHaRA7jpH68HaM-WwQgykAnIIf_ZyFMF1baJYyURHdH492YP4ohphknaTasTL3zQV9wyvIo4FIqNqHBZPntAWujrCFy49ctHEZye03VkFerSMKbNczIGFt5XLaUafpxcNxTznB6GBCUzvu89EUTQbYsOT5qfslqP22TJm7rx7V2XnZzhFP8FnAnRZlOLQs2zfhPupnhobZuHal9tYDqCyqWjTbeiFIGHOa_1kQ-8-vSVPQbw",
    rating: 3.0,
    type: 'grid',
    sizes: ['S', 'M', 'L'],
    color: 'White'
  },
  // New Demo Products (20 items)
  {
    id: '6',
    name: "Women's Skinny Jeans",
    price: 45.00,
    imageUrl: "https://placehold.co/400x500/png?text=Skinny+Jeans",
    description: "Form-fitting denim for a sleek silhouette.",
    rating: 4.2,
    type: 'grid',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    color: 'Navy Blue, Black'
  },
  {
    id: '7',
    name: "High-Waist Mom Jeans",
    price: 49.50,
    imageUrl: "https://placehold.co/400x500/png?text=Mom+Jeans",
    description: "Vintage inspired high-waisted comfortable jeans.",
    rating: 4.6,
    type: 'grid',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Light Wash'
  },
  {
    id: '8',
    name: "Ripped Boyfriend Jeans",
    price: 55.00,
    imageUrl: "https://placehold.co/400x500/png?text=Boyfriend+Jeans",
    description: "Relaxed fit with stylish distressed details.",
    rating: 4.4,
    type: 'grid',
    sizes: ['S', 'M', 'L'],
    color: 'Faded Blue'
  },
  {
    id: '9',
    name: "Classic Aviator Sunglasses",
    price: 15.00,
    imageUrl: "https://placehold.co/400x500/png?text=Aviator+Sunnies",
    description: "Timeless aviator design with UV protection.",
    rating: 4.8,
    isHot: true,
    type: 'featured',
    sizes: ['One Size'],
    color: 'Gold/Black'
  },
  {
    id: '10',
    name: "Retro Wayfarer Sunglasses",
    price: 12.50,
    imageUrl: "https://placehold.co/400x500/png?text=Wayfarer",
    description: "Iconic square frame sunglasses.",
    rating: 4.3,
    type: 'grid',
    sizes: ['One Size'],
    color: 'Black'
  },
  {
    id: '11',
    name: "Chic Cat Eye Sunglasses",
    price: 18.00,
    imageUrl: "https://placehold.co/400x500/png?text=Cat+Eye+Glasses",
    description: "Feminine and bold cat-eye frames.",
    rating: 4.7,
    type: 'grid',
    sizes: ['One Size'],
    color: 'Tortoise Shell'
  },
  {
    id: '12',
    name: "Anti-Radiation Glasses (Black)",
    price: 25.00,
    imageUrl: "https://placehold.co/400x500/png?text=Anti-Rad+Black",
    description: "Protect your eyes from screen glare and blue light.",
    rating: 4.9,
    type: 'grid',
    sizes: ['One Size'],
    color: 'Matte Black'
  },
  {
    id: '13',
    name: "Anti-Radiation Glasses (Clear)",
    price: 25.00,
    imageUrl: "https://placehold.co/400x500/png?text=Anti-Rad+Clear",
    description: "Transparent frames for a modern look.",
    rating: 4.5,
    type: 'grid',
    sizes: ['One Size'],
    color: 'Clear'
  },
  {
    id: '14',
    name: "Minimalist Leather Watch",
    price: 85.00,
    imageUrl: "https://placehold.co/400x500/png?text=Leather+Watch",
    description: "Elegant analog watch with genuine leather strap.",
    rating: 4.6,
    type: 'featured',
    sizes: ['Standard'],
    color: 'Brown/White'
  },
  {
    id: '15',
    name: "Rugged Digital Sport Watch",
    price: 45.00,
    imageUrl: "https://placehold.co/400x500/png?text=Sport+Watch",
    description: "Waterproof digital watch for active lifestyles.",
    rating: 4.4,
    type: 'grid',
    sizes: ['Adjustable'],
    color: 'Black/Red'
  },
  {
    id: '16',
    name: "Men's Utility Cargo Pants",
    price: 58.00,
    imageUrl: "https://placehold.co/400x500/png?text=Cargo+Khaki",
    description: "Functional cargo pants with multiple pockets.",
    rating: 4.5,
    type: 'grid',
    sizes: ['30', '32', '34', '36', '38'],
    color: 'Khaki'
  },
  {
    id: '17',
    name: "Tactical Cargo Pants",
    price: 62.00,
    imageUrl: "https://placehold.co/400x500/png?text=Cargo+Black",
    description: "Durable tactical pants in black.",
    rating: 4.7,
    type: 'grid',
    sizes: ['30', '32', '34', '36'],
    color: 'Black'
  },
  {
    id: '18',
    name: "Streetwear Cargo Joggers",
    price: 48.00,
    imageUrl: "https://placehold.co/400x500/png?text=Cargo+Joggers",
    description: "Relaxed fit joggers with cargo styling.",
    rating: 4.3,
    type: 'grid',
    sizes: ['S', 'M', 'L', 'XL'],
    color: 'Olive Green'
  },
  {
    id: '19',
    name: "Gold Plated Hoop Earrings",
    price: 12.00,
    imageUrl: "https://placehold.co/400x500/png?text=Gold+Hoops",
    description: "Classic gold hoops for everyday wear.",
    rating: 4.6,
    type: 'grid',
    sizes: ['50mm', '60mm'],
    color: 'Gold'
  },
  {
    id: '20',
    name: "Pearl Stud Earrings",
    price: 15.00,
    imageUrl: "https://placehold.co/400x500/png?text=Pearl+Studs",
    description: "Elegant faux pearl studs.",
    rating: 4.8,
    type: 'grid',
    sizes: ['One Size'],
    color: 'Pearl White'
  },
  {
    id: '21',
    name: "Boho Dangle Earrings",
    price: 10.00,
    imageUrl: "https://placehold.co/400x500/png?text=Boho+Earrings",
    description: "Artistic dangle earrings with tassels.",
    rating: 4.1,
    type: 'grid',
    sizes: ['One Size'],
    color: 'Multicolor'
  },
  {
    id: '22',
    name: "Classic Stiletto Heels",
    price: 75.00,
    imageUrl: "https://placehold.co/400x500/png?text=Red+Stilettos",
    description: "High heel stilettos perfect for parties.",
    rating: 4.7,
    isHot: true,
    type: 'grid',
    sizes: ['36', '37', '38', '39', '40'],
    color: 'Red, Black'
  },
  {
    id: '23',
    name: "Block Heel Sandals",
    price: 55.00,
    imageUrl: "https://placehold.co/400x500/png?text=Block+Heels",
    description: "Comfortable block heels for summer.",
    rating: 4.4,
    type: 'grid',
    sizes: ['36', '37', '38', '39', '40'],
    color: 'Beige'
  },
  {
    id: '24',
    name: "Platform Pumps",
    price: 65.00,
    imageUrl: "https://placehold.co/400x500/png?text=Platform+Pumps",
    description: "Bold platform pumps to elevate your height.",
    rating: 4.5,
    type: 'grid',
    sizes: ['36', '37', '38', '39'],
    color: 'Black Patent'
  },
  {
    id: '25',
    name: "Ankle Strap Heels",
    price: 50.00,
    imageUrl: "https://placehold.co/400x500/png?text=Ankle+Strap",
    description: "Secure and stylish ankle strap heels.",
    rating: 4.3,
    type: 'grid',
    sizes: ['36', '37', '38', '39', '40'],
    color: 'Nude'
  }
];