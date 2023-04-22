import { toggleMenu } from "./toggleMenu.js";
import app from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { products } from "./data.js";

const database = getDatabase(app);
const dbRef = ref(database);
const cartRef = ref(database, "/cart");

const productsContainer = document.querySelector(".products-container");

// Added list of products into firebase
const addToDatabase = (key, value) => {
  const customRef = ref(database, key);
  set(customRef, value);
};

addToDatabase("productsInventory", products);

// displayed list of products in to page
onValue(dbRef, (snapshot) => {
  const ourSnapshot = snapshot.val();
  const productsInventory = ourSnapshot.productsInventory;
  displayItems(productsInventory);
});

// Displayed list of products on a page
const displayItems = (productsInventory) => {
  productsContainer.innerHTML = "";

  for (let key in productsInventory) {
    const item = productsInventory[key];
    // created new li element which contains specific product
    const newListItem = document.createElement("li");
    newListItem.classList.add("products-list", "hvr-float");
    // checked if product item exists in inventory
    if (item.stock > 0) {
      newListItem.innerHTML = `
      <div class="product" id=${key}>
        <img src=${item.url} alt="picture of ${item.title}" />
        <img id="cart" class="cart" src=${
          item.icon
        } alt="picture of shopping cart"  width="30" height="30" />
        <p>${item.title}</p>
        <p>$${item.price.toFixed(2)}</p>
      </div>`;
    } else {
      // display this list when item is out of stock
      newListItem.innerHTML = `
      <div class="product no-stock" id=${key}>
        <p class="no-stock-text">Out of Stock</p>
        <img src=${item.url} alt="picture of ${item.title}" />
        <img id="cart" class="cart"  src=${
          item.icon
        } alt="picture of shopping cart"  width="30" height="30" >
        <p>${item.title}</p>
        <p>$${item.price.toFixed(2)}</p>
      </div>`;
    }
    // Appended new li into the ul tag
    productsContainer.appendChild(newListItem);
  }
};

// ADDING PRODUCT TO CART AND REMOVE THAT PRODUCT FROM INVENTORY
productsContainer.addEventListener("click", (e) => {
  // if targeting element id is equal to cart then do something
  if (e.target.id === "cart") {
    addToCart(e.target.parentElement.id);
  }
});

const addToCart = (key) => {
  const productsInventoryRef = ref(database, `productsInventory/${key}`);
  const cartItemRef = ref(database, `/cart/${key}`);

  // retrieving selected node from productsInventory list in firebase
  get(productsInventoryRef).then((snapshot) => {
    const productItem = snapshot.val();
    if (productItem.stock > 0) {
      get(cartRef).then((snapshot) => {
        const cartSnapshot = snapshot.val();
        if (cartSnapshot) {
          // checking if item already exist in the cart then update both product and cart
          if (cartSnapshot[key]) {
            productItem.stock--;
            update(productsInventoryRef, productItem);
            update(cartItemRef, {
              quantityInCart: cartSnapshot[key].quantityInCart + 1,
            });
          } else {
            // if item not exist in the cart then add new item in cart and also update the productsInventory
            productItem.stock--;
            update(productsInventoryRef, productItem);
            const cartItem = {
              title: productItem.title,
              url: productItem.url,
              price: productItem.price,
              quantityInCart: 1,
            };
            set(cartItemRef, cartItem);
          }
        } else {
          // cart is empty then add new item in cart and also update the productsInventory
          productItem.stock--;
          update(productsInventoryRef, productItem);
          const cartItem = {
            title: productItem.title,
            url: productItem.url,
            price: productItem.price,
            quantityInCart: 1,
          };
          set(cartItemRef, cartItem);
        }
      });
    }
  });
};

const shoppingCartIcon = document.querySelector(".shopping-bag img");
const shoppingCartItems = document.querySelector(".cart-design-container");

shoppingCartIcon.addEventListener("click", (e) => {
  if (
    shoppingCartItems.style.display == "" ||
    shoppingCartItems.style.display == "none"
  ) {
    shoppingCartItems.style.display = "block";
  } else {
    shoppingCartItems.style.display = "none";
  }
});

const cartInfoUlElement = document.querySelector(".cart-info");
const checkoutPriceInfoElement = document.querySelector(".checkout-price-info");
const cartButtons = document.querySelector(".cart-buttons");
const cartHeading = document.querySelector(".cart-heading");

onValue(cartRef, (snapshot) => {
  const cartItems = snapshot.val();
  if (cartItems) {
    cartHeading.innerHTML = `Your cart`;
    displayTotalSize(cartItems);
    displayCartItems(cartItems);
    displayTaxInfo(cartItems);
  } else {
    cartHeading.innerHTML = `🙁 Your cart is empty 🙁`;
    cartButtons.innerHTML = "";
    checkoutPriceInfoElement.innerHTML = "";
  }
});

