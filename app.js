// ==========================================
// SMOOOD COLLEGE SMART CANTEEN - APP LOGIC
// Supports Student & Admin Login/Signup,
// Live Stock/Menu Control, and Order Tracking
// ==========================================

const ADMIN_PASSCODE = "admin123";

// Default Users (Demo Accounts pre-loaded)
const defaultUsers = [
  { name: "Arjun (CSE)", identifier: "student@college.edu", password: "123", role: "student" },
  { name: "Chef Ramesh (Admin)", identifier: "admin@smaood.com", password: "123", role: "admin" }
];

// Basic College Canteen Items (Samosa, Coffee, Dosa, Fried Rice, etc.)
const defaultMenu = [
  { id: 1, name: "Crispy Aloo Samosa (2 Pcs)", category: "snacks", price: 30, stock: 45, prep: 3, veg: true, todaysSpecial: true, emoji: "🥟", desc: "Hot flaky pastry stuffed with spiced potato & peas, served with mint chutney." },
  { id: 2, name: "Hot Filter Coffee", category: "snacks", price: 25, stock: 60, prep: 2, veg: true, todaysSpecial: true, emoji: "☕", desc: "Freshly brewed South Indian frothy filter coffee." },
  { id: 3, name: "Masala Dosa", category: "breakfast", price: 55, stock: 35, prep: 7, veg: true, todaysSpecial: true, emoji: "🥞", desc: "Golden crispy dosa filled with spiced potato masala, coconut chutney & sambar." },
  { id: 4, name: "Veg Fried Rice", category: "lunch", price: 85, stock: 30, prep: 8, veg: true, todaysSpecial: true, emoji: "🍛", desc: "Wok-tossed aromatic rice with crunchy vegetables, soy sauce & spring onions." },
  { id: 5, name: "Chicken Fried Rice", category: "lunch", price: 110, stock: 25, prep: 9, veg: false, todaysSpecial: false, emoji: "🍗", desc: "Classic Indo-Chinese fried rice tossed with tender chicken strips & egg." },
  { id: 6, name: "Steamed Idli & Vada (3 Pcs)", category: "breakfast", price: 40, stock: 40, prep: 4, veg: true, todaysSpecial: false, emoji: "⚪", desc: "2 soft steamed idlis + 1 crispy medu vada with hot sambar & chutney." },
  { id: 7, name: "Veg Puff & Ginger Chai Combo", category: "snacks", price: 45, stock: 30, prep: 3, veg: true, todaysSpecial: false, emoji: "🥐", desc: "Fresh bakery spiced veg puff paired with hot adrak chai." },
  { id: 8, name: "Paneer Tikka Sandwich", category: "snacks", price: 65, stock: 20, prep: 6, veg: true, todaysSpecial: false, emoji: "🥪", desc: "Grilled jumbo bread loaded with smoky tandoori paneer & mint mayo." },
  { id: 9, name: "Chapati & Paneer Butter Masala", category: "dinner", price: 95, stock: 25, prep: 8, veg: true, todaysSpecial: false, emoji: "🫓", desc: "3 soft whole-wheat chapatis served with rich creamy paneer gravy." },
  { id: 10, name: "Chocolate Truffle Pastry", category: "cakes", price: 60, stock: 18, prep: 2, veg: true, todaysSpecial: false, emoji: "🍰", desc: "Moist dark chocolate sponge cake layered with silky ganache." }
];

const defaultOrders = [
  {
    token: "SMD-101",
    userId: "student@college.edu",
    studentName: "Arjun (CSE)",
    slot: "12:45 PM Lunch Break",
    note: "Extra chutney",
    status: "preparing",
    total: 90,
    time: "12:30 PM",
    items: [
      { name: "Crispy Aloo Samosa (2 Pcs)", qty: 2, price: 30 },
      { name: "Hot Filter Coffee", qty: 1, price: 25 }
    ]
  }
];

// State
let users = JSON.parse(localStorage.getItem("smaood_users_v2")) || defaultUsers;
let currentUser = JSON.parse(localStorage.getItem("smaood_current_user_v2")) || null;
let menuItems = JSON.parse(localStorage.getItem("smaood_menu_v2")) || defaultMenu;
let orders = JSON.parse(localStorage.getItem("smaood_orders_v2")) || defaultOrders;
let cart = JSON.parse(localStorage.getItem("smaood_cart_v2")) || {};

let selectedAuthRole = "student";
let activeCategory = "all";
let vegOnly = false;
let searchQuery = "";
let sortBy = "featured";

