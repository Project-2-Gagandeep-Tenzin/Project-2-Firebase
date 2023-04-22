import { toggleMenu } from "./toggleMenu.js";
import { toggleCart } from "./toggleCart.js";
import app from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
  get,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { products } from "./data.js";
import { productsContainer, displayItems } from "./displayProducts.js";
import { cartRef, addToCart } from "./addToCart.js";
import {
  displayCartItems,
  displayTotalSize,
  cartHeading,
  cartButtons,
  checkoutPriceInfoElement,
} from "./displayCart.js";
import { minusFromCart, removeProductFromCart } from "./removeFromCart.js";

const database = getDatabase(app);
const productsInventoryRef = ref(database, "/productsInventory");

// Added list of products into firebase
const addToDatabase = (key, value) => {
  const customRef = ref(database, key);
  set(customRef, value);
};

addToDatabase("productsInventory", products);

// displayed list of products in to page
onValue(productsInventoryRef, (snapshot) => {
  const productsInventory = snapshot.val();
  displayItems(productsInventory);
});

// ADDING PRODUCT TO CART AND REMOVE THAT PRODUCT FROM INVENTORY
productsContainer.addEventListener("click", (e) => {
  // if targeting element id is equal to cart then do something
  if (e.target.id === "cart") {
    addToCart(e.target.parentElement.id);
  }
});

// SHOWING THE TOTAL ITEMS IN CART SYSTEM
onValue(cartRef, (snapshot) => {
  const cartItems = snapshot.val();
  displayTotalSize(cartItems);
  if (cartItems) {
    cartHeading.innerHTML = `Your cart`;
    displayCartItems(cartItems);
  } else {
    cartHeading.innerHTML = `🙁 Your cart is empty 🙁`;
    cartInfoElement.innerHTML = "";
    checkoutPriceInfoElement.innerHTML = "";
    cartButtons.innerHTML = "";
  }
});

// EVENT LISTENER TO UPDATE THE PRODUCTS AND CART ITEMS IN CART
const cartInfoElement = document.querySelector(".cart-info");
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
        minusFromCart(key);
      }
      if (e.target.tagName === "I") {
        removeProductFromCart(key);
        alert("Removed item from cart");
      }
    }
  });
});
