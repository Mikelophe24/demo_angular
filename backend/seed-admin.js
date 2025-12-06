const axios = require('axios');
const bcrypt = require('bcrypt');

async function seedAdmin() {
  try {
    console.log('🔐 Creating admin user...\n');

    const adminUser = {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      imageUrl: 'https://i.pravatar.cc/150?u=admin',
    };

    // Register admin
    const response = await axios.post(
      'http://localhost:3000/auth/register',
      adminUser,
    );

    console.log('✅ Admin user created successfully!');
    console.log('\n📧 Email:', adminUser.email);
    console.log('🔑 Password:', adminUser.password);
    console.log('\n⚠️  IMPORTANT: Change the password after first login!\n');

    // Now we need to manually update the role to admin in the database
    // Since we can't do that via API without auth, we'll create a separate script
    console.log(
      '⚠️  Note: You need to manually update the user role to "admin" in the database',
    );
    console.log('   Or use the update-admin-role.js script\n');
  } catch (err) {
    if (
      err.response?.status === 409 ||
      err.message.includes('already exists')
    ) {
      console.log('ℹ️  Admin user already exists');
    } else {
      console.error('❌ Error creating admin:', err.message);
    }
  }
}

seedAdmin();
