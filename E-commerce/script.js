// ==================== DATA MANAGEMENT ====================
const LS_PRODUCTS = 'ca_products_v2';
const LS_CART = 'ca_cart_v2';
const LS_WISHLIST = 'ca_wishlist_v2';
const LS_USER = 'ca_user_v2';
const LS_ORDERS = 'ca_orders_v2';
const LS_REVIEWS = 'ca_reviews_v2';
const LS_NOTIFICATIONS = 'ca_notifications_v2';

// Enhanced seed data with more products and features
const seed = [
  { id: 'p1', name: 'Wireless Headphones', category: 'Electronics', price: 129.99, oldPrice: 179.99, stock: 12, img: 'https://via.placeholder.com/300x200?text=Headphones', desc: 'Premium wireless headphones', rating: 4.5, reviews: 245, popular: true },
  { id: 'p2', name: 'Smart Watch', category: 'Wearables', price: 199.00, oldPrice: 249.00, stock: 5, img: 'https://via.placeholder.com/300x200?text=Smart+Watch', desc: 'Advanced fitness tracking', rating: 4.3, reviews: 128, popular: true },
  { id: 'p3', name: 'Running Shoes', category: 'Fashion', price: 89.99, oldPrice: 0, stock: 25, img: 'https://via.placeholder.com/300x200?text=Running+Shoes', desc: 'Comfortable athletic shoes', rating: 4.7, reviews: 342 },
  { id: 'p4', name: 'Bluetooth Speaker', category: 'Electronics', price: 59.99, oldPrice: 79.99, stock: 0, img: 'https://via.placeholder.com/300x200?text=Speaker', desc: 'Portable audio speaker', rating: 4.2, reviews: 89 },
  { id: 'p5', name: 'Backpack', category: 'Fashion', price: 49.50, oldPrice: 0, stock: 30, img: 'https://via.placeholder.com/300x200?text=Backpack', desc: 'Durable travel backpack', rating: 4.6, reviews: 156 },
  { id: 'p6', name: 'Laptop Bag', category: 'Fashion', price: 79.99, oldPrice: 99.99, stock: 15, img: 'https://via.placeholder.com/300x200?text=Laptop+Bag', desc: 'Professional laptop bag', rating: 4.4, reviews: 203, popular: true },
  { id: 'p7', name: 'USB-C Cable', category: 'Electronics', price: 12.99, oldPrice: 0, stock: 100, img: 'https://via.placeholder.com/300x200?text=USB+Cable', desc: 'High-speed USB-C cable', rating: 4.5, reviews: 567 },
  { id: 'p8', name: 'Wireless Mouse', category: 'Electronics', price: 34.99, oldPrice: 44.99, stock: 45, img: 'https://via.placeholder.com/300x200?text=Mouse', desc: 'Precision wireless mouse', rating: 4.3, reviews: 234 },
  { id: 'p9', name: 'Phone Stand', category: 'Electronics', price: 14.99, oldPrice: 0, stock: 60, img: 'https://via.placeholder.com/300x200?text=Phone+Stand', desc: 'Adjustable phone holder', rating: 4.6, reviews: 412 },
  { id: 'p10', name: 'Desk Lamp', category: 'Home', price: 39.99, oldPrice: 59.99, stock: 20, img: 'https://via.placeholder.com/300x200?text=Desk+Lamp', desc: 'LED desk lamp with USB', rating: 4.4, reviews: 189 }
];

// ==================== UTILITY FUNCTIONS ====================
function lsGet(k) {
  try {
    return JSON.parse(localStorage.getItem(k)) || null;
  } catch (e) {
    return null;
  }
}

function lsSet(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}

// Initialize data
if (!lsGet(LS_PRODUCTS)) { lsSet(LS_PRODUCTS, seed); }

let products = lsGet(LS_PRODUCTS) || [];
let cart = lsGet(LS_CART) || [];
let wishlist = lsGet(LS_WISHLIST) || [];
let user = lsGet(LS_USER) || { name: 'Guest User', email: '', orders: [] };
let orders = lsGet(LS_ORDERS) || [];
let reviews = lsGet(LS_REVIEWS) || {};
let notifications = lsGet(LS_NOTIFICATIONS) || [];

let currentQty = 1;
let currentPage = 1;
const itemsPerPage = 8;

function formatPrice(v) {
  return '$' + v.toFixed(2);
}

function formatStars(rating) {
  return '⭐'.repeat(Math.round(rating));
}

function showToast(msg, type = 'success', time = 2000) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show ' + type;
  clearTimeout(t._to);
  t._to = setTimeout(() => t.classList.remove('show'), time);
}

