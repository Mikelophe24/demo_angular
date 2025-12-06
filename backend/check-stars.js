const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

console.log('🔍 Checking Star values in DB...\n');

// Get stars with product info
db.all(
  `SELECT s.id, s.value, s.productId, p.name as productName 
   FROM star s 
   JOIN product p ON s.productId = p.id 
   ORDER BY s.productId, s.id 
   LIMIT 30`,
  [],
  (err, stars) => {
    if (err) {
      console.error('Error:', err);
      db.close();
      return;
    }

    console.log('📊 Star Values in DB:\n');
    console.log('ID | Value | Product ID | Product Name');
    console.log('---|-------|------------|-------------');

    stars.forEach((star) => {
      console.log(
        `${star.id} | ${star.value}★ | ${star.productId} | ${star.productName}`,
      );
    });

    // Calculate average per product
    console.log('\n📈 Average Rating per Product:\n');

    db.all(
      `SELECT 
        p.id,
        p.name,
        COUNT(s.id) as starCount,
        AVG(s.value) as avgRating,
        ROUND(AVG(s.value), 1) as roundedRating
       FROM product p
       LEFT JOIN star s ON p.id = s.productId
       GROUP BY p.id
       ORDER BY p.id`,
      [],
      (err, products) => {
        if (err) {
          console.error('Error:', err);
        } else {
          console.log('Product ID | Name | Stars | Avg Rating | Rounded');
          console.log('-----------|------|-------|------------|--------');

          products.forEach((p) => {
            console.log(
              `${p.id} | ${p.name.substring(0, 20).padEnd(20)} | ${p.starCount} | ${
                p.avgRating ? p.avgRating.toFixed(2) : '0.00'
              } | ${p.roundedRating || 0.0}`,
            );
          });
        }

        db.close();
      },
    );
  },
);
