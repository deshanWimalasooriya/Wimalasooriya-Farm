const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/wimalasooriya');

const products = [
  {
    name: '1 Dozen Brown Eggs',
    image: 'https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=500&q=80',
    description: 'Freshly laid, farm-to-table organic brown eggs. Perfect for a nutritious breakfast.',
    price: 4.99,
    countInStock: 50,
    category: 'Retail'
  },
  {
    name: '30-Egg Tray',
    image: 'https://images.unsplash.com/photo-1518569656558-1fd6287e07a3?w=500&q=80',
    description: 'A full tray of 30 fresh farm eggs. Ideal for families and serious bakers.',
    price: 11.99,
    countInStock: 20,
    category: 'Retail'
  },
  {
    name: 'Premium White Eggs (12-Pack)',
    image: 'https://images.unsplash.com/photo-1498654200943-1088dd4438ae?w=500&q=80',
    description: 'Clean, large premium white eggs. A classic choice for any kitchen.',
    price: 4.50,
    countInStock: 40,
    category: 'Retail'
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
