const axios = require('axios');

async function fixImages() {
  // URLs to fix (Using Pexels as requested)
  const fixes = {
    'Modern Desk Lamp':
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Coffee Maker Machine':
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Cast Iron Skillet':
      'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Acoustic Guitar':
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Bluetooth Portable Speaker':
      'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Gaming Mouse Wireless':
      'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=600',
    'Mechanical Gaming Keyboard':
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600',
  };

  try {
    // 1. Get all products
    const res = await axios.get('http://localhost:3000/products');
    const products = res.data;

    // 2. Iterate and update if name matches known broken one
    for (const p of products) {
      if (fixes[p.name]) {
        console.log(`Fixing image for ${p.name}...`);
        await axios.put(`http://localhost:3000/products/${p.id}`, {
          ...p,
          imageUrl: fixes[p.name],
        });
        console.log(`updated ${p.name}`);
      }
    }
  } catch (err) {
    console.error('Error fixing images:', err.message);
  }
}

fixImages();
