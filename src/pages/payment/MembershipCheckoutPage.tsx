import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSCAData } from '../../context/SCADataContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { AlertBanner } from '../../components/common/AlertBanner';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  Building2,
  RefreshCw,
  Grid,
} from 'lucide-react';

export const MembershipCheckoutPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { businesses, simulatePaymentStatusChange } = useSCAData();
  const navigate = useNavigate();

  const activeBiz = businesses.find((b) => b.id === currentUser.businessId) || businesses[0];

  // UI state machine: 'OVERVIEW' | 'CHECKOUT' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'LAPSED'
  const [uiState, setUiState] = useState<'OVERVIEW' | 'CHECKOUT' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'LAPSED'>('OVERVIEW');

  // Credit Card Simulator Form
  const [cardForm, setCardForm] = useState({
    cardNumber: '4242 •••• •••• 4242',
    expDate: '12 / 28',
    cvc: '382',
    zip: '560038',
  });

  const handleStartCheckout = () => {
    setUiState('CHECKOUT');
  };

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    setUiState('PROCESSING');

    setTimeout(() => {
      // Simulate successful payment
      simulatePaymentStatusChange(activeBiz.id, 'ACTIVE');
      setUiState('SUCCESS');
    }, 2000);
  };

  const handleSimulateFailure = () => {
    setUiState('PROCESSING');
    setTimeout(() => {
      simulatePaymentStatusChange(activeBiz.id, 'PAYMENT_FAILED_VIEW_ONLY');
      setUiState('FAILED');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Quick State Switcher for Verification */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
            Membership Billing Suite
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-1">{activeBiz.name}</h1>
          <p className="text-xs text-slate-400">
            {activeBiz.allianceName} • Category: <span className="text-white font-semibold">{activeBiz.categoryName}</span>
          </p>
        </div>

        {/* Phase 2 Checkout State Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-800 p-1.5 rounded-xl border border-slate-700">
          <span className="text-[10px] text-slate-400 font-medium px-1">Test State:</span>
          <button
            onClick={() => setUiState('OVERVIEW')}
            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
              uiState === 'OVERVIEW' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setUiState('CHECKOUT')}
            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
              uiState === 'CHECKOUT' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Checkout
          </button>
          <button
            onClick={() => setUiState('SUCCESS')}
            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
              uiState === 'SUCCESS' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Success
          </button>
          <button
            onClick={() => setUiState('FAILED')}
            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
              uiState === 'FAILED' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Failed
          </button>
          <button
            onClick={() => setUiState('LAPSED')}
            className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer ${
              uiState === 'LAPSED' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lapsed
          </button>
        </div>
      </div>

      {/* STATE 1: OVERVIEW / APPROVAL TRANSITION */}
      {uiState === 'OVERVIEW' && (
        <Card className="p-8 space-y-6 animate-in fade-in duration-200">
          <div className="text-center">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              ✓ Application Approved
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3">Your business has been approved.</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
              Complete your membership payment to activate your active membership in <span className="font-bold text-slate-900">{activeBiz.allianceName}</span>.
            </p>
          </div>

          {/* Membership Benefits Box */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Monthly Membership Plan</h3>
                <p className="text-xs text-slate-500">Category Exclusivity Representation</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-900">$199</span>
                <span className="text-xs text-slate-500"> / month</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700">
              <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Included Alliance Benefits:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-800 font-medium">✓ Locked Category Exclusivity</div>
                <div className="flex items-center gap-2 text-emerald-800 font-medium">✓ Private Alliance Directory Listing</div>
                <div className="flex items-center gap-2 text-emerald-800 font-medium">✓ AdShare Co-Marketing Marketplace</div>
                <div className="flex items-center gap-2 text-emerald-800 font-medium">✓ Unlimited Client Referral Exchange</div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Button onClick={handleStartCheckout} variant="success" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Continue to Payment ($199/mo)
            </Button>
          </div>
        </Card>
      )}

      {/* STATE 2: STRIPE-READY CHECKOUT UI */}
      {uiState === 'CHECKOUT' && (
        <Card className="p-8 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Secure Membership Checkout</h2>
              <p className="text-xs text-slate-500">Stripe 256-bit SSL Encrypted Payment</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-lg">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>256-Bit SSL Secure</span>
            </div>
          </div>

          <form onSubmit={handlePayNow} className="space-y-4">
            {/* Order Summary Pill */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{activeBiz.name}</p>
                <p className="text-slate-500">{activeBiz.allianceName} • {activeBiz.categoryName}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-slate-900 text-sm">$199.00</span>
                <span className="text-slate-500 block text-[10px]">Billed Monthly</span>
              </div>
            </div>

            {/* Credit Card Input simulator */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Cardholder Name</label>
                <input
                  type="text"
                  defaultValue={activeBiz.ownerName}
                  className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={cardForm.cardNumber}
                    onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Expires</label>
                  <input
                    type="text"
                    value={cardForm.expDate}
                    onChange={(e) => setCardForm({ ...cardForm, expDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono text-center"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">CVC</label>
                  <input
                    type="text"
                    value={cardForm.cvc}
                    onChange={(e) => setCardForm({ ...cardForm, cvc: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono text-center"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={cardForm.zip}
                    onChange={(e) => setCardForm({ ...cardForm, zip: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 font-mono text-center"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSimulateFailure}
                className="text-xs text-rose-600 hover:underline font-medium cursor-pointer"
              >
                Simulate Payment Failure
              </button>

              <div className="flex gap-2">
                <Button variant="ghost" type="button" onClick={() => setUiState('OVERVIEW')}>
                  Cancel
                </Button>
                <Button type="submit" variant="success" size="lg" leftIcon={<Lock className="w-4 h-4" />}>
                  Pay $199.00 & Activate
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      {/* STATE 3: PAYMENT PROCESSING OVERLAY */}
      {uiState === 'PROCESSING' && (
        <Card className="p-12 text-center space-y-4 animate-in fade-in duration-200">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Payment Processing...</h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Communicating securely with financial network to process your monthly membership.
          </p>
        </Card>
      )}

      {/* STATE 4: PAYMENT SUCCESS */}
      {uiState === 'SUCCESS' && (
        <Card className="p-8 text-center space-y-5 border-emerald-200 bg-emerald-50/40 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-300 shadow-inner">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full">
              Membership Activated
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3">Welcome to Spin City Alliance!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
              Your business membership payment of $199.00 was completed successfully. Your profile is now live in the alliance directory and AdShare marketplace.
            </p>
          </div>

          <div className="p-5 bg-white border border-emerald-200 rounded-2xl max-w-sm mx-auto shadow-xs text-left text-xs space-y-2">
            <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
              <span>Business Name:</span>
              <span className="font-bold text-slate-900">{activeBiz.name}</span>
            </div>
            <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
              <span>Alliance:</span>
              <span className="font-semibold text-slate-900">{activeBiz.allianceName}</span>
            </div>
            <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-2">
              <span>Category Slot:</span>
              <span className="font-bold text-emerald-700">{activeBiz.categoryName}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Membership Status:</span>
              <Badge status="ACTIVE" size="sm" />
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Button onClick={() => navigate('/app/dashboard')} variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Go to Business Dashboard
            </Button>
          </div>
        </Card>
      )}

      {/* STATE 5: PAYMENT FAILED */}
      {uiState === 'FAILED' && (
        <Card className="p-8 text-center space-y-5 border-rose-200 bg-rose-50/40 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mx-auto border border-rose-300">
            <XCircle className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-bold rounded-full">
              Payment Couldn't Be Completed
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-3">Payment Failed</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
              We couldn't process your payment of $199.00. Card was declined by bank or insufficient funds available.
            </p>
          </div>

          <div className="p-4 bg-white border border-rose-200 rounded-xl max-w-md mx-auto text-left text-xs space-y-1 shadow-xs">
            <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" /> Error Explanation:
            </h4>
            <p className="text-slate-700 italic bg-rose-50 p-2.5 rounded border border-rose-100 mt-1">
              "Card transaction was declined by issuing bank (Code 402: Card Declined). Please try a different card or contact your bank."
            </p>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button onClick={() => setUiState('CHECKOUT')} variant="danger" leftIcon={<RefreshCw className="w-4 h-4" />}>
              Try Again
            </Button>
            <Button onClick={() => navigate('/app/settings')} variant="outline">
              Contact Support
            </Button>
          </div>
        </Card>
      )}

      {/* STATE 6: PAYMENT LAPSED / VIEW-ONLY WARNING PAGE */}
      {uiState === 'LAPSED' && (
        <Card className="p-8 text-center space-y-5 border-amber-200 bg-amber-50/40 animate-in fade-in duration-200">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto border border-amber-300">
            <AlertTriangle className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded-full">
              Membership Lapsed — View-Only Mode
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-3">Your membership payment has lapsed.</h2>
            <p className="text-xs text-slate-700 max-w-md mx-auto mt-2 leading-relaxed">
              Your business is temporarily hidden from other members in the directory and AdShare marketplace, and your account is in <span className="font-bold text-slate-900">View-Only</span> mode until payment is resolved.
            </p>
          </div>

          <div className="p-4 bg-white border border-amber-200 rounded-xl max-w-md mx-auto text-left text-xs space-y-2 shadow-xs">
            <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-1.5">
              <span>Lapsed Account:</span>
              <span className="font-bold text-slate-900">{activeBiz.name}</span>
            </div>
            <div className="flex justify-between text-slate-600 border-b border-slate-100 pb-1.5">
              <span>Category Exclusivity Status:</span>
              <span className="font-bold text-amber-700">Hidden from Directory</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Current Account Access:</span>
              <span className="font-bold text-rose-700">View-Only Restricted</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <Button onClick={() => setUiState('CHECKOUT')} variant="secondary" size="lg" leftIcon={<CreditCard className="w-4 h-4" />}>
              Update Payment & Restore Membership
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
