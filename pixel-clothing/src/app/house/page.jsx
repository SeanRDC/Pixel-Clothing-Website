"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './House.css';
import AudioController from '../../components/AudioController/AudioController';
import Guide from '../../components/Guide/Guide';
import QuestPopup from '../../components/Popups/QuestPopup';
import AboutPopup from '../../components/Popups/AboutPopup';

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
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [panelMode, setPanelMode] = useState('desc'); 
  const [selectedSize, setSelectedSize] = useState('M');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activePopup, setActivePopup] = useState(null);

  // New state to track if the user has inspected a shirt
  const [hasLookedAtItems, setHasLookedAtItems] = useState(false);

  const [dialogue, setDialogue] = useState("");

  useEffect(() => {
    // Pause dialogue if an item is selected or a popup is open
    if (selectedItem || activePopup) return; 

    // If the user has already looked at an item, instantly show the new text
    if (hasLookedAtItems) {
      setDialogue("EJ: Have you chosen your choice?");
      return; // Skip the typing animation
    }
    
    // Otherwise, run the initial typing animation
    const initialText = "EJ: Oh, Would you like to see these clothes? I'm actually selling these, I'm happy if you would pick one.";
    let i = 0;
    setDialogue("");
    
    const timer = setInterval(() => {
      setDialogue((prev) => prev + initialText.charAt(i));
      i++;
      if (i === initialText.length) clearInterval(timer);
    }, 40);
    
    return () => clearInterval(timer);
  }, [selectedItem, activePopup, hasLookedAtItems]);

  const handleItemClick = (itemId) => {
    if (selectedItem === itemId) {
      // User clicked the item again to close it
      setSelectedItem(null);
      setHasLookedAtItems(true); // Flag that they have now looked at something
    } else {
      // User opens an item
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
      
      {/* Conditionally render EJ's sprite based on whether the user has looked at items yet */}
      {!selectedItem && !activePopup && (
        <img 
          src={hasLookedAtItems ? "/assets/images/ej.png" : "/assets/images/ejexplaining.png"} 
          className="merchant-character" 
          alt="EJ" 
        />
      )}

      <nav className="top-menu">
        <div className="menu-item" onClick={() => setActivePopup('quest')}>Quest</div>
        <div className="menu-item" onClick={() => setActivePopup('guide')}>Guide</div>
        <div className="menu-item" onClick={() => setActivePopup('about')}>About Us</div>
        <div className="menu-item" onClick={() => router.push('/')}>Exit</div>
      </nav>

      <img src="/assets/images/kart.png" className="shopping-cart-icon" onClick={() => setIsCartOpen(true)} alt="Cart" />

      <div className="keepers-inventory" style={{ display: activePopup ? 'none' : 'block' }}>
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

      {!selectedItem && !activePopup && (
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
      
      {/* Popups */}
      {activePopup === 'quest' && <QuestPopup onClose={() => setActivePopup(null)} />}
      {activePopup === 'guide' && <Guide onClose={() => setActivePopup(null)} />}
      {activePopup === 'about' && <AboutPopup onClose={() => setActivePopup(null)} />}

    </div>
  );
}