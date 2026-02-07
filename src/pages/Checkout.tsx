import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  ChevronRight, 
  ShoppingBag, 
  Shield, 
  Truck,
  CreditCard,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "@/contexts/LocationContext";
import { useToast } from "@/hooks/use-toast";
import { AddressSelectionModal } from "@/components/AddressSelectionModal";
import { AddressCard } from "@/components/AddressCard";
import { supabase } from "@/integrations/supabase/client";
import type { UserAddress } from "@/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const { selectedAddress, setSelectedAddress, setShowAddressModal, showAddressModal } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleAddressSelect = (address: UserAddress) => {
    setSelectedAddress(address);
    toast({
      title: "Delivery Address Selected",
      description: `Delivering to ${address.city}, ${address.pincode}`,
    });
  };

  const deliveryFee = subtotal >= 999 ? 0 : 99;
  const finalTotal = total + deliveryFee;

  const handlePayment = async () => {
    if (!selectedAddress) {
      setShowAddressModal(true);
      return;
    }

    if (!razorpayLoaded) {
      toast({
        title: "Please wait",
        description: "Payment system is loading...",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create Razorpay order
      const { data: orderResponse, error: orderError } = await supabase.functions.invoke(
        'razorpay-create-order',
        {
          body: {
            amount: finalTotal,
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
              customer_email: user?.email,
              items_count: items.length,
            },
          },
        }
      );

      if (orderError || !orderResponse?.success) {
        throw new Error(orderResponse?.error || 'Failed to create order');
      }

      // Prepare order data for verification
      const orderData = {
        customer_id: user?.id,
        subtotal: Math.round(subtotal),
        shipping_fee: deliveryFee,
        discount: 0,
        total: Math.round(finalTotal),
        shipping_address: {
          full_name: selectedAddress.full_name,
          mobile: selectedAddress.mobile,
          address_line: selectedAddress.address_line,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.pincode,
          landmark: selectedAddress.landmark,
        },
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: Math.round(item.product.price),
          total_price: Math.round(item.product.price * item.quantity),
          size: item.size,
          color: item.color,
        })),
      };

      // Configure Razorpay options
      const options = {
        key: orderResponse.key_id,
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'Ogura Fashion',
        description: `Order of ${items.length} item(s)`,
        order_id: orderResponse.order_id,
        handler: async function (response: any) {
          // Verify payment on server
          try {
            const { data: verifyResponse, error: verifyError } = await supabase.functions.invoke(
              'razorpay-verify-payment',
              {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  order_data: orderData,
                },
              }
            );

            if (verifyError || !verifyResponse?.success) {
              throw new Error(verifyResponse?.error || 'Payment verification failed');
            }

            // Clear cart and redirect to confirmation
            clearCart();
            navigate('/order-confirmation', {
              state: {
                orderNumber: verifyResponse.order_number,
                paymentId: verifyResponse.payment_id,
                total: finalTotal,
                address: selectedAddress,
                items: items,
              },
            });

          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Error",
              description: "Payment verification failed. Please contact support.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: selectedAddress.full_name,
          email: user?.email || '',
          contact: selectedAddress.mobile,
        },
        theme: {
          color: '#000000',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment. Your cart is still saved.",
            });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <span>Cart</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Checkout</span>
          <ChevronRight className="h-4 w-4" />
          <span>Confirmation</span>
        </div>

        <h1 className="text-2xl font-bold mb-6">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Address & Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Delivery Address Section */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold">Delivery Address</h2>
                    <p className="text-sm text-muted-foreground">Where should we deliver?</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowAddressModal(true)}
                >
                  {selectedAddress ? 'Change' : 'Add Address'}
                </Button>
              </div>
              
              {selectedAddress ? (
                <AddressCard 
                  address={selectedAddress} 
                  selectable={false}
                  showActions={false}
                />
              ) : (
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="w-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <MapPin className="h-8 w-8" />
                  <span className="font-medium">Add Delivery Address</span>
                </button>
              )}
            </Card>

            {/* Order Items */}
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Order Items ({items.length})</h2>
                  <p className="text-sm text-muted-foreground">Review your items</p>
                </div>
              </div>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.size}-${item.color}`} className="flex gap-4">
                    <div className="w-20 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.product.brand}</p>
                      <div className="flex gap-3 text-xs text-muted-foreground mt-1">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <p className="font-semibold mt-2">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <Card className="p-5 sticky top-24">
              <h2 className="font-semibold mb-4">Payment Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {subtotal < 999 && (
                <p className="text-xs text-muted-foreground mt-3">
                  Add ₹{(999 - subtotal).toLocaleString()} more for FREE delivery!
                </p>
              )}

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={handlePayment}
                disabled={isProcessing || !razorpayLoaded}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay ₹{finalTotal.toLocaleString()}
                  </>
                )}
              </Button>

              {/* Trust Badges */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>100% Secure Payment</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Truck className="h-4 w-4 text-blue-600" />
                  <span>Free delivery on orders above ₹999</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>Easy 7-day returns</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mt-6 pt-4 border-t">
                <p className="text-xs text-muted-foreground mb-2">Accepted Payment Methods</p>
                <div className="flex gap-2">
                  <div className="h-8 px-2 rounded border flex items-center justify-center text-xs font-medium">
                    UPI
                  </div>
                  <div className="h-8 px-2 rounded border flex items-center justify-center text-xs font-medium">
                    Cards
                  </div>
                  <div className="h-8 px-2 rounded border flex items-center justify-center text-xs font-medium">
                    NetBanking
                  </div>
                  <div className="h-8 px-2 rounded border flex items-center justify-center text-xs font-medium">
                    Wallets
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
      <Footer />

      {/* Address Selection Modal */}
      <AddressSelectionModal
        open={showAddressModal}
        onOpenChange={setShowAddressModal}
        onAddressSelect={handleAddressSelect}
        selectedAddressId={selectedAddress?.id}
      />
    </div>
  );
}
