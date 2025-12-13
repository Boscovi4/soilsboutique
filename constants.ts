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
  {
    id: '1',
    name: 'Raglan Tee',
    description: 'Premium cotton blend for maximum comfort and style.',
    price: 35.00,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9rf1iSi9AhoIwV5EMuWhBhyz8vj7K52zXg5jYAJLVHFgW0ByaiOWvEqQZxbu6t5w8YbuVws2OdztcnHyxl9XJIIH77sVv40KLl2XmqMkdT9MPvxbUhCdppGyEYqF7A5RABcaXhEufP6Lj-A6X3eesfvklFr6uoRO1bOdpa0AyJHRP59IUhVLl5vWP_mOEQljC90YDOX6f6FH1XNP5xtYxOiiRYAVLdRnEj_OMPScIQ2NgTkZjOZTXkolQdOSG5x6GgTPFO3YyvLo",
    type: 'featured'
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    price: 99.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuChqqyZx7tcrigHXGO84pYvOSbeXLehYFTdYYin5EgVnkEd4xInS4y_FGFjvYp5HfEgFO9xCBrbONRK-t-vj0WDcQ0wJRlouvPx75WwE8V55OvTm1K-jNrZAXiFAr5nRaH6yd0LGOrlvEunGYNE2VY8MRjZrTd_o6V9A2OR6BzbPF221AAm3-FY9U3PphQ2D67KXmm3htX0qoMSmfpQDaxnr0_MAZrILn5KpS9p858cpfshigHUDx05-Rk9ibUa-29UsW3UgWej1MQ",
    rating: 4.8,
    type: 'grid'
  },
  {
    id: '3',
    name: 'Eco Graphic Tee',
    price: 29.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAJPmOl4JKxwvh4plTdjQC5v8HzULVZlmfHvbgaNV1E29ej6zXO_3F4GyWVX7Hz4LOun6h6UyrF95HSz8d2tBlPOOaeQzByYHsUBU60gFq2UBgzKN21U_BpOnyxTJVLJQwajYE2NWMdO1Ffh3IcgyrZYIomOoBGD_u7-k-14iRk85uLZoaoUsRI1AhJVJUliSEQ6exIbtzXpKP11tuOROKnfU7YrRA72UNAHHHLZGy74we4x05Wf35qH5c8BIJSyyPnvfas5igVHFE",
    rating: 4.5,
    type: 'grid'
  },
  {
    id: '4',
    name: 'Oxford Check Shirt',
    price: 54.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA5S2HI9poE4dsUfk9rdnzZ8KM-b99smcsdhoamATVNDBAtdIh8ova2ktWJsMcFdlF7EC9Md-j-3Kcipo0jQ-l8ybmXxi8o48U7VZTZEra--mt0-JvGzZee0-kH2WPRpz0jsWQT6F54Ct8CJUElWUSr_bUGX-JXNI-cbd1Q0EBXntgu2HsqECUgnJmjD-c0Sqj_dBosyKLGu3pEGFxOFXVU7JtD_ANn_qIPG3VdNf0f5fuNMCZAq_k9YHW9vPV0L5pC8RCabXfTj64",
    rating: 5.0,
    isHot: true,
    type: 'grid'
  },
  {
    id: '5',
    name: 'Summer Blouse',
    price: 39.99,
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjYvg-rp2W7-eMNTmibjfeOoWTllGdHaRA7jpH68HaM-WwQgykAnIIf_ZyFMF1baJYyURHdH492YP4ohphknaTasTL3zQV9wyvIo4FIqNqHBZPntAWujrCFy49ctHEZye03VkFerSMKbNczIGFt5XLaUafpxcNxTznB6GBCUzvu89EUTQbYsOT5qfslqP22TJm7rx7V2XnZzhFP8FnAnRZlOLQs2zfhPupnhobZuHal9tYDqCyqWjTbeiFIGHOa_1kQ-8-vSVPQbw",
    rating: 3.0,
    type: 'grid'
  },
];