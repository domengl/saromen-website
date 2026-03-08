const K = { products: "saromen_products_v2", coupons: "saromen_coupons_v2", profiles: "saromen_profiles_v2", user: "saromen_user_v2" };
const ADMIN = { username: "admin", password: "saromenadmin" };
const BASE_PRODUCTS = [
  { id: "noir-amber", name: "Noir Amber", category: "Disavne", scent: "Amber + Vanilla", description: "Topel vecerni vonj.", price: 34, stock: 18, etaDays: 5, isTop: true, isNew: false, salePercent: 0 },
  { id: "velvet-fig", name: "Velvet Fig", category: "Disavne", scent: "Fig + Sandalwood", description: "Sodoben sadni profil.", price: 32, stock: 8, etaDays: 4, isTop: true, isNew: false, salePercent: 10 },
  { id: "golden-musk", name: "Golden Musk", category: "Premium Reserve", scent: "Musk + Cedar", description: "Globok premium podpis.", price: 39, stock: 0, etaDays: 7, isTop: true, isNew: false, salePercent: 0 },
  { id: "cashmere-bloom", name: "Cashmere Bloom", category: "Novosti", scent: "White Tea + Floral", description: "Nezen clean-luxe obcutek.", price: 31, stock: 14, etaDays: 4, isTop: false, isNew: true, salePercent: 0 },
  { id: "atelier-mono", name: "Atelier Mono", category: "Dekorativne", scent: "Soft Linen", description: "Premium dekor kos za dom.", price: 36, stock: 6, etaDays: 5, isTop: false, isNew: true, salePercent: 0 },
  { id: "runway-smoke", name: "Runway Smoke", category: "Modni Dodatek", scent: "Smoked Oud", description: "Editorial statement sveca.", price: 43, stock: 4, etaDays: 6, isTop: false, isNew: false, salePercent: 15 },
  { id: "luna-champagne", name: "Luna Champagne", category: "Darilne", scent: "Champagne + Rose", description: "Darilna premium linija.", price: 45, stock: 3, etaDays: 6, isTop: true, isNew: true, salePercent: 8 },
  { id: "urban-charcoal", name: "Urban Charcoal", category: "Modni Dodatek", scent: "Charcoal + Vetiver", description: "Temen urbani minimalizem.", price: 37, stock: 10, etaDays: 5, isTop: false, isNew: false, salePercent: 0 }
];
const BASE_COUPONS = [
  { code: "SARA10", percent: 10, minAmount: 0 },
  { code: "DOMEN15", percent: 15, minAmount: 60 },
  { code: "LOVE20", percent: 20, minAmount: 120 }
];
const S = {
  products: load(K.products, BASE_PRODUCTS),
  coupons: load(K.coupons, BASE_COUPONS),
  profiles: load(K.profiles, []),
  userId: localStorage.getItem(K.user) || "",
  category: "Vse",
  activeCoupon: null,
  cart: [],
  adminAuth: false
};

