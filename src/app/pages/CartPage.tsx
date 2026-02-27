import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { api, type PaymentMethod } from '../services/api';
import { Trash2, Plus, Minus, CreditCard, ShoppingBag, Check } from 'lucide-react';
import { Link } from 'react-router';
import { formatPrice } from '../utils';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

export function CartPage() {
  const { state, dispatch } = useCart();
  const { isAuthenticated } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [showPayment, setShowPayment] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    const loadPaymentMethods = async () => {
      try {
        const response = await api.getPaymentMethods();
        setPaymentMethods(response.data || []);
      } catch (error) {
        console.error('Failed to load payment methods', error);
      }
    };
    loadPaymentMethods();
  }, []);

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      return;
    }
    if (!selectedPayment) {
      toast.error('Please select a payment method');
      return;
    }

    setCheckingOut(true);
    try {
      // Step 1: Add each item to the server cart
      const cartIds: string[] = [];
      for (const item of state.items) {
        for (let i = 0; i < item.quantity; i++) {
          const res = await api.addToCart(item.id);
          // The API response should contain the cart item ID
          const cartData = res as any;
          if (cartData?.data?.id) {
            cartIds.push(cartData.data.id);
          }
        }
      }

      if (cartIds.length === 0) {
        // If we couldn't get cart IDs from create response, fetch all carts
        const cartsRes = await api.getCarts();
        const serverCarts = cartsRes.data || [];
        cartIds.push(...serverCarts.map(c => c.id));
      }

      if (cartIds.length === 0) {
        toast.error('Failed to add items to cart');
        setCheckingOut(false);
        return;
      }

      // Step 2: Create transaction
      await api.createTransaction(cartIds, selectedPayment);

      // Step 3: Clear local cart
      dispatch({ type: 'CLEAR_CART' });
      setOrderSuccess(true);
      toast.success('Order placed successfully! 🎉');
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-green-100 p-8 rounded-full mb-6">
          <Check className="w-16 h-16 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed!</h2>
        <p className="text-gray-500 mb-8 max-w-md">Your order has been placed successfully. You can check the status in your profile.</p>
        <div className="flex gap-4">
          <Link to="/profile" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-700 transition">
            View Orders
          </Link>
          <Link to="/menu" className="bg-gray-200 text-gray-800 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-300 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = state.total;
  const deliveryFee = state.items.length > 0 ? 15000 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + deliveryFee + tax;

  if (state.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-orange-100 p-8 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-orange-500" />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Go ahead and explore our menu.</p>
        <Link to="/menu" className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-orange-700 transition">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="lg:w-2/3 space-y-6">
          {state.items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
              <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />

              <div className="flex-grow text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                <p className="text-orange-600 font-semibold">{formatPrice(item.price)}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium text-gray-700">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-xl text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            {!showPayment ? (
              <button
                onClick={() => setShowPayment(true)}
                className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" /> Checkout
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">Select Payment Method</h3>
                {paymentMethods.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {paymentMethods.map((pm) => (
                      <label
                        key={pm.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedPayment === pm.id ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:bg-gray-50'}`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={pm.id}
                          checked={selectedPayment === pm.id}
                          onChange={(e) => setSelectedPayment(e.target.value)}
                          className="accent-orange-600"
                        />
                        <img src={pm.imageUrl} alt={pm.name} className="w-8 h-8 object-contain" />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{pm.name}</p>
                          <p className="text-xs text-gray-400">{pm.virtualAccountName}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No payment methods available.</p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut || !selectedPayment}
                  className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {checkingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" /> Place Order
                    </>
                  )}
                </button>

                <button
                  onClick={() => { setShowPayment(false); setSelectedPayment(''); }}
                  className="w-full text-gray-500 text-sm hover:text-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            )}

            <p className="text-xs text-center text-gray-400 mt-4">
              Secure Checkout. By proceeding, you agree to our Terms and Conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
