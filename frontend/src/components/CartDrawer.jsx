import { useContext } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const CartDrawer = () => {
  const { isCartOpen, setIsCartOpen, cartItems, removeFromCart, clearCart, getCartTotal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to checkout');
      setIsCartOpen(false);
      navigate('/login');
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };
      
      const orderData = {
        orderItems: cartItems,
        totalPrice: getCartTotal(),
        orderType: 'Retail'
      };

      await axios.post('/api/orders', orderData, config);
      toast.success('Order placed successfully!');
      clearCart();
      setIsCartOpen(false);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Checkout failed. Please try again.');
      console.error(error);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-mountain-brown/50 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-mountain-gray/20 flex items-center justify-between bg-mountain-sand/10">
          <h2 className="text-2xl font-bold text-mountain-brown flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" /> Your Cart
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-mountain-gray hover:text-mountain-brown hover:bg-mountain-gray/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-mountain-gray space-y-4 opacity-70">
              <ShoppingBag className="w-16 h-16" />
              <p className="text-lg font-medium">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.product} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-mountain-gray/20 shadow-sm">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-mountain-sand/20 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-mountain-brown line-clamp-1">{item.name}</h4>
                    <p className="text-sm text-mountain-gray">Qty: {item.qty}</p>
                    <p className="font-bold text-mountain-moss mt-1">${(item.price * item.qty).toFixed(2)}</p>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.product)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-mountain-gray/20 bg-mountain-sand/5">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg text-mountain-gray font-medium">Total</span>
              <span className="text-2xl font-bold text-mountain-brown">${getCartTotal()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 bg-mountain-moss text-white rounded-xl font-bold text-lg hover:bg-mountain-brown transition-all duration-300 shadow-lg shadow-mountain-moss/30 transform hover:-translate-y-0.5"
            >
              Checkout Now
            </button>
            <button 
              onClick={clearCart}
              className="w-full py-3 mt-3 text-mountain-gray font-medium hover:text-mountain-brown transition-colors"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
