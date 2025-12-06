const axios = require('axios');

const products = [
  {
    name: 'Wireless Headphones',
    price: 79.99,
    description: 'High-quality wireless headphones with noise cancellation',
    imageUrl:
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 50,
    category: 'electronics',
  },
  {
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with health tracking',
    imageUrl:
      'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 30,
    category: 'electronics',
  },
  {
    name: 'Running Shoes',
    price: 89.99,
    description: 'Comfortable running shoes for all terrains',
    imageUrl:
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 100,
    category: 'sports',
  },
  {
    name: 'Yoga Mat',
    price: 29.99,
    description: 'Non-slip yoga mat for home workouts',
    imageUrl:
      'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 75,
    category: 'sports',
  },
  {
    name: 'Coffee Maker Machine',
    price: 129.99,
    description: 'Automatic coffee maker with programmable settings',
    imageUrl:
      'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 40,
    category: 'home',
  },
  {
    name: 'Modern Desk Lamp',
    price: 45.99,
    description: 'LED desk lamp with adjustable brightness',
    imageUrl:
      'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 60,
    category: 'home',
  },
  {
    name: 'Bluetooth Portable Speaker',
    price: 59.99,
    description: 'Waterproof portable speaker with excellent sound quality',
    imageUrl:
      'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 80,
    category: 'electronics',
  },
  {
    name: 'Gaming Mouse Wireless',
    price: 49.99,
    description: 'High-precision wireless gaming mouse',
    imageUrl:
      'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 55,
    category: 'electronics',
  },
  {
    name: 'Mechanical Gaming Keyboard',
    price: 119.99,
    description: 'RGB mechanical keyboard with customizable keys',
    imageUrl:
      'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 45,
    category: 'electronics',
  },
  {
    name: 'Cast Iron Skillet',
    price: 39.99,
    description: 'Pre-seasoned cast iron skillet for cooking',
    imageUrl:
      'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 70,
    category: 'home',
  },
  {
    name: 'Acoustic Guitar',
    price: 249.99,
    description: 'Full-size acoustic guitar for beginners and professionals',
    imageUrl:
      'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 25,
    category: 'music',
  },
  {
    name: 'Dumbbell Set',
    price: 149.99,
    description: 'Adjustable dumbbell set for home gym',
    imageUrl:
      'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=600',
    stock: 35,
    category: 'sports',
  },
];

async function seedProducts() {
  try {
    console.log('Seeding products...');

    for (const product of products) {
      try {
        await axios.post('http://localhost:3000/products', product);
        console.log(`✓ Created: ${product.name}`);
      } catch (err) {
        console.error(`✗ Failed to create ${product.name}:`, err.message);
      }
    }

    console.log('\n✅ Product seeding complete!');
  } catch (err) {
    console.error('Error seeding products:', err.message);
  }
}

seedProducts();
