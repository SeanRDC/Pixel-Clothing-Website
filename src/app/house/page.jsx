"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AudioController from '../../components/AudioController/AudioController';
import Guide from '../../components/Popups/Guide';
import QuestPopup from '../../components/Popups/QuestPopup';
import AboutPopup from '../../components/Popups/AboutPopup';
import ScrollPopup from '../../components/Popups/ScrollPopup';
import IconButton from '../../components/ui/IconButton';
import PixelIcon from '../../components/ui/PixelIcon';
import Logo from '../../components/ui/Logo';
import { readCart, writeCart } from '../../lib/cart';
import styles from './House.module.css';

const introDialogue = "Oh, would you like to see these clothes? I'm actually selling these, I'd be happy if you would pick one.";
const returnDialogue = "Have you made your choice?";
const errorDialogue = "Hmm, my stock ledger won't open right now. Please come back a little later, traveler!";

const SLOTS = [
  { id: 'iroha', thumb: '/assets/images/irohapixel.png', label: 'Iroha' },
  { id: 'wonhee', thumb: '/assets/images/wonheepixel.png', label: 'Wonhee' },
];

const SIZES = [
  { id: 'XS', label: 'Extra Small', measure: '114 x 88' },
  { id: 'S', label: 'Small', measure: '118 x 90' },
  { id: 'M', label: 'Medium', measure: '122 x 92' },
  { id: 'L', label: 'Large', measure: '126 x 94' },
];

const NAV = [
  { key: 'quest', label: 'Quest' },
  { key: 'guide', label: 'Guide' },
  { key: 'about', label: 'About' },
];

const CART_TITLES = {
  cart: "Merchant's Ledger",
  details: 'Shipping Manifest',
  processing: 'Communicating...',
  success: 'Transaction Complete',
};

const formatPrice = (value) => `₱${value.toFixed(2)}`;

