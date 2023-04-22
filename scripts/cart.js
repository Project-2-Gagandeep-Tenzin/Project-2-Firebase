import app from "./firebase.js";
import {
  getDatabase,
  ref,
  get,
  update,
  set,
  remove,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const database = getDatabase(app);
export const cartRef = ref(database, "/cart");

// Selecting elements from page
export const cartInfoElement = document.querySelector(".cart-info");
const cartHeading = document.querySelector(".cart-heading");
const checkoutPriceInfoElement = document.querySelector(".checkout-price-info");
const cartButtons = document.querySelector(".cart-buttons");
const totalItems = document.querySelector("#total-items");

// adding items in cart
export const addToCart = (key) => {
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

// displaying the total size of items in cart
export const displayTotalSize = (cartItems) => {
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

// displaying the cart widget with list of items
export const displayCart = (cartInventory) => {
  cartHeading.innerHTML = `Your cart`;
  cartInfoElement.innerHTML = "";
  checkoutPriceInfoElement.innerHTML = "";

  let subTotal = 0;
  // looping through currentStocks array and passing item to a call back function
  for (let key in cartInventory) {
    const cartItem = cartInventory[key];
    // creating a new li
    const newCartListItem = document.createElement("li");
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
    // calculating the price of items
    subTotal += cartItem.price * cartItem.quantityInCart;
    cartInfoElement.appendChild(newCartListItem);
  }

  const tax = subTotal * 0.13;
  const totalPrice = subTotal + tax;

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
  <p>$${tax.toFixed(2)}</p>
  `;

  const priceTotalDiv = document.createElement("div");
  priceTotalDiv.classList.add("price-total");
  priceTotalDiv.innerHTML = `
  <p>Total Price</p>
  <p>$${totalPrice.toFixed(2)}</p>
  `;

  checkoutPriceInfoElement.append(subTotalDiv, taxTotalDiv, priceTotalDiv);
  cartButtons.innerHTML = `
      <button>Cart</button>
      <button>Checkout</button>
  `;
};

// when no item in cart then call empty cart
export const emptyCart = () => {
  cartHeading.innerHTML = `🙁 Your cart is empty 🙁`;
  cartInfoElement.innerHTML = "";
  checkoutPriceInfoElement.innerHTML = "";
  cartButtons.innerHTML = "";
};

// when click on del icon then removing the item total from cart and updating products inventory
export const removeProductFromCart = (key) => {
  const cartItemRef = ref(database, `/cart/${key}`);
  const productsInventoryRef = ref(database, `/productsInventory/${key}`);

  get(productsInventoryRef).then((snapshot) => {
    const productSnapshot = snapshot.val();
    get(cartItemRef).then((snapshot) => {
      const cartItemSnapshot = snapshot.val();
      productSnapshot.stock += cartItemSnapshot.quantityInCart;
      update(productsInventoryRef, productSnapshot);
      remove(cartItemRef);
    });
  });
};

// when click on minus btn then reduce the quantity of cart item and add the stock in product
export const updateItemFromCart = (key) => {
  const cartItemRef = ref(database, `/cart/${key}`);
  const productItemRef = ref(database, `/productsInventory/${key}`);

  get(productItemRef).then((snapshot) => {
    const productItemSnapshot = snapshot.val();
    get(cartItemRef).then((snapshot) => {
      const cartItemSnapshot = snapshot.val();
      if (cartItemSnapshot) {
        if (cartItemSnapshot.quantityInCart > 1) {
          productItemSnapshot.stock++;
          update(productItemRef, productItemSnapshot);
          cartItemSnapshot.quantityInCart--;
          update(cartItemRef, cartItemSnapshot);
        } else {
          productItemSnapshot.stock++;
          update(productItemRef, productItemSnapshot);
          remove(cartItemRef);
          alert("Removed item from cart");
        }
      }
    });
  });
};
