import { useState, useEffect } from "react";

// --- MOCK DATA ---
const MOCK_FOODS = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    description: "Juicy beef patty with melted cheddar cheese, fresh lettuce, and tomato.",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    category: "Burger",
    ingredients: ["Beef Patty", "Cheddar Cheese", "Lettuce", "Tomato", "Bun"],
    isLiked: false,
  },
  {
    id: 2,
    name: "Margherita Pizza",
    description: "Classic Italian pizza with tomato sauce, mozzarella, and fresh basil.",
    price: 85000,
    imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    category: "Pizza",
    ingredients: ["Tomato Sauce", "Mozzarella", "Basil", "Dough"],
    isLiked: true,
  },
  {
    id: 3,
    name: "Sushi Platter",
    description: "Assorted fresh sushi rolls including salmon, tuna, and avocado.",
    price: 95000,
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    category: "Sushi",
    ingredients: ["Rice", "Salmon", "Tuna", "Seaweed", "Avocado"],
    isLiked: false,
  },
  {
    id: 4,
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with parmesan cheese, croutons, and Caesar dressing.",
    price: 35000,
    imageUrl: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    rating: 4.2,
    category: "Salad",
    ingredients: ["Romaine Lettuce", "Parmesan", "Croutons", "Caesar Dressing"],
    isLiked: false,
  },
  {
    id: 5,
    name: "Spaghetti Carbonara",
    description: "Traditional Italian pasta with eggs, cheese, pancetta, and black pepper.",
    price: 55000,
    imageUrl: "https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    category: "Pasta",
    ingredients: ["Spaghetti", "Eggs", "Pancetta", "Parmesan", "Black Pepper"],
    isLiked: true,
  },
  {
    id: 6,
    name: "Grilled Salmon",
    description: "Perfectly grilled salmon fillet served with steamed vegetables.",
    price: 98000,
    imageUrl: "https://images.unsplash.com/photo-1735315050688-010b5b548054?q=80&w=1285&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.9,
    category: "Seafood",
    ingredients: ["Salmon", "Lemon", "Asparagus", "Broccoli"],
    isLiked: false,
  },
  {
    id: 7,
    name: "Nasi Goreng Kampung",
    description: "Indonesian fried rice with chicken, egg, and traditional spices.",
    price: 25000,
    imageUrl: "https://thumb.viva.id/vivabanyuwangi/665x374/2025/07/16/6877ad1d7dba6-resep-nasi-goreng-kampung-sederhana-nikmat_banyuwangi.jpg",
    rating: 4.8,
    category: "Indonesian",
    ingredients: ["Rice", "Chicken", "Egg", "Sweet Soy Sauce", "Spices"],
    isLiked: false,
  },
  {
    id: 8,
    name: "Sate Ayam",
    description: "Grilled chicken skewers served with rich peanut sauce and rice cakes.",
    price: 30000,
    imageUrl: "https://assets.pikiran-rakyat.com/crop/0x0:0x0/1200x675/photo/2025/05/04/3494215350.jpg",
    rating: 4.9,
    category: "Indonesian",
    ingredients: ["Chicken", "Peanut Sauce", "Sweet Soy Sauce", "Rice Cake"],
    isLiked: true,
  },
  {
    id: 9,
    name: "Rendang",
    description: "Slow-cooked tender beef in rich coconut milk and spices.",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1688084546323-fcd3f9d8389b?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 5.0,
    category: "Indonesian",
    ingredients: ["Beef", "Coconut Milk", "Spices", "Chili"],
    isLiked: false,
  },
  {
    id: 10,
    name: "Gado-Gado",
    description: "Mixed steamed vegetables with tofu, tempeh, and peanut sauce dressing.",
    price: 20000,
    imageUrl: "https://images.unsplash.com/photo-1707269561481-a4a0370a980a?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    category: "Salad",
    ingredients: ["Spinach", "Bean Sprouts", "Tofu", "Tempeh", "Peanut Sauce"],
    isLiked: false,
  },
  {
    id: 11,
    name: "Soto Medan",
    description: "Traditional yellow chicken soup with vermicelli and boiled egg.",
    price: 22000,
    imageUrl: "https://awsimages.detik.net.id/community/media/visual/2020/12/04/5-tempat-makan-soto-medan-enak-di-jakarta-udang-dan-ayamnya-mantap_169.png?w=1200",
    rating: 4.7,
    category: "Soup",
    ingredients: ["Chicken", "Turmeric", "Vermicelli", "Egg", "Cabbage"],
    isLiked: false,
  },
  {
    id: 12,
    name: "Martabak Manis",
    description: "Thick sweet pancake with chocolate, cheese, and condensed milk.",
    price: 35000,
    imageUrl: "https://awsimages.detik.net.id/community/media/visual/2023/09/07/resep-martabak-manis-teflon_43.jpeg?w=1200",
    rating: 4.9,
    category: "Dessert",
    ingredients: ["Flour", "Chocolate", "Cheese", "Condensed Milk", "Butter"],
    isLiked: true,
  },
  {
    id: 13,
    name: "Bakso Beranak",
    description: "Giant meatball filled with smaller meatballs and quail eggs in savory broth.",
    price: 28000,
    imageUrl: "https://images.unsplash.com/photo-1687425973269-af0d62587769?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    category: "Soup",
    ingredients: ["Beef", "Tapioca", "Garlic", "Egg", "Scallions"],
    isLiked: false,
  },
  {
    id: 14,
    name: "Mie Goreng Jawa",
    description: "Javanese style fried noodles with chicken, vegetables and sweet soy sauce.",
    price: 22000,
    imageUrl: "https://images.unsplash.com/photo-1730177871173-94898b9a17ec?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    category: "Indonesian",
    ingredients: ["Noodles", "Chicken", "Cabbage", "Egg", "Sweet Soy Sauce"],
    isLiked: false,
  },
  {
    id: 15,
    name: "Ayam Geprek Sambal Matah",
    description: "Crispy fried chicken smashed with spicy Balinese raw shallot and chili sambal.",
    price: 25000,
    imageUrl: "https://assets.unileversolutions.com/recipes-v2/257353.jpg",
    rating: 4.9,
    category: "Indonesian",
    ingredients: ["Chicken", "Chili", "Shallots", "Lime", "Rice"],
    isLiked: true,
  },
  {
    id: 16,
    name: "Pempek Palembang",
    description: "Savory fish cake from Palembang filled with egg, served with sour vinegar sauce.",
    price: 18000,
    imageUrl: "https://www.generasimaju.co.id/articles/article/image-thumb__594928__webp/Pempek%20Palembang.webp",
    rating: 4.8,
    category: "Indonesian",
    ingredients: ["Fish", "Tapioca", "Egg", "Vinegar", "Cucumber"],
    isLiked: false,
  },
  {
    id: 17,
    name: "Soto Lamongan",
    description: "Rich beef soup with coconut milk broth, potatoes, and tomatoes.",
    price: 38000,
    imageUrl: "https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2023/07/17043644/Praktis-dan-Simpel-Ini-Resep-Soto-Ayam-Lamongan-yang-Menggugah-Selera-.jpg",
    rating: 4.9,
    category: "Soup",
    ingredients: ["Beef", "Coconut Milk", "Potato", "Tomato", "Emping"],
    isLiked: false,
  },
  {
    id: 18,
    name: "Rawon",
    description: "Traditional East Javanese black beef soup made with keluak nut.",
    price: 32000,
    imageUrl: "https://images.unsplash.com/photo-1708782344137-21c48d98dfcc?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    category: "Soup",
    ingredients: ["Beef", "Keluak", "Bean Sprouts", "Salted Egg", "Sambal"],
    isLiked: true,
  },
  {
    id: 19,
    name: "Mie Bangladesh",
    description: "Spicy noodles served with half-boiled egg and rich flavorful broth.",
    price: 22000,
    imageUrl: "https://img-global.cpcdn.com/recipes/096456f92bb120e8/1200x630cq80/photo.jpg",
    rating: 4.8,
    category: "Noodles",
    ingredients: ["Noodles", "Egg", "Spices", "Chili", "Vegetables"],
    isLiked: true,
  },
  {
    id: 20,
    name: "Es Kopi Susu Gula Aren",
    description: "Iced coffee with fresh milk and authentic palm sugar.",
    price: 18000,
    imageUrl: "https://images.unsplash.com/photo-1629688825560-917b9727c15b?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    category: "Coffee",
    ingredients: ["Coffee", "Fresh Milk", "Palm Sugar", "Ice"],
    isLiked: false,
  },
  {
    id: 21,
    name: "Hot Latte",
    description: "Classic espresso with steamed milk and thick foam.",
    price: 28000,
    imageUrl: "https://st2.depositphotos.com/5355656/7824/i/950/depositphotos_78249960-stock-photo-hot-cafe-latte-and-coffee.jpg",
    rating: 4.7,
    category: "Coffee",
    ingredients: ["Espresso", "Steamed Milk", "Foam"],
    isLiked: false,
  },
  {
    id: 22,
    name: "Iced Lemon Tea",
    description: "Refreshing iced tea with a splash of fresh lemon.",
    price: 12000,
    imageUrl: "https://images.unsplash.com/photo-1560023907-5f339617ea30?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    category: "Tea",
    ingredients: ["Tea", "Lemon", "Sugar", "Ice"],
    isLiked: false,
  },
  {
    id: 23,
    name: "Thai Milk Tea",
    description: "Sweet and creamy Thai tea with condensed milk.",
    price: 18000,
    imageUrl: "https://www.seriouseats.com/thmb/ZEGPLnXaVrnmpvElVWYxwnOtoaw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20240628-ThaiIcedTea-AmandaSuarez-hero10-20560485c8c2468aab5c065afaa16018.jpg",
    rating: 4.8,
    category: "Tea",
    ingredients: ["Thai Tea", "Condensed Milk", "Ice", "Sugar"],
    isLiked: true,
  },
  {
    id: 24,
    name: "Chamomile Tea",
    description: "Classic hot chamomile tea to warm your day.",
    price: 5000,
    imageUrl: "https://images-prod.healthline.com/hlcmsresource/images/chamomile-tea.jpg",
    rating: 4.5,
    category: "Tea",
    ingredients: ["Chamomile Tea", "Water", "Sugar (Optional)"],
    isLiked: false,
  }
];

// --- API SERVICE ---

export const api = {
  // Simulating API calls with delays
  getFoods: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_FOODS), 500);
    });
  },

  getFoodById: async (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(MOCK_FOODS.find((f) => f.id === id)), 500);
    });
  },

  toggleLike: async (id: number) => {
     // In a real app, this would call the API
     console.log(`Toggled like for food ${id}`);
     return Promise.resolve(true);
  },

  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "user@example.com" && password === "password") {
          resolve({
            token: "fake-jwt-token",
            user: {
              id: 1,
              name: "John Doe",
              email: "user@example.com",
              profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
            },
          });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  },
  
  register: async (userData) => {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve({
                  token: "fake-jwt-token",
                  user: {
                      id: 2,
                      name: userData.name,
                      email: userData.email,
                      profilePicture: "https://via.placeholder.com/150"
                  }
              })
          }, 800);
      })
  },

  getTransactions: async () => {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve([
                  { id: "TRX-001", date: "2023-10-01", total: 115000, status: "Completed", items: ["Margherita Pizza", "Sate Ayam"] },
                  { id: "TRX-002", date: "2023-10-05", total: 45000, status: "Pending", items: ["Classic Cheeseburger"] }
              ])
          }, 600);
      })
  }
};
