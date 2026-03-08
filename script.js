const products = [
  {
    id: "noir-amber",
    name: "Noir Amber",
    scent: "Amber + Vanilla",
    description: "Topel vecerni vonj z elegantnim zlatim finishem.",
    price: 34
  },
  {
    id: "velvet-fig",
    name: "Velvet Fig",
    scent: "Fig + Sandalwood",
    description: "Sodoben sadni profil za sofisticiran dom.",
    price: 32
  },
  {
    id: "golden-musk",
    name: "Golden Musk",
    scent: "Musk + Cedar",
    description: "Globok in umirjen podpis za premium interier.",
    price: 36
  },
  {
    id: "cashmere-bloom",
    name: "Cashmere Bloom",
    scent: "White Tea + Floral",
    description: "Nezna dnevna aroma za clean luxe obcutek.",
    price: 30
  }
];

const cart = {};

const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartEmpty = document.getElementById("cartEmpty");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

function formatPrice(value) {
  return "EUR " + value.toFixed(2);
}

function renderProducts() {
  productGrid.innerHTML = products
    .map(
      (product) => `
        <article class="product-card">
          <span class="product-tag">${product.scent}</span>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.description}</p>
          <div class="product-bottom">
            <span class="price">${formatPrice(product.price)}</span>
            <button class="add-btn" type="button" data-id="${product.id}">Dodaj</button>
          </div>
        </article>
      `
    )
    .join("");
}

function getCartStats() {
  let total = 0;
  let count = 0;

  Object.entries(cart).forEach(([id, qty]) => {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    total += product.price * qty;
    count += qty;
  });

  return { total, count };
}

function renderCart() {
  const entries = Object.entries(cart).filter(([, qty]) => qty > 0);

  if (entries.length === 0) {
    cartItems.innerHTML = "";
    cartEmpty.style.display = "block";
    checkoutBtn.disabled = true;
  } else {
    cartEmpty.style.display = "none";
    checkoutBtn.disabled = false;
    cartItems.innerHTML = entries
      .map(([id, qty]) => {
        const product = products.find((item) => item.id === id);
        if (!product) return "";

        return `
            <li class="cart-item">
              <div class="cart-item-head">
                <span class="item-name">${product.name}</span>
                <strong>${formatPrice(product.price * qty)}</strong>
              </div>
              <div class="item-meta">
                <span>Kolicina: ${qty}</span>
                <span>${formatPrice(product.price)} / kos</span>
              </div>
              <button class="remove-btn" type="button" data-remove="${id}">Odstrani</button>
            </li>
          `;
      })
      .join("");
  }

  const { total, count } = getCartStats();
  cartTotal.textContent = formatPrice(total);
  openCartBtn.textContent = `Kosarica (${count})`;
}

function addToCart(id) {
  if (!cart[id]) {
    cart[id] = 0;
  }
  cart[id] += 1;
  renderCart();
}

function removeFromCart(id) {
  if (!cart[id]) return;
  cart[id] -= 1;
  if (cart[id] <= 0) {
    delete cart[id];
  }
  renderCart();
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-id]");
  if (!addButton) return;
  addToCart(addButton.dataset.id);
});

cartItems.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove]");
  if (!removeButton) return;
  removeFromCart(removeButton.dataset.remove);
});

openCartBtn.addEventListener("click", () => {
  cartPanel.classList.add("open");
  cartPanel.setAttribute("aria-hidden", "false");
});

closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartPanel.setAttribute("aria-hidden", "true");
});

checkoutBtn.addEventListener("click", () => {
  alert("Test checkout: v naslednjem koraku bova to povezala na pravi payment sistem (Stripe).");
});

renderProducts();
renderCart();