function saveState() {
  localStorage.setItem("smaood_users_v2", JSON.stringify(users));
  localStorage.setItem("smaood_current_user_v2", JSON.stringify(currentUser));
  localStorage.setItem("smaood_menu_v2", JSON.stringify(menuItems));
  localStorage.setItem("smaood_orders_v2", JSON.stringify(orders));
  localStorage.setItem("smaood_cart_v2", JSON.stringify(cart));
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.add("hidden"), 2800);
}

// ==========================================
// 1. AUTHENTICATION (LOGIN / SIGNUP)
// ==========================================
const roleStudentBtn = document.getElementById("roleStudentBtn");
const roleAdminBtn = document.getElementById("roleAdminBtn");
const loginTabBtn = document.getElementById("loginTabBtn");
const signupTabBtn = document.getElementById("signupTabBtn");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

function updateAuthUI() {
  roleStudentBtn.classList.toggle("active", selectedAuthRole === "student");
  roleAdminBtn.classList.toggle("active", selectedAuthRole === "admin");

  if (selectedAuthRole === "student") {
    document.getElementById("loginIdLabel").textContent = "Student Email / Roll No";
    document.getElementById("loginIdentifier").placeholder = "e.g., student@college.edu";
    document.getElementById("loginSubmitBtn").textContent = "Login as Student";
    document.getElementById("signupIdLabel").textContent = "College Roll No / Email";
    document.getElementById("signupSubmitBtn").textContent = "Create Student Account";
    document.getElementById("adminSecretGroup").classList.add("hidden");
  } else {
    document.getElementById("loginIdLabel").textContent = "Admin Staff Email / ID";
    document.getElementById("loginIdentifier").placeholder = "e.g., admin@smaood.com";
    document.getElementById("loginSubmitBtn").textContent = "Login to Kitchen Admin";
    document.getElementById("signupIdLabel").textContent = "Admin Email / Staff ID";
    document.getElementById("signupSubmitBtn").textContent = "Register Admin Account";
    document.getElementById("adminSecretGroup").classList.remove("hidden");
  }
}

roleStudentBtn.addEventListener("click", () => {
  selectedAuthRole = "student";
  updateAuthUI();
});

roleAdminBtn.addEventListener("click", () => {
  selectedAuthRole = "admin";
  updateAuthUI();
});

loginTabBtn.addEventListener("click", () => {
  loginTabBtn.classList.add("active");
  signupTabBtn.classList.remove("active");
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
});

signupTabBtn.addEventListener("click", () => {
  signupTabBtn.classList.add("active");
  loginTabBtn.classList.remove("active");
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
});

// Demo Auto-Fill Buttons
document.getElementById("quickStudentDemo").addEventListener("click", () => {
  selectedAuthRole = "student";
  updateAuthUI();
  document.getElementById("loginIdentifier").value = "student@college.edu";
  document.getElementById("loginPassword").value = "123";
});

document.getElementById("quickAdminDemo").addEventListener("click", () => {
  selectedAuthRole = "admin";
  updateAuthUI();
  document.getElementById("loginIdentifier").value = "admin@smaood.com";
  document.getElementById("loginPassword").value = "123";
});

// Login Handler
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const id = document.getElementById("loginIdentifier").value.trim().toLowerCase();
  const pwd = document.getElementById("loginPassword").value.trim();

  const user = users.find(
    u => u.identifier.toLowerCase() === id && u.password === pwd && u.role === selectedAuthRole
  );

  if (!user) {
    showToast(`Invalid ${selectedAuthRole} credentials! Try Demo Login or Sign Up.`);
    return;
  }

  currentUser = user;
  saveState();
  showToast(`Welcome back, ${user.name}!`);
  renderAppRouter();
});

// Signup Handler
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const identifier = document.getElementById("signupIdentifier").value.trim();
  const password = document.getElementById("signupPassword").value.trim();

  if (selectedAuthRole === "admin") {
    const code = document.getElementById("adminPasscode").value.trim();
    if (code !== ADMIN_PASSCODE) {
      showToast("Incorrect Admin Kitchen Passcode! (Hint: admin123)");
      return;
    }
  }

  const exists = users.some(u => u.identifier.toLowerCase() === identifier.toLowerCase() && u.role === selectedAuthRole);
  if (exists) {
    showToast("Account already exists with this ID! Please login.");
    return;
  }

  const newUser = { name, identifier, password, role: selectedAuthRole };
  users.push(newUser);
  currentUser = newUser;
  saveState();
  signupForm.reset();
  showToast(`Account created! Logged in as ${name}.`);
  renderAppRouter();
});

