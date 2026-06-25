import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const existing = prev.find((item) => String(item.id) === String(product.id))
      
      if (existing) {
        // Item already in cart — increment quantity
        return prev.map((item) =>
          String(item.id) === String(product.id)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        // New item
        return [...prev, { ...product, quantity: 1, note: '' }]
      }
    })
    setIsOpen(true) // Auto-open cart when item added
  }, [])

  const removeItem = useCallback((productId) => {
    setItems((prev) => prev.filter((item) => String(item.id) !== String(productId)))
  }, [])

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId)
    } else {
      setItems((prev) =>
        prev.map((item) =>
          String(item.id) === String(productId)
            ? { ...item, quantity }
            : item
        )
      )
    }
  }, [removeItem])

  const updateNote = useCallback((productId, note) => {
    setItems((prev) =>
      prev.map((item) =>
        String(item.id) === String(productId)
          ? { ...item, note }
          : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const value = {
    items,
    cartCount,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateQuantity,
    updateNote,
    clearCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
