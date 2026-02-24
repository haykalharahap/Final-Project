import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { Heart, Star, ShoppingBag } from 'lucide-react';

interface FoodProps {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  isLiked?: boolean;
}

export function FoodCard({ id, name, description, price, imageUrl, rating, isLiked: initialLiked }: FoodProps) {
  const { dispatch } = useCart();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isAdding, setIsAdding] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a link
    setIsLiked(!isLiked);
    try {
      await api.toggleLike(id);
      toast(isLiked ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      setIsLiked(!isLiked); // revert
      toast.error("Failed to update like");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    setIsAdding(true);
    dispatch({ type: 'ADD_ITEM', payload: { id, name, price, imageUrl, quantity: 1 } });
    toast.success(`Added ${name} to cart`);
    setTimeout(() => setIsAdding(false), 500);
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(price);

  return (
    <Link to={`/food/${id}`} className="block bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl group">
      <div className="relative h-48 w-full">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <button 
          onClick={handleLike}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition-colors z-10 ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition">{name}</h3>
          <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded text-yellow-700 text-sm font-semibold">
            <Star className="w-3 h-3 fill-current mr-1" />
            {rating}
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 h-10">{description}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-orange-600">{formattedPrice}</span>
          <button 
            onClick={handleAddToCart}
            className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors z-10 ${isAdding ? 'bg-green-500 text-white' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
          >
            <ShoppingBag className="w-4 h-4 mr-1.5" />
            {isAdding ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