function logoutUser() {
  currentUser = null;
  saveState();
  showToast("Logged out successfully.");
  renderAppRouter();
}

// ==========================================
// 2. VIEW ROUTER & NAVBAR
// ==========================================
function renderAppRouter() {
  const authView = document.getElementById("authView");
  const studentView = document.getElementById("studentView");
  const adminView = document.getElementById("adminView");
  const navSearchBar = document.getElementById("navSearchBar");
  const navActions = document.getElementById("navActions");

  if (!currentUser) {
    authView.classList.remove("hidden");
    studentView.classList.add("hidden");
    adminView.classList.add("hidden");
    navSearchBar.classList.add("hidden");
    navActions.innerHTML = `<span class="user-pill">🎓 Student & 👨‍🍳 Admin Portal</span>`;
    return;
  }

  authView.classList.add("hidden");

  if (currentUser.role === "student") {
    studentView.classList.remove("hidden");
    adminView.classList.add("hidden");
    navSearchBar.classList.remove("hidden");
    document.getElementById("heroUserName").textContent = currentUser.name;

    const myOrders = orders.filter(o => o.userId.toLowerCase() === currentUser.identifier.toLowerCase());
    const cartTotalCount = Object.values(cart).reduce((a, b) => a + b, 0);

    navActions.innerHTML = `
      <span class="user-pill">🎓 ${currentUser.name}</span>
      <button class="btn-outline" onclick="openOrdersModal()">
        🧾 My Orders <span class="pill" id="myOrdersCount">${myOrders.length}</span>
      </button>
      <button class="btn-primary" onclick="openCart()">
        🛒 Cart <span class="pill pill-light" id="cartCount">${cartTotalCount}</span>
      </button>
      <button class="btn-danger-outline" onclick="logoutUser()">Logout</button>
    `;

    renderTodaysSpecials();
    renderMenu();
    renderCart();
    updateStudentHeroStatus();
  } else {
    // Admin View
    studentView.classList.add("hidden");
    adminView.classList.remove("hidden");
    navSearchBar.classList.add("hidden");

    navActions.innerHTML = `
      <span class="user-pill">👨‍🍳 ${currentUser.name} (Admin)</span>
      <button class="btn-danger-outline" onclick="logoutUser()">Logout</button>
    `;

    renderAdminDashboard();
  }
}

// ==========================================
// 3. STUDENT VIEW: MENU, CART & ORDERS
// ==========================================
function renderTodaysSpecials() {
  const dateEl = document.getElementById("todayDateLabel");
  dateEl.textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  const container = document.getElementById("todaysMenuList");
  const specials = menuItems.filter(item => item.todaysSpecial && item.stock > 0).slice(0, 4);

  if (specials.length === 0) {
    container.innerHTML = `<p class="muted-sm">Check out the full menu below!</p>`;
    return;
  }

  container.innerHTML = specials.map(item => `
    <div class="special-item">
      <div class="special-item-info">
        <strong>${item.emoji} ${item.name}</strong>
        <span>₹${item.price} • ${item.stock} left • ~${item.prep}m</span>
      </div>
      <button class="special-add" onclick="updateCart(${item.id}, 1)">+ Add</button>
    </div>
  `).join("");
}

