"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './House.css';
import AudioController from '../../components/AudioController/AudioController';
import Guide from '../../components/Guide/Guide';

// Item Database (Easy to update!)
const shopItems = {
  iroha: {
    id: 'iroha',
    name: 'Iroha Oversized Navy Blue Tee',
    price: 450,
    desc: 'A soft navy blue oversized shirt featuring a monochrome Iroha print on the lower right.',
    passive: '60% Huzz spawnrate boost when worn in urban zones.\n10% chance to appear as if wearing a good fragrance',
    img: '/assets/images/Iroha.png'
  },
  wonhee: {
    id: 'wonhee',
    name: 'Wonhee Black AcidWash Tee',
    price: 450,
    desc: 'A clean oversized white tee inspired by Wonhee minimalist vibe. Soft cotton fabric with a casual silhouette.',
    passive: '+15% charm boost during social interactions.\nSlightly increases confidence aura.',
    img: '/assets/images/Wonhee.png'
  }
};

export default function HousePage() {
  const router = useRouter();
  
  // States
  const [selectedItem, setSelectedItem] = useState(null);
  const [panelMode, setPanelMode] = useState('desc'); 
  const [selectedSize, setSelectedSize] = useState('M');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [dialogue, setDialogue] = useState("");
  const fullText = "EJ: Oh, Would you like to see these clothes? I'm actually selling these, I'm happy if you would pick one.";

  useEffect(() => {
    if (selectedItem || isGuideOpen) return; 
    
    let i = 0;
    setDialogue("");
    const timer = setInterval(() => {
      setDialogue((prev) => prev + fullText.charAt(i));
      i++;
      if (i === fullText.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [selectedItem, isGuideOpen]);

  // Handlers
  const handleItemClick = (itemId) => {
    if (selectedItem === itemId) {
      setSelectedItem(null);
    } else {
      setSelectedItem(itemId);
      setPanelMode('desc');
    }
  };

  const handleAddToCart = () => {
    const item = shopItems[selectedItem];
    setCartItems([...cartItems, { ...item, size: selectedSize }]);
    setIsCartOpen(true); 
  };

  const removeCartItem = (indexToRemove) => {
    setCartItems(cartItems.filter((_, idx) => idx !== indexToRemove));
  };

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.price, 0);

  const activeItemData = selectedItem ? shopItems[selectedItem] : null;

  return (
    <div className="house-container">
      <img src="/assets/images/ej.png" className="merchant-character" alt="EJ" />

      <nav className="top-menu">
        <div className="menu-item" onClick={() => router.push('/#quest')}>Quest</div>
        <div className="menu-item" onClick={() => router.push('/')}>Exit</div>
        <div className="menu-item" onClick={() => setIsGuideOpen(true)}>Guide</div>
        <div className="menu-item" onClick={() => router.push('/#about')}>About Us</div>
      </nav>

      <img src="/assets/images/kart.png" className="shopping-cart-icon" onClick={() => setIsCartOpen(true)} alt="Cart" />

      <div className="keepers-inventory" style={{ display: isGuideOpen ? 'none' : 'block' }}>
        <img src="/assets/images/inventory.png" className="inventory-bg" alt="Inventory" />
        <div className="inventory-items">
          <div className="item-slot slot-1" onClick={() => handleItemClick('iroha')}>
            <img src="/assets/images/irohapixel.png" alt="Iroha" />
            {selectedItem === 'iroha' && <img src="/assets/images/Equip.png" className="equip-badge" alt="Equip" />}
          </div>
          <div className="item-slot slot-2" onClick={() => handleItemClick('wonhee')}>
            <img src="/assets/images/wonheepixel.png" alt="Wonhee" />
            {selectedItem === 'wonhee' && <img src="/assets/images/Equip.png" className="equip-badge" alt="Equip" />}
          </div>
          <div className="item-slot slot-3">
            <img src="/assets/images/question.png" alt="Mystery" />
          </div>
        </div>
      </div>

      {!selectedItem && !isGuideOpen && (
        <div className="dialogue-box">
          <img src="/assets/images/speechbox.png" className="dialogue-bg" alt="Speech Box" />
          <p className="dialogue-text">{dialogue}</p>
        </div>
      )}

      {selectedItem && (
        <img src={activeItemData.img} className="center-display-image" alt="Selected Item" />
      )}

      {selectedItem && (
        <div className="item-panel">
          <img src="/assets/images/descriptionbox.png" className="panel-bg" alt="Panel Box" />
          <h2 className="item-title">{activeItemData.name}</h2>
          
          {panelMode === 'desc' ? (
            <>
              <div className="description-section">
                <h3 className="section-label">Description</h3>
                <p className="item-desc-text">{activeItemData.desc}</p>
              </div>
              <div className="passive-section">
                <h3 className="section-label">Passive</h3>
                <p className="item-desc-text">{activeItemData.passive}</p>
              </div>
              <div className="item-actions">
                <p className="item-price">₱{activeItemData.price.toFixed(2)}</p>
                <button className="panel-btn" onClick={() => setPanelMode('size')}>Size</button>
                <button className="panel-btn" onClick={handleAddToCart}>Add to Cart</button>
              </div>
            </>
          ) : (
            <>
              <div className="sizes-section">
                <h3 className="section-label">Sizes:</h3>
                <ul className="size-list">
                  {['XS', 'S', 'M', 'L'].map((size) => (
                    <li 
                      key={size} 
                      className={selectedSize === size ? 'selected' : ''}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size === 'XS' ? 'Extra Small - 114 x 88' : size === 'S' ? 'Small - 118 x 90' : size === 'M' ? 'Medium - 122 x 92' : 'Large - 126 x 94'}
                      {selectedSize === size && ' ⭐'}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="item-actions">
                <p className="item-price">₱{activeItemData.price.toFixed(2)}</p>
                <button className="panel-btn" onClick={() => setPanelMode('desc')}>Prev</button>
                <button className="panel-btn" onClick={handleAddToCart}>Add to Cart</button>
              </div>
            </>
          )}
        </div>
      )}

      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <h2 className="cart-title">CART</h2>
        <button onClick={() => setIsCartOpen(false)} style={{marginBottom: '20px'}}>Close Cart</button>
        
        {cartItems.length === 0 ? (
          <p>YOUR CART IS CURRENTLY EMPTY</p>
        ) : (
          cartItems.map((item, idx) => (
            <div key={idx} className="cart-item">
              <div>
                <strong>{item.name}</strong><br/>
                <span>Size: {item.size} - ₱{item.price.toFixed(2)}</span>
              </div>
              <span className="cart-item-remove" onClick={() => removeCartItem(idx)}>Remove</span>
            </div>
          ))
        )}

        <div className="cart-total">
          <span>Total:</span>
          <span>₱{calculateTotal().toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={() => router.push('/checkout')}>Checkout</button>
      </div>

      <AudioController isVisible={true} />
      {isGuideOpen && <Guide onClose={() => setIsGuideOpen(false)} />}
      
    </div>
  );
}