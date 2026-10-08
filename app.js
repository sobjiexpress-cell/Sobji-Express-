const products = [
  { id: 1, name: "আলু", price: 25, unit: "kg", emoji: "🥔", category: "সবজি" },
  { id: 2, name: "পেঁয়াজ", price: 30, unit: "kg", emoji: "🧅", category: "সবজি" },
  { id: 3, name: "টমেটো", price: 40, unit: "kg", emoji: "🍅", category: "সবজি" },
  { id: 4, name: "গাজর", price: 50, unit: "kg", emoji: "🥕", category: "সবজি" },
  { id: 5, name: "বাঁধাকপি", price: 35, unit: "piece", emoji: "🥬", category: "সবজি" }
];

let cart = [];

function renderProducts() {
  const box = document.getElementById("products");
  const search = document.getElementById("search").value.toLowerCase();

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search)
  );

  box.innerHTML = filtered.map(p => `
    <div class="product">
      <div class="product-image">${p.emoji}</div>
      <h3>${p.name}</h3>
      <p>₹${p.price}/${p.unit}</p>
      <button onclick="addToCart(${p.id})">কার্টে যোগ করুন</button>
    </div>
  `).join("");

  document.getElementById("result").textContent =
    filtered.length + "টি পণ্য";
}

function addToCart(id) {
  const item = cart.find(x => x.id === id);

  if (item) {
    item.qty++;
  } else {
    const product = products.find(x => x.id === id);
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
}

function changeQty(id, amount) {
  const item = cart.find(x => x.id === id);

  if (!item) return;

  item.qty += amount;

  if (item.qty <= 0) {
    cart = cart.filter(x => x.id !== id);
  }

  updateCart();
}

function updateCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  document.getElementById("cartCount").textContent = count;

  const box = document.getElementById("cartItems");

  if (cart.length === 0) {
    box.innerHTML = "<p>আপনার Cart খালি।</p>";
    document.getElementById("total").textContent = "0";
    return;
  }

  box.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.emoji} ${item.name}</span>
      <div>
        <button onclick="changeQty(${item.id}, -1)">−</button>
        <strong>${item.qty}</strong>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
      <b>₹${item.price * item.qty}</b>
    </div>
  `).join("");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  document.getElementById("total").textContent = total;
}

function openCart() {
  document.getElementById("cart").style.display = "flex";
  updateCart();
}

function closeCart() {
  document.getElementById("cart").style.display = "none";
}

function placeOrder(event) {
  event.preventDefault();

  if (cart.length === 0) {
    alert("আগে Cart-এ পণ্য যোগ করুন।");
    return;
  }

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;
  const slot = document.getElementById("slot").value;

  const items = cart.map(item =>
    `${item.name} x ${item.qty} = ₹${item.price * item.qty}`
  ).join("\n");

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const message =
`🥬 Sobji Express Order

নাম: ${name}
মোবাইল: ${phone}
ঠিকানা: ${address}
Delivery: ${slot}

অর্ডার:
${items}

মোট: ₹${total}`;

  const whatsappNumber = "917908999752";

  const url =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");

  document.getElementById("success").textContent =
    "WhatsApp খুলছে...";

}

renderProducts();
updateCart();
