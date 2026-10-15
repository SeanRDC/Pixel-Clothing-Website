"use client";
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import AudioController from '../../components/AudioController/AudioController';
import ScrollPopup from '../../components/Popups/ScrollPopup';
import HouseScene from '../../components/House/HouseScene';
import PixelIcon from '../../components/ui/PixelIcon';
import useHydrated from '../../lib/useHydrated';
import { readCart, writeCart } from '../../lib/cart';
import styles from './Checkout.module.css';

const SHIPPING = [
  { id: 'swift', label: 'Swift Horse', eta: '2–3 days', cost: 100 },
  { id: 'dragon', label: 'Dragon Express', eta: 'Next day', cost: 150 },
  { id: 'merchant', label: 'Merchant Walk', eta: '5–7 days', cost: 50 },
];

const PROVINCES = ['Northern Realm', 'Eastern Sands', 'Western Peaks'];

const formatPrice = (value) => `₱${value.toFixed(2)}`;

export default function CheckoutPage() {
  const router = useRouter();
  const isHydrated = useHydrated();

  const cart = useMemo(() => (isHydrated ? readCart() : []), [isHydrated]);
  const [shippingId, setShippingId] = useState(null);
  const [error, setError] = useState('');
  const [isQuestComplete, setIsQuestComplete] = useState(false);

  const shippingCost = SHIPPING.find((s) => s.id === shippingId)?.cost ?? 0;
  const subtotal = cart.reduce((total, item) => total + item.price, 0);
  const total = subtotal + shippingCost;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      setError('Your inventory bag is empty!');
      return;
    }
    if (!shippingId) {
      setError('Choose how your gear should travel.');
      return;
    }
    setError('');
    setIsQuestComplete(true);
    writeCart([]);
  };

  return (
    <>
    <HouseScene showEJ={false} />
    <div className={styles.page}>
      <h1 className={styles.title}>Items Checkout</h1>

      <form className={styles.layout} onSubmit={handleSubmit}>
        <div className={styles.forms}>
          <section className={`${styles.section} frame-wood`}>
            <h2 className={styles.heading}>Player Scroll</h2>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>Full Name</span>
                <input type="text" required autoComplete="name" placeholder="Enter thy name..." />
              </label>
              <label className={styles.field}>
                <span>Email</span>
                <input type="email" required autoComplete="email" placeholder="hero@realm.com" />
              </label>
              <label className={`${styles.field} ${styles.wide}`}>
                <span>Address</span>
                <input type="text" required autoComplete="street-address" placeholder="123 Castle Lane, Kingdom City" />
              </label>
              <label className={styles.field}>
                <span>Province</span>
                <select defaultValue={PROVINCES[0]}>
                  {PROVINCES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className={styles.field}>
                <span>Postal Code</span>
                <input type="text" required inputMode="numeric" autoComplete="postal-code" placeholder="12345" />
              </label>
            </div>
          </section>

          <section className={`${styles.section} frame-wood`}>
            <h2 className={styles.heading}>Shipping Speed</h2>
            <div className={styles.shipping} role="radiogroup" aria-label="Shipping speed">
              {SHIPPING.map((option) => (
                <label key={option.id} className={`${styles.ship} ${shippingId === option.id ? styles.shipSelected : ''}`}>
                  <input
                    type="radio"
                    name="shipping"
                    value={option.id}
                    checked={shippingId === option.id}
                    onChange={() => setShippingId(option.id)}
                  />
                  <strong>{option.label}</strong>
                  <small>{option.eta} ({formatPrice(option.cost)})</small>
                </label>
              ))}
            </div>
          </section>

          <section className={`${styles.section} frame-wood`}>
            <h2 className={styles.heading}>Payment</h2>
            <div className={styles.grid}>
              <label className={styles.field}>
                <span>GCash Number</span>
                <input type="text" required inputMode="numeric" autoComplete="off" placeholder="0917 123 4567" />
              </label>
              <label className={styles.field}>
                <span>GCash Name</span>
                <input type="text" required autoComplete="off" placeholder="Hero of the Realm" />
              </label>
            </div>
          </section>
        </div>

        <aside className={`${styles.bag} frame-plank`}>
          <h2 className={styles.bagTitle}>Inventory Bag</h2>
          <ul className={styles.items}>
            {cart.length === 0 ? (
              <li className={styles.empty}>No items found in your inventory.</li>
            ) : (
              cart.map((item, index) => (
                <li key={`${item.id}-${index}`} className={styles.item}>
                  <span>{item.name} ({item.size})</span>
                  <span>{formatPrice(item.price)}</span>
                </li>
              ))
            )}
          </ul>
          <dl className={styles.totals}>
            <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div><dt>Delivery</dt><dd>{formatPrice(shippingCost)}</dd></div>
            <div className={styles.grand}><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit" className="btn btn-green">Complete Quest</button>
          <button type="button" className="btn btn-wood" onClick={() => router.push('/house')}>
            <PixelIcon name="back" size={20} />
            Back to Shop
          </button>
        </aside>
      </form>

      {isQuestComplete && (
        <ScrollPopup title="Quest Complete!" returnLabel="Return to Merchant" onClose={() => router.push('/house')}>
          <p className={styles.complete}>
            Your item is now getting ready to be shipped. Check your email to track shipping and item.
          </p>
        </ScrollPopup>
      )}

      <AudioController isVisible={true} className={styles.sound} />
    </div>
    </>
  );
}
