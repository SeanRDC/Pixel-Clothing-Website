document.addEventListener("DOMContentLoaded", () => {
  const itemsContainer = document.getElementById("checkout-items");
  const subtotalEl = document.getElementById("subtotal");
  const deliveryEl = document.getElementById("delivery");
  const totalEl = document.getElementById("total");
  const questComplete = document.getElementById("quest-complete");
  const returnBtn = document.getElementById("return-btn");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let subtotal = 0;
  let shippingCost = 0;

  // 🧾 Load Cart Items
  if (cart.length === 0) {
    itemsContainer.innerHTML = `<p>No items found in your inventory.</p>`;
  } else {
    cart.forEach(item => {
      const div = document.createElement("div");
      div.classList.add("checkout-item");
      div.innerHTML = `
        <span>${item.name} (Qty: 1)</span>
        <span>₱${item.price.toFixed(2)}</span>
      `;
      itemsContainer.appendChild(div);
      subtotal += item.price;
    });
  }

  // 🧮 Update Totals Function
  function updateTotals() {
    subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    deliveryEl.textContent = `₱${shippingCost.toFixed(2)}`;
    const total = subtotal + shippingCost;
    totalEl.textContent = `₱${total.toFixed(2)}`;
  }

  updateTotals(); // initialize

  // 🚚 Shipping Buttons
  const shipButtons = document.querySelectorAll(".ship-option");
  shipButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Reset styles
      shipButtons.forEach(b => b.classList.remove("selected"));
      button.classList.add("selected");

      const text = button.textContent.toLowerCase();

      if (text.includes("swift")) shippingCost = 100;
      else if (text.includes("dragon")) shippingCost = 150;
      else if (text.includes("merchant")) shippingCost = 50;
      else shippingCost = 0;

      updateTotals();
    });
  });

  // 🟡 Complete Quest button logic
  document.getElementById("complete-btn").addEventListener("click", () => {
    // Hide checkout and show quest complete screen
    document.querySelector(".checkout-content").style.display = "none";
    questComplete.classList.remove("hidden");
    localStorage.removeItem("cart");
  });

  // 🟢 Return to Merchant
  returnBtn.addEventListener("click", () => {
    window.location.href = "house.html";
  });
});
