import { create } from 'zustand';

const useStore = create((set) => ({
  // UI state
  searchQuery: '',
  filters: {
    make: '', model: '', bodyType: '', fuelType: '',
    transmission: '', condition: '', minPrice: '', maxPrice: '',
    minMileage: '', maxMileage: '', city: '',
  },
  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({
    searchQuery: '',
    filters: {
      make: '', model: '', bodyType: '', fuelType: '',
      transmission: '', condition: '', minPrice: '', maxPrice: '',
      minMileage: '', maxMileage: '', city: '',
    },
  }),

  // Unread message count
  unreadCount: 0,
  setUnreadCount: (n) => set({ unreadCount: n }),
  incrementUnread: () => set((s) => ({ unreadCount: s.unreadCount + 1 })),
  resetUnread: () => set({ unreadCount: 0 }),

  // Active conversation in messaging
  activeConversation: null,
  setActiveConversation: (c) => set({ activeConversation: c }),
}));

export default useStore;