function renderMenu() {
  const grid = document.getElementById("menuGrid");
  let filtered = menuItems.filter(item => {
    const matchesCat =
      activeCategory === "all" ? true :
      activeCategory === "todays" ? item.todaysSpecial :
      item.category === activeCategory;
    const matchesVeg = vegOnly ? item.veg : true;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesVeg && matchesSearch;
  });

  if (sortBy === "price-asc") filtered.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") filtered.sort((a, b) => b.price - a.price);
  if (sortBy === "prep") filtered.sort((a, b) => a.prep - b.prep);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted);">No items match your filter.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const qty = cart[item.id] || 0;
    const outOfStock = item.stock <= 0;
    return `
      <article class="food-card ${outOfStock ? 'sold-out' : ''}">
        <div>
          <div class="card-top">
            <div class="food-emoji">${item.emoji}</div>
            <div class="badges-col">
              <span class="diet-badge ${item.veg ? 'diet-veg' : 'diet-nonveg'}">${item.veg ? '● VEG' : '▲ NON-VEG'}</span>
              ${item.todaysSpecial ? '<span class="today-pill">⭐ Today\'s Menu</span>' : ''}
            </div>
          </div>
          <h3 class="food-title">${item.name}</h3>
          <p class="food-desc">${item.desc}</p>
        </div>

        <div>
          <div class="food-meta">
            <span>⏱️ ${item.prep} mins</span>
            <span>📦 Stock: <strong>${item.stock}</strong></span>
            <span>📂 ${item.category}</span>
          </div>
          <div class="card-bottom">
            <span class="price">₹${item.price}</span>
            ${outOfStock
              ? `<span style="color:var(--red);font-weight:700;font-size:13px;">Out of Stock</span>`
              : qty === 0
                ? `<button class="btn-primary" onclick="updateCart(${item.id}, 1)">+ Add</button>`
                : `<div class="qty-control">
                    <button onclick="updateCart(${item.id}, -1)">−</button>
                    <span>${qty}</span>
                    <button onclick="updateCart(${item.id}, 1)">+</button>
                  </div>`
            }
          </div>
        </div>
      </article>
    `;
  }).join("");
}

function updateCart(id, delta) {
  const item = menuItems.find(m => m.id === id);
  if (!item) return;

  const current = cart[id] || 0;
  const next = current + delta;

  if (next > item.stock) {
    showToast(`Only ${item.stock} ${item.name} available in stock!`);
    return;
  }

  if (next <= 0) {
    delete cart[id];
  } else {
    cart[id] = next;
  }
  saveState();
  renderMenu();
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cartItemsContainer");
  const entries = Object.entries(cart);
  let totalItems = 0;
  let subtotal = 0;

  if (entries.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:var(--muted);margin-top:40px;">Your canteen tray is empty. Add samosa, coffee, dosa, or fried rice!</p>`;
  } else {
    container.innerHTML = entries.map(([id, qty]) => {
      const item = menuItems.find(m => m.id === Number(id));
      if (!item) return "";
      totalItems += qty;
      subtotal += item.price * qty;
      return `
        <div class="cart-row">
          <div>
            <strong>${item.emoji} ${item.name}</strong>
            <div style="font-size:12px;color:var(--muted);">₹${item.price} × ${qty} = ₹${item.price * qty}</div>
          </div>
          <div class="qty-control">
            <button onclick="updateCart(${item.id}, -1)">−</button>
            <span>${qty}</span>
            <button onclick="updateCart(${item.id}, 1)">+</button>
          </div>
        </div>
      `;
    }).join("");
  }

  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = totalItems;
  document.getElementById("billSubtotal").textContent = `₹${subtotal}`;
  document.getElementById("billTotal").textContent = subtotal > 0 ? `₹${subtotal + 5}` : `₹0`;
}

