import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCars, mockOrders } from '../data/cars';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Current logged in persona: 'buyer' or 'seller'
  const [role, setRole] = useState(() => localStorage.getItem('p2p_role') || 'buyer');
  
  // Buyer profile
  const [buyerUser, setBuyerUser] = useState({
    id: 'usr_buyer_01',
    name: 'Arjun Verma',
    email: 'arjun.verma@example.com',
    phone: '+91 98200 55443',
    city: 'Mumbai',
    pan: 'BKPPA8910Q',
    panVerified: true,
    kycCompleted: true,
  });

  // Seller profile (with Linked Account attributes as required by RBI / Razorpay Route)
  const [sellerUser, setSellerUser] = useState({
    id: 'usr_seller_01',
    name: 'Vikramaditya Rao',
    email: 'vikram.rao@example.com',
    phone: '+91 98765 43210',
    city: 'Mumbai',
    pan: 'ABCDE1234F',
    panVerified: true,
    linkedAccountId: 'acc_H23k98sL12',
    linkedAccountStatus: 'ACTIVATED', // 'PENDING' | 'ACTIVATED'
    bankAccount: {
      accountNumber: '••••••••4892',
      ifsc: 'HDFC0000123',
      bankName: 'HDFC Bank Ltd, Bandra West',
      accountHolderName: 'Vikramaditya Rao',
      pennyDropStatus: 'VERIFIED', // 'PENDING' | 'VERIFIED'
      verifiedAt: '12 Jan 2024',
    },
    gstNumber: '27ABCDE1234F1Z5',
    commissionRate: 0.05 // 5%
  });

  // Global shared state for cars and orders (stored in localStorage for persistence)
  const [cars, setCars] = useState(() => {
    const saved = localStorage.getItem('p2p_cars');
    return saved ? JSON.parse(saved) : initialCars;
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('p2p_orders');
    return saved ? JSON.parse(saved) : mockOrders;
  });

  useEffect(() => {
    localStorage.setItem('p2p_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('p2p_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('p2p_role', role);
  }, [role]);

  // Switch role between buyer and seller
  const toggleRole = () => {
    const nextRole = role === 'buyer' ? 'seller' : 'buyer';
    setRole(nextRole);
    toast.success(`Switched to ${nextRole.toUpperCase()} view`, { icon: '🔄' });
  };

  // Add new car listing
  const addCarListing = (newCarData) => {
    const carId = `CAR_${Math.floor(1000 + Math.random() * 9000)}`;
    const newCar = {
      ...newCarData,
      id: carId,
      seller: {
        id: sellerUser.id,
        name: sellerUser.name,
        city: sellerUser.city,
        phone: sellerUser.phone,
        email: sellerUser.email,
        pan: sellerUser.pan,
        linkedAccountId: sellerUser.linkedAccountId,
        bankVerified: sellerUser.bankAccount.pennyDropStatus === 'VERIFIED',
        bankName: sellerUser.bankAccount.bankName,
        memberSince: 'Today',
        rating: 5.0,
        dealsCompleted: 0
      },
      status: 'AVAILABLE'
    };
    setCars(prev => [newCar, ...prev]);
    return newCar;
  };

  // Place bid on car
  const placeBid = (carId, bidAmount) => {
    setCars(prev => prev.map(car => {
      if (car.id === carId) {
        return {
          ...car,
          currentBid: bidAmount
        };
      }
      return car;
    }));
    toast.success(`Bid of ₹${bidAmount.toLocaleString('en-IN')} placed successfully!`, { icon: '🏷️' });
  };

  // Create Order with Escrow Split (Step B from Document)
  const createEscrowOrder = ({ car, paymentMethod = 'Netbanking' }) => {
    const salePrice = car.currentBid > 0 ? car.currentBid : car.price;
    const commissionPaise = Math.round(salePrice * 0.05 * 100); // 5% platform commission
    const commissionINR = commissionPaise / 100;
    const sellerPayoutINR = salePrice - commissionINR;

    const newOrder = {
      orderId: `ORD_${Math.floor(10000 + Math.random() * 90000)}`,
      razorpayOrderId: `order_${Math.random().toString(36).substring(2, 12)}`,
      carId: car.id,
      carTitle: car.title,
      carImage: car.images[0],
      totalAmount: salePrice,
      commissionPaise: commissionPaise,
      sellerPayoutAmount: sellerPayoutINR,
      sellerName: car.seller.name,
      sellerLinkedAccount: car.seller.linkedAccountId || 'acc_H23k98sL12',
      buyerName: buyerUser.name,
      buyerEmail: buyerUser.email,
      buyerPhone: buyerUser.phone,
      status: 'PAID_IN_ESCROW', // immediately set after checkout signature verification
      onHold: true,
      transferId: `trf_${Math.random().toString(36).substring(2, 12)}`,
      paymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
      paymentMethod: paymentMethod,
      createdAt: new Date().toISOString(),
      handoverDate: 'Estimated within 3 business days',
      notes: {
        listing_id: car.id,
        platform_commission_paise: String(commissionPaise)
      },
      timeline: [
        { step: 'Order Created', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true, desc: 'Split parameters calculated' },
        { step: 'Paid into Gateway Nodal Escrow', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true, desc: `₹${salePrice.toLocaleString('en-IN')} held safely (on_hold: true)` },
        { step: 'Physical Inspection & Handover', time: 'Awaiting buyer check', done: false, desc: 'Inspect vehicle & verify RC documents' },
        { step: 'Escrow Released to Seller', time: 'Pending confirmation', done: false, desc: `₹${sellerPayoutINR.toLocaleString('en-IN')} to seller linked account` }
      ]
    };

    // Update cars state to mark car reserved / in escrow
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, status: 'IN_ESCROW' } : c));
    setOrders(prev => [newOrder, ...prev]);

    return newOrder;
  };

  // Step D: Releasing Escrow Funds After Handover (PATCH /v1/transfers/{transfer_id} with {"on_hold": 0})
  const releaseEscrowFunds = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          status: 'HANDOVER_CONFIRMED',
          onHold: false,
          settledAt: new Date().toISOString(),
          timeline: order.timeline.map((t, idx) => {
            if (idx === 2) return { ...t, done: true, time: 'Completed just now' };
            if (idx === 3) return { ...t, done: true, time: 'Released (T+1 Settlement)' };
            return t;
          })
        };
      }
      return order;
    }));

    toast.success('Escrow released! ₹ Payout dispatched to seller bank account.', {
      icon: '🎉',
      duration: 5000
    });
  };

  // Pre-handover cancellation & refund (POST /v1/payments/{payment_id}/refund)
  const cancelAndRefund = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.orderId === orderId) {
        return {
          ...order,
          status: 'REFUNDED',
          onHold: false,
          refundedAt: new Date().toISOString()
        };
      }
      return order;
    }));

    toast.success('Deal cancelled. Full escrow amount refunded to original payment method.', {
      icon: '↩️',
      duration: 5000
    });
  };

  // Update seller bank / linked account KYC
  const updateSellerKYC = (kycData) => {
    setSellerUser(prev => ({
      ...prev,
      ...kycData,
      linkedAccountStatus: 'ACTIVATED',
      bankAccount: {
        ...prev.bankAccount,
        ...kycData.bankAccount,
        pennyDropStatus: 'VERIFIED',
        verifiedAt: 'Just now'
      }
    }));
    toast.success('Penny-drop verified! Razorpay Linked Account activated.', { icon: '✅' });
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        toggleRole,
        setRole,
        buyerUser,
        sellerUser,
        cars,
        orders,
        addCarListing,
        placeBid,
        createEscrowOrder,
        releaseEscrowFunds,
        cancelAndRefund,
        updateSellerKYC
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
