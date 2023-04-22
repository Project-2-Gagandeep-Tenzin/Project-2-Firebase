import { toggleMenu, toggleCart } from "./toggleFn.js";
import {
  ref,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import {
  database,
  productsInventoryRef,
  productsContainer,
  displayItems,
} from "./products.js";

import {
  cartRef,
  addToCart,
  cartInfoElement,
  displayCart,
  displayTotalSize,
  emptyCart,
  updateItemFromCart,
  removeProductFromCart,
} from "./cart.js";

// using onvalue to display list of products on page and populate them on every change
onValue(productsInventoryRef, (snapshot) => {
  const productsInventory = snapshot.val();
  displayItems(productsInventory);
});

// Adding products in to cart and updating stock in products inventory
productsContainer.addEventListener("click", (e) => {
  // if targeting element id is equal to cart then do something
  if (e.target.id === "cart") {
    addToCart(e.target.parentElement.id);
  }
});

// Showing the list of items on cart widget
onValue(cartRef, (snapshot) => {
  const cartItems = snapshot.val();
  displayTotalSize(cartItems);
  if (cartItems) {
    displayCart(cartItems);
  } else {
    emptyCart();
  }
});

/* binding the event listener to cart info element which is the parent element of cart items and with the the bubbling effect,
can modifiy the items present in the cart  */
cartInfoElement.addEventListener("click", (e) => {
  const key = e.target.parentElement.id;
  const cartItemRef = ref(database, `/cart/${key}`);
  get(cartItemRef).then((snapshot) => {
    const cartItemSnapshot = snapshot.val();
    if (cartItemSnapshot) {
      if (e.target.className === "plus") {
        if (cartItemSnapshot.quantityInCart < 10) {
          // when user want to add the quantity of products
          addToCart(key);
        } else {
          alert(`No more quantity left for ${cartItemSnapshot.title} `);
        }
      }
      if (e.target.className === "minus") {
        // when user want to reduce the quantity of products
        updateItemFromCart(key);
      }
      if (e.target.tagName === "I") {
        removeProductFromCart(key);
        alert("Removed item from cart");
      }
    }
  });
});
