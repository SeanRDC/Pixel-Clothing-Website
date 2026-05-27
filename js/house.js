// ===================================================
// 1️⃣ Typing effect function (Improved with interrupt support)
// ===================================================
let typingController = {
  active: false,
  timer: null,
  currentText: "",
  currentElement: null,
  currentIndex: 0,
  speed: 40
};

function typeText(element, text, speed = 40) {
  if (
    typingController.active &&
    typingController.currentElement === element &&
    typingController.currentText === text
  ) {
    clearTimeout(typingController.timer);
    element.textContent = text;
    typingController.active = false;
    return;
  }

  clearTimeout(typingController.timer);
  typingController.active = true;
  typingController.currentElement = element;
  typingController.currentText = text;
  typingController.currentIndex = 0;
  typingController.speed = speed;
  element.textContent = "";

  function loop() {
    if (!typingController.active) return;
    if (typingController.currentIndex < text.length) {
      element.textContent += text.charAt(typingController.currentIndex);
      typingController.currentIndex++;
      typingController.timer = setTimeout(loop, speed);
    } else {
      typingController.active = false;
    }
  }
  loop();
}

function stopTyping() {
  clearTimeout(typingController.timer);
  typingController.active = false;
}

// ===================================================
// 2️⃣ Create the center display image element
// ===================================================
const centerDisplay = document.createElement("img");
centerDisplay.className = "center-display-image";
centerDisplay.style.display = "none";
document.body.appendChild(centerDisplay);

