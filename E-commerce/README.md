# CodeAlpha Shop — Modern E-Commerce Website

A fully functional, feature-rich e-commerce website built with vanilla HTML, CSS, and JavaScript. No backend required — everything runs in the browser with localStorage for data persistence.

## 📁 Project Structure

```
E-commerce/
├── index.html          # Main HTML file (clean markup)
├── styles.css          # All CSS styling (external stylesheet)
├── script.js           # All JavaScript functionality (external)
├── README.md           # This file
└── index-old.html      # Backup of original version
```

## 🎨 Features

### Shopping Features
- ✅ Product catalog with 10+ products
- ✅ Advanced filtering (category, price range, stock status, on sale)
- ✅ Multiple sorting options (newest, price, rating, popular)
- ✅ Product search functionality
- ✅ Product detail modal with reviews and shipping info
- ✅ Wishlist functionality
- ✅ Shopping cart with quantity controls
- ✅ Free shipping on orders over $50
- ✅ Tax calculation (8%)

### Checkout & Payment
- ✅ Complete checkout flow
- ✅ Shipping address collection
- ✅ Payment information form
- ✅ Card validation
- ✅ Order confirmation with order ID
- ✅ Order tracking

### User Features
- ✅ User account dashboard
- ✅ Order history
- ✅ Notification center
- ✅ Toast notifications
- ✅ Profile management

### UI/UX
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Modal dialogs for all actions
- ✅ Tabbed interface for product info
- ✅ Pagination for products
- ✅ Breadcrumb navigation
- ✅ Star ratings and reviews
- ✅ Discount badges
- ✅ Professional styling

## 📦 Data Persistence

All data is stored in browser localStorage:
- Products inventory
- Shopping cart
- Wishlist
- User profile
- Order history
- Notifications
- Product reviews

## 🚀 Getting Started

1. **Open the website:**
   - Simply open `index.html` in any modern web browser
   - No server or build process required

2. **Start shopping:**
   - Browse products in the main grid
   - Use filters to narrow down results
   - Click "View" to see product details
   - Click "Add" to add items to cart

3. **Checkout:**
   - Click "Cart" button in header
   - Review items and click "Checkout"
   - Fill in shipping and payment info
   - Click "Place Order"

## 💾 Local Storage Keys

The application uses the following localStorage keys:
- `ca_products_v2` - Product catalog
- `ca_cart_v2` - Shopping cart items
- `ca_wishlist_v2` - Wishlist items
- `ca_user_v2` - User profile
- `ca_orders_v2` - Order history
- `ca_reviews_v2` - Product reviews
- `ca_notifications_v2` - User notifications

## 🎯 Key Components

### HTML (index.html)
- Clean semantic markup
- Modal dialogs for all major features
- Accessible form inputs
- 261 lines of pure HTML

### CSS (styles.css)
- Mobile-first responsive design
- CSS custom properties (variables)
- Smooth animations and transitions
- Professional color scheme
- ~400 lines of organized CSS

### JavaScript (script.js)
- Modular functions
- Event-driven architecture
- LocalStorage integration
- Product filtering and sorting
- Cart management
- Order processing
- Notification system
- ~650 lines of well-commented code

## 🎮 API Reference

Access via `window.ca`:
```javascript
// Global API
window.ca.products          // All products
window.ca.cart              // Cart items
window.ca.wishlist          // Wishlist items
window.ca.orders            // Order history
window.ca.user              // User profile
window.ca.refresh()          // Re-render everything
window.ca.addToCart(id, qty) // Add product to cart
window.ca.toggleWishlist(id) // Toggle wishlist
window.ca.openProductModal(id) // Open product details
```

## 🎨 Customization

### Change Theme Colors
Edit the CSS variables in `styles.css`:
```css
:root {
  --accent: #0066ff;        /* Blue */
  --bg: #f6f8fb;            /* Light gray background */
  --muted: #6b7280;         /* Gray text */
  --success: #10b981;       /* Green */
  --danger: #ef4444;        /* Red */
  --warning: #f59e0b;       /* Orange */
}
```

### Add More Products
Edit the `seed` array in `script.js`:
```javascript
const seed = [
  {
    id: 'p11',
    name: 'New Product',
    category: 'Electronics',
    price: 99.99,
    oldPrice: 129.99,
    stock: 20,
    img: 'image-url',
    desc: 'Product description',
    rating: 4.5,
    reviews: 100,
    popular: true
  }
  // ... more products
];
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## 🔧 Development Notes

### File Separation Benefits
- **index.html** - Pure markup, easy to read
- **styles.css** - All styling in one place, easy to maintain
- **script.js** - All logic organized by feature

### Code Organization
Each script section is clearly marked:
- Data Management
- Utility Functions
- Filtering & Sorting
- Cart Management
- Wishlist
- Product Modal
- Checkout
- Notifications
- User Account
- Event Listeners
- Initial Render

## 🐛 Debugging

Open browser console and use:
```javascript
window.ca.products    // View all products
window.ca.cart        // View cart contents
window.ca.orders      // View all orders
localStorage.clear()  // Clear all data and start fresh
```

## 📝 License

Free to use and modify for personal or commercial projects.

## 🎓 Learning Resources

This project demonstrates:
- Clean separation of concerns (HTML/CSS/JS)
- DOM manipulation and event handling
- LocalStorage API
- Responsive CSS Grid and Flexbox
- Modal dialogs and form validation
- Array methods and functional programming
- String templates and DOM creation

---

**Built with ❤️ for CodeAlpha**
