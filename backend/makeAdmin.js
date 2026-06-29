const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wimalasooriya');

const makeAdmin = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.isAdmin = true;
      await user.save();
      console.log(`Success! ${email} is now an Admin.`);
    } else {
      console.log(`User with email ${email} not found.`);
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const emailArg = process.argv[2];
if (!emailArg) {
  console.log('Please provide an email address. Usage: node makeAdmin.js <email>');
  process.exit();
}

makeAdmin(emailArg);
