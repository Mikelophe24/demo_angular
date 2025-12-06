const axios = require('axios');

async function checkBackend() {
  try {
    console.log('🔍 Checking backend status...\n');

    // Check if backend is running
    const response = await axios.get('http://localhost:3000/products');
    console.log(`✅ Backend is running!`);
    console.log(`📦 Found ${response.data.length} products\n`);

    if (response.data.length === 0) {
      console.log('⚠️  No products found. Run: node seed-products.js');
    } else {
      console.log('Products:');
      response.data.forEach((p, i) => {
        console.log(
          `  ${i + 1}. ${p.name} - $${p.price} (${p.reviewCount || 0} reviews)`,
        );
      });
    }
  } catch (err) {
    console.error('❌ Backend is NOT running!');
    console.error('Error:', err.message);
    console.log('\n💡 Start backend with: npx nest start --watch');
  }
}

checkBackend();
