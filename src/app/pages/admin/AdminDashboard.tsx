import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  UtensilsCrossed
} from "lucide-react";
import { formatPrice } from '../../utils';
import { api, type Food, type Transaction, type User } from '../../services/api';

export function AdminDashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFoods, setTotalFoods] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Transaction[]>([]);
  const [popularFoods, setPopularFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodsRes, usersRes, transactionsRes] = await Promise.all([
          api.getFoods(),
          api.getAllUsers(),
          api.getAllTransactions(),
        ]);

        const foods = foodsRes.data || [];
        const users = usersRes.data || [];
        const transactions = transactionsRes.data || [];

        setTotalFoods(foods.length);
        setTotalUsers(users.length);
        setTotalOrders(transactions.length);
        setTotalRevenue(
          transactions
            .filter(t => t.status === 'success')
            .reduce((sum, t) => sum + (t.totalPrice || 0), 0)
        );
        setRecentOrders(transactions.slice(0, 5));
        setPopularFoods(foods.sort((a, b) => (b.totalLikes || 0) - (a.totalLikes || 0)).slice(0, 5));
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Foods",
      value: totalFoods,
      icon: UtensilsCrossed,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back, Admin! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.invoiceId || order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">{new Date(order.orderDate || order.createdAt).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatPrice(order.totalPrice)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${order.status === "success"
                        ? "bg-green-100 text-green-700"
                        : order.status === "failed"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No orders yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Popular Foods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Most Liked Foods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularFoods.map((food, index) => (
                <div
                  key={food.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={food.imageUrl} alt={food.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-sm text-gray-600">❤️ {food.totalLikes || 0} likes</p>
                      </div>
                    </div>
                  </div>
                  <p className="font-medium text-green-600">
                    {formatPrice(food.price)}
                  </p>
                </div>
              ))}
              {popularFoods.length === 0 && (
                <p className="text-gray-500 text-center py-4">No foods yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