const R = {
  topHitsGrid: id("topHitsGrid"),
  discountGrid: id("discountGrid"),
  newGrid: id("newGrid"),
  allProductsGrid: id("allProductsGrid"),
  categoryFilters: id("categoryFilters"),
  openCartBtn: id("openCartBtn"),
  closeCartBtn: id("closeCartBtn"),
  cartPanel: id("cartPanel"),
  cartItems: id("cartItems"),
  cartEmpty: id("cartEmpty"),
  couponInput: id("couponInput"),
  applyCouponBtn: id("applyCouponBtn"),
  couponInfo: id("couponInfo"),
  subtotalAmount: id("subtotalAmount"),
  discountAmount: id("discountAmount"),
  shippingAmount: id("shippingAmount"),
  totalAmount: id("totalAmount"),
  clearCartBtn: id("clearCartBtn"),
  checkoutBtn: id("checkoutBtn"),
  orderResult: id("orderResult"),
  personalForm: id("personalForm"),
  personalBase: id("personalBase"),
  personalText: id("personalText"),
  personalScent: id("personalScent"),
  personalLogo: id("personalLogo"),
  personalQty: id("personalQty"),
  personalMessage: id("personalMessage"),
  authBtn: id("authBtn"),
  profileBtn: id("profileBtn"),
  adminBtn: id("adminBtn"),
  authModal: id("authModal"),
  closeAuthModal: id("closeAuthModal"),
  showLoginTab: id("showLoginTab"),
  showRegisterTab: id("showRegisterTab"),
  loginForm: id("loginForm"),
  loginEmail: id("loginEmail"),
  loginPassword: id("loginPassword"),
  loginMessage: id("loginMessage"),
  registerForm: id("registerForm"),
  registerName: id("registerName"),
  registerEmail: id("registerEmail"),
  registerPassword: id("registerPassword"),
  registerPasswordConfirm: id("registerPasswordConfirm"),
  registerMessage: id("registerMessage"),
  profileModal: id("profileModal"),
  closeProfileModal: id("closeProfileModal"),
  profileName: id("profileName"),
  profileEmail: id("profileEmail"),
  profileOrders: id("profileOrders"),
  profileEmails: id("profileEmails"),
  logoutBtn: id("logoutBtn"),
  adminModal: id("adminModal"),
  closeAdminModal: id("closeAdminModal"),
  adminLoginView: id("adminLoginView"),
  adminPanelView: id("adminPanelView"),
  adminLoginForm: id("adminLoginForm"),
  adminUsername: id("adminUsername"),
  adminPassword: id("adminPassword"),
  adminMessage: id("adminMessage"),
  adminProductForm: id("adminProductForm"),
  adminProductName: id("adminProductName"),
  adminProductCategory: id("adminProductCategory"),
  adminProductScent: id("adminProductScent"),
  adminProductPrice: id("adminProductPrice"),
  adminProductStock: id("adminProductStock"),
  adminProductEta: id("adminProductEta"),
  adminProductSale: id("adminProductSale"),
  adminProductTop: id("adminProductTop"),
  adminProductNew: id("adminProductNew"),
  adminProductMessage: id("adminProductMessage"),
  adminCouponForm: id("adminCouponForm"),
  adminCouponCode: id("adminCouponCode"),
  adminCouponPercent: id("adminCouponPercent"),
  adminCouponMin: id("adminCouponMin"),
  adminCouponMessage: id("adminCouponMessage"),
  adminCouponsList: id("adminCouponsList"),
  adminProductsList: id("adminProductsList"),
  adminLogoutBtn: id("adminLogoutBtn")
};

