import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Badge } from "../../components/ui/badge";
import { Search, Eye, Shield, User as UserIcon } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  profilePicture: string;
  role: "user" | "admin";
  status: "active" | "inactive";
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setLoading(true);
    // Simulated API call
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+62 812-3456-7890",
          profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
          role: "user",
          status: "active",
          joinDate: "2024-01-15",
          totalOrders: 12,
          totalSpent: 1450000,
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+62 813-9876-5432",
          profilePicture: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
          role: "user",
          status: "active",
          joinDate: "2024-01-20",
          totalOrders: 8,
          totalSpent: 890000,
        },
        {
          id: 3,
          name: "Admin User",
          email: "admin@example.com",
          phone: "+62 821-1111-2222",
          profilePicture: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
          role: "admin",
          status: "active",
          joinDate: "2024-01-01",
          totalOrders: 0,
          totalSpent: 0,
        },
        {
          id: 4,
          name: "Bob Johnson",
          email: "bob@example.com",
          phone: "+62 821-5555-6666",
          profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
          role: "user",
          status: "active",
          joinDate: "2024-02-01",
          totalOrders: 15,
          totalSpent: 1820000,
        },
        {
          id: 5,
          name: "Alice Brown",
          email: "alice@example.com",
          phone: "+62 822-7777-8888",
          profilePicture: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
          role: "user",
          status: "inactive",
          joinDate: "2024-01-10",
          totalOrders: 3,
          totalSpent: 250000,
        },
        {
          id: 6,
          name: "Charlie Wilson",
          email: "charlie@example.com",
          phone: "+62 823-4444-3333",
          profilePicture: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
          role: "user",
          status: "active",
          joinDate: "2024-02-10",
          totalOrders: 6,
          totalSpent: 520000,
        },
      ];
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setLoading(false);
    }, 500);
  };

  const handleToggleStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
    toast.success("User status updated successfully!");
  };

  const handleToggleRole = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              role: user.role === "user" ? "admin" : "user",
            }
          : user
      )
    );
    toast.success("User role updated successfully!");
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  const activeUsers = users.filter((u) => u.status === "active").length;
  const adminUsers = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-1">Manage registered users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-purple-600">{adminUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Total Spent</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{user.phone}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleRole(user.id)}
                        className={
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : ""
                        }
                      >
                        {user.role === "admin" ? (
                          <>
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </>
                        ) : (
                          <>
                            <UserIcon className="h-3 w-3 mr-1" />
                            User
                          </>
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleStatus(user.id)}
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }
                      >
                        {user.status}
                      </Button>
                    </TableCell>
                    <TableCell className="text-sm">{user.joinDate}</TableCell>
                    <TableCell className="text-center">{user.totalOrders}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(user.totalSpent)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.profilePicture}
                  alt={selectedUser.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                  <div className="flex gap-2 mt-2">
                    <Badge
                      variant={
                        selectedUser.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {selectedUser.role}
                    </Badge>
                    <Badge
                      variant={
                        selectedUser.status === "active"
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Join Date</p>
                  <p className="font-medium">{selectedUser.joinDate}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedUser.totalOrders}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(selectedUser.totalSpent)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
