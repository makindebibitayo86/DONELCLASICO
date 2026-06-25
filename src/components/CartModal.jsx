import { useCart } from './CartContext'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_NUMBER = '2348068161932'

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
)

export default function CartModal() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, updateNote } = useCart()

  function handleCheckout() {
    if (items.length === 0) return

    const lines = [
      '🛍️ *Commission Order* 🛍️',
      '',
      ...items.map((item, i) => {
        const itemLine = `${i + 1}. *${item.name}* (${item.category})`
        const quantityLine = `   Qty: ${item.quantity} × ${item.price}`
        const noteLine = item.note ? `   Note: ${item.note}` : ''
        return [itemLine, quantityLine, noteLine].filter(Boolean).join('\n')
      }),
      '',
      `*Total Items:* ${items.reduce((sum, item) => sum + item.quantity, 0)}`,
    ].join('\n')

    const encoded = encodeURIComponent(lines)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank', 'noopener')
  }

  const subtotal = items.reduce(
    (sum, item) => {
      const priceStr = String(item.price).replace(/[^\d.]/g, '')
      const price = parseFloat(priceStr) || 0
      return sum + price * item.quantity
    },
    0
  )

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[999]"
            style={{ backgroundColor: 'rgba(8, 8, 8, 0.4)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Right Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed right-0 top-0 h-screen w-full sm:w-96 z-[1000] flex flex-col overflow-hidden"
            style={{
              paddingTop: '56px',
              backgroundColor: 'var(--black)',
              color: 'var(--white)',
              fontFamily: 'var(--font-body)',
            }}
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{
                borderColor: 'var(--border)',
              }}
            >
              <h2
                className="text-sm font-medium tracking-widest uppercase"
                style={{
                  color: 'var(--white)',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '0.15em',
                }}
              >
                Cart
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 transition-colors"
                style={{
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={(e) => (e.target.style.color = 'var(--accent)')}
                onMouseLeave={(e) => (e.target.style.color = 'var(--text-muted)')}
                aria-label="Close cart"
              >
                <CloseIcon />
              </button>
            </div>

            {/* Items Container */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p
                    className="text-sm"
                    style={{ color: 'var(--text-light)' }}
                  >
                    Your cart is empty
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    borderColor: 'var(--border)',
                  }}
                  className="divide-y"
                >
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 space-y-3 transition-colors"
                      style={{
                        backgroundColor: 'var(--black)',
                        borderColor: 'var(--border)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--off-black)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = 'var(--black)')
                      }
                    >
                      {/* Item Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="text-sm font-medium leading-snug"
                            style={{ color: 'var(--white)' }}
                          >
                            {item.name}
                          </h3>
                          <p
                            className="text-xs mt-1"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {item.category}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 transition-colors"
                          style={{
                            color: 'var(--text-muted)',
                          }}
                          onMouseEnter={(e) => (e.target.style.color = '#ef4444')}
                          onMouseLeave={(e) =>
                            (e.target.style.color = 'var(--text-muted)')
                          }
                          aria-label="Remove item"
                        >
                          <TrashIcon />
                        </button>
                      </div>

                      {/* Price */}
                      <p
                        className="text-sm font-semibold"
                        style={{ color: 'var(--accent)' }}
                      >
                        {item.price}
                      </p>

                      {/* Quantity Controls */}
                      <div
                        className="flex items-center gap-2 rounded-sm p-1 w-fit"
                        style={{
                          backgroundColor: 'var(--charcoal)',
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors text-sm"
                          style={{
                            color: 'var(--text-light)',
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = 'var(--slate)')
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = 'transparent')
                          }
                        >
                          −
                        </button>
                        <span
                          className="w-7 text-center text-sm font-medium"
                          style={{ color: 'var(--white)' }}
                        >
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-sm transition-colors text-sm"
                          style={{
                            color: 'var(--text-light)',
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.backgroundColor = 'var(--slate)')
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.backgroundColor = 'transparent')
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* Notes */}
                      <textarea
                        value={item.note}
                        onChange={(e) => updateNote(item.id, e.target.value)}
                        placeholder="Add special instructions..."
                        className="w-full text-xs p-3 rounded-sm border resize-none focus:outline-none transition-colors"
                        style={{
                          backgroundColor: 'var(--off-black)',
                          borderColor: 'var(--border)',
                          color: 'var(--white)',
                          fontFamily: 'var(--font-body)',
                        }}
                        rows="2"
                        onFocus={(e) => {
                          e.target.style.borderColor = 'var(--accent)'
                          e.target.style.backgroundColor = 'var(--dark)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = 'var(--border)'
                          e.target.style.backgroundColor = 'var(--off-black)'
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="border-t p-5 space-y-4"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--black)',
                }}
              >
                {/* Subtotal */}
                <div
                  className="flex items-center justify-between py-3 border-b"
                  style={{
                    borderColor: 'var(--border)',
                  }}
                >
                  <span
                    className="text-xs font-light tracking-widest uppercase"
                    style={{ color: 'var(--text-light)' }}
                  >
                    Subtotal
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: 'var(--accent)' }}
                  >
                    ₦{subtotal.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full text-white text-sm font-medium py-3 px-4 rounded-sm transition-opacity"
                  style={{
                    backgroundColor: 'var(--accent)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
                  onMouseLeave={(e) => (e.target.style.opacity = '1')}
                >
                  Send to WhatsApp
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full text-sm font-medium py-3 px-4 rounded-sm transition-colors border"
                  style={{
                    backgroundColor: 'var(--black)',
                    color: 'var(--text-light)',
                    borderColor: 'var(--border)',
                    fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'var(--off-black)'
                    e.target.style.color = 'var(--accent)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'var(--black)'
                    e.target.style.color = 'var(--text-light)'
                  }}
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