// Student Place Order
document.getElementById("placeOrderBtn").addEventListener("click", () => {
  const entries = Object.entries(cart);
  if (entries.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  // Verify stock & deduct
  let subtotal = 0;
  const orderItems = [];

  for (const [id, qty] of entries) {
    const item = menuItems.find(m => m.id === Number(id));
    if (!item || item.stock < qty) {
      showToast(`Insufficient stock for ${item ? item.name : 'item'}.`);
      return;
    }
    item.stock -= qty;
    subtotal += item.price * qty;
    orderItems.push({ name: item.name, qty, price: item.price });
  }

  const tokenNum = `SMD-${Math.floor(102 + Math.random() * 890)}`;
  const newOrder = {
    token: tokenNum,
    userId: currentUser.identifier,
    studentName: currentUser.name,
    slot: document.getElementById("pickupSlot").value,
    note: document.getElementById("cookingNoteInput").value.trim(),
    status: "queued",
    total: subtotal + 5,
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    items: orderItems
  };

  orders.unshift(newOrder);
  cart = {};
  document.getElementById("cookingNoteInput").value = "";
  saveState();

  renderAppRouter();
  closeCart();
  showToast(`Order Placed! Token #${tokenNum} sent to kitchen.`);
  openOrdersModal();
});

function updateStudentHeroStatus() {
  if (!currentUser) return;
  const myOrders = orders.filter(o => o.userId.toLowerCase() === currentUser.identifier.toLowerCase());
  const badge = document.getElementById("studentActiveOrderBadge");
  if (myOrders.length > 0) {
    const latest = myOrders[0];
    badge.textContent = `#${latest.token} (${latest.status.toUpperCase()})`;
  } else {
    badge.textContent = "No Active Order";
  }
}

function renderStudentOrders() {
  if (!currentUser) return;
  const myOrders = orders.filter(o => o.userId.toLowerCase() === currentUser.identifier.toLowerCase());
  const countEl = document.getElementById("myOrdersCount");
  if (countEl) countEl.textContent = myOrders.length;

  const list = document.getElementById("myOrdersList");
  if (myOrders.length === 0) {
    list.innerHTML = `<p style="color:var(--muted);text-align:center;padding:20px;">You haven't placed any orders yet.</p>`;
    return;
  }

  list.innerHTML = myOrders.map(o => `
    <div class="ticket-card">
      <div class="ticket-top">
        <span class="token-num">Token #${o.token}</span>
        <span class="status-badge status-${o.status}">${o.status}</span>
      </div>
      <div style="font-size:12px;color:var(--muted);">
        🕒 Pickup: <strong>${o.slot}</strong> • Ordered at ${o.time}
      </div>
      <ul class="ticket-items">
        ${o.items.map(i => `<li><span>${i.qty}× ${i.name}</span><span>₹${i.price * i.qty}</span></li>`).join("")}
      </ul>
      <div style="display:flex;justify-content:space-between;font-size:13px;font-weight:700;">
        <span>${o.note ? '📝 ' + o.note : 'Standard Prep'}</span>
        <span>Total: ₹${o.total}</span>
      </div>
    </div>
  `).join("");
}

// ==========================================
// 4. ADMIN VIEW: MANAGE ORDERS, ITEMS, PRICE & STOCK
// ==========================================
function renderAdminDashboard() {
  const queued = orders.filter(o => o.status === "queued").length;
  const preparing = orders.filter(o => o.status === "preparing").length;
  const ready = orders.filter(o => o.status === "ready").length;
  const revenue = orders.reduce((sum, o) => sum + o.total, 0);

  document.getElementById("kdsQueuedOrders").textContent = queued;
  document.getElementById("kdsPreparingOrders").textContent = preparing;
  document.getElementById("kdsReadyOrders").textContent = ready;
  document.getElementById("kdsRevenue").textContent = `₹${revenue}`;

  // Render Orders Queue
  const ticketsGrid = document.getElementById("kdsTicketsGrid");
  if (orders.length === 0) {
    ticketsGrid.innerHTML = `<p class="muted-sm">No student orders yet.</p>`;
  } else {
    ticketsGrid.innerHTML = orders.map((o, idx) => `
      <div class="ticket-card">
        <div class="ticket-top">
          <span class="token-num">#${o.token}</span>
          <span class="status-badge status-${o.status}">${o.status}</span>
        </div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:4px;">
          🎓 <strong>${o.studentName}</strong> (${o.userId})
        </div>
        <div style="font-size:12px;color:var(--muted);">
          🕒 ${o.slot} • ₹${o.total}
        </div>
        ${o.note ? `<div style="background:#fef3c7;padding:4px 8px;border-radius:6px;font-size:12px;margin-top:6px;">📝 ${o.note}</div>` : ''}
        <ul class="ticket-items">
          ${o.items.map(i => `<li><span><strong>${i.qty}×</strong> ${i.name}</span><span>₹${i.price * i.qty}</span></li>`).join("")}
        </ul>
        <div class="status-actions">
          <button class="mini-btn ${o.status === 'queued' ? 'active-amber' : ''}" onclick="adminUpdateOrderStatus(${idx}, 'queued')">Queued</button>
          <button class="mini-btn ${o.status === 'preparing' ? 'active-amber' : ''}" onclick="adminUpdateOrderStatus(${idx}, 'preparing')">Preparing</button>
          <button class="mini-btn ${o.status === 'ready' ? 'active-green' : ''}" onclick="adminUpdateOrderStatus(${idx}, 'ready')">Ready</button>
          <button class="mini-btn" onclick="adminUpdateOrderStatus(${idx}, 'completed')">Picked Up</button>
        </div>
      </div>
    `).join("");
  }

  // Render Menu, Price & Stock Controls
  const invList = document.getElementById("kdsInventoryList");
  invList.innerHTML = menuItems.map(item => `
    <div class="inv-row">
      <div class="inv-row-top">
        <div>
          <strong>${item.emoji} ${item.name}</strong>
          <span class="muted-sm"> (${item.category})</span>
        </div>
        <button class="mini-btn danger" onclick="adminDeleteItem(${item.id})" title="Remove item from menu">🗑️ Remove</button>
      </div>

      <div class="inv-controls">
        <label class="inline-edit">
          Price ₹
          <input type="number" min="1" value="${item.price}" onchange="adminUpdatePrice(${item.id}, this.value)" />
        </label>

        <label class="inline-edit">
          Stock:
          <input type="number" min="0" value="${item.stock}" onchange="adminUpdateStock(${item.id}, this.value)" />
        </label>

        <button class="mini-btn ${item.todaysSpecial ? 'active-amber' : ''}" onclick="adminToggleSpecial(${item.id})">
          ${item.todaysSpecial ? '⭐ Today\'s Menu' : '☆ Pin Today'}
        </button>
      </div>
    </div>
  `).join("");
}

function adminUpdateOrderStatus(index, newStatus) {
  orders[index].status = newStatus;
  saveState();
  renderAdminDashboard();
  showToast(`Order #${orders[index].token} updated to ${newStatus.toUpperCase()}`);
}

function adminUpdatePrice(id, val) {
  const price = Number(val);
  if (price <= 0) return;
  const item = menuItems.find(m => m.id === id);
  if (item) {
    item.price = price;
    saveState();
    showToast(`Updated ${item.name} price to ₹${price}`);
  }
}

function adminUpdateStock(id, val) {
  const stock = Math.max(0, Number(val));
  const item = menuItems.find(m => m.id === id);
  if (item) {
    item.stock = stock;
    saveState();
    showToast(`Updated ${item.name} stock to ${stock}`);
  }
}

function adminToggleSpecial(id) {
  const item = menuItems.find(m => m.id === id);
  if (item) {
    item.todaysSpecial = !item.todaysSpecial;
    saveState();
    renderAdminDashboard();
  }
}

function adminDeleteItem(id) {
  const item = menuItems.find(m => m.id === id);
  menuItems = menuItems.filter(m => m.id !== id);
  saveState();
  renderAdminDashboard();
  showToast(`Removed "${item.name}" from menu.`);
}

// Add New Food Item Modal Handlers
const addItemModal = document.getElementById("addItemModal");
document.getElementById("openAddItemModalBtn").addEventListener("click", () => {
  addItemModal.classList.remove("hidden");
});
document.getElementById("closeAddItemModalBtn").addEventListener("click", () => {
  addItemModal.classList.add("hidden");
});

document.getElementById("addItemForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const newItem = {
    id: Date.now(),
    name: document.getElementById("newItemName").value.trim(),
    emoji: document.getElementById("newItemEmoji").value.trim() || "🍽️",
    category: document.getElementById("newItemCategory").value,
    price: Number(document.getElementById("newItemPrice").value),
    stock: Number(document.getElementById("newItemStock").value),
    prep: Number(document.getElementById("newItemPrep").value),
    desc: document.getElementById("newItemDesc").value.trim(),
    veg: document.getElementById("newItemVeg").checked,
    todaysSpecial: document.getElementById("newItemSpecial").checked
  };

  menuItems.unshift(newItem);
  saveState();
  e.target.reset();
  addItemModal.classList.add("hidden");
  renderAdminDashboard();
  showToast(`Added "${newItem.name}" (₹${newItem.price}) to Canteen Menu!`);
});

