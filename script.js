const cakes = [
  {
    name: "CHOCOLATE FUDGE CAKE",
    description: "Rich chocolate sponge layered with creamy fudge and silky ganache.",
    price: "GHS180.00",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "STRAWBERRY BLISS CAKE",
    description: "Soft vanilla sponge with fresh strawberry cream and berry topping.",
    price: "GHS210.00",
    image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "RED VELVET SIGNATURE",
    description: "Elegant red velvet cake with smooth cream cheese frosting.",
    price: "GHS230.00",
    image: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "VANILLA BERRY BLOOM",
    description: "Light vanilla layers with whipped cream and berry glaze.",
    price: "GHS195.00",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "CARAMEL DRIP DELIGHT",
    description: "Moist butter cake with caramel cream and salted caramel drip.",
    price: "GHS220.00",
    image: "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "LEMON CREAM CELEBRATION",
    description: "Refreshing lemon sponge and smooth cream frosting.",
    price: "GHS175.00",
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=900&q=80",
  },
];

function getCartItems() {
  return JSON.parse(localStorage.getItem("cartItems")) || [];
}

function setCartItems(items) {
  localStorage.setItem("cartItems", JSON.stringify(items));
}

function addToCart(productInfo) {
  const cartItems = getCartItems();
  cartItems.push(productInfo);
  setCartItems(cartItems);
  updateCartCount();
}

function updateCartCount() {
  const count = getCartItems().length;
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = String(count);
  });
}

function showMessage(className, text) {
  const message = document.createElement("div");
  message.className = className;
  message.textContent = text;
  document.body.appendChild(message);
  setTimeout(() => message.remove(), 2000);
}

function calculateSubtotal(cartItems) {
  return cartItems.reduce((total, item) => {
    const price = parseFloat(item.price.replace("GHS", ""));
    return total + price * (item.quantity || 1);
  }, 0);
}

