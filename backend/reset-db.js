const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Resetting database...\n');

// 1. Stop any running backend processes (optional, comment out if not needed)
// console.log('Stopping backend processes...');
// try {
//   execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
// } catch (err) {
//   // Ignore errors if no process found
// }

// 2. Delete database file
const dbPath = path.join(__dirname, 'ecommerce.db');
if (fs.existsSync(dbPath)) {
  console.log('📁 Deleting old database...');
  fs.unlinkSync(dbPath);
  console.log('✓ Database deleted\n');
} else {
  console.log('ℹ️  No existing database found\n');
}

// 3. Wait a moment
console.log('⏳ Waiting for backend to initialize...');
setTimeout(() => {
  console.log('✓ Backend should be ready\n');

  // 4. Seed products
  console.log('📦 Seeding products...');
  try {
    execSync('node seed-products.js', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to seed products');
    process.exit(1);
  }

  // 5. Seed reviews
  console.log('\n⭐ Seeding reviews...');
  try {
    execSync('node seed-reviews.js', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to seed reviews');
    process.exit(1);
  }

  console.log('\n✅ Database reset and seeding complete!');
  console.log('🚀 You can now use the application\n');
}, 3000);
