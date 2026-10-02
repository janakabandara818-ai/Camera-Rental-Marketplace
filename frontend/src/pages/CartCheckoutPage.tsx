import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useEquipment } from '../context/EquipmentContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import {
  Trash2,
  Calendar,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Plus,
  Minus,
  Film
} from 'lucide-react';

export const CartCheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    items,
    removeFromCart,
    updateQuantity,
    updateRentalDates,
    toggleDamageProtection,
    clearCart,
    subtotal,
    damageProtectionFee,
    securityDeposit,
    estimatedTax,
    shippingFee,
    grandTotal
  } = useCart();
  const { addRentalBooking, addPurchaseOrder } = useEquipment();

  // Checkout Step: 1: Cart, 2: Production Info, 3: Payment, 4: Confirmed
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [productionName, setProductionName] = useState('Light & Lens Productions');
  const [shippingAddress, setShippingAddress] = useState('Stage 4, 742 Sunset Gower Studios, Hollywood, CA 90028');
  const [phone, setPhone] = useState('+1 (555) 782-9012');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 8819');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvc, setCardCvc] = useState('482');
  const [completedOrderIds, setCompletedOrderIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedIds: string[] = [];

      items.forEach((item) => {
        if (item.type === 'rent') {
          const booking = addRentalBooking({
            product: item.product,
            startDate: item.startDate || '2026-10-05',
            endDate: item.endDate || '2026-10-08',
            totalDays: item.rentalDays || 3,
            totalAmount:
              item.product.rentPricePerDay *
              (item.rentalDays || 3) *
              (item.includeDamageProtection ? 1.1 : 1),
            depositAmount: item.product.depositRequired,
            status: 'Active',
            deliveryType: 'Courier Delivery'
          });
          generatedIds.push(booking.id);
        } else {
          const order = addPurchaseOrder({
            product: item.product,
            orderDate: new Date().toISOString().split('T')[0],
            quantity: item.quantity,
            totalAmount: item.product.buyPrice * item.quantity,
            status: 'Processing',
            shippingAddress
          });
          generatedIds.push(order.id);
        }
      });

      setCompletedOrderIds(generatedIds);
      clearCart();
      setIsProcessing(false);
      setStep(4);
    }, 800);
  };

  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#111827] py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="text-xs font-mono text-amber-500 uppercase tracking-wider mb-2">
            Equipment Reserved & Inspected
          </div>
          <h1 className="text-3xl font-bold text-white font-display mb-3">
            Production Order Confirmed!
          </h1>
          <p className="text-sm text-gray-300 max-w-md mx-auto mb-8">
            Your camera gear package has been scheduled for bench collimation and courier dispatch to your Hollywood studio.
          </p>

          <div className="bg-[#161f30] p-6 rounded-xl border border-gray-800 text-left space-y-3 mb-8 text-xs">
            <div className="flex justify-between pb-3 border-b border-gray-800">
              <span className="text-gray-400">Order Reference Numbers:</span>
              <span className="text-amber-400 font-mono font-bold">
                {completedOrderIds.join(', ')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Delivery Address:</span>
              <span className="text-white font-medium">{shippingAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Insurance Status:</span>
              <span className="text-emerald-400 font-medium">COI Verified · Damage Waiver Applied</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient / DP:</span>
              <span className="text-white">{user?.name || 'Janaka Bandara'} ({productionName})</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <Link
              to="/dashboard?tab=rentals"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs sm:text-sm rounded-lg transition-colors"
            >
              View in My Dashboard
            </Link>
            <Link
              to="/products"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium text-xs sm:text-sm rounded-lg border border-gray-700 transition-colors"
            >
              Continue Browsing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111827] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-500 uppercase tracking-wider mb-1">
            <span>Checkout</span>
            <span aria-hidden="true">/</span>
            <span>Step {step} of 3</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
            {step === 1 && 'Your Cinema Equipment Cart'}
            {step === 2 && 'Production & Shipping Dispatch'}
            {step === 3 && 'Payment & Damage Waiver Security'}
          </h1>
        </div>

        {items.length === 0 && step === 1 ? (
          <div className="bg-[#161f30] rounded-2xl p-12 text-center border border-gray-800">
            <Film className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Your Equipment Cart is Empty</h3>
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
              Browse our large-format cinema cameras, prime optics, and studio lighting packages.
            </p>
            <Link
              to="/products"
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-lg transition-colors"
            >
              Explore Equipment Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items or Checkout Forms */}
            <div className="lg:col-span-8 space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  {items.map((item) => {
                    const days = item.rentalDays || 1;
                    const itemRentBase = item.product.rentPricePerDay * days * item.quantity;

                    return (
                      <div
                        key={item.id}
                        className="bg-[#161f30] rounded-xl p-5 border border-gray-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start gap-4">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            referrerPolicy="no-referrer"
                            className="w-20 h-16 rounded-lg object-cover bg-black shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-mono text-amber-500 uppercase font-semibold">
                                {item.product.brand}
                              </span>
                              <span className="text-gray-600">·</span>
                              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                                {item.type === 'rent' ? 'Daily Rental' : 'Outright Purchase'}
                              </span>
                            </div>
                            <Link
                              to={`/product/${item.product.id}`}
                              className="text-sm font-semibold text-white hover:text-amber-400 transition-colors line-clamp-1"
                            >
                              {item.product.name}
                            </Link>

                            {/* Rental Date Adjuster */}
                            {item.type === 'rent' ? (
                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                                  <span>{days} Shoot Days</span>
                                </span>
                                <span>·</span>
                                <label className="flex items-center gap-1.5 cursor-pointer text-gray-300">
                                  <input
                                    type="checkbox"
                                    checked={!!item.includeDamageProtection}
                                    onChange={() => toggleDamageProtection(item.id)}
                                    className="rounded border-gray-700 bg-gray-900 text-amber-500 w-3.5 h-3.5"
                                  />
                                  <span className="text-[11px]">Damage Protection (+10%)</span>
                                </label>
                              </div>
                            ) : (
                              <div className="mt-2 flex items-center gap-2 text-xs">
                                <span className="text-gray-400">Qty:</span>
                                <div className="flex items-center bg-[#0d131f] rounded border border-gray-700">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="px-2 py-0.5 text-gray-400 hover:text-white"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="px-2 font-mono text-white text-xs">{item.quantity}</span>
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="px-2 py-0.5 text-gray-400 hover:text-white"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center sm:flex-col items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-gray-800 pt-3 sm:pt-0">
                          <div className="text-right">
                            <div className="text-sm font-bold text-white font-mono tabular-nums">
                              ${item.type === 'rent' ? itemRentBase.toLocaleString() : (item.product.buyPrice * item.quantity).toLocaleString()}
                            </div>
                            {item.type === 'rent' && (
                              <div className="text-[11px] text-gray-500">
                                ${item.product.rentPricePerDay}/day &times; {days}d
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-500 hover:text-red-400 p-1.5 rounded transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="bg-[#161f30] rounded-xl p-6 border border-gray-800 space-y-4">
                  <h3 className="text-base font-semibold text-white">Production & Shipping Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                        Production / Company Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={productionName}
                        onChange={(e) => setProductionName(e.target.value)}
                        className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                        Contact Phone on Set *
                      </label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">
                      Delivery / Studio Stage Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="p-4 bg-[#0d131f] rounded-lg border border-gray-800 text-xs text-gray-300 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                      <Truck className="w-4 h-4" />
                      <span>Dedicated Cinema Flight Courier</span>
                    </div>
                    <p className="text-gray-400">
                      Dispatched in sealed Pelican TrekPak storm cases. Signature and photo verification required on-set.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="bg-[#161f30] rounded-xl p-6 border border-gray-800 space-y-5">
                  <h3 className="text-base font-semibold text-white">Payment & Escrow Security</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-[#0d131f] border border-gray-700 rounded-lg pl-10 pr-3.5 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Expiration</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">CVC Code</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-[#0d131f] border border-gray-700 rounded-lg px-3.5 py-2 text-xs text-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-3 bg-[#0d131f] rounded-lg border border-gray-800 flex items-center gap-3 text-xs text-gray-400">
                      <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>End-to-end 256-bit encrypted escrow payment. Damage waiver and deposit holds are automatically authorized.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Order Summary (4 Cols) */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-[#161f30] rounded-2xl p-6 border border-gray-800 shadow-xl space-y-4 text-xs">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Order Summary
                </h3>

                <div className="space-y-2 text-gray-300">
                  <div className="flex justify-between">
                    <span>Equipment Subtotal</span>
                    <span className="font-mono text-white tabular-nums">${subtotal.toLocaleString()}</span>
                  </div>

                  {damageProtectionFee > 0 && (
                    <div className="flex justify-between text-amber-400">
                      <span>Damage Waiver (10%)</span>
                      <span className="font-mono tabular-nums">+${damageProtectionFee.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-400">
                    <span>Courier On-Set Delivery</span>
                    <span className="font-mono tabular-nums">
                      {shippingFee === 0 ? 'FREE' : `$${shippingFee}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>Estimated Sales Tax</span>
                    <span className="font-mono tabular-nums">${estimatedTax.toFixed(2)}</span>
                  </div>

                  {securityDeposit > 0 && (
                    <div className="flex justify-between text-gray-400 pt-2 border-t border-gray-800">
                      <span>Refundable Hold Deposit</span>
                      <span className="font-mono text-gray-300 tabular-nums">${securityDeposit}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-bold text-white pt-3 border-t border-gray-800">
                    <span>Grand Total</span>
                    <span className="font-mono text-amber-400 tabular-nums text-lg">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Progress Navigation Buttons */}
                <div className="pt-3 space-y-2">
                  {step === 1 && (
                    <Button
                      onClick={() => setStep(2)}
                      variant="primary"
                      size="lg"
                      className="w-full"
                      icon={<ArrowRight className="w-4 h-4" />}
                    >
                      Proceed to Dispatch Info
                    </Button>
                  )}

                  {step === 2 && (
                    <div className="space-y-2">
                      <Button
                        onClick={() => setStep(3)}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        icon={<ArrowRight className="w-4 h-4" />}
                      >
                        Continue to Payment
                      </Button>
                      <button
                        onClick={() => setStep(1)}
                        className="w-full py-2 text-xs text-gray-400 hover:text-white"
                      >
                        &larr; Back to Cart Items
                      </button>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-2">
                      <Button
                        onClick={handlePlaceOrder}
                        variant="primary"
                        size="lg"
                        isLoading={isProcessing}
                        className="w-full"
                        icon={<Lock className="w-4 h-4" />}
                      >
                        Authorize & Place Order
                      </Button>
                      <button
                        onClick={() => setStep(2)}
                        className="w-full py-2 text-xs text-gray-400 hover:text-white"
                      >
                        &larr; Back to Shipping
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-800 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Backed by CineVault Equipment Guarantee</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