function updateCartTotals(subtotal) {
  const subtotalElement = document.querySelector(".subtotal");
  const totalElement = document.querySelector(".total-amount");
  if (subtotalElement) subtotalElement.textContent = `GHS${subtotal.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `GHS${subtotal.toFixed(2)}`;
}

function updateCartDisplay() {
  const cartItemsContainer = document.querySelector(".cart-items");
  if (!cartItemsContainer) return;
  const cartItems = getCartItems();

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = "<h1>Shopping Cart</h1><p>Your cart is empty</p>";
    updateCartTotals(0);
    return;
  }

  let subtotal = 0;
  let html = "<h1>Shopping Cart</h1>";
  cartItems.forEach((item, index) => {
    const price = parseFloat(item.price.replace("GHS", ""));
    const quantity = item.quantity || 1;
    subtotal += price * quantity;
    html += `
      <div class="cart-item" data-index="${index}">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-details">
          <h3>${item.name}</h3>
          <p class="item-price">${item.price}</p>
          ${item.color ? `<p>Color: ${item.color}</p>` : ""}
          ${item.size ? `<p>Size: ${item.size}</p>` : ""}
        </div>
        <div class="item-quantity">
          <button class="quantity-btn minus">-</button>
          <span class="quantity">${quantity}</span>
          <button class="quantity-btn plus">+</button>
        </div>
        <p class="item-total">GHS${(price * quantity).toFixed(2)}</p>
        <button class="remove-item">Remove</button>
      </div>
    `;
  });

  cartItemsContainer.innerHTML = html;
  updateCartTotals(subtotal);
}

function showCheckoutForm() {
  const cartItems = getCartItems();
  if (!cartItems.length) {
    showMessage("remove-message", "Your cart is empty");
    return;
  }

  const subtotal = calculateSubtotal(cartItems);
  const formHTML = `
    <div class="checkout-overlay">
      <div class="checkout-form">
        <h2>Checkout Details</h2>
        <form id="checkoutForm">
          <div class="form-group"><label for="name">Full Name</label><input id="name" required></div>
          <div class="form-group"><label for="phone">Phone Number</label><input id="phone" required></div>
          <div class="form-group"><label for="address">Delivery Address</label><textarea id="address" required></textarea></div>
          <div class="form-group"><label for="notes">Additional Notes</label><textarea id="notes"></textarea></div>
          <p>Total Amount: GHS${subtotal.toFixed(2)}</p>
          <button type="submit" class="submit-btn">Complete Order</button>
          <button type="button" class="cancel-btn">Cancel</button>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML("beforeend", formHTML);

  const overlay = document.querySelector(".checkout-overlay");
  const cancelBtn = document.querySelector(".cancel-btn");
  const checkoutForm = document.getElementById("checkoutForm");
  cancelBtn.addEventListener("click", () => overlay.remove());

  checkoutForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const notes = document.getElementById("notes").value;
    let orderMessage = `*New Cake Order*%0A%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}%0A`;
    if (notes) orderMessage += `Notes: ${notes}%0A`;
    orderMessage += "%0A*Items*%0A";
    cartItems.forEach((item) => {
      orderMessage += `- ${item.name} (${item.quantity || 1}x) @ ${item.price}%0A`;
    });
    orderMessage += `%0A*Total: GHS${subtotal.toFixed(2)}*`;
    localStorage.setItem("cartItems", "[]");
    window.location.href = `https://wa.me/233594906859?text=${orderMessage}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const leftImg = document.querySelector(".product.left");
  const centerImg = document.querySelector(".product.center");
  const rightImg = document.querySelector(".product.right");
  const productContainer = document.querySelector(".product-container");
  const prevBtn = document.querySelector(".control-btn.prev");
  const nextBtn = document.querySelector(".control-btn.next");
  const dots = document.querySelectorAll(".slider-dots .dot");
  const popupName = document.getElementById("popupName");
  const popupPrice = document.getElementById("popupPrice");
  const popupDescription = document.getElementById("popupDescription");
  const popupImage = document.getElementById("popupImage");
  const buyNowBtn = document.querySelector(".buy-now-btn");
  const sizeButtons = document.querySelectorAll(".size-btn");
  const colorDots = document.querySelectorAll(".color-dot");
  const searchBtn = document.querySelector(".search-btn");
  const closeSearch = document.querySelector(".close-search");
  const searchOverlay = document.querySelector(".search-overlay");
  const searchInput = document.querySelector(".search-input");
  const quickAddBtns = document.querySelectorAll(".quick-add-btn");
  const customCakeForm = document.getElementById("customCakeForm");

  let activeIndex = 0;
  let isAnimatingSlide = false;
  let touchStartX = 0;
  let touchEndX = 0;

  function wrap(index) {
    return (index + cakes.length) % cakes.length;
  }

  function renderCarousel() {
    if (!leftImg || !centerImg || !rightImg) return;
    const left = cakes[wrap(activeIndex - 1)];
    const center = cakes[activeIndex];
    const right = cakes[wrap(activeIndex + 1)];
    leftImg.src = left.image;
    leftImg.alt = left.name;
    centerImg.src = center.image;
    centerImg.alt = center.name;
    rightImg.src = right.image;
    rightImg.alt = right.name;
    if (popupName) popupName.textContent = center.name;
    if (popupPrice) popupPrice.textContent = center.price;
    if (popupDescription) popupDescription.textContent = center.description;
    if (popupImage) {
      popupImage.src = center.image;
      popupImage.alt = center.name;
    }
    dots.forEach((dot, idx) => dot.classList.toggle("active", idx === activeIndex));
  }

  function animateSlide(direction) {
    if (!productContainer || isAnimatingSlide || !leftImg || !centerImg || !rightImg) return;
    isAnimatingSlide = true;
    const animationClass = direction === "next" ? "slide-next" : "slide-prev";
    productContainer.classList.add(animationClass);

    window.setTimeout(() => {
      activeIndex = wrap(activeIndex + (direction === "next" ? 1 : -1));
      renderCarousel();
    }, 170);

    window.setTimeout(() => {
      productContainer.classList.remove(animationClass);
      isAnimatingSlide = false;
    }, 380);
  }

  if (prevBtn && nextBtn) {
    prevBtn.addEventListener("click", () => {
      animateSlide("prev");
    });
    nextBtn.addEventListener("click", () => {
      animateSlide("next");
    });
  }

  if (productContainer) {
    productContainer.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0].clientX;
    }, { passive: true });

    productContainer.addEventListener("touchend", (event) => {
      touchEndX = event.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) < 40) return;
      if (swipeDistance < 0) {
        animateSlide("next");
      } else {
        animateSlide("prev");
      }
    }, { passive: true });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      activeIndex = idx;
      renderCarousel();
    });
  });

  colorDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      colorDots.forEach((d) => d.classList.remove("active"));
      dot.classList.add("active");
    });
  });

  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      const selectedColor = document.querySelector(".color-dot.active")?.classList[1] || "black";
      const selectedSize = document.querySelector(".size-btn.active")?.textContent || '8"';
      const item = cakes[activeIndex];
      addToCart({ ...item, quantity: 1, color: selectedColor, size: selectedSize });
      showMessage("add-to-cart-message", "Added to cart!");
      window.location.href = "cart.html";
    });
  }

  quickAddBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const item = {
        name: btn.dataset.name,
        price: btn.dataset.price,
        image: btn.dataset.image,
        quantity: 1,
      };
      addToCart(item);
      showMessage("add-to-cart-message", "Added to cart!");
    });
  });

  if (searchBtn && searchOverlay && closeSearch) {
    searchBtn.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      if (searchInput) searchInput.focus();
    });
    closeSearch.addEventListener("click", () => searchOverlay.classList.remove("active"));
    searchOverlay.addEventListener("click", (event) => {
      if (event.target === searchOverlay) searchOverlay.classList.remove("active");
    });
  }

  if (customCakeForm) {
    const summaryFields = {
      occasion: document.getElementById("sumOccasion"),
      size: document.getElementById("sumSize"),
      flavor: document.getElementById("sumFlavor"),
      filling: document.getElementById("sumFilling"),
      themeColor: document.getElementById("sumTheme"),
      budget: document.getElementById("sumBudget"),
      deliveryDate: document.getElementById("sumDate"),
      designNotes: document.getElementById("sumNotes"),
    };

    const syncSummary = () => {
      Object.entries(summaryFields).forEach(([name, node]) => {
        if (!node) return;
        const input = customCakeForm.elements[name];
        node.textContent = input && input.value ? input.value : "-";
      });
    };

    customCakeForm.addEventListener("input", syncSummary);
    syncSummary();

    customCakeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const order = {
        occasion: customCakeForm.occasion.value,
        size: customCakeForm.size.value,
        flavor: customCakeForm.flavor.value,
        filling: customCakeForm.filling.value,
        themeColor: customCakeForm.themeColor.value,
        budget: customCakeForm.budget.value,
        deliveryDate: customCakeForm.deliveryDate.value,
        inspiration: customCakeForm.inspiration.value,
        designNotes: customCakeForm.designNotes.value,
        customerName: customCakeForm.customerName.value,
        customerPhone: customCakeForm.customerPhone.value,
      };

      localStorage.setItem("customCakeRequest", JSON.stringify(order));

      let message = "*Custom Cake Request*\n\n";
      message += `Name: ${order.customerName}\n`;
      message += `Phone: ${order.customerPhone}\n`;
      message += `Occasion: ${order.occasion}\n`;
      message += `Size: ${order.size}\n`;
      message += `Flavor: ${order.flavor}\n`;
      message += `Filling: ${order.filling}\n`;
      message += `Theme Color: ${order.themeColor}\n`;
      message += `Budget: ${order.budget}\n`;
      message += `Delivery Date: ${order.deliveryDate}\n`;
      message += `Design Notes: ${order.designNotes}\n`;
      if (order.inspiration) {
        message += `Inspiration URL: ${order.inspiration}\n`;
      }

      const whatsappLink = `https://wa.me/233594906859?text=${encodeURIComponent(message)}`;
      window.location.href = whatsappLink;
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && searchOverlay?.classList.contains("active")) {
      searchOverlay.classList.remove("active");
    }
  });

  const cartItemsContainer = document.querySelector(".cart-items");
  if (cartItemsContainer) {
    updateCartDisplay();
    cartItemsContainer.addEventListener("click", (event) => {
      const target = event.target;
      const cartItem = target.closest(".cart-item");
      if (!cartItem) return;
      const index = Number(cartItem.dataset.index);
      const cartItems = getCartItems();

      if (target.classList.contains("remove-item")) {
        cartItems.splice(index, 1);
        setCartItems(cartItems);
        updateCartCount();
        updateCartDisplay();
        showMessage("remove-message", "Item removed from cart");
      } else if (target.classList.contains("plus")) {
        cartItems[index].quantity = (cartItems[index].quantity || 1) + 1;
        setCartItems(cartItems);
        updateCartDisplay();
      } else if (target.classList.contains("minus") && (cartItems[index].quantity || 1) > 1) {
        cartItems[index].quantity -= 1;
        setCartItems(cartItems);
        updateCartDisplay();
      }
    });
  }

  renderCarousel();
});

document.body.addEventListener("click", (event) => {
  const checkoutBtn = event.target.closest(".checkout-btn");
  if (checkoutBtn) showCheckoutForm();
});
