import { useParams } from 'react-router';
import { api, type Food, type Rating } from '../services/api';
import { useCart } from '../context/CartContext';
import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Heart, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { formatPrice } from '../utils';

export function FoodDetailPage() {
  const { id } = useParams();
  const [food, setFood] = useState<Food | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const { dispatch } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // Rating form
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadFood = async () => {
      try {
        const response = await api.getFoodById(id);
        if (response.data) {
          setFood(response.data);
          setIsLiked(response.data.isLike || false);
        }
        // Load ratings
        try {
          const ratingsResponse = await api.getRatingByFoodId(id);
          setRatings(ratingsResponse.data || []);
        } catch {
          // Ratings may not exist yet
        }
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
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: 'ADD_ITEM', payload: { id: food.id, name: food.name, price: food.price, imageUrl: food.imageUrl, quantity: 1 } });
    }
    toast.success(`Added ${quantity} ${food.name} to cart`);
  };

  const handleLike = async () => {
    if (!food) return;
    const wasLiked = isLiked;
    setIsLiked(!isLiked);
    try {
      if (wasLiked) {
        await api.unlikeFood(food.id);
        toast("Removed from favorites");
      } else {
        await api.likeFood(food.id);
        toast("Added to favorites");
      }
    } catch (error) {
      setIsLiked(wasLiked);
      toast.error("Please login to like foods");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!food) return;
    setSubmittingReview(true);
    try {
      await api.createRating(food.id, ratingValue, reviewText);
      toast.success('Review submitted!');
      setReviewText('');
      setRatingValue(5);
      // Refresh ratings
      const ratingsResponse = await api.getRatingByFoodId(food.id);
      setRatings(ratingsResponse.data || []);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review. Please login first.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-orange-600 font-bold text-xl animate-pulse">Loading...</div>;
  if (!food) return <div className="h-screen flex items-center justify-center text-red-600 font-bold text-xl">Food not found</div>;

  const formattedPrice = formatPrice(food.price * quantity);
  const avgRating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length : 0;

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
            {avgRating > 0 && (
              <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-700">
                <Star className="w-4 h-4 fill-current mr-1" />
                <span className="font-bold">{avgRating.toFixed(1)}</span>
                <span className="text-xs ml-1 text-gray-500">({ratings.length} reviews)</span>
              </div>
            )}
            {food.totalLikes > 0 && (
              <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                ❤️ {food.totalLikes} likes
              </span>
            )}
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
            <div>
              <div className="text-3xl font-bold text-orange-600">{formattedPrice}</div>
              {food.priceDiscount > 0 && food.priceDiscount !== food.price && (
                <div className="text-sm text-gray-400 line-through">{formatPrice(food.priceDiscount)}</div>
              )}
            </div>
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

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews ({ratings.length})</h2>

        {/* Add Review Form */}
        <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Write a Review</h3>
          <div className="flex items-center gap-2 mb-4">
            <label className="text-sm font-medium text-gray-700">Rating:</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRatingValue(star)}
                  className={`p-1 ${star <= ratingValue ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  <Star className={`w-6 h-6 ${star <= ratingValue ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-4"
            rows={3}
            required
          />
          <button
            type="submit"
            disabled={submittingReview}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
          >
            {submittingReview ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews List */}
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((r) => (
              <div key={r.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  {r.user?.profilePictureUrl && (
                    <img src={r.user.profilePictureUrl} alt={r.user.name} className="w-8 h-8 rounded-full object-cover" />
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{r.user?.name || 'Anonymous'}</p>
                    <div className="flex items-center text-yellow-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">{r.review}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
