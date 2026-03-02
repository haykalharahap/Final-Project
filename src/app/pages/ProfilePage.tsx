import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, type Transaction } from '../services/api';
import { Package, LogOut, Upload, Image } from 'lucide-react';
import { useNavigate } from 'react-router';
import { formatPrice } from '../utils';
import { toast } from 'sonner';

export function ProfilePage() {
  const { user, logout } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingProof, setUploadingProof] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadData = async () => {
      try {
        const response = await api.getMyTransactions();
        setTransactions(response.data || []);
      } catch (error) {
        console.error("Failed to load transactions", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [user, navigate]);

  const handleUploadProof = async (transactionId: string, file: File) => {
    setUploadingProof(transactionId);
    try {
      // Upload image first
      const uploadRes = await api.uploadImage(file);
      const imageUrl = uploadRes.url;

      // Update transaction proof
      await api.updateTransactionProof(transactionId, imageUrl);

      // Update local state
      setTransactions(transactions.map(t =>
        t.id === transactionId ? { ...t, proofPaymentUrl: imageUrl } : t
      ));

      toast.success('Bukti pembayaran berhasil diupload!');
    } catch (error: any) {
      toast.error(error.message || 'Gagal mengupload bukti pembayaran');
    } finally {
      setUploadingProof(null);
    }
  };

  if (!user) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'success': return 'Disetujui';
      case 'failed': return 'Ditolak';
      case 'pending': return 'Menunggu';
      default: return status;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        {/* User Info Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100 text-center">
            <img
              src={user.profilePictureUrl}
              alt={user.name}
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-3 sm:mb-4 object-cover border-4 border-orange-100"
            />
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-500 text-sm sm:text-base">{user.email}</p>
            {user.phoneNumber && (
              <p className="text-gray-400 text-xs sm:text-sm mt-1">{user.phoneNumber}</p>
            )}
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                {user.role}
              </span>
            </div>

            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg hover:bg-red-100 transition mt-5 sm:mt-6 text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Transaction History */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-2 mb-4 sm:mb-6 pb-3 sm:pb-4 border-b">
              <Package className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order History</h2>
            </div>

            {loading ? (
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>)}
              </div>
            ) : transactions.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {transactions.map((trx) => (
                  <div key={trx.id} className="flex flex-col p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                      <div className="w-full sm:w-auto">
                        <p className="font-bold text-gray-800 text-sm sm:text-base">{trx.invoiceId || trx.id.slice(0, 8)}</p>
                        <p className="text-xs sm:text-sm text-gray-500">{new Date(trx.orderDate || trx.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-400 mt-0.5 sm:mt-1 line-clamp-1">
                          {trx.transaction_items?.map(item => item.food?.name).filter(Boolean).join(", ") || 'No items'}
                        </p>
                      </div>
                      <div className="flex items-center sm:flex-col gap-2 sm:gap-1 sm:items-end w-full sm:w-auto mt-1 sm:mt-0">
                        <span className={`px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${trx.status === 'success' ? 'bg-green-100 text-green-700' :
                          trx.status === 'failed' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                          {getStatusLabel(trx.status)}
                        </span>
                        <span className="font-bold text-orange-600 text-sm sm:text-base">{formatPrice(trx.totalPrice)}</span>
                      </div>
                    </div>

                    {/* Upload Proof Payment Section */}
                    {trx.status === 'pending' && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {trx.proofPaymentUrl ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <Image className="w-4 h-4" />
                              <span className="font-medium">Bukti sudah diupload</span>
                            </div>
                            <a
                              href={trx.proofPaymentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 text-xs hover:underline"
                            >
                              Lihat bukti
                            </a>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <label className="flex items-center gap-2 bg-orange-50 text-orange-600 px-3 py-2 rounded-lg cursor-pointer hover:bg-orange-100 transition text-sm font-medium">
                              <Upload className="w-4 h-4" />
                              {uploadingProof === trx.id ? 'Mengupload...' : 'Upload Bukti Transfer'}
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                disabled={uploadingProof === trx.id}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleUploadProof(trx.id, file);
                                }}
                              />
                            </label>
                            <span className="text-xs text-gray-400">Upload bukti pembayaran untuk diverifikasi admin</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No orders found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
