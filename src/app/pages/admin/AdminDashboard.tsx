import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  UtensilsCrossed
} from "lucide-react";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalFoods: number;
  recentOrders: any[];
  popularFoods: any[];
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalFoods: 0,
    recentOrders: [],
    popularFoods: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated data fetch
    setTimeout(() => {
      setStats({
        totalRevenue: 15750000,
        totalOrders: 342,
        totalUsers: 156,
        totalFoods: 24,
        recentOrders: [
          { id: "ORD-001", customer: "John Doe", total: 125000, status: "Completed" },
          { id: "ORD-002", customer: "Jane Smith", total: 85000, status: "Pending" },
          { id: "ORD-003", customer: "Bob Johnson", total: 95000, status: "Processing" },
          { id: "ORD-004", customer: "Alice Brown", total: 155000, status: "Completed" },
          { id: "ORD-005", customer: "Charlie Wilson", total: 65000, status: "Pending" },
        ],
        popularFoods: [
          { name: "Rendang", orders: 89, revenue: 4005000 },
          { name: "Sate Ayam", orders: 76, revenue: 2280000 },
          { name: "Nasi Goreng Kampung", orders: 68, revenue: 1700000 },
          { name: "Margherita Pizza", orders: 54, revenue: 4590000 },
          { name: "Martabak Manis", orders: 45, revenue: 1575000 },
        ],
      });
      setLoading(false);
    }, 500);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Foods",
      value: stats.totalFoods,
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
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(order.total)}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Foods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Popular Foods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.popularFoods.map((food, index) => (
                <div
                  key={food.name}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{food.name}</p>
                      <p className="text-sm text-gray-600">{food.orders} orders</p>
                    </div>
                  </div>
                  <p className="font-medium text-green-600">
                    {formatCurrency(food.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
