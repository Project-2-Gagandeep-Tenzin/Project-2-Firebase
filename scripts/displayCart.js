export const cartHeading = document.querySelector(".cart-heading");
export const cartInfoUlElement = document.querySelector(".cart-info");
export const checkoutPriceInfoElement = document.querySelector(
  ".checkout-price-info"
);
export const cartButtons = document.querySelector(".cart-buttons");

// showing the total length of items
export const totalItems = document.querySelector("#total-items");
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

export const displayCartItems = (cartInventory) => {
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