export default function HousePage() {
  const router = useRouter();

  const [shopItems, setShopItems] = useState({});
  const [loadState, setLoadState] = useState('loading');

  const [selectedItem, setSelectedItem] = useState(null);
  const [panelTab, setPanelTab] = useState('desc');
  const [selectedSize, setSelectedSize] = useState('M');
  const [hasLookedAtItems, setHasLookedAtItems] = useState(false);
  const [typedChars, setTypedChars] = useState(0);

  // Cart & checkout. Safe to read storage here: the server render only shows the loading screen
  const [cartItems, setCartItems] = useState(() => (typeof window === 'undefined' ? [] : readCart()));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState('cart');
  const [shippingInfo, setShippingInfo] = useState({ name: '', address: '' });

  // Popups and small-screen sheets
  const [activePopup, setActivePopup] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isPanelExpanded, setIsPanelExpanded] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const fetchItems = async () => {
      try {
        const res = await fetch('/api/items');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Server returned an error');
        if (!Array.isArray(data)) throw new Error('Expected an array of items.');
        if (cancelled) return;
        setShopItems(Object.fromEntries(data.map((item) => [item.id, item])));
        setLoadState('ready');
      } catch (error) {
        console.error("Failed to load shop items:", error);
        if (!cancelled) setLoadState('error');
      }
    };
    fetchItems();
    return () => {
      cancelled = true;
    };
  }, []);

  // Typewriter intro, played once after the shop loads
  const introText = loadState === 'error' ? errorDialogue : introDialogue;
  useEffect(() => {
    if (loadState === 'loading') return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setTypedChars(i);
      if (i >= introText.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [loadState, introText]);

  const dialogue = hasLookedAtItems && loadState === 'ready' ? returnDialogue : introText.slice(0, typedChars);
  const isTyping = !hasLookedAtItems && typedChars < introText.length;

  // Keep the cart across reloads; the /checkout page reads the same storage key
  useEffect(() => {
    writeCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const activeItem = selectedItem ? shopItems[selectedItem] : null;
  const cartTotal = cartItems.reduce((total, item) => total + item.price, 0);

  const showToast = (message) => {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };

  const deselect = () => {
    setSelectedItem(null);
    setIsPanelExpanded(false);
    setHasLookedAtItems(true);
  };

  const handleSlotClick = (itemId) => {
    if (selectedItem === itemId) {
      deselect();
      return;
    }
    if (!shopItems[itemId]) {
      showToast('This item is not in stock yet.');
      return;
    }
    setSelectedItem(itemId);
    setPanelTab('desc');
    setIsInventoryOpen(false);
    setIsPanelExpanded(false);
  };

  const handleAddToCart = () => {
    if (!activeItem) return;
    setCartItems((items) => [...items, { ...activeItem, size: selectedSize }]);
    showToast(`${activeItem.name} (${selectedSize}) added to your satchel!`);
  };

  const removeCartItem = (indexToRemove) => {
    setCartItems((items) => items.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setCheckoutStep('processing');
    setTimeout(() => {
      setCheckoutStep('success');
      setCartItems([]);
    }, 2500);
  };

  const openCart = () => {
    setToast(null);
    setIsMenuOpen(false);
    setIsInventoryOpen(false);
    setIsCartOpen(true);
  };

  function closeCart() {
    setIsCartOpen(false);
    setTimeout(() => setCheckoutStep((step) => (step === 'processing' ? step : 'cart')), 300);
  }

  const openPopup = (key) => {
    setIsMenuOpen(false);
    setActivePopup(key);
  };

  if (loadState === 'loading') {
    return (
      <div className={styles.loading}>
        <p className={styles.loadingText}>
          Loading Inventory
          <span className={styles.dots} aria-hidden="true"><i /><i /><i /></span>
        </p>
      </div>
    );
  }

  const inventoryPanel = (
    <section
      id="inventory"
      className={`${styles.inventory} ${isInventoryOpen ? styles.sheetOpen : ''} frame-wood`}
      aria-label="Keeper's Inventory"
    >
      <h2 className={styles.panelTitle}>Keeper&apos;s Inventory</h2>
      <p className={styles.hint}>Pick a garment to inspect it.</p>
      <div className={styles.slots}>
        {SLOTS.map((slot) => {
          const isSelected = selectedItem === slot.id;
          return (
            <button
              key={slot.id}
              type="button"
              className={`${styles.slot} ${isSelected ? styles.slotSelected : ''} frame-slot`}
              aria-pressed={isSelected}
              aria-label={shopItems[slot.id]?.name || slot.label}
              onClick={() => handleSlotClick(slot.id)}
            >
              <img src={slot.thumb} alt="" />
              {isSelected && <span className={styles.equipBadge}>E</span>}
            </button>
          );
        })}
        <button
          type="button"
          className={`${styles.slot} ${styles.mystery} frame-slot`}
          aria-label="Mystery item, coming soon"
          onClick={() => openPopup('soon')}
        >
          <span aria-hidden="true">?</span>
        </button>
      </div>
      <button type="button" className={`btn btn-wood btn-small ${styles.sheetClose}`} onClick={() => setIsInventoryOpen(false)}>
        Close
      </button>
    </section>
  );

  return (
    <div className={styles.house}>
      <div className={styles.backdrop} aria-hidden="true" />

      {/* ---------- Top bar ---------- */}
      <header className={styles.topbar}>
        <button type="button" className={styles.home} onClick={() => router.push('/')} aria-label="Back to title screen">
          <Logo size="small" />
        </button>

        <nav id="house-menu" className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''} frame-plank`} aria-label="House menu">
          {NAV.map((item) => (
            <button key={item.key} type="button" className={styles.navItem} onClick={() => openPopup(item.key)}>
              {item.label}
            </button>
          ))}
          <button type="button" className={styles.navItem} onClick={() => router.push('/')}>Exit</button>
        </nav>

        <div className={styles.actions}>
          <IconButton
            icon="gear"
            label="Menu"
            className={styles.menuToggle}
            aria-expanded={isMenuOpen}
            aria-controls="house-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          />
          <IconButton
            icon="backpack"
            label="Inventory"
            className={styles.inventoryToggle}
            aria-expanded={isInventoryOpen}
            aria-controls="inventory"
            onClick={() => setIsInventoryOpen((open) => !open)}
          />
          <AudioController isVisible={true} />
          <IconButton icon="cart" label={`Cart (${cartItems.length} items)`} badge={cartItems.length || null} onClick={openCart} />
        </div>
      </header>

      {/* ---------- Shop ---------- */}
      <main className={`${styles.shop} ${activeItem ? styles.hasItem : ''}`}>
        {inventoryPanel}

        <section className={styles.stage} aria-live="polite">
          {activeItem ? (
            <div key={activeItem.id} className={styles.showcase}>
              <IconButton icon="back" label="Back to the merchant" className={styles.backBtn} onClick={deselect} />
              <img className={styles.shirt} src={activeItem.img} alt={activeItem.name} />
              <h2 className={styles.shirtName}>{activeItem.name}</h2>
            </div>
          ) : (
            <div className={styles.merchant}>
              <div className={`${styles.bubble} frame-wood`}>
                <span className={styles.speaker}>EJ</span>
                <p className={styles.bubbleText}>
                  {dialogue}
                  {isTyping && <span className={styles.caret} aria-hidden="true" />}
                </p>
              </div>
              <img
                className={styles.ej}
                src={hasLookedAtItems ? '/assets/images/ej.png' : '/assets/images/ejexplaining.png'}
                alt="EJ the merchant"
              />
            </div>
          )}
        </section>

        {activeItem && (
          <section
            key={activeItem.id}
            className={`${styles.itemPanel} ${isPanelExpanded ? styles.panelExpanded : ''} frame-wood`}
            aria-label={`${activeItem.name} details`}
          >
            <button
              type="button"
              className={styles.panelHandle}
              aria-expanded={isPanelExpanded}
              onClick={() => setIsPanelExpanded((open) => !open)}
            >
              <PixelIcon name={isPanelExpanded ? 'chevronDown' : 'chevronUp'} size={24} />
              <span className="visually-hidden">{isPanelExpanded ? 'Collapse details' : 'Expand details'}</span>
            </button>

            <h2 className={styles.itemTitle}>{activeItem.name}</h2>

            <div className={styles.tabs} role="tablist">
              <button type="button" role="tab" aria-selected={panelTab === 'desc'} className={styles.tab} onClick={() => setPanelTab('desc')}>
                Details
              </button>
              <button type="button" role="tab" aria-selected={panelTab === 'size'} className={styles.tab} onClick={() => setPanelTab('size')}>
                Size: {selectedSize}
              </button>
            </div>

            <div className={styles.panelBody}>
              {panelTab === 'desc' ? (
                <>
                  <h3 className={styles.label}>Description</h3>
                  <p className={styles.text}>{activeItem.desc}</p>
                  <h3 className={styles.label}>Passive</h3>
                  <p className={`${styles.text} ${styles.passive}`}>{activeItem.passive}</p>
                </>
              ) : (
                <fieldset className={styles.sizes}>
                  <legend className={styles.label}>Choose a size</legend>
                  {SIZES.map((size) => (
                    <label key={size.id} className={`${styles.size} ${selectedSize === size.id ? styles.sizeSelected : ''}`}>
                      <input
                        type="radio"
                        name="size"
                        value={size.id}
                        checked={selectedSize === size.id}
                        onChange={() => setSelectedSize(size.id)}
                      />
                      <span className={styles.sizeId}>{size.id}</span>
                      <span className={styles.sizeLabel}>{size.label}</span>
                      <span className={styles.sizeMeasure}>{size.measure}</span>
                    </label>
                  ))}
                </fieldset>
              )}
            </div>

            <div className={styles.buyRow}>
              <p className={styles.price}>
                <PixelIcon name="coin" size={24} />
                {formatPrice(activeItem.price)}
              </p>
              <button type="button" className="btn btn-green" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          </section>
        )}
      </main>

      {isInventoryOpen && <div className={styles.sheetScrim} onClick={() => setIsInventoryOpen(false)} aria-hidden="true" />}

      {/* ---------- Cart drawer ---------- */}
      <div className={`${styles.cartScrim} ${isCartOpen ? styles.cartScrimOpen : ''}`} onClick={closeCart} aria-hidden="true" />
      <aside
        className={`${styles.cart} ${isCartOpen ? styles.cartOpen : ''} frame-plank`}
        aria-label="Cart"
        aria-hidden={!isCartOpen}
        inert={!isCartOpen}
      >
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>{CART_TITLES[checkoutStep]}</h2>
          <IconButton icon="close" label="Close cart" onClick={closeCart} className={styles.cartClose} />
        </div>

        <div className={styles.cartBody}>
          {checkoutStep === 'cart' &&
            (cartItems.length === 0 ? (
              <div className={styles.empty}>
                <PixelIcon name="backpack" size={64} />
                <p>Your satchel is empty.</p>
                <p>Equip some gear before departing!</p>
              </div>
            ) : (
              <ul className={styles.cartList}>
                {cartItems.map((item, idx) => (
                  <li key={`${item.id}-${idx}`} className={styles.cartItem}>
                    <div className={`${styles.thumb} frame-slot`}>
                      <img src={item.img} alt="" />
                    </div>
                    <div className={styles.cartInfo}>
                      <strong>{item.name}</strong>
                      <span>Size: {item.size}</span>
                      <span className={styles.cartPrice}>{formatPrice(item.price)}</span>
                    </div>
                    <button type="button" className="btn btn-red btn-small" onClick={() => removeCartItem(idx)}>
                      Drop
                    </button>
                  </li>
                ))}
              </ul>
            ))}

          {checkoutStep === 'details' && (
            <form id="shipping-form" className={styles.form} onSubmit={handlePlaceOrder}>
              <label className={styles.field}>
                <span>Hero&apos;s Name</span>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Enter your name..."
                  value={shippingInfo.name}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                />
              </label>
              <label className={styles.field}>
                <span>Delivery Coordinates (Address)</span>
                <textarea
                  required
                  autoComplete="street-address"
                  placeholder="Where should the courier pigeon fly?"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                />
              </label>
              <div className={styles.summary}>
                <p>Items: {cartItems.length}</p>
                <p>Total Due: <strong>{formatPrice(cartTotal)}</strong></p>
              </div>
            </form>
          )}

          {checkoutStep === 'processing' && (
            <div className={styles.status}>
              <div className={styles.spinner} aria-hidden="true" />
              <p>Forging your order...</p>
              <p>Consulting the Guild Bank...</p>
            </div>
          )}

          {checkoutStep === 'success' && (
            <div className={styles.status}>
              <PixelIcon name="check" size={88} className={styles.successIcon} />
              <h3>Purchase Successful!</h3>
              <p>Thank you, {shippingInfo.name || 'Traveler'}.</p>
              <p>Your gear will arrive shortly.</p>
            </div>
          )}
        </div>

        <div className={styles.cartFooter}>
          {checkoutStep === 'cart' && cartItems.length > 0 && (
            <>
              <div className={styles.total}>
                <span>Total Due</span>
                <strong>{formatPrice(cartTotal)}</strong>
              </div>
              <button type="button" className="btn btn-green" onClick={() => setCheckoutStep('details')}>
                Proceed to Checkout
              </button>
            </>
          )}
          {checkoutStep === 'cart' && cartItems.length === 0 && (
            <button type="button" className="btn btn-wood" onClick={closeCart}>Keep Browsing</button>
          )}
          {checkoutStep === 'details' && (
            <div className={styles.footerRow}>
              <button type="button" className="btn btn-wood" onClick={() => setCheckoutStep('cart')}>Back</button>
              <button type="submit" form="shipping-form" className="btn btn-green">Confirm Payment</button>
            </div>
          )}
          {checkoutStep === 'success' && (
            <button type="button" className="btn btn-green" onClick={closeCart}>Return to Shop</button>
          )}
        </div>
      </aside>

      {toast && (
        <div className={styles.toast} role="status">
          {toast}
        </div>
      )}

      {activePopup === 'quest' && <QuestPopup onClose={() => setActivePopup(null)} />}
      {activePopup === 'guide' && <Guide onClose={() => setActivePopup(null)} />}
      {activePopup === 'about' && <AboutPopup onClose={() => setActivePopup(null)} />}
      {activePopup === 'soon' && (
        <ScrollPopup title="Coming Soon" onClose={() => setActivePopup(null)}>
          <p className={styles.soonText}>Future content is currently in development. Stay tuned, Traveler!</p>
        </ScrollPopup>
      )}
    </div>
  );
}
