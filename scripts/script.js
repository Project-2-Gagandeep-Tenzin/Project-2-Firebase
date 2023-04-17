import { toggleMenu } from "./toggleMenu.js";
import app from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  update,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { products } from "./data.js";

// Step 1: Set up our FIREBASE database. This includes initializing our database and our dbRef.
const database = getDatabase(app);
const dbRef = ref(database);

// If instead of the entire database (ie. the root of our database) we want to target a specific node in our database, we can call ref but pass it a second argument:
const cartRef = ref(database, "/cart");

// create a function to add our product data into firebase
const addToDatabase = (key, value) => {
  const customRef = ref(database, key);
  set(customRef, value);
};
// calling a function, naming the key 'productsInventory' and passing list of products
addToDatabase("productsInventory", products);
// call onValue function that empty our ul and populate that data from firebase
onValue(dbRef, (snapshot) => {
  //store the snapshot value in a variable
  const ourSnapshot = snapshot.val();
  // getting the products list from our snapshot and storing in to productsInventory variable
  const productsInventory = ourSnapshot.productsInventory;
  // calling the displayItems function and passing the products to display on page
  displayItems(productsInventory);
});

// getting the ul which contains the product info
const productsContainer = document.querySelector(".products-container");

// creating a function that gets the data from firebase and add the the page
const displayItems = (productsInventory) => {
  // emptying the ul
  productsContainer.innerHTML = "";
  // looping through currentStocks array and passing item to a call back function
  productsInventory.forEach((item, index) => {
    // creating a new li
    const newListItem = document.createElement("li");
    // adding classes to li
    newListItem.classList.add("products-list", "hvr-float");
    // populating the li with the right div, img, and p tags.
    // checking the condition if stock is available then show the add to icon to page with other elements
    if (item.stock > 0) {
      newListItem.innerHTML = `
    <div class="product" id=${index}>
      <img src=${item.url} alt="picture of ${item.title}" />
      <img id="cart" class="cart" src=${
        item.icon
      } alt="picture of shopping cart"  width="30" height="30" />
      <p>${item.title}</p>
      <p>$${item.price.toFixed(2)}</p>
    </div>`;
    } else {
      // if no stock then create new p element and add text out of stock and also hide add to cart icon
      newListItem.innerHTML = `
    <div class="product no-stock" id=${index}>
      <p class="no-stock-text">Out of Stock</p>
      <img src=${item.url} alt="picture of ${item.title}" />
      <img id="cart" class="cart"  src=${
        item.icon
      } alt="picture of shopping cart"  width="30" height="30" >
      <p>${item.title}</p>
      <p>$${item.price.toFixed(2)}</p>
    </div>`;
    }

    // adding our new li into the ul tag
    productsContainer.appendChild(newListItem);
  });
};

// ADDING PRODUCT TO CART AND REMOVE THAT PRODUCT FROM INVENTORY

// binding an click event listener to a productsContainer (UL tag) and take advantage of bubbling to monitor for clicks on the className cart <img>
productsContainer.addEventListener("click", (e) => {
  // if targeting element id is equal to cart then do something
  if (e.target.id === "cart") {
    // calling the addToCart fn and passes the parent element(div) with id as index(0 || 1 || 2 ...) of prodcutsInventory array)
    addToCart(e.target.parentElement.id);
  }
});

const addToCart = (productItemIndex) => {
  // pointing to particular node in list of productsInventory [0 || 1 || 2 || ...] based on selected parent element
  const productsInventoryRef = ref(
    database,
    `productsInventory/${productItemIndex}` // like  productsInventory/0
  );
  // retrieving selected node from productsInventory list in firebase
  get(productsInventoryRef).then((snapshot) => {
    const productItem = snapshot.val();
    // checking condition if stock is greater than 0
    if (productItem.stock > 0) {
      // push that speciifc item in to cart database
      push(cartRef, productItem);
      // updating the stock of that specific item
      productItem.stock--;
      // updating the sepcific item of productsInventory
      update(productsInventoryRef, productItem);
    }
  });
};

// SHOWING NO. OF ITEMS ON THE SHOPPING BAG
// selecting the span tag (id:total-items) where we need to display no. of cart items
const totalItems = document.querySelector("#total-items");
// calling onValue function that will populate no. of items in cart whenever items new items added
onValue(cartRef, (snapshot) => {
  // storing the snapshot object into cart items
  const cartItems = snapshot.val();
  if (cartItems) {
    // converting the object into an array and finding the length and assigning to span tag
    totalItems.innerHTML = Object.keys(cartItems).length;
  } else {
    totalItems.innerHTML = 0;
  }
});
