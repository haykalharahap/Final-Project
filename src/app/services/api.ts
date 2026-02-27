// --- Configuration ---

const BASE_URL = "https://api-bootcamp.do.dibimbing.id";
const API_KEY = "w05KkI9AWhKxzvPFtXotUva-";

// --- Types ---

export interface Food {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ingredients: string[];
  price: number;
  priceDiscount: number;
  isLike: boolean;
  totalLikes: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profilePictureUrl: string;
  phoneNumber: string;
  role: "admin" | "user";
}

export interface Rating {
  id: string;
  rating: number;
  review: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  foodId: string;
  quantity: number;
  food: Food;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  imageUrl: string;
  virtualAccountNumber: string;
  virtualAccountName: string;
}

export interface TransactionItem {
  id: string;
  foodId: string;
  quantity: number;
  food: Food;
}

export interface Transaction {
  id: string;
  orderDate: string;
  totalPrice: number;
  status: string;
  paymentMethodId: string;
  paymentMethod: PaymentMethod;
  proofPaymentUrl: string | null;
  invoiceId: string;
  transaction_items: TransactionItem[];
  createdAt: string;
  updatedAt: string;
}

// --- API Helper ---

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    apiKey: API_KEY,
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // If body is FormData, remove Content-Type so browser sets it with boundary
  if (options.body instanceof FormData) {
    delete headers["Content-Type"];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// --- API SERVICE ---

export const api = {
  // ===== Authentication =====

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    passwordRepeat: string;
    role: string;
    profilePictureUrl: string;
    phoneNumber: string;
  }) => {
    return apiRequest("/api/v1/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (
    email: string,
    password: string
  ): Promise<{ status: string; message: string; token: string }> => {
    return apiRequest("/api/v1/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout: async () => {
    return apiRequest("/api/v1/logout", { method: "GET" });
  },

  // ===== User =====

  getUser: async (): Promise<{ status: string; message: string; user: User }> => {
    return apiRequest("/api/v1/user", { method: "GET" });
  },

  getAllUsers: async (): Promise<{ status: string; message: string; data: User[] }> => {
    return apiRequest("/api/v1/all-user", { method: "GET" });
  },

  updateProfile: async (userData: {
    name: string;
    email: string;
    profilePictureUrl: string;
    phoneNumber: string;
  }) => {
    return apiRequest("/api/v1/update-profile", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  updateUserRole: async (userId: string, role: string) => {
    return apiRequest(`/api/v1/update-user-role/${userId}`, {
      method: "POST",
      body: JSON.stringify({ role }),
    });
  },

  // ===== Food =====

  getFoods: async (): Promise<{ status: string; message: string; data: Food[] }> => {
    return apiRequest("/api/v1/foods", { method: "GET" });
  },

  getFoodById: async (
    id: string
  ): Promise<{ status: string; message: string; data: Food }> => {
    return apiRequest(`/api/v1/foods/${id}`, { method: "GET" });
  },

  createFood: async (foodData: {
    name: string;
    description: string;
    imageUrl: string;
    ingredients: string[];
    price: number;
    priceDiscount: number;
  }) => {
    return apiRequest("/api/v1/create-food", {
      method: "POST",
      body: JSON.stringify(foodData),
    });
  },

  updateFood: async (
    id: string,
    foodData: {
      name: string;
      description: string;
      imageUrl: string;
      ingredients: string[];
    }
  ) => {
    return apiRequest(`/api/v1/update-food/${id}`, {
      method: "POST",
      body: JSON.stringify(foodData),
    });
  },

  deleteFood: async (id: string) => {
    return apiRequest(`/api/v1/delete-food/${id}`, { method: "DELETE" });
  },

  // ===== Like =====

  likeFood: async (foodId: string) => {
    return apiRequest("/api/v1/like", {
      method: "POST",
      body: JSON.stringify({ foodId }),
    });
  },

  unlikeFood: async (foodId: string) => {
    return apiRequest("/api/v1/unlike", {
      method: "POST",
      body: JSON.stringify({ foodId }),
    });
  },

  getLikedFoods: async (): Promise<{ status: string; message: string; data: Food[] }> => {
    return apiRequest("/api/v1/like-foods", { method: "GET" });
  },

  // ===== Rating =====

  createRating: async (foodId: string, rating: number, review: string) => {
    return apiRequest(`/api/v1/rate-food/${foodId}`, {
      method: "POST",
      body: JSON.stringify({ rating, review }),
    });
  },

  getRatingByFoodId: async (
    foodId: string
  ): Promise<{ status: string; message: string; data: Rating[] }> => {
    return apiRequest(`/api/v1/food-rating/${foodId}`, { method: "GET" });
  },

  // ===== Payment Methods =====

  getPaymentMethods: async (): Promise<{
    status: string;
    message: string;
    data: PaymentMethod[];
  }> => {
    return apiRequest("/api/v1/payment-methods", { method: "GET" });
  },

  // ===== Cart =====

  addToCart: async (foodId: string) => {
    return apiRequest("/api/v1/add-cart", {
      method: "POST",
      body: JSON.stringify({ foodId }),
    });
  },

  updateCart: async (cartId: string, quantity: number) => {
    return apiRequest(`/api/v1/update-cart/${cartId}`, {
      method: "POST",
      body: JSON.stringify({ quantity }),
    });
  },

  deleteCart: async (cartId: string) => {
    return apiRequest(`/api/v1/delete-cart/${cartId}`, { method: "DELETE" });
  },

  getCarts: async (): Promise<{ status: string; message: string; data: CartItem[] }> => {
    return apiRequest("/api/v1/carts", { method: "GET" });
  },

  // ===== Transactions =====

  createTransaction: async (cartIds: string[], paymentMethodId: string) => {
    return apiRequest("/api/v1/create-transaction", {
      method: "POST",
      body: JSON.stringify({ cartIds, paymentMethodId }),
    });
  },

  getTransaction: async (
    id: string
  ): Promise<{ status: string; message: string; data: Transaction }> => {
    return apiRequest(`/api/v1/transaction/${id}`, { method: "GET" });
  },

  getMyTransactions: async (): Promise<{
    status: string;
    message: string;
    data: Transaction[];
  }> => {
    return apiRequest("/api/v1/my-transactions", { method: "GET" });
  },

  getAllTransactions: async (): Promise<{
    status: string;
    message: string;
    data: Transaction[];
  }> => {
    return apiRequest("/api/v1/all-transactions", { method: "GET" });
  },

  cancelTransaction: async (id: string) => {
    return apiRequest(`/api/v1/cancel-transaction/${id}`, { method: "POST" });
  },

  updateTransactionProof: async (id: string, proofPaymentUrl: string) => {
    return apiRequest(`/api/v1/update-transaction-proof-payment/${id}`, {
      method: "POST",
      body: JSON.stringify({ proofPaymentUrl }),
    });
  },

  updateTransactionStatus: async (id: string, status: string) => {
    return apiRequest(`/api/v1/update-transaction-status/${id}`, {
      method: "POST",
      body: JSON.stringify({ status }),
    });
  },

  // ===== Upload Image =====

  uploadImage: async (
    file: File
  ): Promise<{ status: string; message: string; url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiRequest("/api/v1/upload-image", {
      method: "POST",
      body: formData,
    });
  },
};
