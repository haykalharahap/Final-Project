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
import { UtensilsCrossed, Plus, Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { api, type Food } from '../../services/api';
import { formatPrice } from '../../utils';

export function FoodManagement() {
    const [foods, setFoods] = useState<Food[]>([]);
    const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingFood, setEditingFood] = useState<Food | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        ingredients: "",
        price: 0,
        priceDiscount: 0,
    });

    const fetchFoods = async () => {
        setLoading(true);
        try {
            const response = await api.getFoods();
            const data = response.data || [];
            setFoods(data);
            setFilteredFoods(data);
        } catch (error) {
            console.error("Failed to fetch foods", error);
            toast.error("Failed to load foods");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            setFilteredFoods(
                foods.filter((f) =>
                    f.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        } else {
            setFilteredFoods(foods);
        }
    }, [searchTerm, foods]);

    const handleOpenCreate = () => {
        setEditingFood(null);
        setFormData({ name: "", description: "", imageUrl: "", ingredients: "", price: 0, priceDiscount: 0 });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (food: Food) => {
        setEditingFood(food);
        setFormData({
            name: food.name,
            description: food.description,
            imageUrl: food.imageUrl,
            ingredients: food.ingredients?.join(", ") || "",
            price: food.price,
            priceDiscount: food.priceDiscount,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const ingredientsArray = formData.ingredients.split(",").map((s) => s.trim()).filter(Boolean);

        try {
            if (editingFood) {
                await api.updateFood(editingFood.id, {
                    name: formData.name,
                    description: formData.description,
                    imageUrl: formData.imageUrl,
                    ingredients: ingredientsArray,
                });
                toast.success("Food updated successfully");
            } else {
                await api.createFood({
                    name: formData.name,
                    description: formData.description,
                    imageUrl: formData.imageUrl,
                    ingredients: ingredientsArray,
                    price: formData.price,
                    priceDiscount: formData.priceDiscount,
                });
                toast.success("Food created successfully");
            }
            setIsDialogOpen(false);
            fetchFoods();
        } catch (error: any) {
            toast.error(error.message || "Failed to save food");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this food?")) return;
        try {
            await api.deleteFood(id);
            toast.success("Food deleted successfully");
            setFoods(foods.filter((f) => f.id !== id));
        } catch (error: any) {
            toast.error(error.message || "Failed to delete food");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading foods...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Food Management</h1>
                    <p className="text-gray-600 mt-1">Manage your food menu items.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search foods..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleOpenCreate} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="h-4 w-4 mr-2" /> Add Food
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Likes</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredFoods.map((food) => (
                            <TableRow key={food.id}>
                                <TableCell>
                                    <img src={food.imageUrl} alt={food.name} className="w-12 h-12 rounded-lg object-cover" />
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <p className="font-medium">{food.name}</p>
                                        <p className="text-xs text-gray-500 line-clamp-1">{food.description}</p>
                                    </div>
                                </TableCell>
                                <TableCell>{formatPrice(food.price)}</TableCell>
                                <TableCell>❤️ {food.totalLikes || 0}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(food)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(food.id)} className="text-red-600 hover:text-red-700">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredFoods.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    No foods found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{editingFood ? "Edit Food" : "Create Food"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                rows={3}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                            <Input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients (comma-separated)</label>
                            <Input value={formData.ingredients} onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })} placeholder="ayam, sambal, bawang" required />
                        </div>
                        {!editingFood && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price Discount</label>
                                    <Input type="number" value={formData.priceDiscount} onChange={(e) => setFormData({ ...formData, priceDiscount: parseInt(e.target.value) || 0 })} />
                                </div>
                            </div>
                        )}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                                {editingFood ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