// ===================================================
// 3️⃣ DOMContentLoaded logic (dialogue, items, navigation)
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
  const dialogueBox = document.getElementById("dialogue-box");
  const dialogueText = document.querySelector(".dialogue-text");
  const originalText = dialogueText.textContent;
  const descriptionPanelIroha = document.getElementById("description-panel");
  const descriptionPanelWonhee = document.getElementById("description-wonhee");
  const sizePanelIroha = document.getElementById("size-panel");
  const sizePanelWonhee = document.getElementById("size-panel-wonhee");
  const keepersInventory = document.querySelector(".keepers-inventory");
  const clothingMerchant = document.querySelector(".clothing-merchant");

  dialogueText.textContent = "";

  // Show dialogue after short delay (skip if opening Guide directly)
  setTimeout(() => {
    if (dialogueBox && window.location.hash !== "#guide") {
      dialogueBox.style.display = "block";
      dialogueBox.classList.add("show");
      setTimeout(() => {
        typeText(dialogueText, originalText, 50);
      }, 500);
    }
  }, 300);


  // 🧩 Item slot click handling
  const itemSlots = document.querySelectorAll(".item-slot");
  itemSlots.forEach(slot => {
    slot.addEventListener("click", function () {
      const isAlreadySelected = this.classList.contains("selected");

      if (isAlreadySelected) {
        this.classList.remove("selected");
        const existingBadge = this.querySelector(".equip-badge");
        if (existingBadge) existingBadge.remove();

        dialogueBox.style.display = "block";
        dialogueBox.classList.add("show");
        centerDisplay.style.display = "none";
        descriptionPanelIroha?.classList.remove("show");
        descriptionPanelWonhee?.classList.remove("show");
        sizePanelIroha?.classList.remove("show");
        sizePanelWonhee?.classList.remove("show");
      } else {
        dialogueBox.style.display = "none";
        dialogueBox.classList.remove("show");

        itemSlots.forEach(s => {
          s.classList.remove("selected");
          const existingBadge = s.querySelector(".equip-badge");
          if (existingBadge) existingBadge.remove();
        });

        this.classList.add("selected");
        const equipBadge = document.createElement("img");
        equipBadge.src = "img/Equip.png";
        equipBadge.alt = "Equipped";
        equipBadge.className = "equip-badge";
        this.appendChild(equipBadge);

        descriptionPanelIroha?.classList.remove("show");
        descriptionPanelWonhee?.classList.remove("show");
        sizePanelIroha?.classList.remove("show");
        sizePanelWonhee?.classList.remove("show");

        if (this.classList.contains("slot-1")) {
          centerDisplay.src = "img/Iroha.png";
          centerDisplay.style.display = "block";
          descriptionPanelIroha?.classList.add("show");
        } else if (this.classList.contains("slot-2")) {
          centerDisplay.src = "Wonhee.png";
          centerDisplay.style.display = "block";
          descriptionPanelWonhee?.classList.add("show");
        } else {
          centerDisplay.style.display = "none";
        }
      }
    });
  });

  // ===================================================
  // 🧭 Navigation Menu Functionality (fixed Exit behavior)
  // ===================================================
  const menuItems = document.querySelectorAll(".menu-item");
  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      const menuText = item.textContent.trim();
      const backgroundMusic = document.getElementById("background-music");
      const guideSpeechBox = document.querySelector(".guide-speech-box");
      const guideFaqBox = document.querySelector(".guide-faq-box");

      const isGuideVisible = () => {
        const g1 = guideSpeechBox;
        const g2 = guideFaqBox;
        const hasVisibleClass = el => el && el.classList.contains("visible");
        const isRendered = el =>
          el && window.getComputedStyle(el).display !== "none" && el.offsetParent !== null;
        return hasVisibleClass(g1) || hasVisibleClass(g2) || isRendered(g1) || isRendered(g2);
      };

      if (menuText === "Guide") {
        guideSpeechBox?.classList.add("visible");
        guideFaqBox?.classList.add("visible");
        keepersInventory.style.display = "none";
        dialogueBox.style.display = "none";
        centerDisplay.style.display = "none";
        descriptionPanelIroha?.classList.remove("show");
        descriptionPanelWonhee?.classList.remove("show");
        sizePanelIroha?.classList.remove("show");
        sizePanelWonhee?.classList.remove("show");
        clothingMerchant.style.display = "block";

        const guideSpeechText = document.getElementById("guide-speech-text");
        if (guideSpeechText) {
          typeText(
            guideSpeechText,
            "EJ: You seem that you needed help. What is it that you need to ask?",
            40
          );
        }
        return;
      }

      if (menuText === "Exit") {
        if (isGuideVisible()) {
          guideSpeechBox?.classList.remove("visible");
          guideFaqBox?.classList.remove("visible");
          keepersInventory.style.display = "block";
          clothingMerchant.style.display = "block";
          centerDisplay.style.display = "none";
          descriptionPanelIroha?.classList.remove("show");
          descriptionPanelWonhee?.classList.remove("show");
          sizePanelIroha?.classList.remove("show");
          sizePanelWonhee?.classList.remove("show");

          if (dialogueBox && dialogueText) {
            dialogueBox.style.display = "block";
            dialogueBox.classList.add("show");
            stopTyping();
            typeText(
              dialogueText,
              "EJ: Oh, Would you like to see these clothes? I'm actually selling these, I'm happy if you would pick one.",
              40
            );
          }
        } else {
          window.location.href = "index.html";
        }
        return;
      }

      guideSpeechBox?.classList.remove("visible");
      guideFaqBox?.classList.remove("visible");
      keepersInventory.style.display = "block";
      clothingMerchant.style.display = "block";

      if (backgroundMusic) {
        localStorage.setItem("musicTime", backgroundMusic.currentTime);
        localStorage.setItem("musicPlaying", !backgroundMusic.paused);
        localStorage.setItem("musicMuted", backgroundMusic.muted);
      }

      if (menuText === "Quest") window.location.href = "index.html#quest";
      else if (menuText === "About Us") window.location.href = "index.html#about";
    });
  });

  // ===================================================
  // 🧭 Auto-open Guide if coming from index.html#guide
  // ===================================================
  if (window.location.hash === "#guide") {
    const guideSpeechBox = document.querySelector(".guide-speech-box");
    const guideFaqBox = document.querySelector(".guide-faq-box");
    const guideSpeechText = document.getElementById("guide-speech-text");

    guideSpeechBox?.classList.add("visible");
    guideFaqBox?.classList.add("visible");
    keepersInventory.style.display = "none";
    dialogueBox.style.display = "none";
    centerDisplay.style.display = "none";
    descriptionPanelIroha?.classList.remove("show");
    descriptionPanelWonhee?.classList.remove("show");
    sizePanelIroha?.classList.remove("show");
    sizePanelWonhee?.classList.remove("show");
    clothingMerchant.style.display = "block";

    if (guideSpeechText) {
      typeText(
        guideSpeechText,
        "EJ: You seem that you needed help. What is it that you need to ask?",
        40
      );
    }
  }

  // ===================================================
  // 📖 GUIDE FAQ FUNCTIONALITY
  // ===================================================
  const guideFaqQuestions = document.querySelectorAll(".guide-faq-question");
  const guideSpeechText = document.getElementById("guide-speech-text");

  const guideAnswers = {
    1: "EJ: Ah, you made a mistake with your order? Dont worry! Just message us within 24 hours after you placed it, and we will fix it right away.",
    2: "EJ: Oh no, you received the wrong item? My bad! Please contact us with your order number and a quick photo — we will make sure to sort it out fast.",
    3: "EJ: Of course you can! Once your order ships, youll get a tracking link so you can check your orders location anytime.",
    4: "EJ: We take product quality seriously. Every piece is inspected carefully before shipping — nothing leaves without a final check from me!"
  };

  guideFaqQuestions.forEach(question => {
    question.addEventListener("click", () => {
      const answerId = question.dataset.answer;
      const answerText = guideAnswers[answerId];
      if (!guideSpeechText) return;

      if (
        typingController.active &&
        typingController.currentText === answerText
      ) {
        typeText(guideSpeechText, answerText, 0);
        return;
      }

      stopTyping();

      guideFaqQuestions.forEach(q => q.classList.remove("active"));
      question.classList.add("active");

      typeText(guideSpeechText, answerText, 35);
    });
  });

  // ===================================================
  // 📏 SIZE PANEL LOGIC (Restored)
  // ===================================================
  const irohaSizeBtn = descriptionPanelIroha?.querySelector(".size-button");
  const wonheeSizeBtn = descriptionPanelWonhee?.querySelector(".size-button");
  const irohaPrevBtn = sizePanelIroha?.querySelector(".prev-button");
  const wonheePrevBtn = sizePanelWonhee?.querySelector(".prev-button");

  if (irohaSizeBtn && sizePanelIroha) {
    irohaSizeBtn.addEventListener("click", () => {
      descriptionPanelIroha.classList.remove("show");
      sizePanelIroha.classList.add("show");
    });
  }

  if (irohaPrevBtn && sizePanelIroha) {
    irohaPrevBtn.addEventListener("click", () => {
      sizePanelIroha.classList.remove("show");
      descriptionPanelIroha.classList.add("show");
    });
  }

  if (wonheeSizeBtn && sizePanelWonhee) {
    wonheeSizeBtn.addEventListener("click", () => {
      descriptionPanelWonhee.classList.remove("show");
      sizePanelWonhee.classList.add("show");
    });
  }

  if (wonheePrevBtn && sizePanelWonhee) {
    wonheePrevBtn.addEventListener("click", () => {
      sizePanelWonhee.classList.remove("show");
      descriptionPanelWonhee.classList.add("show");
    });
  }

  // ===================================================
  // 🛒 CART PANEL
  // ===================================================
  const cartIcon = document.querySelector(".shopping-cart");
  const cartPanel = document.getElementById("cart-panel");

  if (cartIcon && cartPanel) {
    cartIcon.addEventListener("click", () => {
      const isOpen = cartPanel.classList.contains("show");
      if (isOpen) {
        cartPanel.classList.remove("show");
        document.body.classList.remove("cart-open");
      } else {
        cartPanel.classList.add("show");
        document.body.classList.add("cart-open");

        const emptyText = cartPanel.querySelector(".cart-empty-text");
        if (emptyText) {
          const text = "There is currently no item in your cart.";
          emptyText.textContent = "";
          let i = 0;
          function type() {
            if (i < text.length) {
              emptyText.textContent += text.charAt(i);
              i++;
              setTimeout(type, 30);
            }
          }
          type();
        }
      }
    });
  }

  // ⭐ Size selection highlight logic
  document.querySelectorAll(".size-list").forEach(list => {
    const sizeOptions = list.querySelectorAll("li");
    sizeOptions.forEach(option => {
      option.addEventListener("click", () => {
        sizeOptions.forEach(o => {
          o.classList.remove("selected");
          o.textContent = o.textContent.replace(" ⭐", "");
        });
        option.classList.add("selected");
        option.textContent += " ⭐";
      });
    });
  });
});