// showing the total length of items
const totalItems = document.querySelector("#total-items");
const displayTotalSize = (cartItems) => {
  let totalItemsInCart = 0;
  for (let key in cartItems) {
    totalItemsInCart += cartItems[key].quantityInCart;
  }
  if (cartItems) {
    // assigning the total length of items to span tag
    totalItems.innerHTML = totalItemsInCart;
  } else {
    // when no items in cart, assign zero to span tag
    totalItems.innerHTML = 0;
  }
};

const displayCartItems = (cartInventory) => {
  cartInfoUlElement.innerHTML = "";
  checkoutPriceInfoElement.innerHTML = "";

  let subTotal = 0;
  // looping through currentStocks array and passing item to a call back function
  for (let key in cartInventory) {
    const cartItem = cartInventory[key];
    // creating a new li
    const newCartListItem = document.createElement("li");
    // adding classes to li
    newCartListItem.classList.add("product-info");
    newCartListItem.id = key;
    // populating the li with the right div, img, and p tags.
    // checking the condition if stock is available then show the add to icon to page with other elements
    newCartListItem.innerHTML = `
    <img src=${cartItem.url} alt="picture of ${cartItem.title}" />
    <div class = "product-name">
      <p>${cartItem.title}</p>
      <div class="number" id=${key}>
        <span class="minus">-</span>
        <input type="text" value="${cartItem.quantityInCart}" disabled/>
        <span class="plus">+</span>
      </div>
      <p>$${(cartItem.price * cartItem.quantityInCart).toFixed(2)}</p>
    </div>
    <i>&#x2715</i>
    `;
    subTotal += cartItem.price * cartItem.quantityInCart;
    cartInfoUlElement.appendChild(newCartListItem);
  }

  const tax = Number((subTotal * 0.13).toFixed(2));
  const totalPrice = Number((subTotal + tax).toFixed(2));

  const subTotalDiv = document.createElement("div");
  subTotalDiv.classList.add("sub-total");
  subTotalDiv.innerHTML = `
  <p>Sub Total</p>
  <p>$${subTotal.toFixed(2)}</p>
  `;

  const taxTotalDiv = document.createElement("div");
  taxTotalDiv.classList.add("tax-total");
  taxTotalDiv.innerHTML = `
  <p>Tax</p>
  <p>$${tax}</p>
  `;

  const priceTotalDiv = document.createElement("div");
  priceTotalDiv.classList.add("price-total");
  priceTotalDiv.innerHTML = `
  <p>Total Price</p>
  <p>$${totalPrice}</p>
  `;

  checkoutPriceInfoElement.append(subTotalDiv, taxTotalDiv, priceTotalDiv);
  cartButtons.innerHTML = `
      <button>Cart</button>
      <button>Checkout</button>
  `;
};

const cartInfoElement = document.querySelector(".cart-info");
cartInfoElement.addEventListener("click", (e) => {
  const key = e.target.parentElement.id;
  const cartItemRef = ref(database, `/cart/${key}`);
  get(cartItemRef).then((snapshot) => {
    const cartItemSnapshot = snapshot.val();
    if (cartItemSnapshot) {
      if (e.target.className === "plus") {
        if (cartItemSnapshot.quantityInCart < 10) {
          addToCart(key);
        } else {
          alert(`No more quantity left for ${cartItemSnapshot.title} `);
        }
      }
      if (e.target.className === "minus") {
        minusFromCart(key);
      }
      if (e.target.tagName === "I") {
        removeProductFromCart(key);
        alert("Removed item from cart");
      }
    }
  });
});

const removeProductFromCart = (key) => {
  const cartItemRef = ref(database, `/cart/${key}`);
  remove(cartItemRef);
  document.querySelector(`#${key}`).innerHTML = "";
};

const minusFromCart = (key) => {
  const cartItemRef = ref(database, `/cart/${key}`);
  const productItemRef = ref(database, `/productsInventory/${key}`);
  get(productItemRef).then((snapshot) => {
    const productItemSnapshot = snapshot.val();
    get(cartItemRef).then((snapshot) => {
      const cartItemSnapshot = snapshot.val();
      if (cartItemSnapshot) {
        if (cartItemSnapshot.quantityInCart > 1) {
          cartItemSnapshot.quantityInCart--;
          update(cartItemRef, cartItemSnapshot);
          productItemSnapshot.stock++;
          update(productItemRef, productItemSnapshot);
        } else {
          productItemSnapshot.stock++;
          update(productItemRef, productItemSnapshot);
          remove(cartItemRef);
          document.querySelector(`#${key}`).innerHTML = "";
          alert("Removed item from cart");
        }
      }
    });
  });
};
