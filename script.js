
"use strict";

// =====================================
// 90° CAKE SHOP — PRODUCT DATA
// =====================================

const cakes = [
  {
    id: 1,
    name: "Chocolate Truffle",
    category: "Chocolate",
    price: 650,
    description: "Rich chocolate layers with creamy truffle.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Strawberry Cake",
    category: "Fruit",
    price: 580,
    description: "A sweet cake with strawberry flavour.",
    image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Black Forest",
    category: "Classic",
    price: 600,
    description: "Chocolate sponge with cream and cherry decoration.",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Red Velvet",
    category: "Classic",
    price: 720,
    description: "Soft red velvet-style cake with creamy frosting.",
    image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Chocolate Fudge",
    category: "Chocolate",
    price: 700,
    description: "A rich chocolate cake for special occasions.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Vanilla Cake",
    category: "Classic",
    price: 520,
    description: "A soft vanilla cake for every celebration.",
    image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=700&q=80"
  }
];

// =====================================
// PAGE NAVIGATION
// =====================================

const pages = [
  { key: "home", href: "index.html", label: "Home" },
  { key: "cakes", href: "cakes.html", label: "Our Cakes" },
  { key: "order", href: "order.html", label: "How to Order" },
  { key: "about", href: "about.html", label: "About Us" },
  { key: "contact", href: "contact.html", label: "Contact" }
];

function formatPrice(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

// =====================================
// CART STORAGE
// =====================================

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("cakeCart") || "[]");

    if (!Array.isArray(saved)) return [];

    return saved.filter(item =>
      Number.isInteger(item.id) &&
      cakes.some(cake => cake.id === item.id) &&
      Number.isInteger(item.quantity) &&
      item.quantity > 0
    );
  } catch (error) {
    return [];
  }
}

let cart = loadCart();

function saveCart() {
  try {
    localStorage.setItem("cakeCart", JSON.stringify(cart));
  } catch (error) {
    // The cart still works for the current page if storage is unavailable.
  }
}

// =====================================
// BUILD SHARED HEADER AND FOOTER
// =====================================

function buildLayout() {
  const currentPage = document.body.dataset.page;
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (!header || !footer) return;

  const links = pages.map(page => `
    <a
      href="${page.href}"
      class="${page.key === currentPage ? "active" : ""}"
      ${page.key === currentPage ? 'aria-current="page"' : ""}>
      ${page.label}
    </a>
  `).join("");

  header.innerHTML = `
    <header class="site-header">
      <a href="index.html" class="logo">🎂 90° Cake Shop</a>

      <button
        class="menu-btn"
        id="menuBtn"
        type="button"
        aria-label="Open navigation menu"
        aria-expanded="false"
        aria-controls="navigation">
        ☰
      </button>

      <nav class="site-nav" id="navigation" aria-label="Main navigation">
        ${links}
      </nav>

      <div class="header-actions">
        <button class="cart-btn" id="openCart" type="button">
          🛒 Cart (<span id="cartCount">0</span>)
        </button>
      </div>
    </header>
  `;

  footer.innerHTML = `
    <footer>
      <strong>🎂 90° Cake Shop</strong>
      <span>© ${new Date().getFullYear()} 90° Cake Shop | Student Project</span>
      <a href="#top">Back to Top ↑</a>
    </footer>

    <div class="overlay" id="overlay" hidden></div>

    <aside
      class="cart-panel"
      id="cartPanel"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
      aria-hidden="true">

      <div class="cart-header">
        <h2>Your Cart</h2>
        <button
          class="close-btn"
          id="closeCart"
          type="button"
          aria-label="Close cart">
          ✕
        </button>
      </div>

      <div class="cart-items" id="cartItems" aria-live="polite"></div>

      <div class="cart-total">
        <p class="total-row">
          <span>Total:</span>
          <span id="cartTotal">₹0</span>
        </p>

        <button class="btn" id="orderBtn" type="button">
          Prepare Order Message
        </button>

        <p class="notice">
          Demo only: payments and automatic order submission are not enabled.
        </p>
      </div>
    </aside>
  `;
}

buildLayout();

// =====================================
// GET PAGE ELEMENTS
// =====================================

const productList = document.getElementById("productList");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const menuBtn = document.getElementById("menuBtn");
const navigation = document.getElementById("navigation");
const openCartBtn = document.getElementById("openCart");
const closeCartBtn = document.getElementById("closeCart");
const orderBtn = document.getElementById("orderBtn");

// =====================================
// DISPLAY CAKE CARDS
// =====================================

function productCard(cake) {
  return `
    <article class="product">
      <img
        src="${cake.image}"
        alt="${cake.name}"
        loading="lazy"
        onerror="this.onerror=null;this.src='https://placehold.co/700x450/fbe8ed/a93759?text=Cake';">

      <div class="product-info">
        <h3>${cake.name}</h3>
        <p>${cake.description}</p>

        <div class="product-bottom">
          <span class="price">${formatPrice(cake.price)}</span>

          <button
            class="add-btn"
            type="button"
            data-add="${cake.id}"
            aria-label="Add ${cake.name} to cart">
            + Add to Cart
          </button>
        </div>
      </div>
    </article>
  `;
}

function displayCakes(category = "All") {
  if (!productList) return;

  let filteredCakes = category === "All"
    ? cakes
    : cakes.filter(cake => cake.category === category);

  const limit = Number(productList.dataset.limit);

  if (Number.isFinite(limit) && limit > 0) {
    filteredCakes = filteredCakes.slice(0, limit);
  }

  productList.innerHTML = filteredCakes.length
    ? filteredCakes.map(productCard).join("")
    : '<p class="empty">No cakes available in this category.</p>';
}