// ===================================================
// 🛒 Close cart when clicking outside
// ===================================================
document.addEventListener("click", e => {
  const cartPanel = document.getElementById("cart-panel");
  const cartIcon = document.querySelector(".shopping-cart");
  if (
    cartPanel?.classList.contains("show") &&
    !cartPanel.contains(e.target) &&
    !cartIcon.contains(e.target)
  ) {
    cartPanel.classList.remove("show");
    document.body.classList.remove("cart-open");
  }
});

// ===================================================
// 🛒 ADD TO CART FUNCTIONALITY
// ===================================================
const cartEmptyText = document.querySelector(".cart-empty-text");
const cartItemsContainer = document.getElementById("cart-items");
const totalPriceEl = document.getElementById("cart-total-price");

let cart = [];
const items = {
  iroha: { name: "Iroha Oversized Navy Blue Tee", price: 450 },
  wonhee: { name: "Wonhee Black AcidWash Tee", price: 450 }
};

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  cartEmptyText.style.display = cart.length === 0 ? "block" : "none";

  let total = 0;
  cart.forEach((item, index) => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>${item.size} - ₱${item.price.toFixed(2)}</span>
      </div>
      <span class="cart-item-remove" data-index="${index}">Remove</span>
    `;
    cartItemsContainer.appendChild(div);
    total += item.price;
  });

  totalPriceEl.textContent = `₱${total.toFixed(2)}`;

  document.querySelectorAll(".cart-item-remove").forEach(btn => {
    btn.addEventListener("click", e => {
      const index = e.target.dataset.index;
      cart.splice(index, 1);
      updateCartUI();
    });
  });
}

document.querySelectorAll(".add-to-cart, .add-cart-button").forEach(button => {
  button.addEventListener("click", () => {
    const itemType =
      button.dataset.item ||
      (button.closest("#description-wonhee, #size-panel-wonhee") ? "wonhee" : "iroha");

    const currentPanel = button.closest(".item-description-panel, .size-selection-panel");
    const selectedSize =
      currentPanel?.querySelector(".size-list li.selected")?.dataset.size || "M";

    const selectedItem = items[itemType];
    if (selectedItem) {
      cart.push({
        name: selectedItem.name,
        size: selectedSize,
        price: selectedItem.price
      });
      updateCartUI();
    }
  });
});

document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length > 0) {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "checkout.html";
  } else {
    alert("Your cart is empty!");
  }
});

// ===================================================
// 🔹 ESC Key: Exit Guide and Return to House View
// ===================================================
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    const guideSpeechBox = document.querySelector(".guide-speech-box");
    const guideFaqBox = document.querySelector(".guide-faq-box");
    const dialogueBox = document.getElementById("dialogue-box");
    const dialogueText = document.querySelector(".dialogue-text");

    const isGuideVisible =
      guideSpeechBox?.classList.contains("visible") ||
      guideFaqBox?.classList.contains("visible");

    if (isGuideVisible) {
      guideSpeechBox?.classList.remove("visible");
      guideFaqBox?.classList.remove("visible");
      document.querySelector(".keepers-inventory").style.display = "block";
      document.querySelector(".clothing-merchant").style.display = "block";
      centerDisplay.style.display = "none";

      if (dialogueBox && dialogueText) {
        dialogueBox.style.display = "block";
        dialogueBox.classList.add("show");
        stopTyping();
        typeText(
          dialogueText,
          "EJ: Oh, Would you like to see these clothes? I'm actually selling these, I'm happy if you would pick one.",
          40
        );
      }
    }
  }
});



