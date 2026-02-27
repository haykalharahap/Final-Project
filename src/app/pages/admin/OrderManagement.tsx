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
import { Badge } from "../../components/ui/badge";
import { Search, ShoppingCart, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { api, type Transaction } from '../../services/api';
import { formatPrice } from '../../utils';

export function OrderManagement() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const response = await api.getAllTransactions();
            const data = response.data || [];
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredTransactions(
                transactions.filter(
                    (t) =>
                        (t.invoiceId || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                        t.id.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredTransactions(transactions);
        }
    }, [searchTerm, transactions]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.updateTransactionStatus(id, status);
            toast.success(`Transaction marked as ${status}`);
            setTransactions(
                transactions.map((t) => (t.id === id ? { ...t, status } : t))
            );
        } catch (error: any) {
            toast.error(error.message || "Failed to update status");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Success</Badge>;
            case "failed":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Failed</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-600 mt-1">Track and manage customer orders.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Search orders..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.map((trx) => (
                            <TableRow key={trx.id}>
                                <TableCell className="font-medium">{trx.invoiceId || trx.id.slice(0, 8)}</TableCell>
                                <TableCell>{new Date(trx.orderDate || trx.createdAt).toLocaleDateString('id-ID')}</TableCell>
                                <TableCell>
                                    <p className="text-sm text-gray-600 line-clamp-1">
                                        {trx.transaction_items?.map(item => item.food?.name).filter(Boolean).join(", ") || '-'}
                                    </p>
                                </TableCell>
                                <TableCell>{formatPrice(trx.totalPrice)}</TableCell>
                                <TableCell>{getStatusBadge(trx.status)}</TableCell>
                                <TableCell className="text-right">
                                    {trx.status !== "success" && trx.status !== "failed" && (
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(trx.id, "success")}
                                                className="text-green-600 hover:text-green-700"
                                                title="Mark as success"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleUpdateStatus(trx.id, "failed")}
                                                className="text-red-600 hover:text-red-700"
                                                title="Mark as failed"
                                            >
                                                <XCircle className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                    No orders found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