// =====================================
// SHOPPING CART FUNCTIONS
// =====================================

function cartTotalAmount() {
  return cart.reduce((total, item) => {
    const cake = cakes.find(product => product.id === item.id);
    return total + (cake ? cake.price * item.quantity : 0);
  }, 0);
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: id, quantity: 1 });
  }

  displayCart();
}

function changeQuantity(id, change) {
  const item = cart.find(entry => entry.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(entry => entry.id !== id);
  }

  displayCart();
}

function displayCart() {
  saveCart();

  if (!cartItems || !cartCount || !cartTotal) return;

  const itemCount = cart.reduce(
    (total, item) => total + item.quantity, 0
  );

  cartCount.textContent = itemCount;
  cartTotal.textContent = formatPrice(cartTotalAmount());

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty">
        Your cart is empty. Add a cake to get started! 🎂
      </p>
    `;
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const cake = cakes.find(product => product.id === item.id);

    if (!cake) return "";

    return `
      <div class="cart-item">
        <div>
          <h4>${cake.name}</h4>
          <small>${formatPrice(cake.price)} each</small>

          <div class="quantity">
            <button
              type="button"
              data-id="${cake.id}"
              data-change="-1"
              aria-label="Decrease ${cake.name} quantity">
              −
            </button>

            <span>${item.quantity}</span>

            <button
              type="button"
              data-id="${cake.id}"
              data-change="1"
              aria-label="Increase ${cake.name} quantity">
              +
            </button>
          </div>
        </div>

        <strong>
          ${formatPrice(cake.price * item.quantity)}
        </strong>
      </div>
    `;
  }).join("");
}

// Add cakes to cart
if (productList) {
  productList.addEventListener("click", event => {
    const button = event.target.closest("[data-add]");

    if (button) {
      addToCart(Number(button.dataset.add));
    }
  });
}

// Change cart quantities
if (cartItems) {
  cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-id][data-change]");

    if (button) {
      changeQuantity(
        Number(button.dataset.id),
        Number(button.dataset.change)
      );
    }
  });
}

// =====================================
// CAKE CATEGORY FILTERS
// =====================================

document.querySelectorAll(".filter-btn").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(filter => {
      filter.classList.remove("active");
      filter.setAttribute("aria-pressed", "false");
    });

    button.classList.add("active");
    button.setAttribute("aria-pressed", "true");

    displayCakes(button.dataset.category);
  });
});

// =====================================
// MOBILE NAVIGATION
// =====================================

if (menuBtn && navigation) {
  menuBtn.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.setAttribute(
      "aria-label",
      isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuBtn.textContent = isOpen ? "✕" : "☰";
  });

  navigation.addEventListener("click", event => {
    if (event.target.closest("a")) {
      navigation.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation menu");
      menuBtn.textContent = "☰";
    }
  });
}

// =====================================
// SHOPPING CART DRAWER
// =====================================

function openCart() {
  if (!cartPanel || !overlay) return;

  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
  overlay.hidden = false;
  document.body.classList.add("cart-open");

  if (closeCartBtn) closeCartBtn.focus();
}

function closeCart() {
  if (!cartPanel || !overlay) return;

  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
  overlay.hidden = true;
  document.body.classList.remove("cart-open");

  if (openCartBtn) openCartBtn.focus();
}

if (openCartBtn) {
  openCartBtn.addEventListener("click", openCart);
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", closeCart);
}

if (overlay) {
  overlay.addEventListener("click", closeCart);
}

// =====================================
// BACK ARROW
// =====================================

document.querySelectorAll("[data-back-link]").forEach(link => {
  link.addEventListener("click", event => {
    try {
      const previousPage = new URL(document.referrer);

      if (
        window.history.length > 1 &&
        previousPage.origin === window.location.origin
      ) {
        event.preventDefault();
        window.history.back();
      }
      // Otherwise the link opens index.html.
    } catch (error) {
      // The normal index.html link remains the fallback.
    }
  });
});

// =====================================
// PREPARE ORDER ENQUIRY MESSAGE
// =====================================

if (orderBtn) {
  orderBtn.addEventListener("click", async () => {
    if (cart.length === 0) {
      alert("Please add a cake to your cart first.");
      return;
    }

    const orderLines = cart.map(item => {
      const cake = cakes.find(product => product.id === item.id);

      return `${cake.name} x ${item.quantity} = ${
        formatPrice(cake.price * item.quantity)
      }`;
    });

    const message =
      "Hello 90° Cake Shop! I would like to enquire about this order.\n\n" +
      orderLines.join("\n") +
      "\n\nEstimated Total: " + formatPrice(cartTotalAmount()) +
      "\nPlease confirm availability and delivery details.";

    try {
      if (!navigator.clipboard || !window.isSecureContext) {
        throw new Error("Clipboard access is unavailable.");
      }

      await navigator.clipboard.writeText(message);

      alert(
        "Order message copied! You can paste it into a message to the shop."
      );
    } catch (error) {
      window.prompt("Copy your order message below:", message);
    }
  });
}

// =====================================
// CLOSE MENU OR CART WITH ESCAPE
// =====================================

document.addEventListener("keydown", event => {
  if (event.key !== "Escape") return;

  if (cartPanel && cartPanel.classList.contains("open")) {
    closeCart();
  }

  if (navigation && navigation.classList.contains("open")) {
    navigation.classList.remove("open");

    if (menuBtn) {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open navigation menu");
      menuBtn.textContent = "☰";
    }
  }
});

// =====================================
// START WEBSITE
// =====================================

displayCakes();
displayCart();
