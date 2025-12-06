const axios = require('axios');

// Sample review data
const reviewTemplates = [
  {
    title: 'Excellent product!',
    comment: 'This product exceeded my expectations. Highly recommend!',
    rating: 5,
    userName: 'John Smith',
    userImageUrl: 'https://i.pravatar.cc/150?img=12',
  },
  {
    title: 'Great value for money',
    comment:
      'Very satisfied with this purchase. Good quality and fast shipping.',
    rating: 5,
    userName: 'Sarah Johnson',
    userImageUrl: 'https://i.pravatar.cc/150?img=45',
  },
  {
    title: 'Good quality',
    comment: 'Product works as described. Would buy again.',
    rating: 4,
    userName: 'Mike Davis',
    userImageUrl: 'https://i.pravatar.cc/150?img=33',
  },
  {
    title: 'Pretty good',
    comment: 'Nice product overall, minor issues but nothing major.',
    rating: 4,
    userName: 'Emily Wilson',
    userImageUrl: 'https://i.pravatar.cc/150?img=47',
  },
  {
    title: 'Decent purchase',
    comment: "It's okay for the price. Does the job.",
    rating: 3,
    userName: 'David Brown',
    userImageUrl: 'https://i.pravatar.cc/150?img=51',
  },
  {
    title: 'Love it!',
    comment: 'Absolutely perfect! Exactly what I was looking for.',
    rating: 5,
    userName: 'Lisa Anderson',
    userImageUrl: 'https://i.pravatar.cc/150?img=23',
  },
  {
    title: 'Highly recommended',
    comment: 'Top quality product. Very happy with my purchase.',
    rating: 5,
    userName: 'Robert Taylor',
    userImageUrl: 'https://i.pravatar.cc/150?img=68',
  },
  {
    title: 'Solid product',
    comment: 'Good build quality and works great. No complaints.',
    rating: 4,
    userName: 'Jennifer Martinez',
    userImageUrl: 'https://i.pravatar.cc/150?img=29',
  },
  {
    title: 'Worth buying',
    comment: 'Happy with this product. Meets all my needs.',
    rating: 4,
    userName: 'Chris Lee',
    userImageUrl: 'https://i.pravatar.cc/150?img=15',
  },
  {
    title: 'Amazing!',
    comment: "Best purchase I've made this year. 10/10!",
    rating: 5,
    userName: 'Amanda White',
    userImageUrl: 'https://i.pravatar.cc/150?img=32',
  },
];

async function getProducts() {
  try {
    const response = await axios.get('http://localhost:3000/products');
    return response.data;
  } catch (err) {
    console.error('Failed to fetch products:', err.message);
    return [];
  }
}

async function seedReviews() {
  console.log('🌟 Seeding reviews for all products...\n');

  const products = await getProducts();

  if (products.length === 0) {
    console.log('❌ No products found. Please seed products first.');
    return;
  }

  let totalReviews = 0;

  for (const product of products) {
    // Each product gets 3-5 random reviews
    const numReviews = Math.floor(Math.random() * 3) + 3; // 3-5 reviews
    console.log(`\n📦 ${product.name} - Adding ${numReviews} reviews...`);

    for (let i = 0; i < numReviews; i++) {
      // Pick a random review template
      const template =
        reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];

      const review = {
        productId: product.id,
        userName: template.userName,
        userImageUrl: template.userImageUrl,
        rating: template.rating,
        title: template.title,
        comment: template.comment,
      };

      try {
        await axios.post('http://localhost:3000/reviews', review);
        console.log(
          `  ✓ Added ${template.rating}★ review by ${template.userName}`,
        );
        totalReviews++;
      } catch (err) {
        console.error(`  ✗ Failed to add review:`, err.message);
      }
    }
  }

  console.log(
    `\n✅ Seeding complete! Added ${totalReviews} reviews to ${products.length} products.`,
  );
  console.log('\n📊 Summary:');
  console.log(`   Products: ${products.length}`);
  console.log(`   Reviews: ${totalReviews}`);
  console.log(
    `   Average: ${(totalReviews / products.length).toFixed(1)} reviews per product`,
  );
}

seedReviews();
