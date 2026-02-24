import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { Search, Filter } from 'lucide-react';

const CATEGORIES = ["All", "Burger", "Pizza", "Sushi", "Salad", "Pasta", "Seafood", "Indonesian", "Soup", "Dessert"];

export function MenuPage() {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || "All";
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(categoryParam);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const loadFoods = async () => {
      setLoading(true);
      try {
        const data = await api.getFoods();
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

    if (activeCategory !== "All") {
      result = result.filter(food => food.category === activeCategory);
    }

    if (searchTerm) {
      result = result.filter(food => 
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoods(result);
  }, [foods, activeCategory, searchTerm]);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setSearchParams(cat === "All" ? {} : { category: cat });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Our Menu</h1>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search for food..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-colors ${
              activeCategory === cat 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredFoods.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFoods.map((food) => (
            <FoodCard key={food.id} {...food} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">No food found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          <button 
            onClick={() => {setSearchTerm(""); setActiveCategory("All"); setSearchParams({});}}
            className="mt-4 text-orange-600 font-semibold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
