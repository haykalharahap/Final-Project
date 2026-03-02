import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Search,
  CheckCircle,
  XCircle,
  Eye,
  CreditCard,
  Clock,
  ImageIcon,
  ExternalLink,
  Filter,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { api, type Transaction } from "../../services/api";
import { formatPrice } from "../../utils";

type FilterStatus = "all" | "pending" | "success" | "failed";

export function PaymentApproval() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("pending");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchTransactions = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await api.getAllTransactions();
      const data = response.data || [];
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      toast.error("Gagal memuat data transaksi");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = transactions;

    if (filterStatus !== "all") {
      result = result.filter((t) => t.status === filterStatus);
    }

    if (searchTerm) {
      result = result.filter(
        (t) =>
          (t.invoiceId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(result);
  }, [searchTerm, filterStatus, transactions]);

  const handleUpdateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    try {
      await api.updateTransactionStatus(id, status);
      toast.success(
        status === "success"
          ? "✅ Pembayaran berhasil disetujui!"
          : "❌ Pembayaran telah ditolak"
      );
      setTransactions(
        transactions.map((t) => (t.id === id ? { ...t, status } : t))
      );
      setIsDetailOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengupdate status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200">
            <CheckCircle className="w-3 h-3 mr-1" /> Disetujui
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
            <XCircle className="w-3 h-3 mr-1" /> Ditolak
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200">
            <Clock className="w-3 h-3 mr-1" /> Menunggu
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const pendingCount = transactions.filter(
    (t) => t.status === "pending"
  ).length;
  const approvedCount = transactions.filter(
    (t) => t.status === "success"
  ).length;
  const rejectedCount = transactions.filter(
    (t) => t.status === "failed"
  ).length;

  const openDetail = (trx: Transaction) => {
    setSelectedTransaction(trx);
    setIsDetailOpen(true);
  };

  const openProof = (trx: Transaction) => {
    setSelectedTransaction(trx);
    setIsProofOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Approve Pembayaran
          </h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">
            Review dan setujui bukti pembayaran pelanggan.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchTransactions(true)}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-lg">
            <Clock className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-amber-600 font-medium">Menunggu</p>
            <p className="text-2xl font-bold text-amber-700">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-emerald-100 p-3 rounded-lg">
            <CheckCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-emerald-600 font-medium">Disetujui</p>
            <p className="text-2xl font-bold text-emerald-700">
              {approvedCount}
            </p>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-lg">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm text-red-600 font-medium">Ditolak</p>
            <p className="text-2xl font-bold text-red-700">{rejectedCount}</p>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(
            [
              { value: "all", label: "Semua" },
              { value: "pending", label: "Menunggu" },
              { value: "success", label: "Disetujui" },
              { value: "failed", label: "Ditolak" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                filterStatus === filter.value
                  ? "bg-orange-600 text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Cari invoice..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Transaction Cards - Mobile Responsive */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-100 rounded-full p-6 inline-block mb-4">
            <Filter className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Tidak ada transaksi
          </h3>
          <p className="text-gray-500">
            {filterStatus === "pending"
              ? "Belum ada pembayaran yang perlu direview."
              : "Tidak ada data yang cocok dengan filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTransactions.map((trx) => (
            <div
              key={trx.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left Section - Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="font-bold text-gray-800 text-sm sm:text-base">
                        {trx.invoiceId || trx.id.slice(0, 12)}
                      </span>
                      {getStatusBadge(trx.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span>
                        📅{" "}
                        {new Date(
                          trx.orderDate || trx.createdAt
                        ).toLocaleDateString("id-ID", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {trx.paymentMethod && (
                        <span className="flex items-center gap-1">
                          <CreditCard className="w-3 h-3" />
                          {trx.paymentMethod.name}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <span className="font-medium">Item: </span>
                      <span className="line-clamp-1">
                        {trx.transaction_items
                          ?.map((item) => `${item.food?.name} (x${item.quantity})`)
                          .filter(Boolean)
                          .join(", ") || "-"}
                      </span>
                    </div>
                  </div>

                  {/* Right Section - Price & Actions */}
                  <div className="flex flex-col sm:items-end gap-3">
                    <div className="text-xl font-bold text-orange-600">
                      {formatPrice(trx.totalPrice)}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {/* Proof Button */}
                      {trx.proofPaymentUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openProof(trx)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <ImageIcon className="h-4 w-4 mr-1" />
                          <span className="hidden xs:inline">Bukti</span>
                        </Button>
                      )}
                      {/* View Detail */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetail(trx)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden xs:inline">Detail</span>
                      </Button>

                      {/* Action Buttons - Only for pending */}
                      {trx.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(trx.id, "success")
                            }
                            disabled={updatingId === trx.id}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span className="hidden xs:inline">Setujui</span>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleUpdateStatus(trx.id, "failed")
                            }
                            disabled={updatingId === trx.id}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            <span className="hidden xs:inline">Tolak</span>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-orange-600" />
              Detail Transaksi
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6">
              {/* Invoice Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Invoice ID</span>
                  <span className="font-mono font-medium text-sm">
                    {selectedTransaction.invoiceId ||
                      selectedTransaction.id.slice(0, 12)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Tanggal Order</span>
                  <span className="text-sm">
                    {new Date(
                      selectedTransaction.orderDate ||
                        selectedTransaction.createdAt
                    ).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Metode Pembayaran
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedTransaction.paymentMethod?.imageUrl && (
                      <img
                        src={selectedTransaction.paymentMethod.imageUrl}
                        alt=""
                        className="w-6 h-6 object-contain"
                      />
                    )}
                    <span className="text-sm font-medium">
                      {selectedTransaction.paymentMethod?.name || "-"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Item Pesanan</h3>
                <div className="space-y-3">
                  {selectedTransaction.transaction_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                    >
                      <img
                        src={item.food?.imageUrl}
                        alt={item.food?.name}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {item.food?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          x{item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-sm text-orange-600">
                        {formatPrice(
                          (item.food?.price || 0) * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-xl font-bold text-orange-600">
                    {formatPrice(selectedTransaction.totalPrice)}
                  </span>
                </div>
              </div>

              {/* Proof Payment */}
              {selectedTransaction.proofPaymentUrl && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-3">
                    Bukti Pembayaran
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <img
                      src={selectedTransaction.proofPaymentUrl}
                      alt="Bukti Pembayaran"
                      className="w-full max-h-64 object-contain bg-gray-50"
                    />
                  </div>
                  <a
                    href={selectedTransaction.proofPaymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
                  >
                    <ExternalLink className="w-3 h-3" /> Buka gambar penuh
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              {selectedTransaction.status === "pending" && (
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() =>
                      handleUpdateStatus(selectedTransaction.id, "success")
                    }
                    disabled={updatingId === selectedTransaction.id}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {updatingId === selectedTransaction.id ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" /> Setujui
                        Pembayaran
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleUpdateStatus(selectedTransaction.id, "failed")
                    }
                    disabled={updatingId === selectedTransaction.id}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Tolak
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Proof Image Dialog */}
      <Dialog open={isProofOpen} onOpenChange={setIsProofOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Bukti Pembayaran</DialogTitle>
          </DialogHeader>
          {selectedTransaction?.proofPaymentUrl && (
            <div className="space-y-4">
              <div className="rounded-lg overflow-hidden border">
                <img
                  src={selectedTransaction.proofPaymentUrl}
                  alt="Bukti Pembayaran"
                  className="w-full max-h-[70vh] object-contain bg-gray-50"
                />
              </div>
              <a
                href={selectedTransaction.proofPaymentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-sm text-blue-600 hover:underline"
              >
                <ExternalLink className="w-4 h-4" /> Buka di tab baru
              </a>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
