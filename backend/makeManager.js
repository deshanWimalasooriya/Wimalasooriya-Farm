const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const makeManager = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const email = process.argv[2];
    if (!email) {
      console.log('Please provide an email address: node makeManager.js <email>');
      process.exit(1);
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }

    user.isManager = true;
    await user.save();
    console.log(`Success! ${user.name} is now a Manager.`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

makeManager();
