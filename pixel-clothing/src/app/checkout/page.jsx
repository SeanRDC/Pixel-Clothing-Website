"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './Checkout.css';
import AudioController from '../../components/AudioController/AudioController';

export default function CheckoutPage() {
  const router = useRouter();
  

  const [cart, setCart] = useState([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [isQuestComplete, setIsQuestComplete] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const total = subtotal + shippingCost;

  // Handlers
  const handleShippingSelect = (option, cost) => {
    setSelectedShipping(option);
    setShippingCost(cost);
  };

  const handleCompleteQuest = () => {
    if (cart.length === 0) {
      alert("Your inventory bag is empty!");
      return;
    }
    
    setIsQuestComplete(true);
    localStorage.removeItem("cart"); 
  };

  const handleReturnToMerchant = () => {
    router.push('/house');
  };

  return (
    <div className="checkout-wrapper">
      <h1 className="page-title">Items Checkout</h1>

      <div className="checkout-content">
        <div className="left-side">
          
          <div className="section player-scroll">
            <h2>PLAYER SCROLL</h2>
            <div className="form-row">
              <label>Full Name</label>
              <input type="text" className="checkout-input" placeholder="Enter thy name..." />
              <label>(Email)</label>
              <input type="email" className="checkout-input" placeholder="hero@realm.com" />
            </div>
            <div className="form-row">
              <label>(Address)</label>
              <input type="text" className="checkout-input address-input" placeholder="123 Castle Lane, Kingdom City" />
            </div>
            <div className="form-row">
              <label>Province</label>
              <select className="checkout-select">
                <option>Northern Realm</option>
                <option>Eastern Sands</option>
                <option>Western Peaks</option>
              </select>
              <label>Postal Code</label>
              <input type="text" className="checkout-input" placeholder="12345" />
            </div>
          </div>

          <div className="section shipping-speed">
            <h2>Shipping Speed</h2>
            <div className="shipping-options">
              <div 
                className={`ship-option ${selectedShipping === 'swift' ? 'selected' : ''}`}
                onClick={() => handleShippingSelect('swift', 100)}
              >
                SWIFT HORSE<br/><small>2–3 DAYS (₱100)</small>
              </div>
              <div 
                className={`ship-option ${selectedShipping === 'dragon' ? 'selected' : ''}`}
                onClick={() => handleShippingSelect('dragon', 150)}
              >
                DRAGON EXPRESS<br/><small>NEXT DAY (₱150)</small>
              </div>
              <div 
                className={`ship-option ${selectedShipping === 'merchant' ? 'selected' : ''}`}
                onClick={() => handleShippingSelect('merchant', 50)}
              >
                MERCHANT WALK<br/><small>5–7 DAYS (₱50)</small>
              </div>
            </div>
          </div>

          <div className="section payment">
            <h2>💰 Payment</h2>
            <div className="payment-box">
              <label>GCASH NUMBER</label>
              <input type="text" className="checkout-input" placeholder="1234 5678 9012 3456" />
              <label>GCASH NAME</label>
              <input type="text" className="checkout-input" placeholder="Hero of the Realm" />
            </div>
          </div>

        </div>

        <div className="right-side">
          <div className="inventory-bag">
            <h2>INVENTORY BAG</h2>
            <div className="checkout-items">
              {cart.length === 0 ? (
                <p>No items found in your inventory.</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="checkout-item">
                    <span>{item.name} ({item.size})</span>
                    <span>₱{item.price.toFixed(2)}</span>
                  </div>
                ))
              )}
            </div>
            <div className="totals">
              <p>Subtotal: <span>₱{subtotal.toFixed(2)}</span></p>
              <p>Delivery: <span>₱{shippingCost.toFixed(2)}</span></p>
              <p className="total">TOTAL: <span>₱{total.toFixed(2)}</span></p>
            </div>
            <button className="complete-btn" onClick={handleCompleteQuest}>
              ⚔️ COMPLETE QUEST
            </button>
          </div>
        </div>
      </div>

      {isQuestComplete && (
        <div className="quest-complete-overlay">
          <div className="complete-box">
            <h2>📜 Quest Complete!</h2>
            <p>Your item is now getting ready to be shipped. Check your email to track shipping and item.</p>
            <button className="return-btn" onClick={handleReturnToMerchant}>
              🚶 Return to Merchant
            </button>
          </div>
        </div>
      )}

      <AudioController isVisible={true} />
    </div>
  );
}