// ==================== FILTERING & SORTING ====================
function getFiltered() {
  const q = (document.getElementById('search').value || '').trim().toLowerCase();
  const cat = document.getElementById('categoryFilter').value;
  const maxP = Number(document.getElementById('priceRange').value);
  const inStock = document.getElementById('inStockOnly').checked;
  const onSale = document.getElementById('onSaleOnly').checked;

  let filtered = products.filter(p => {
    if (cat && p.category !== cat) return false;
    if (p.price > maxP) return false;
    if (inStock && p.stock === 0) return false;
    if (onSale && !p.oldPrice) return false;
    if (q && !(p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q))) return false;
    return true;
  });

  // Sort
  const sort = document.getElementById('sortFilter').value;
  switch (sort) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      break;
    case 'popular':
      filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
      break;
    default:
      filtered.reverse();
  }

  return filtered;
}

function renderCategories() {
  const cats = Array.from(new Set(products.map(p => p.category))).sort();
  const select = document.getElementById('categoryFilter');
  select.innerHTML = '<option value="">All Categories</option>' + cats.map(c => `<option>${c}</option>`).join('');
}

function renderProducts(list) {
  const productsEl = document.getElementById('products');
  productsEl.innerHTML = '';
  if (!list.length) {
    productsEl.innerHTML = '<div class="empty" style="grid-column:1/-1">📭 No products found</div>';
    return;
  }

  list.forEach(p => {
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="thumb">
        ${discount > 0 ? `<div class="thumb-badge">-${discount}%</div>` : ''}
        <img src="${p.img}" alt="${p.name}">
      </div>
      <div class="card-content">
        <div class="card-title">${p.name}</div>
        <div class="rating">
          <span class="stars">${formatStars(p.rating || 4)}</span>
          <span class="review-summary">(${p.reviews || 0})</span>
        </div>
        <div class="card-meta">
          <span>${p.category}</span>
          <span class="${p.stock > 0 ? '' : 'out-of-stock'}">${p.stock > 0 ? 'In stock' : 'Out of stock'}</span>
        </div>
        <div>
          <span class="price">${formatPrice(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
        </div>
      </div>
      <div class="card-actions">
        <button class="btn view" data-id="${p.id}">View</button>
        <button class="btn add" data-id="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>Add</button>
        <button class="wishlist-btn" data-id="${p.id}">❤️</button>
      </div>
    `;
    productsEl.appendChild(card);
  });

  // Attach event handlers
  document.querySelectorAll('.view').forEach(b => b.addEventListener('click', e => {
    openProductModal(e.currentTarget.dataset.id);
  }));
  document.querySelectorAll('.add').forEach(b => b.addEventListener('click', e => {
    addToCart(e.currentTarget.dataset.id, 1);
    showToast('Added to cart!', 'success');
  }));
  document.querySelectorAll('.wishlist-btn').forEach(b => b.addEventListener('click', e => {
    toggleWishlist(e.currentTarget.dataset.id);
  }));

  updateWishlistUI();
  renderPagination(list.length);
}

function renderPagination(total) {
  const pages = Math.ceil(total / itemsPerPage);
  const pag = document.getElementById('pagination');
  pag.innerHTML = '';
  if (pages <= 1) return;

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = i === currentPage ? 'active' : '';
    btn.onclick = () => {
      currentPage = i;
      const list = getFiltered();
      renderProducts(list.slice((i - 1) * itemsPerPage, i * itemsPerPage));
      window.scrollTo(0, 200);
    };
    pag.appendChild(btn);
  }
}

// ==================== CART MANAGEMENT ====================
function addToCart(id, qty = 1) {
  const p = products.find(x => x.id === id);
  if (!p || p.stock === 0) return;

  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: id, qty: qty, price: p.price, name: p.name });
  }
  lsSet(LS_CART, cart);
  updateCartUI();
  addNotification(`${p.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  lsSet(LS_CART, cart);
  renderCart();
  updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = totalItems;
}

function renderCart() {
  const container = document.getElementById('cartContent');
  container.innerHTML = '';
  if (!cart.length) {
    container.innerHTML = '<div class="empty">🛒 Your cart is empty</div>';
    document.getElementById('cartSummary').style.display = 'none';
    return;
  }

  const list = document.createElement('div');
  list.className = 'cart-list';
  let subtotal = 0;

  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    const itemTotal = item.qty * item.price;
    subtotal += itemTotal;

    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-img"><img src="${p.img}" alt="${p.name}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">${item.qty} × ${formatPrice(item.price)} = ${formatPrice(itemTotal)}</div>
        <div class="cart-item-actions">
          <button class="btn" style="padding:4px 8px;font-size:12px" onclick="addToCart('${item.id}',1)">+</button>
          <button class="btn" style="padding:4px 8px;font-size:12px" onclick="removeFromCart('${item.id}')">−</button>
        </div>
      </div>
    `;
    list.appendChild(row);
  });

  container.appendChild(list);

  // Calculate totals
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  document.getElementById('cartSummary').style.display = 'block';
  document.getElementById('subtotal').textContent = formatPrice(subtotal);
  document.getElementById('shipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('tax').textContent = formatPrice(tax);
  document.getElementById('total').textContent = formatPrice(total);
}

// ==================== WISHLIST ====================
function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
  } else {
    wishlist.push(id);
  }
  lsSet(LS_WISHLIST, wishlist);
  updateWishlistUI();
  showToast(idx > -1 ? 'Removed from wishlist' : 'Added to wishlist!', 'success');
}

function updateWishlistUI() {
  document.getElementById('wishlistCount').textContent = wishlist.length;
  document.getElementById('wishlistCount').style.display = wishlist.length > 0 ? 'block' : 'none';

  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.dataset.id;
    btn.classList.toggle('saved', wishlist.includes(id));
  });
}

function renderWishlist() {
  const container = document.getElementById('wishlistContent');
  container.innerHTML = '';
  const items = products.filter(p => wishlist.includes(p.id));

  if (!items.length) {
    container.innerHTML = '<div class="empty">❤️ Your wishlist is empty</div>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'cart-list';
  items.forEach(p => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-img"><img src="${p.img}" alt="${p.name}"></div>
      <div class="cart-item-info">
        <div class="cart-item-name">${p.name}</div>
        <div class="cart-item-price">${formatPrice(p.price)}</div>
      </div>
      <div style="display:flex;gap:8px">
        <button class="btn" onclick="addToCart('${p.id}',1)">Add to Cart</button>
        <button class="btn danger" onclick="toggleWishlist('${p.id}')">Remove</button>
      </div>
    `;
    list.appendChild(row);
  });
  container.appendChild(list);
}

// ==================== PRODUCT MODAL ====================
function openProductModal(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  currentQty = 1;
  document.getElementById('modalTitle').textContent = p.name;
  document.getElementById('modalCategory').textContent = `Category: ${p.category}`;
  document.getElementById('modalDesc').textContent = p.desc || 'High-quality product';
  document.getElementById('detailedDesc').textContent = `${p.desc || 'Description not available'}\n\nThis is a premium ${p.category} item with excellent quality and durability.`;
  document.getElementById('modalPrice').textContent = formatPrice(p.price);

  if (p.oldPrice) {
    document.getElementById('modalOldPrice').textContent = formatPrice(p.oldPrice);
    document.getElementById('modalOldPrice').style.display = 'block';
  } else {
    document.getElementById('modalOldPrice').style.display = 'none';
  }

  const stockEl = document.getElementById('modalStock');
  if (p.stock > 0) {
    stockEl.className = 'stock-status in-stock';
    stockEl.innerHTML = '<span>✓</span> In Stock';
  } else {
    stockEl.className = 'stock-status out-of-stock';
    stockEl.innerHTML = '<span>✗</span> Out of Stock';
  }

  document.getElementById('modalRating').textContent = formatStars(p.rating || 4);
  document.getElementById('modalReviewCount').textContent = `${p.reviews || 0} reviews`;
  document.getElementById('modalImg').innerHTML = `<img src="${p.img}" alt="${p.name}">`;

  // Update wishlist button
  document.getElementById('modalWishlist').classList.toggle('saved', wishlist.includes(p.id));

  // Update quantity display
  updateQtyDisplay();

  // Render reviews
  renderReviews(id);

  // Setup handlers
  document.getElementById('modalAdd').onclick = () => {
    addToCart(p.id, currentQty);
    showToast('Added to cart!');
  };
  document.getElementById('modalWishlist').onclick = () => {
    toggleWishlist(p.id);
  };
  document.getElementById('qtyMinus').onclick = () => {
    if (currentQty > 1) currentQty--;
    updateQtyDisplay();
  };
  document.getElementById('qtyPlus').onclick = () => {
    if (currentQty < p.stock) currentQty++;
    updateQtyDisplay();
  };

  // Disable add button if out of stock
  document.getElementById('modalAdd').disabled = p.stock === 0;

  const modal = document.getElementById('productModal');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
}

function updateQtyDisplay() {
  document.getElementById('qtyDisplay').textContent = currentQty;
}

function renderReviews(productId) {
  const container = document.getElementById('reviewsList');
  container.innerHTML = '';
  const prodReviews = reviews[productId] || [];

  if (!prodReviews.length) {
    container.innerHTML = '<p class="small">No reviews yet. Be the first to review!</p>';
    return;
  }

  prodReviews.forEach(r => {
    const div = document.createElement('div');
    div.style.cssText = 'padding:12px;border-bottom:1px solid #eef2f7';
    div.innerHTML = `
      <div style="display:flex;justify-content:space-between;margin-bottom:8px">
        <strong>${r.author}</strong>
        <span class="stars">${'⭐'.repeat(r.rating)}</span>
      </div>
      <p style="margin:0">${r.text}</p>
    `;
    container.appendChild(div);
  });
}

// ==================== CHECKOUT ====================
function openCheckout() {
  const subtotal = cart.reduce((s, i) => s + (i.qty * i.price), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const total = subtotal + (subtotal * 0.08) + shipping;

  document.getElementById('checkoutSubtotal').textContent = formatPrice(subtotal);
  document.getElementById('checkoutShipping').textContent = shipping === 0 ? 'FREE' : formatPrice(shipping);
  document.getElementById('checkoutTotal').textContent = formatPrice(total);

  document.getElementById('checkoutModal').classList.add('open');
  document.getElementById('checkoutModal').setAttribute('aria-hidden', 'false');
}

function placeOrder() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  const email = document.getElementById('email').value;
  const cardNumber = document.getElementById('cardNumber').value;

  if (!firstName || !lastName || !email || !cardNumber) {
    showToast('Please fill in all fields', 'error');
    return;
  }

  // Validate card (simple check)
  if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
    showToast('Invalid card number', 'error');
    return;
  }

  const orderId = 'ORD-' + Date.now();
  const subtotal = cart.reduce((s, i) => s + (i.qty * i.price), 0);
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08;

  const order = {
    id: orderId,
    date: new Date().toLocaleDateString(),
    items: [...cart],
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    customer: { name: `${firstName} ${lastName}`, email },
    status: 'Confirmed'
  };

  orders.push(order);
  lsSet(LS_ORDERS, orders);

  user.name = `${firstName} ${lastName}`;
  user.email = email;
  lsSet(LS_USER, user);

  document.getElementById('orderId').textContent = orderId;
  document.getElementById('confirmationMessage').textContent = `Thank you for your purchase! Your order has been confirmed and will be shipped to ${firstName} ${lastName}.`;

  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('confirmationModal').classList.add('open');
  document.getElementById('confirmationModal').setAttribute('aria-hidden', 'false');

  cart = [];
  lsSet(LS_CART, cart);
  updateCartUI();

  addNotification(`Order ${orderId} placed successfully!`);
}

// ==================== NOTIFICATIONS ====================
function addNotification(msg) {
  notifications.unshift({ id: Date.now(), msg, date: new Date().toLocaleTimeString() });
  if (notifications.length > 20) notifications.pop();
  lsSet(LS_NOTIFICATIONS, notifications);
  updateNotificationUI();
}

function updateNotificationUI() {
  document.getElementById('notificationCount').textContent = notifications.length;
  document.getElementById('notificationCount').style.display = notifications.length > 0 ? 'block' : 'none';
}

function renderNotifications() {
  const container = document.getElementById('notificationsList');
  container.innerHTML = '';

  if (!notifications.length) {
    container.innerHTML = '<div class="empty">🔔 No notifications</div>';
    return;
  }

  notifications.forEach(n => {
    const div = document.createElement('div');
    div.style.cssText = 'padding:12px;border-bottom:1px solid #eef2f7;display:flex;justify-content:space-between;align-items:center';
    div.innerHTML = `
      <div>
        <p style="margin:0">${n.msg}</p>
        <span class="small">${n.date}</span>
      </div>
      <button class="icon-btn" onclick="notifications=notifications.filter(x=>x.id!==${n.id});lsSet('${LS_NOTIFICATIONS}',notifications);renderNotifications();updateNotificationUI()">✕</button>
    `;
    container.appendChild(div);
  });
}

// ==================== USER ACCOUNT ====================
function renderUserAccount() {
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email || 'No email';

  const orderHistoryEl = document.getElementById('orderHistory');
  orderHistoryEl.innerHTML = '';

  if (!orders.length) {
    orderHistoryEl.innerHTML = '<p class="small">No orders yet</p>';
    return;
  }

  const recentOrders = orders.slice(-3).reverse();
  recentOrders.forEach(o => {
    const div = document.createElement('div');
    div.style.cssText = 'padding:8px;border-bottom:1px solid #eef2f7';
    div.innerHTML = `
      <div style="font-weight:600;font-size:12px">${o.id}</div>
      <div class="small">${o.date}</div>
      <div class="small">Total: ${formatPrice(o.total)}</div>
    `;
    orderHistoryEl.appendChild(div);
  });
}

// ==================== EVENT LISTENERS ====================
document.getElementById('search').addEventListener('input', () => {
  currentPage = 1;
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
});

document.getElementById('categoryFilter').addEventListener('change', () => {
  currentPage = 1;
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
  document.getElementById('currentCategory').textContent = document.getElementById('categoryFilter').value || 'All Products';
});

document.getElementById('priceRange').addEventListener('input', () => {
  document.getElementById('maxPriceLabel').textContent = document.getElementById('priceRange').value;
  currentPage = 1;
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
});

document.getElementById('inStockOnly').addEventListener('change', () => {
  currentPage = 1;
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
});

document.getElementById('onSaleOnly').addEventListener('change', () => {
  currentPage = 1;
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
});

document.getElementById('sortFilter').addEventListener('change', () => {
  currentPage = 1;
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
});

document.getElementById('clearFilters').addEventListener('click', () => {
  document.getElementById('search').value = '';
  document.getElementById('categoryFilter').value = '';
  document.getElementById('priceRange').value = '1000';
  document.getElementById('inStockOnly').checked = false;
  document.getElementById('onSaleOnly').checked = false;
  document.getElementById('sortFilter').value = 'newest';
  currentPage = 1;
  document.getElementById('maxPriceLabel').textContent = '1000';
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
});

// Modal controls
document.getElementById('cartBtn').addEventListener('click', () => {
  renderCart();
  document.getElementById('cartModal').classList.add('open');
  document.getElementById('cartModal').setAttribute('aria-hidden', 'false');
});

document.getElementById('closeCart').addEventListener('click', () => {
  document.getElementById('cartModal').classList.remove('open');
  document.getElementById('cartModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('modalClose').addEventListener('click', () => {
  document.getElementById('productModal').classList.remove('open');
  document.getElementById('productModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('wishlistBtn').addEventListener('click', () => {
  renderWishlist();
  document.getElementById('wishlistModal').classList.add('open');
  document.getElementById('wishlistModal').setAttribute('aria-hidden', 'false');
});

document.getElementById('closeWishlist').addEventListener('click', () => {
  document.getElementById('wishlistModal').classList.remove('open');
  document.getElementById('wishlistModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('checkout').addEventListener('click', openCheckout);

document.getElementById('continueShopping').addEventListener('click', () => {
  document.getElementById('cartModal').classList.remove('open');
  document.getElementById('cartModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('closeCheckout').addEventListener('click', () => {
  document.getElementById('checkoutModal').classList.remove('open');
  document.getElementById('checkoutModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('placeOrder').addEventListener('click', placeOrder);

document.getElementById('continueAfterOrder').addEventListener('click', () => {
  document.getElementById('confirmationModal').classList.remove('open');
  document.getElementById('confirmationModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('notificationBtn').addEventListener('click', () => {
  renderNotifications();
  document.getElementById('notificationsModal').classList.add('open');
  document.getElementById('notificationsModal').setAttribute('aria-hidden', 'false');
});

document.getElementById('closeNotifications').addEventListener('click', () => {
  document.getElementById('notificationsModal').classList.remove('open');
  document.getElementById('notificationsModal').setAttribute('aria-hidden', 'true');
});

document.getElementById('userBtn').addEventListener('click', () => {
  renderUserAccount();
  document.getElementById('userModal').classList.add('open');
  document.getElementById('userModal').setAttribute('aria-hidden', 'false');
});

document.getElementById('closeUser').addEventListener('click', () => {
  document.getElementById('userModal').classList.remove('open');
  document.getElementById('userModal').setAttribute('aria-hidden', 'true');
});

// Tab handlers
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Close modals on background click
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });
});

// ==================== INITIAL RENDER ====================
function init() {
  renderCategories();
  const list = getFiltered();
  renderProducts(list.slice(0, itemsPerPage));
  updateCartUI();
  updateWishlistUI();
  updateNotificationUI();
}

init();

// Expose API for debugging
window.ca = {
  products,
  cart,
  wishlist,
  orders,
  user,
  refresh: init,
  addToCart,
  toggleWishlist,
  openProductModal
};
