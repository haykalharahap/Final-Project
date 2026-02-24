import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { User, Package, CreditCard, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    const loadData = async () => {
      try {
        const data = await api.getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(price);
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <img 
              src={user.profilePicture} 
              alt={user.name} 
              className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-orange-100"
            />
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 mb-6">{user.email}</p>
            
            <button 
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="md:col-span-2">
           <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
             <div className="flex items-center gap-2 mb-6 pb-4 border-b">
               <Package className="w-6 h-6 text-orange-600" />
               <h2 className="text-xl font-bold text-gray-800">Order History</h2>
             </div>
             
             {loading ? (
               <div className="space-y-4">
                 {[1,2,3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>)}
               </div>
             ) : transactions.length > 0 ? (
               <div className="space-y-4">
                 {transactions.map((trx) => (
                   <div key={trx.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition">
                      <div className="mb-2 sm:mb-0 text-center sm:text-left">
                        <p className="font-bold text-gray-800">{trx.id}</p>
                        <p className="text-sm text-gray-500">{trx.date}</p>
                        <p className="text-xs text-gray-400 mt-1">{trx.items.join(", ")}</p>
                      </div>
                      <div className="text-right flex flex-col items-center sm:items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold mb-1 ${trx.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {trx.status}
                        </span>
                        <span className="font-bold text-orange-600">{formatPrice(trx.total)}</span>
                      </div>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-gray-500 text-center py-8">No orders found.</p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
