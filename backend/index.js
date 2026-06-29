const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const farmRoutes = require('./routes/farmRoutes');
const workerRoutes = require('./routes/workerRoutes');
const transportRoutes = require('./routes/transportRoutes');
const companyRoutes = require('./routes/companyRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/admin/workers', workerRoutes);
app.use('/api/admin/transport', transportRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/notifications', notificationRoutes);

// Socket.io integration
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // When a user opens chat
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // When a message is sent
  socket.on('send_message', (data) => {
    // data should contain { room: userId, message: obj }
    io.to(data.room).emit('receive_message', data.message);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.log('MongoDB connection error: ', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
