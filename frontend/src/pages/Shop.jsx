import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, setIsCartOpen } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('/api/products');
        setProducts(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-mountain-sand/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-slide-up opacity-0" style={{ animationDelay: '0.1s' }}>
          <h1 className="text-4xl font-bold text-mountain-brown mb-4">Retail Shop</h1>
          <p className="text-mountain-gray text-lg max-w-2xl mx-auto">
            Fresh, farm-to-table eggs delivered straight to your door.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-mountain-gray text-xl">Loading fresh eggs...</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <div 
                key={product._id} 
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-mountain-gray/20 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in opacity-0 flex flex-col"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="h-48 overflow-hidden bg-mountain-gray/10 relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-red-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm">
                      {product.discountPercentage}% OFF
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-mountain-brown shadow-sm flex flex-col items-end">
                    {product.discountPercentage > 0 ? (
                      <>
                        <span className="text-xs line-through text-mountain-gray/70">${product.price.toFixed(2)}</span>
                        <span>${(product.price * (1 - product.discountPercentage / 100)).toFixed(2)}</span>
                      </>
                    ) : (
                      <span>${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-mountain-brown mb-2">{product.name}</h3>
                  <p className="text-mountain-gray text-sm mb-6 flex-grow">{product.description}</p>
                  
                  <button 
                    onClick={() => {
                      addToCart(product);
                      setIsCartOpen(true);
                    }}
                    className="w-full py-3 bg-mountain-moss text-white rounded-xl font-medium hover:bg-mountain-brown transition-colors flex items-center justify-center gap-2 shadow-md shadow-mountain-moss/20"
                  >
                    <ShoppingCart className="w-5 h-5" /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
