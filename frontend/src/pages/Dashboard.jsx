import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, LogOut, Package, Clock, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const [profileRes, ordersRes] = await Promise.all([
          axios.get('/api/auth/profile', config),
          axios.get('/api/orders/myorders', config)
        ]);
        setProfileData(profileRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-mountain-sand py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-mountain-brown mb-8 animate-slide-up opacity-0">My Dashboard</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-mountain-gray/20 animate-fade-in opacity-0 sticky top-24" style={{ animationDelay: '0.2s' }}>
              <div className="w-24 h-24 bg-mountain-moss/20 text-mountain-moss rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12" />
              </div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-mountain-brown">{user?.name}</h2>
                <p className="text-mountain-gray">{user?.email}</p>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={logout}
                  className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* User Details & Activity */}
          <div className="md:col-span-2 space-y-8 animate-fade-in opacity-0" style={{ animationDelay: '0.4s' }}>
            
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-mountain-gray/20">
              <h3 className="text-xl font-bold text-mountain-brown mb-6 border-b border-mountain-gray/20 pb-4">Profile Information</h3>
              {profileData && !loading ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-mountain-gray mb-1">Full Name</p>
                    <p className="text-lg text-mountain-brown font-semibold">{profileData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-mountain-gray mb-1">Email Address</p>
                    <p className="text-lg text-mountain-brown font-semibold">{profileData.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-mountain-gray mb-1">Member Since</p>
                    <p className="text-lg text-mountain-brown font-semibold">
                      {new Date(profileData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-mountain-gray">Loading profile...</p>
              )}
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-xl border border-mountain-gray/20">
              <div className="flex items-center justify-between mb-6 border-b border-mountain-gray/20 pb-4">
                <h3 className="text-xl font-bold text-mountain-brown flex items-center gap-2">
                  <Package className="w-6 h-6 text-mountain-moss" /> My Orders
                </h3>
              </div>
              
              {loading ? (
                <p className="text-mountain-gray">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-mountain-gray/50 mx-auto mb-3" />
                  <p className="text-mountain-gray">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order._id} className="border border-mountain-gray/30 rounded-2xl p-5 hover:border-mountain-moss/50 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <div>
                          <p className="text-sm text-mountain-gray font-medium">Order #{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-xs text-mountain-gray">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            order.status === 'Pending' ? 'bg-mountain-gold/20 text-mountain-gold' : 
                            order.status === 'Shipped' ? 'bg-mountain-moss/20 text-mountain-moss' : 
                            'bg-mountain-gray/20 text-mountain-brown'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover bg-mountain-sand/20" />
                            <div className="flex-grow">
                              <p className="text-sm font-bold text-mountain-brown">{item.name}</p>
                              <p className="text-xs text-mountain-gray">Qty: {item.qty}</p>
                            </div>
                            <p className="text-sm font-bold text-mountain-moss">${(item.price * item.qty).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-mountain-gray/20 flex justify-between items-center">
                        <span className="font-medium text-mountain-gray">Total Amount</span>
                        <span className="font-bold text-lg text-mountain-brown">${order.totalPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
