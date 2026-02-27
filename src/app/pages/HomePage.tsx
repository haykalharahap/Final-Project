import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { api, type Food } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { ArrowRight, Utensils, Zap, ThumbsUp } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function HomePage() {
  const [featuredFoods, setFeaturedFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribed, setSubscribed] = useState(() => !!localStorage.getItem('subscribed'));

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const response = await api.getFoods();
        setFeaturedFoods((response.data || []).slice(0, 4));
      } catch (error) {
        console.error("Failed to load foods", error);
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-orange-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left md:w-1/2"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
              Delicious Food <br /> Delivered To You
            </h1>
            <p className="text-lg md:text-xl text-orange-100 mb-8 max-w-lg mx-auto md:mx-0">
              Experience the best cuisine from top local restaurants. Fast delivery, fresh ingredients, and unforgettable flavors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/menu" className="bg-white text-orange-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-lg flex items-center justify-center">
                Order Now <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/menu" className="bg-orange-700 bg-opacity-50 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-70 transition border border-orange-400 flex items-center justify-center">
                View Menu
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background Image Overlay */}
        <div className="absolute top-0 right-0 w-full h-full md:w-2/3 md:h-full z-0 opacity-20 md:opacity-100 md:mask-image-gradient-to-l pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
            alt="Hero Food"
            className="w-full h-full object-cover md:object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-orange-600/80 to-transparent md:via-transparent"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4 text-orange-600">
              <Utensils className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quality Food</h3>
            <p className="text-gray-500">We partner with the best restaurants to ensure high quality meals.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4 text-orange-600">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
            <p className="text-gray-500">We deliver your food hot and fresh in under 30 minutes.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
            <div className="bg-orange-100 p-4 rounded-full mb-4 text-orange-600">
              <ThumbsUp className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">Best Service</h3>
            <p className="text-gray-500">Our customer support is available 24/7 to assist you.</p>
          </div>
        </div>
      </section>

      {/* Featured/Popular Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Popular Now</h2>
          <Link to="/menu" className="text-orange-600 font-semibold hover:underline">See More</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredFoods.map((food) => (
              <FoodCard key={food.id} id={food.id} name={food.name} description={food.description} price={food.price} imageUrl={food.imageUrl} rating={food.rating} isLike={food.isLike} />
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get 20% Discount On First Order</h2>
            <p className="text-gray-400 mb-8">Join our community and start enjoying delicious food at the best prices.</p>
            {subscribed ? (
              <div className="bg-green-900/50 border border-green-500/30 rounded-lg p-4 max-w-md">
                <p className="text-green-400 font-bold text-lg mb-1">🎉 You're subscribed!</p>
                <p className="text-gray-300 text-sm">Use promo code <span className="font-mono bg-orange-600 px-2 py-0.5 rounded text-white font-bold">SINGGAH20</span> at checkout for 20% off.</p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!subscribeEmail || !subscribeEmail.includes('@')) {
                    toast.error('Please enter a valid email address');
                    return;
                  }
                  localStorage.setItem('subscribed', subscribeEmail);
                  setSubscribed(true);
                  toast.success('🎉 Subscribed! Use promo code SINGGAH20 for 20% discount on your first order!');
                }}
                className="flex gap-4"
              >
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="px-4 py-3 rounded-lg text-gray-900 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button type="submit" className="bg-orange-600 px-6 py-3 rounded-lg font-bold hover:bg-orange-700 transition whitespace-nowrap">Subscribe</button>
              </form>
            )}
          </div>
          <div className="md:w-1/3">
          </div>
        </div>
      </section>
    </div>
  );
}
