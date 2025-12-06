const axios = require('axios');

const customers = [
  {
    email: 'customer1@example.com',
    password: 'customer123',
    name: 'John Doe',
  },
  {
    email: 'customer2@example.com',
    password: 'customer123',
    name: 'Jane Smith',
  },
  {
    email: 'customer3@example.com',
    password: 'customer123',
    name: 'Mike Johnson',
  },
];

async function seedCustomers() {
  console.log('👥 Creating customer accounts...\n');

  for (const customer of customers) {
    try {
      await axios.post('http://localhost:3000/auth/register', customer);
      console.log(`✅ Created: ${customer.name} (${customer.email})`);
    } catch (err) {
      if (
        err.response?.status === 409 ||
        err.message.includes('already exists')
      ) {
        console.log(`ℹ️  Already exists: ${customer.email}`);
      } else {
        console.error(`❌ Failed to create ${customer.email}:`, err.message);
      }
    }
  }

  console.log('\n✅ Customer seeding complete!');
  console.log('\n📋 Customer Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  customers.forEach((c, i) => {
    console.log(`\n${i + 1}. ${c.name}`);
    console.log(`   📧 Email: ${c.email}`);
    console.log(`   🔑 Password: ${c.password}`);
    console.log(`   👤 Role: customer`);
  });
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

seedCustomers();
