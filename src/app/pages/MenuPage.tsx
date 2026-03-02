import { useState, useEffect } from 'react';
import { api, type Food } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { Search, Filter } from 'lucide-react';

export function MenuPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadFoods = async () => {
      setLoading(true);
      try {
        const response = await api.getFoods();
        const data = response.data || [];
        setFoods(data);
        setFilteredFoods(data);
      } catch (error) {
        console.error("Failed to load foods", error);
      } finally {
        setLoading(false);
      }
    };
    loadFoods();
  }, []);

  useEffect(() => {
    let result = foods;

    if (searchTerm) {
      result = result.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoods(result);
  }, [foods, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Our Menu</h1>

        {/* Search Bar */}
        <div className="relative w-full sm:w-80 md:w-96">
          <input
            type="text"
            placeholder="Search for food..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-60 sm:h-80 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredFoods.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} id={food.id} name={food.name} description={food.description} price={food.price} imageUrl={food.imageUrl} rating={food.rating} isLike={food.isLike} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20">
          <div className="bg-gray-100 rounded-full p-5 sm:p-6 inline-block mb-4">
            <Filter className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">No food found</h3>
          <p className="text-gray-500 text-sm sm:text-base">Try adjusting your search criteria.</p>
          <button
            onClick={() => setSearchTerm("")}
            className="mt-4 text-orange-600 font-semibold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
