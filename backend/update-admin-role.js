const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'ecommerce.db');
const db = new sqlite3.Database(dbPath);

console.log('🔧 Updating admin role...\n');

db.run(
  `UPDATE user SET role = 'admin' WHERE email = 'admin@example.com'`,
  function (err) {
    if (err) {
      console.error('❌ Error updating role:', err.message);
    } else {
      console.log('✅ Admin role updated successfully!');
      console.log(`   Rows affected: ${this.changes}`);

      // Verify the update
      db.get(
        `SELECT id, email, name, role FROM user WHERE email = 'admin@example.com'`,
        (err, row) => {
          if (err) {
            console.error('Error verifying:', err.message);
          } else if (row) {
            console.log('\n📋 Admin User Info:');
            console.log('   ID:', row.id);
            console.log('   Email:', row.email);
            console.log('   Name:', row.name);
            console.log('   Role:', row.role);
            console.log('\n🔐 Login Credentials:');
            console.log('   Email: admin@example.com');
            console.log('   Password: admin123');
          }
          db.close();
        },
      );
    }
  },
);
