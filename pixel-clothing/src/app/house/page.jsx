"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './House.css';
import AudioController from '../../components/AudioController/AudioController';
import Guide from '../../components/Guide/Guide';
import QuestPopup from '../../components/Popups/QuestPopup';
import AboutPopup from '../../components/Popups/AboutPopup';

export default function HousePage() {
  const router = useRouter();
  
  // --- NEW: Database States ---
  const [shopItems, setShopItems] = useState({});
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [panelMode, setPanelMode] = useState('desc'); 
  const [selectedSize, setSelectedSize] = useState('M');
  
  // Cart & Checkout States
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart'); 
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '', realm: 'Earth' });

  const [activePopup, setActivePopup] = useState(null);
  const [hasLookedAtItems, setHasLookedAtItems] = useState(false);
  const [dialogue, setDialogue] = useState("");

  // Inventory States
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [dockState, setDockState] = useState('none');
  const [isExitingItem, setIsExitingItem] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Server returned an error');
        }
        if (!Array.isArray(data)) {
          throw new Error('Expected an array of items but got something else.');
        }
        
        const itemsMap = data.reduce((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {});
        
        setShopItems(itemsMap);
        setIsLoadingItems(false);
      } catch (error) {
        console.error("Failed to load shop items:", error);
        setShopItems({});
        setIsLoadingItems(false);
      }
    };
    
    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem || activePopup || isCartOpen || isLoadingItems || isTransitioning) return; 

    if (hasLookedAtItems) {
      setDialogue("EJ: Have you chosen your choice?");
      return; 
    }
    
    const initialText = "EJ: Oh, Would you like to see these clothes? I'm actually selling these, I'm happy if you would pick one.";
    let i = 0;
    setDialogue("");
    
    const timer = setInterval(() => {
      setDialogue((prev) => prev + initialText.charAt(i));
      i++;
      if (i === initialText.length) clearInterval(timer);
    }, 40);
    
    return () => clearInterval(timer);
  }, [selectedItem, activePopup, isCartOpen, hasLookedAtItems, isLoadingItems]);

  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1570) {
        setIsInventoryOpen(false);
        setDockState('none');     
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = (itemId) => {
    setSelectedItem(itemId);
    setPanelMode('desc');
    setDockState('docked'); 
    setIsExitingItem(false); 
  };

  const handlePullInventory = () => {
    setIsExitingItem(true);    
    setDockState('returning'); 

    setTimeout(() => {
      setSelectedItem(null);
      setDockState('settled');
      setIsExitingItem(false);
    }, 500);
  };

  const handleAddToCart = () => {
    const item = shopItems[selectedItem];
    setCartItems([...cartItems, { ...item, size: selectedSize }]);
    setIsCartOpen(true); 
    setCheckoutStep('cart'); 
  };

  const removeCartItem = (indexToRemove) => {
    setCartItems(cartItems.filter((_, idx) => idx !== indexToRemove));
  };

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.price, 0);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setCheckoutStep('processing');
    
    setTimeout(() => {
      setCheckoutStep('success');
      setCartItems([]); 
    }, 2500);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep('cart'), 300); 
  };

  const activeItemData = selectedItem ? shopItems[selectedItem] : null;

  
  if (isLoadingItems) {
    return (
      <div className="house-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h1 className="loading-text" style={{ color: '#f4c26f', fontFamily: "'Depixel', monospace" }}>Loading Inventory</h1>
      </div>
    );
  }
  return (
    <div className="house-container">

      <nav className="top-menu">
        <div className="menu-item" onClick={() => setActivePopup('quest')}>Quest</div>
        <div className="menu-item" onClick={() => setActivePopup('guide')}>Guide</div>
        <div className="menu-item" onClick={() => setActivePopup('about')}>About</div>
        <div className="menu-item" onClick={() => router.push('/')}>Exit</div>
      </nav>

      <img 
        src="/assets/images/kart.png" 
        className={`shopping-cart-icon ${isCartOpen ? 'shifted' : ''}`} 
        onClick={() => {
          if (isInventoryOpen || dockState !== 'none') {
            setIsInventoryOpen(false);
            setDockState('none');
            setIsCartOpen(true);       
          } else {
            setIsCartOpen(!isCartOpen);
          }
        }} 
        alt="Cart" 
      />
      
      <img 
        src="/assets/images/inventoryicon.png?v=2" 
        className={`mobile-inventory-icon ${isCartOpen ? 'shifted' : ''}`} 
        onClick={() => {
          if (isCartOpen) {
            setIsCartOpen(false);
            setIsTransitioning(true);
            setTimeout(() => {
              setIsTransitioning(false); 
              if (dockState === 'docked') {
                handlePullInventory();
              } else {
                setIsInventoryOpen(true);
                setDockState('none');
              }
            }, 400); 
            return;
          }

          if (dockState === 'docked') {
            handlePullInventory();
          } else {
            setIsInventoryOpen(!isInventoryOpen);
            if (!isInventoryOpen) setDockState('none');
          }
        }} 
        alt="Open Inventory" 
      />

      <img 
        src="/assets/images/backbtn.png" 
        className={`mobile-back-btn ${isCartOpen ? 'shifted' : ''}`}
        onClick={() => {
          setSelectedItem(null);      
          setIsInventoryOpen(false);   
          setDockState('none');       
          setHasLookedAtItems(true);  
        }}
        alt="Back"
      />

      {!activePopup && (
        <div className={`keepers-inventory ${isInventoryOpen ? 'open-modal' : ''} ${dockState === 'docked' ? 'docked' : ''} ${dockState === 'returning' ? 'returning' : ''} ${dockState === 'settled' ? 'settled' : ''}`}>
          
          {dockState === 'docked' && (
            <button className="pull-inventory-btn" onClick={handlePullInventory}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f4e1c1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}

          {isInventoryOpen && dockState !== 'docked' && (
            <button className="close-inventory-btn" onClick={() => {
              setIsInventoryOpen(false);
              setTimeout(() => setDockState('none'), 300); // Cleans up after hiding
            }}>[X]</button>
          )}
          <img src="/assets/images/inventory.png" className="inventory-bg" alt="Inventory" />
          <div className="inventory-items">
            {/* Slot 1 */}
            <div className="item-slot slot-1" onClick={() => handleItemClick('iroha')}>
              <img src="/assets/images/irohapixel.png" alt="Iroha" />
              {selectedItem === 'iroha' && <img src="/assets/images/Equip.png" className="equip-badge" alt="Equip" />}
            </div>
            {/* Slot 2 */}
            <div className="item-slot slot-2" onClick={() => handleItemClick('wonhee')}>
              <img src="/assets/images/wonheepixel.png" alt="Wonhee" />
              {selectedItem === 'wonhee' && <img src="/assets/images/Equip.png" className="equip-badge" alt="Equip" />}
            </div>
            {/* Slot 3 */}
            <div className="item-slot slot-3">
              <img src="/assets/images/question.png" alt="Mystery" />
            </div>
          </div>
        </div>
      )}

      {!selectedItem && !activePopup && !isInventoryOpen && !isTransitioning && (
        <div className="merchant-station">
          <div className="dialogue-box">
            <img src="/assets/images/speechbox.png" className="dialogue-bg" alt="Speech Box" />
            <p className="dialogue-text">{dialogue}</p>
          </div>
          
          <img 
            src={hasLookedAtItems ? "/assets/images/ej.png" : "/assets/images/ejexplaining.png"} 
            className="merchant-character" 
            alt="EJ" 
          />
        </div>
      )}

      {selectedItem && !activePopup && activeItemData && (
        <img 
          src={activeItemData?.img} 
          className={`center-display-image ${isExitingItem ? 'exiting' : ''}`} 
          alt="Selected Item" 
        />
      )}

      {selectedItem && !activePopup && activeItemData && (
        <div className={`item-panel ${isExitingItem ? 'exiting' : ''}`}>
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
        <div className="cart-header">
          <h2 className="cart-title">
            {checkoutStep === 'cart' ? "MERCHANT'S LEDGER" : 
             checkoutStep === 'details' ? "SHIPPING MANIFEST" : 
             checkoutStep === 'processing' ? "COMMUNICATING..." : "TRANSACTION COMPLETE"}
          </h2>
          <button className="cart-close-btn" onClick={closeCart}>[X]</button>
        </div>

        <div className="cart-content-scroll">
          
          {checkoutStep === 'cart' && (
            <>
              {cartItems.length === 0 ? (
                <div className="empty-cart-msg">
                  <p>Your satchel is empty.</p>
                  <p>Equip some gear before departing!</p>
                </div>
              ) : (
                <div className="cart-items-list">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="cart-item-retro">
                      <img src={item.img} alt={item.name} className="cart-item-thumb" />
                      <div className="cart-item-details">
                        <strong className="cart-item-name">{item.name}</strong>
                        <span className="cart-item-size">Size: {item.size}</span>
                        <span className="cart-item-price">₱{item.price.toFixed(2)}</span>
                      </div>
                      <button className="cart-item-remove" onClick={() => removeCartItem(idx)}>Drop</button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {checkoutStep === 'details' && (
            <form className="retro-checkout-form" onSubmit={handlePlaceOrder}>
              <label className="retro-label">Hero's Name</label>
              <input 
                type="text" 
                className="retro-input" 
                required 
                placeholder="Enter your name..."
                value={shippingInfo.name}
                onChange={(e) => setShippingInfo({...shippingInfo, name: e.target.value})}
              />

              <label className="retro-label">Delivery Coordinates (Address)</label>
              <textarea 
                className="retro-input textarea" 
                required 
                placeholder="Where should the courier pigeon fly?"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
              ></textarea>

              <div className="summary-box">
                <p>Items: {cartItems.length}</p>
                <p>Total Due: <span className="highlight">₱{calculateTotal().toFixed(2)}</span></p>
              </div>
            </form>
          )}

          {checkoutStep === 'processing' && (
            <div className="processing-state">
              <div className="pixel-spinner"></div>
              <p>Forging your order...</p>
              <p>Consulting the Guild Bank...</p>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className="success-state">
              <img src="/assets/images/Equip.png" className="success-icon" alt="Success" />
              <h3>Purchase Successful!</h3>
              <p>Thank you, {shippingInfo.name || 'Traveler'}.</p>
              <p>Your gear will arrive shortly.</p>
            </div>
          )}
        </div>

        <div className="cart-footer">
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <>
              <div className="cart-total-retro">
                <span>Total Due:</span>
                <span className="cart-total-price">₱{calculateTotal().toFixed(2)}</span>
              </div>
              <button className="retro-btn-primary" onClick={() => setCheckoutStep('details')}>Proceed to Checkout</button>
            </>
          )}

          {checkoutStep === 'details' && (
            <div className="checkout-actions">
              <button className="retro-btn-secondary" onClick={() => setCheckoutStep('cart')}>&lt; Back</button>
              <button className="retro-btn-primary" onClick={handlePlaceOrder}>Confirm Payment</button>
            </div>
          )}

          {checkoutStep === 'success' && (
            <button className="retro-btn-primary w-full" onClick={closeCart}>Return to Shop</button>
          )}
        </div>
      </div>

      <AudioController isVisible={true} />
      
      {/* Popups */}
      {activePopup === 'quest' && <QuestPopup onClose={() => setActivePopup(null)} />}
      {activePopup === 'guide' && <Guide onClose={() => setActivePopup(null)} />}
      {activePopup === 'about' && <AboutPopup onClose={() => setActivePopup(null)} />}

    </div>
  );
}