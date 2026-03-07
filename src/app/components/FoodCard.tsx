import { Link } from 'react-router';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { useState } from 'react';
import { toast } from 'sonner';
import { Heart, Star, ShoppingBag, ThumbsDown } from 'lucide-react';
import { formatPrice } from '../utils';

interface FoodProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating?: number;
  isLike?: boolean;
}

export function FoodCard({ id, name, description, price, imageUrl, rating, isLike: initialLiked }: FoodProps) {
  const { dispatch } = useCart();
  const [isLiked, setIsLiked] = useState(initialLiked || false);
  const [isDisliked, setIsDisliked] = useState(() => {
    const disliked = localStorage.getItem(`dislike-${id}`);
    return disliked === 'true';
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    // If disliked, remove dislike when liking
    if (isDisliked) {
      setIsDisliked(false);
      localStorage.removeItem(`dislike-${id}`);
    }
    try {
      if (wasLiked) {
        await api.unlikeFood(id);
        toast('Removed from favorites');
      } else {
        await api.likeFood(id);
        toast('Added to favorites');
      }
    } catch (error) {
      setIsLiked(wasLiked);
      toast.error('Please login to like foods');
    }
  };

  const handleDislike = async (e: React.MouseEvent) => {
    e.preventDefault();
    const wasDisliked = isDisliked;
    setIsDisliked(!isDisliked);
    // If liked, remove like when disliking
    if (isLiked) {
      setIsLiked(false);
      try {
        await api.unlikeFood(id);
      } catch {
        // ignore
      }
    }
    if (!wasDisliked) {
      localStorage.setItem(`dislike-${id}`, 'true');
      toast('Marked as disliked');
    } else {
      localStorage.removeItem(`dislike-${id}`);
      toast('Removed dislike');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    dispatch({ type: 'ADD_ITEM', payload: { id, name, price, imageUrl, quantity: 1 } });
    toast.success(`Added ${name} to cart`);
    setTimeout(() => setIsAdding(false), 500);
  };

  const formattedPrice = formatPrice(price);

  return (
    <Link to={`/food/${id}`} className="block bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl group">
      <div className="relative h-36 sm:h-48 w-full">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleLike}
            className={`p-1.5 sm:p-2 rounded-full shadow-md transition-colors ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleDislike}
            className={`p-1.5 sm:p-2 rounded-full shadow-md transition-colors ${isDisliked ? 'bg-gray-700 text-white' : 'bg-white text-gray-400 hover:text-gray-700'}`}
          >
            <ThumbsDown className={`w-4 h-4 sm:w-5 sm:h-5 ${isDisliked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="flex justify-between items-start mb-1 sm:mb-2 gap-1">
          <h3 className="text-sm sm:text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-orange-600 transition">{name}</h3>
          {rating !== undefined && rating > 0 && (
            <div className="flex items-center bg-yellow-100 px-1.5 sm:px-2 py-0.5 rounded text-yellow-700 text-xs font-semibold flex-shrink-0">
              <Star className="w-3 h-3 fill-current mr-0.5" />
              {rating.toFixed(1)}
            </div>
          )}
        </div>
        <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 h-8 sm:h-10">{description}</p>
        <div className="flex items-center justify-between mt-auto gap-2">
          <span className="text-sm sm:text-lg font-bold text-orange-600 truncate">{formattedPrice}</span>
          <button
            onClick={handleAddToCart}
            className={`flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors z-10 flex-shrink-0 ${isAdding ? 'bg-green-500 text-white' : 'bg-orange-600 text-white hover:bg-orange-700'}`}
          >
            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {isAdding ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