function id(v) { return document.getElementById(v); }
function load(key, fallback) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(fallback)); } catch { return JSON.parse(JSON.stringify(fallback)); } }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function currentUser() { return S.profiles.find((p) => p.id === S.userId) || null; }
function fmt(v) { return `EUR ${Number(v).toFixed(2)}`; }
function msg(el, text) { el.textContent = text; }
function slug(v) { return v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function hash(v) { let h = 0; for (let i = 0; i < v.length; i += 1) h = (h << 5) - h + v.charCodeAt(i); return Math.abs(h); }
function imageFor(p) {
  const h = hash(`${p.name}-${p.scent}`) % 360;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='720' height='720'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='hsl(${h},42%,20%)'/><stop offset='100%' stop-color='hsl(${(h + 40) % 360},48%,12%)'/></linearGradient></defs><rect width='720' height='720' fill='url(#g)'/><ellipse cx='360' cy='190' rx='34' ry='60' fill='#f8d39d'/><rect x='334' y='238' width='52' height='246' rx='22' fill='#d7b07b'/><text x='360' y='570' fill='#f2d8b3' font-size='58' text-anchor='middle' font-family='Cormorant Garamond,serif'>${p.name}</text><text x='360' y='620' fill='#f8e9d3' font-size='24' text-anchor='middle' font-family='Manrope,sans-serif'>${p.scent}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function price(p) { return p.salePercent ? p.price * (1 - p.salePercent / 100) : p.price; }
function stockInCart(productId) { return S.cart.filter((i) => i.type === "catalog" && i.productId === productId && !i.preorder).reduce((s, i) => s + i.qty, 0); }
function available(productId) { const p = S.products.find((x) => x.id === productId); return p ? Math.max(0, p.stock - stockInCart(productId)) : 0; }
function modalOpen(el) { el.classList.add("open"); el.setAttribute("aria-hidden", "false"); }
function modalClose(el) { el.classList.remove("open"); el.setAttribute("aria-hidden", "true"); }

function card(p) {
  const now = available(p.id);
  const pre = p.etaDays > 0;
  const old = p.salePercent ? `<span class="price-old">${fmt(p.price)}</span>` : "";
  const stockLine = now > 0 ? `<p class="stock-line"><strong>Na zalogi:</strong> ${now} kos</p>` : `<p class="stock-line warn"><strong>Ni na zalogi.</strong> ETA: ${p.etaDays} dni.</p>`;
  const disabled = now <= 0 && !pre ? "disabled" : "";
  const btn = now > 0 ? "Dodaj v kosarico" : pre ? `Prednaroci (${p.etaDays} dni)` : "Ni na voljo";
  return `<article class="product-card">
    <img class="product-image" src="${imageFor(p)}" alt="${p.name}" loading="lazy"/>
    <div class="product-badges">
      <span class="badge">${p.category}</span>${p.isTop ? `<span class="badge gold">Top hit</span>` : ""}${p.isNew ? `<span class="badge gold">Novost</span>` : ""}${p.salePercent ? `<span class="badge gold">-${p.salePercent}%</span>` : ""}
    </div>
    <h3 class="product-name">${p.name}</h3>
    <p class="product-meta">${p.scent}</p>
    <p class="product-desc">${p.description}</p>
    ${stockLine}
    <div class="price-row"><span class="price-main">${fmt(price(p))}</span>${old}</div>
    <button class="add-btn" type="button" data-add-product="${p.id}" ${disabled}>${btn}</button>
  </article>`;
}

function renderFilters() {
  const cats = ["Vse", ...new Set(S.products.map((p) => p.category))];
  R.categoryFilters.innerHTML = cats.map((c) => `<button class="filter-chip ${S.category === c ? "active" : ""}" type="button" data-category="${c}">${c}</button>`).join("");
}

function renderProducts() {
  const tops = S.products.filter((p) => p.isTop);
  const sale = S.products.filter((p) => p.salePercent > 0);
  const news = S.products.filter((p) => p.isNew);
  const all = S.category === "Vse" ? S.products : S.products.filter((p) => p.category === S.category);
  R.topHitsGrid.innerHTML = tops.map(card).join("");
  R.discountGrid.innerHTML = sale.map(card).join("");
  R.newGrid.innerHTML = news.map(card).join("");
  R.allProductsGrid.innerHTML = all.map(card).join("");
}

function totals() {
  const subtotal = S.cart.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  if (S.activeCoupon && subtotal < S.activeCoupon.minAmount) S.activeCoupon = null;
  const discount = S.activeCoupon ? subtotal * (S.activeCoupon.percent / 100) : 0;
  const after = Math.max(0, subtotal - discount);
  const shipping = after === 0 ? 0 : after >= 50 ? 0 : 4.9;
  return { subtotal, discount, shipping, total: after + shipping };
}

function cartLine(i) {
  return `<li class="cart-item">
    <div class="cart-item-head"><span>${i.name}</span><strong>${fmt(i.qty * i.unitPrice)}</strong></div>
    <div class="item-meta"><span>${i.scent}</span><span>${i.preorder ? "Prednarocilo" : "Na zalogi"} / ETA ${i.etaDays} dni</span></div>
    <div class="item-controls">
      <div class="qty-controls"><button type="button" data-qty-minus="${i.id}">-</button><button type="button" data-qty-plus="${i.id}">+</button></div>
      <button class="remove-btn" type="button" data-remove-item="${i.id}">Odstrani</button>
    </div>
  </li>`;
}

function renderCart() {
  const count = S.cart.reduce((s, i) => s + i.qty, 0);
  const t = totals();
  R.openCartBtn.textContent = `Kosarica (${count})`;
  R.cartEmpty.style.display = S.cart.length ? "none" : "block";
  R.checkoutBtn.disabled = !S.cart.length;
  R.cartItems.innerHTML = S.cart.map(cartLine).join("");
  R.subtotalAmount.textContent = fmt(t.subtotal);
  R.discountAmount.textContent = `- ${fmt(t.discount)}`;
  R.shippingAmount.textContent = fmt(t.shipping);
  R.totalAmount.textContent = fmt(t.total);
}

function addProductToCart(productId) {
  const p = S.products.find((x) => x.id === productId);
  if (!p) return;
  const now = available(productId);
  const lineId = now > 0 ? `catalog-${productId}-stock` : `catalog-${productId}-pre`;
  const existing = S.cart.find((i) => i.id === lineId);
  if (!now && !p.etaDays) return;
  if (existing) {
    existing.qty += 1;
  } else {
    S.cart.push({
      id: lineId,
      type: "catalog",
      productId,
      name: now > 0 ? p.name : `${p.name} (prednarocilo)`,
      scent: p.scent,
      unitPrice: price(p),
      qty: 1,
      preorder: now <= 0,
      etaDays: now > 0 ? 1 : p.etaDays
    });
  }
  msg(R.personalMessage, "");
  renderProducts();
  renderCart();
}

function addPersonalized(evt) {
  evt.preventDefault();
  const base = R.personalBase.value;
  const text = R.personalText.value.trim();
  const scent = R.personalScent.value.trim();
  const qty = Number(R.personalQty.value || 1);
  const logo = R.personalLogo.files[0] ? R.personalLogo.files[0].name : "";
  S.cart.push({
    id: `custom-${Date.now()}`,
    type: "custom",
    productId: "",
    name: `Personalized ${base}`,
    scent,
    unitPrice: 49 + (logo ? 6 : 0),
    qty,
    preorder: true,
    etaDays: 7,
    note: `Napis: ${text}${logo ? `, Logo: ${logo}` : ""}`
  });
  R.personalForm.reset();
  R.personalQty.value = "1";
  msg(R.personalMessage, "Personalizirana sveca dodana v kosarico.");
  renderCart();
}

function adjustItem(id, dir) {
  const item = S.cart.find((i) => i.id === id);
  if (!item) return;
  if (dir === "plus" && item.type === "catalog" && !item.preorder) {
    const p = S.products.find((x) => x.id === item.productId);
    if (p && stockInCart(item.productId) >= p.stock) {
      if (p.etaDays > 0) {
        addProductToCart(item.productId);
      }
      return;
    }
  }
  if (dir === "minus") item.qty -= 1;
  if (dir === "plus") item.qty += 1;
  if (item.qty <= 0) S.cart = S.cart.filter((i) => i.id !== id);
  renderProducts();
  renderCart();
}

function removeItem(id) {
  S.cart = S.cart.filter((i) => i.id !== id);
  renderProducts();
  renderCart();
}

function applyCoupon() {
  const code = R.couponInput.value.trim().toUpperCase();
  const coupon = S.coupons.find((c) => c.code === code);
  if (!coupon) return msg(R.couponInfo, "Kupon ne obstaja.");
  const subtotal = S.cart.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  if (subtotal < coupon.minAmount) return msg(R.couponInfo, `Minimalni znesek: ${fmt(coupon.minAmount)}.`);
  S.activeCoupon = coupon;
  msg(R.couponInfo, `Kupon ${coupon.code} aktiviran.`);
  renderCart();
}

function invoiceText(order) {
  const lines = [`SAROMEN DEMO RACUN`, `Racun: ${order.invoice}`, `Narocilo: ${order.order}`, `Tracking: ${order.tracking}`, `Datum: ${order.date}`, "", "Postavke:"];
  order.items.forEach((i) => lines.push(`- ${i.name} x${i.qty} (${fmt(i.qty * i.unitPrice)})`));
  lines.push("", `Vmesni: ${fmt(order.subtotal)}`, `Popust: ${fmt(order.discount)}`, `Postnina: ${fmt(order.shipping)}`, `Skupaj: ${fmt(order.total)}`);
  return lines.join("\n");
}

function downloadInvoice(order) {
  const blob = new Blob([invoiceText(order)], { type: "text/plain;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${order.invoice}.txt`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  a.remove();
}

function checkout() {
  if (!S.cart.length) return;
  const user = currentUser();
  if (!user) { modalOpen(R.authModal); return msg(R.loginMessage, "Za checkout se prijavi."); }
  const t = totals();
  const now = Date.now();
  const order = {
    order: `SAR-${String(now).slice(-8)}`,
    invoice: `INV-${String(now).slice(-7)}`,
    tracking: `TRK-${Math.random().toString(36).slice(2, 9).toUpperCase()}`,
    date: new Date().toLocaleString("sl-SI"),
    subtotal: t.subtotal,
    discount: t.discount,
    shipping: t.shipping,
    total: t.total,
    items: JSON.parse(JSON.stringify(S.cart))
  };
  user.orders = user.orders || [];
  user.emails = user.emails || [];
  user.orders.unshift({ orderNumber: order.order, invoiceNumber: order.invoice, trackingNumber: order.tracking, total: order.total, dateLabel: order.date });
  user.emails.unshift({ subject: `Potrditev narocila ${order.order}`, body: `Narocilo potrjeno. Tracking: ${order.tracking}.`, dateLabel: order.date });
  save(K.profiles, S.profiles);
  R.orderResult.hidden = false;
  R.orderResult.innerHTML = `<strong>Narocilo oddano.</strong><br/>Narocilo: ${order.order}<br/>Racun: ${order.invoice}<br/>Tracking: ${order.tracking}<br/>Email poslan na: ${user.email} (demo)<br/><button class="secondary-btn" id="downloadInvoiceBtn" type="button">Prenesi racun</button>`;
  const btn = id("downloadInvoiceBtn");
  if (btn) btn.addEventListener("click", () => downloadInvoice(order));
  S.cart = [];
  S.activeCoupon = null;
  R.couponInput.value = "";
  msg(R.couponInfo, "Narocilo zakljuceno.");
  renderProducts();
  renderCart();
  renderProfile();
}

function authButtons() {
  const u = currentUser();
  if (!u) { R.authBtn.textContent = "Prijava"; R.profileBtn.hidden = true; return; }
  R.authBtn.textContent = u.name;
  R.profileBtn.hidden = false;
}

function showLogin() {
  R.showLoginTab.classList.add("active");
  R.showRegisterTab.classList.remove("active");
  R.loginForm.hidden = false;
  R.registerForm.hidden = true;
}

function showRegister() {
  R.showLoginTab.classList.remove("active");
  R.showRegisterTab.classList.add("active");
  R.loginForm.hidden = true;
  R.registerForm.hidden = false;
}

function login(evt) {
  evt.preventDefault();
  const email = R.loginEmail.value.trim().toLowerCase();
  const pass = R.loginPassword.value;
  const u = S.profiles.find((p) => p.email.toLowerCase() === email && p.password === pass);
  if (!u) return msg(R.loginMessage, "Napacni podatki.");
  S.userId = u.id;
  localStorage.setItem(K.user, u.id);
  R.loginForm.reset();
  modalClose(R.authModal);
  authButtons();
  renderProfile();
}

function register(evt) {
  evt.preventDefault();
  const name = R.registerName.value.trim();
  const email = R.registerEmail.value.trim().toLowerCase();
  const p1 = R.registerPassword.value;
  const p2 = R.registerPasswordConfirm.value;
  if (p1 !== p2) return msg(R.registerMessage, "Gesli se ne ujemata.");
  if (S.profiles.some((p) => p.email.toLowerCase() === email)) return msg(R.registerMessage, "Email ze obstaja.");
  const profile = { id: `usr-${Date.now()}`, name, email, password: p1, orders: [], emails: [] };
  S.profiles.push(profile);
  save(K.profiles, S.profiles);
  S.userId = profile.id;
  localStorage.setItem(K.user, profile.id);
  R.registerForm.reset();
  modalClose(R.authModal);
  authButtons();
  renderProfile();
}

function logout() {
  S.userId = "";
  localStorage.removeItem(K.user);
  modalClose(R.profileModal);
  authButtons();
  renderProfile();
}

function renderProfile() {
  const u = currentUser();
  if (!u) {
    R.profileName.textContent = "-";
    R.profileEmail.textContent = "-";
    R.profileOrders.innerHTML = "<li>Brez narocil.</li>";
    R.profileEmails.innerHTML = "<li>Brez email zapisov.</li>";
    return;
  }
  R.profileName.textContent = u.name;
  R.profileEmail.textContent = u.email;
  R.profileOrders.innerHTML = (u.orders || []).length ? u.orders.map((o) => `<li>${o.dateLabel}<br/>${o.orderNumber} / ${o.invoiceNumber}<br/>Tracking: ${o.trackingNumber}<br/>Skupaj: ${fmt(o.total)}</li>`).join("") : "<li>Se ni narocil.</li>";
  R.profileEmails.innerHTML = (u.emails || []).length ? u.emails.map((e) => `<li>${e.dateLabel}<br/><strong>${e.subject}</strong><br/>${e.body}</li>`).join("") : "<li>Se ni email obvestil.</li>";
}

function adminView() {
  R.adminLoginView.hidden = S.adminAuth;
  R.adminPanelView.hidden = !S.adminAuth;
  if (S.adminAuth) renderAdminLists();
}

function renderAdminLists() {
  R.adminProductsList.innerHTML = S.products.map((p) => `<li>${p.name} (${p.category}) - ${fmt(price(p))} / zaloga ${p.stock} <button class="remove-btn" type="button" data-remove-product="${p.id}">Brisi</button></li>`).join("");
  R.adminCouponsList.innerHTML = S.coupons.map((c) => `<li>${c.code} - ${c.percent}% (min ${fmt(c.minAmount)}) <button class="remove-btn" type="button" data-remove-coupon="${c.code}">Brisi</button></li>`).join("");
}

function adminLogin(evt) {
  evt.preventDefault();
  if (R.adminUsername.value.trim() !== ADMIN.username || R.adminPassword.value !== ADMIN.password) return msg(R.adminMessage, "Napacni admin podatki.");
  S.adminAuth = true;
  R.adminLoginForm.reset();
  msg(R.adminMessage, "");
  adminView();
}

function adminLogout() { S.adminAuth = false; adminView(); }

function adminAddProduct(evt) {
  evt.preventDefault();
  const p = {
    id: `${slug(R.adminProductName.value.trim())}-${Date.now()}`,
    name: R.adminProductName.value.trim(),
    category: R.adminProductCategory.value.trim(),
    scent: R.adminProductScent.value.trim(),
    description: "Dodano preko admin centra.",
    price: Number(R.adminProductPrice.value),
    stock: Number(R.adminProductStock.value),
    etaDays: Number(R.adminProductEta.value),
    isTop: R.adminProductTop.checked,
    isNew: R.adminProductNew.checked,
    salePercent: Number(R.adminProductSale.value || 0)
  };
  S.products.unshift(p);
  save(K.products, S.products);
  R.adminProductForm.reset();
  msg(R.adminProductMessage, "Izdelek dodan.");
  renderFilters();
  renderProducts();
  renderAdminLists();
}

function adminAddCoupon(evt) {
  evt.preventDefault();
  const code = R.adminCouponCode.value.trim().toUpperCase();
  if (S.coupons.some((c) => c.code === code)) return msg(R.adminCouponMessage, "Kupon ze obstaja.");
  S.coupons.push({ code, percent: Number(R.adminCouponPercent.value), minAmount: Number(R.adminCouponMin.value) });
  save(K.coupons, S.coupons);
  R.adminCouponForm.reset();
  msg(R.adminCouponMessage, "Kupon dodan.");
  renderAdminLists();
}

function adminRemoveProduct(idv) {
  S.products = S.products.filter((p) => p.id !== idv);
  save(K.products, S.products);
  S.cart = S.cart.filter((i) => i.productId !== idv);
  renderFilters(); renderProducts(); renderCart(); renderAdminLists();
}

function adminRemoveCoupon(code) {
  S.coupons = S.coupons.filter((c) => c.code !== code);
  save(K.coupons, S.coupons);
  if (S.activeCoupon && S.activeCoupon.code === code) S.activeCoupon = null;
  renderCart(); renderAdminLists();
}

function bind() {
  R.categoryFilters.addEventListener("click", (e) => { const b = e.target.closest("[data-category]"); if (!b) return; S.category = b.dataset.category; renderFilters(); renderProducts(); });
  [R.topHitsGrid, R.discountGrid, R.newGrid, R.allProductsGrid].forEach((c) => c.addEventListener("click", (e) => { const b = e.target.closest("[data-add-product]"); if (b) addProductToCart(b.dataset.addProduct); }));
  R.openCartBtn.addEventListener("click", () => { R.cartPanel.classList.add("open"); R.cartPanel.setAttribute("aria-hidden", "false"); });
  R.closeCartBtn.addEventListener("click", () => { R.cartPanel.classList.remove("open"); R.cartPanel.setAttribute("aria-hidden", "true"); });
  R.cartItems.addEventListener("click", (e) => {
    const plus = e.target.closest("[data-qty-plus]"); if (plus) return adjustItem(plus.dataset.qtyPlus, "plus");
    const minus = e.target.closest("[data-qty-minus]"); if (minus) return adjustItem(minus.dataset.qtyMinus, "minus");
    const rem = e.target.closest("[data-remove-item]"); if (rem) removeItem(rem.dataset.removeItem);
  });
  R.personalForm.addEventListener("submit", addPersonalized);
  R.applyCouponBtn.addEventListener("click", applyCoupon);
  R.clearCartBtn.addEventListener("click", () => { S.cart = []; S.activeCoupon = null; R.couponInput.value = ""; R.orderResult.hidden = true; renderProducts(); renderCart(); });
  R.checkoutBtn.addEventListener("click", checkout);
  R.authBtn.addEventListener("click", () => { if (currentUser()) { modalOpen(R.profileModal); renderProfile(); } else { showLogin(); modalOpen(R.authModal); } });
  R.profileBtn.addEventListener("click", () => { modalOpen(R.profileModal); renderProfile(); });
  R.adminBtn.addEventListener("click", () => { modalOpen(R.adminModal); adminView(); });
  R.closeAuthModal.addEventListener("click", () => modalClose(R.authModal));
  R.closeProfileModal.addEventListener("click", () => modalClose(R.profileModal));
  R.closeAdminModal.addEventListener("click", () => modalClose(R.adminModal));
  R.showLoginTab.addEventListener("click", showLogin);
  R.showRegisterTab.addEventListener("click", showRegister);
  R.loginForm.addEventListener("submit", login);
  R.registerForm.addEventListener("submit", register);
  R.logoutBtn.addEventListener("click", logout);
  R.adminLoginForm.addEventListener("submit", adminLogin);
  R.adminLogoutBtn.addEventListener("click", adminLogout);
  R.adminProductForm.addEventListener("submit", adminAddProduct);
  R.adminCouponForm.addEventListener("submit", adminAddCoupon);
  R.adminProductsList.addEventListener("click", (e) => { const b = e.target.closest("[data-remove-product]"); if (b) adminRemoveProduct(b.dataset.removeProduct); });
  R.adminCouponsList.addEventListener("click", (e) => { const b = e.target.closest("[data-remove-coupon]"); if (b) adminRemoveCoupon(b.dataset.removeCoupon); });
  [R.authModal, R.profileModal, R.adminModal].forEach((m) => m.addEventListener("click", (e) => { if (e.target === m) modalClose(m); }));
}

bind();
renderFilters();
renderProducts();
renderCart();
renderProfile();
authButtons();
adminView();