// ==========================================
// 5. FILTER, DRAWER & MODAL LISTENERS
// ==========================================
document.querySelectorAll(".tab").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.cat;
    renderMenu();
  });
});

document.getElementById("vegOnlyToggle").addEventListener("change", (e) => {
  vegOnly = e.target.checked;
  renderMenu();
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderMenu();
});

document.getElementById("sortSelect").addEventListener("change", (e) => {
  sortBy = e.target.value;
  renderMenu();
});

function openCart() {
  document.getElementById("cartDrawer").classList.remove("hidden");
  document.getElementById("cartBackdrop").classList.remove("hidden");
}
function closeCart() {
  document.getElementById("cartDrawer").classList.add("hidden");
  document.getElementById("cartBackdrop").classList.add("hidden");
}
function openOrdersModal() {
  renderStudentOrders();
  document.getElementById("ordersModal").classList.remove("hidden");
}
function closeOrdersModal() {
  document.getElementById("ordersModal").classList.add("hidden");
}

document.getElementById("closeCartBtn").addEventListener("click", closeCart);
document.getElementById("cartBackdrop").addEventListener("click", closeCart);
document.getElementById("closeOrdersModalBtn").addEventListener("click", closeOrdersModal);

// Initialize App
updateAuthUI();
renderAppRouter();
