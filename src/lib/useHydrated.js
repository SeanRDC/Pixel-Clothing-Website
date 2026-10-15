import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

// false during SSR and hydration, true afterwards. Lets components read
// browser storage during render without a hydration mismatch.
export default function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
