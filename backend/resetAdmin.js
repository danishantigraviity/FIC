const mongoose = require('mongoose');
const User = require('./models/User.model');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    const adminEmail = 'admin@fic.com';
    const newPassword = 'adminPassword123';

    let user = await User.findOne({ email: adminEmail });
    
    if (user) {
      console.log('🔄 Updating existing admin...');
      user.password = newPassword;
      user.role = 'admin';
      user.isRegistered = true;
      user.status = 'approved';
      await user.save(); // This will trigger the bcrypt hashing hook
      console.log('✅ Admin password updated and hashed');
    } else {
      console.log('🆕 Creating new admin...');
      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: newPassword,
        role: 'admin',
        isRegistered: true,
        status: 'approved'
      });
      console.log('✅ Admin user created and hashed');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

resetAdmin();
