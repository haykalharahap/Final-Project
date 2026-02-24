import { useParams } from 'react-router';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function FoodDetailPage() {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadFood = async () => {
      try {
        const data = await api.getFoodById(parseInt(id));
        setFood(data);
        setIsLiked(data.isLiked);
      } catch (error) {
        console.error("Failed to load food", error);
      } finally {
        setLoading(false);
      }
    };
    loadFood();
  }, [id]);

  const handleAddToCart = () => {
    if (!food) return;
    dispatch({ type: 'ADD_ITEM', payload: { ...food, quantity } });
    toast.success(`Added ${quantity} ${food.name} to cart`);
  };

  const handleLike = async () => {
    if (!food) return;
    setIsLiked(!isLiked);
    try {
      await api.toggleLike(food.id);
      toast(isLiked ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      setIsLiked(!isLiked);
      toast.error("Failed to update like");
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-orange-600 font-bold text-xl animate-pulse">Loading...</div>;
  if (!food) return <div className="h-screen flex items-center justify-center text-red-600 font-bold text-xl">Food not found</div>;

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(food.price * quantity);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Image Section */}
        <div className="md:w-1/2 rounded-2xl overflow-hidden shadow-2xl relative">
          <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover max-h-[500px]" />
          <button 
            onClick={handleLike}
            className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Details Section */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">{food.category}</span>
            <div className="flex items-center text-yellow-500">
               <Star className="w-4 h-4 fill-current mr-1" />
               <span className="font-bold text-gray-700">{food.rating}</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{food.name}</h1>
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">{food.description}</p>
          
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 mb-2">Ingredients:</h3>
            <ul className="flex flex-wrap gap-2">
              {food.ingredients?.map((ing: string) => (
                <li key={ing} className="bg-gray-100 px-3 py-1 rounded-md text-sm text-gray-600 border border-gray-200">{ing}</li>
              ))}
            </ul>
          </div>

          <div className="flex items-center justify-between mb-8 border-t border-b border-gray-100 py-6">
             <div className="text-3xl font-bold text-orange-600">{formattedPrice}</div>
             <div className="flex items-center border border-gray-300 rounded-lg">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-gray-600 hover:text-orange-600 disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="px-4 font-bold text-lg w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-gray-600 hover:text-orange-600"
                >
                  <Plus className="w-5 h-5" />
                </button>
             </div>
          </div>

          <button 
            onClick={handleAddToCart}
            className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-6 h-6" /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
