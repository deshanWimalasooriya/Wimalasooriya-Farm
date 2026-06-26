import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { LayoutDashboard, PackageSearch, ListOrdered, DollarSign, Users, ShoppingBag, MessageSquare, Send } from 'lucide-react';
import io from 'socket.io-client';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [activeChatUser, setActiveChatUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const audio = new Audio('https://actions.google.com/sounds/v1/water/pop.ogg');

  useEffect(() => {
    // Admin connects to socket
    socketRef.current = io('http://localhost:5000');
    socketRef.current.emit('join_room', 'admin_room');

    socketRef.current.on('receive_message', (message) => {
      setChatMessages((prev) => [...prev, message]);
      audio.play().catch(e => console.log('Audio error:', e));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    fetchAdminData();
  }, [activeTab]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (activeTab === 'overview') {
        const res = await axios.get('/api/admin/analytics', config);
        setAnalytics(res.data);
      } else if (activeTab === 'orders') {
        const res = await axios.get('/api/admin/orders', config);
        setOrders(res.data);
      } else if (activeTab === 'products') {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } else if (activeTab === 'cms') {
        const res = await axios.get('/api/admin/users', config);
        setUsersList(res.data);
      }
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdate = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/admin/products/${editingProduct._id}`, {
        price: Number(editingProduct.price),
        discountPercentage: Number(editingProduct.discountPercentage)
      }, config);
      toast.success('Product updated successfully!');
      setEditingProduct(null);
      fetchAdminData(); // refresh list
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleUserClick = async (u) => {
    setActiveChatUser(u);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const res = await axios.get(`/api/chat/${u._id}`, config);
      setChatMessages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const sendAdminMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !activeChatUser) return;

    const messageData = {
      sender: user._id,
      receiver: activeChatUser._id,
      content: chatInput,
      isAdminMessage: true,
      createdAt: new Date().toISOString()
    };

    setChatMessages((prev) => [...prev, messageData]);
    setChatInput('');

    socketRef.current.emit('send_message', { room: activeChatUser._id, message: messageData });
    socketRef.current.emit('send_message', { room: 'admin_room', message: messageData });

    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post('/api/chat', messageData, config);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-mountain-sand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-mountain-gray/20 sticky top-24">
            <h2 className="text-xl font-bold text-mountain-brown mb-6 px-2">Admin Panel</h2>
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'overview' ? 'bg-mountain-moss text-white shadow-md' : 'text-mountain-gray hover:bg-mountain-sand/50'
                }`}
              >
                <LayoutDashboard className="w-5 h-5" /> Overview
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'products' ? 'bg-mountain-moss text-white shadow-md' : 'text-mountain-gray hover:bg-mountain-sand/50'
                }`}
              >
                <PackageSearch className="w-5 h-5" /> Products
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'orders' ? 'bg-mountain-moss text-white shadow-md' : 'text-mountain-gray hover:bg-mountain-sand/50'
                }`}
              >
                <ListOrdered className="w-5 h-5" /> All Orders
              </button>
              <button 
                onClick={() => setActiveTab('cms')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'cms' ? 'bg-mountain-moss text-white shadow-md' : 'text-mountain-gray hover:bg-mountain-sand/50'
                }`}
              >
                <MessageSquare className="w-5 h-5" /> CMS & Chat
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow">
          {loading ? (
            <div className="bg-white rounded-3xl p-12 shadow-xl border border-mountain-gray/20 text-center">
              <p className="text-mountain-gray text-lg animate-pulse">Loading admin data...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              
              {/* --- OVERVIEW TAB --- */}
              {activeTab === 'overview' && analytics && (
                <>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-mountain-gray/20 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <DollarSign className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-mountain-gray font-medium">Total Revenue</p>
                      <h3 className="text-2xl font-bold text-mountain-brown">${analytics.totalRevenue.toFixed(2)}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-mountain-gray/20 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-mountain-gray font-medium">Active Orders</p>
                      <h3 className="text-2xl font-bold text-mountain-brown">{analytics.activeOrders}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-mountain-gray/20 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                        <ListOrdered className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-mountain-gray font-medium">Total Orders</p>
                      <h3 className="text-2xl font-bold text-mountain-brown">{analytics.totalOrders}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-mountain-gray/20 flex flex-col items-center text-center">
                      <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-mountain-gray font-medium">Total Users</p>
                      <h3 className="text-2xl font-bold text-mountain-brown">{analytics.totalUsers}</h3>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-mountain-gray/20">
                    <h3 className="text-xl font-bold text-mountain-brown mb-6">Revenue Over Time</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} dx={-10} tickFormatter={(val) => `$${val}`} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
                          />
                          <Area type="monotone" dataKey="revenue" stroke="#6498AF" strokeWidth={3} fill="#6498AF" fillOpacity={0.2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-xl border border-mountain-gray/20">
                    <h3 className="text-xl font-bold text-mountain-brown mb-6">Orders Volume</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF'}} dx={-10} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{fill: '#F3F4F6'}}
                          />
                          <Bar dataKey="orders" fill="#8CA9BD" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </>
              )}

              {/* --- PRODUCTS TAB --- */}
              {activeTab === 'products' && (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-mountain-gray/20">
                  <h3 className="text-xl font-bold text-mountain-brown mb-6">Manage Products & Offers</h3>
                  
                  {editingProduct ? (
                    <div className="bg-mountain-sand/20 p-6 rounded-2xl border border-mountain-moss/30 mb-8">
                      <h4 className="font-bold text-mountain-brown mb-4">Editing: {editingProduct.name}</h4>
                      <form onSubmit={handleProductUpdate} className="flex gap-4 items-end">
                        <div className="space-y-2 flex-grow">
                          <label className="text-sm font-medium text-mountain-gray">Price ($)</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            required
                            className="w-full px-4 py-2 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none" 
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2 flex-grow">
                          <label className="text-sm font-medium text-mountain-gray">Discount % (e.g. 15 for 15% off)</label>
                          <input 
                            type="number" 
                            min="0" 
                            max="100" 
                            required
                            className="w-full px-4 py-2 rounded-xl border border-mountain-gray/30 focus:border-mountain-moss outline-none" 
                            value={editingProduct.discountPercentage}
                            onChange={(e) => setEditingProduct({...editingProduct, discountPercentage: e.target.value})}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl text-mountain-gray font-medium hover:bg-mountain-gray/10">Cancel</button>
                          <button type="submit" className="px-4 py-2 bg-mountain-moss text-white rounded-xl font-medium hover:bg-mountain-brown">Save</button>
                        </div>
                      </form>
                    </div>
                  ) : null}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-mountain-gray/20 text-mountain-gray text-sm">
                          <th className="pb-3 font-medium">Product</th>
                          <th className="pb-3 font-medium">Base Price</th>
                          <th className="pb-3 font-medium">Discount</th>
                          <th className="pb-3 font-medium">Final Price</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(product => {
                          const finalPrice = product.price * (1 - product.discountPercentage / 100);
                          return (
                            <tr key={product._id} className="border-b border-mountain-gray/10 hover:bg-mountain-sand/10 transition-colors">
                              <td className="py-4 flex items-center gap-3">
                                <img src={product.image} className="w-10 h-10 rounded-lg object-cover bg-mountain-sand" />
                                <span className="font-medium text-mountain-brown">{product.name}</span>
                              </td>
                              <td className="py-4 text-mountain-gray">${product.price.toFixed(2)}</td>
                              <td className="py-4">
                                {product.discountPercentage > 0 ? (
                                  <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-bold">-{product.discountPercentage}%</span>
                                ) : (
                                  <span className="text-mountain-gray text-sm">None</span>
                                )}
                              </td>
                              <td className="py-4 font-bold text-mountain-moss">${finalPrice.toFixed(2)}</td>
                              <td className="py-4 text-right">
                                <button 
                                  onClick={() => setEditingProduct(product)}
                                  className="text-sm font-medium text-[#6498AF] hover:text-mountain-brown"
                                >
                                  Edit Price & Offer
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* --- ORDERS TAB --- */}
              {activeTab === 'orders' && (
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-mountain-gray/20">
                  <h3 className="text-xl font-bold text-mountain-brown mb-6">System Orders</h3>
                  
                  {orders.length === 0 ? (
                    <p className="text-mountain-gray text-center py-8">No orders have been placed yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order._id} className="border border-mountain-gray/30 rounded-2xl p-5">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                            <div>
                              <p className="text-sm text-mountain-gray font-medium">
                                Order #{order._id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleString()}
                              </p>
                              <p className="text-mountain-brown font-bold mt-1">Customer: {order.user?.name || 'Unknown'}</p>
                            </div>
                            <div className="flex gap-3 items-center">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                order.status === 'Pending' ? 'bg-mountain-gold/20 text-mountain-gold' : 
                                'bg-mountain-gray/20 text-mountain-brown'
                              }`}>
                                {order.status}
                              </span>
                              <span className="font-bold text-lg text-mountain-moss">${order.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 pt-4 border-t border-mountain-gray/10">
                            {order.orderItems.map((item, idx) => (
                              <span key={idx} className="text-xs bg-mountain-sand/50 text-mountain-gray px-2 py-1 rounded-md">
                                {item.qty}x {item.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* --- CMS TAB --- */}
              {activeTab === 'cms' && (
                <div className="bg-white rounded-3xl shadow-xl border border-mountain-gray/20 flex overflow-hidden h-[600px]">
                  {/* Users List */}
                  <div className="w-1/3 border-r border-mountain-gray/20 bg-mountain-sand/10 overflow-y-auto">
                    <div className="p-4 border-b border-mountain-gray/20 bg-white sticky top-0">
                      <h3 className="font-bold text-mountain-brown">Registered Customers</h3>
                    </div>
                    {usersList.map(u => (
                      <div 
                        key={u._id} 
                        onClick={() => handleUserClick(u)}
                        className={`p-4 border-b border-mountain-gray/10 cursor-pointer transition-colors ${
                          activeChatUser?._id === u._id ? 'bg-mountain-gold/20 border-l-4 border-l-mountain-gold' : 'hover:bg-mountain-sand/50'
                        }`}
                      >
                        <p className="font-bold text-mountain-brown truncate">{u.name}</p>
                        <p className="text-xs text-mountain-gray truncate">{u.email}</p>
                      </div>
                    ))}
                  </div>

                  {/* Chat Interface */}
                  <div className="w-2/3 flex flex-col bg-white">
                    {activeChatUser ? (
                      <>
                        <div className="p-4 border-b border-mountain-gray/20 bg-mountain-sand/5 flex items-center gap-3">
                          <div className="w-10 h-10 bg-mountain-moss/20 text-mountain-moss rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-mountain-brown">{activeChatUser.name}</h3>
                            <p className="text-xs text-mountain-gray">Live Support Chat</p>
                          </div>
                        </div>

                        <div className="flex-grow p-6 overflow-y-auto space-y-4">
                          {chatMessages.map((msg, idx) => {
                            // In admin view, isAdminMessage=true goes on right (admin sending)
                            const isMe = msg.isAdminMessage;
                            return (
                              <div key={idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                                  isMe 
                                    ? 'bg-mountain-moss text-white rounded-tr-sm' 
                                    : 'bg-mountain-sand/50 text-mountain-brown border border-mountain-gray/20 rounded-tl-sm'
                                }`}>
                                  {msg.content}
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>

                        <div className="p-4 bg-mountain-sand/10 border-t border-mountain-gray/20">
                          <form onSubmit={sendAdminMessage} className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder={`Reply to ${activeChatUser.name}...`}
                              className="flex-grow px-4 py-3 rounded-xl border border-mountain-gray/30 focus:outline-none focus:border-mountain-moss bg-white"
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                            />
                            <button 
                              type="submit"
                              disabled={!chatInput.trim()}
                              className="px-6 py-3 bg-mountain-gold text-white rounded-xl hover:bg-mountain-brown transition-colors disabled:opacity-50"
                            >
                              <Send className="w-5 h-5" />
                            </button>
                          </form>
                        </div>
                      </>
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-mountain-gray opacity-50 space-y-4">
                        <MessageSquare className="w-16 h-16" />
                        <p className="font-medium">Select a customer to view their chat history</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
