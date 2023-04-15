import { toggleMenu } from "./toggleMenu.js";
import app from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
  push,
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
// calling a function, naming the key 'productsInventory' and passing list f products
addToDatabase("productsInventory", products);
// call onValue function that empty our ul and populate that data from firebase
onValue(dbRef, (snapshot) => {
  //store the snapshot value in a variable
  const ourSnapshot = snapshot.val();
  // getting the products list from our snapshot and storing in to productsInventory variable
  const productsInventory = ourSnapshot.productsInventory;
  // create a function that filters through the productInventory list and returns an array that matches our filter:
  const currentStocks = productsInventory.filter((item) => {
    // filtering items that have 0 stock or have no images
    return item.stock > 0 && item.url;
  });
  // calling the displayItems function and passing currentStocks.
  displayItems(currentStocks);
});

// getting the ul which contains the product info
const productsContainer = document.querySelector(".products-container");

// creating a function that gets the data from firebase and add the the page
const displayItems = (currentStocks) => {
  // emptying the ul
  productsContainer.innerHTML = "";
  // looping through currentStocks array and passing item to a call back function
  currentStocks.forEach((item, index) => {
    // creating a new li
    const newListItem = document.createElement("li");
    // adding classes to li
    newListItem.classList.add("products-list", "hvr-float");
    // populating the li with the right div, img, and p tags.
    newListItem.innerHTML = `
    <div class="product">
    <img src=${item.url} alt="picture of ${item.title}" />
    <img id="cart" class="cart" data-index="${index}" src=${item.icon} alt="picture of shopping cart"  width="30" height="30" />
    <p>${item.title}</p>
    <p>$${item.price}</p>
    </div>`;

    // adding our new li into the ul tag
    productsContainer.appendChild(newListItem);
  });
};

// ADDING PRODUCT TO CART AND REMOVE THAT PRODUCT INVENTORY BY 1

// binding an click event listener to a productsContainer (UL tag) and take advantage of bubbling to monitor for clicks on the className cart <img>
productsContainer.addEventListener("click", (e) => {
  // if targeting element id is equal to cart then do something
  if (e.target.id === "cart") {
    // getting the index of speciifc item of products array and storing it into new variable
    const itemIndex = e.target.getAttribute("data-index");
    // at method of array return the selected item when we pass its index
    let item = products.at(itemIndex);
    // storing the items into cart database
    push(cartRef, item);
    // setting the custom ref for the position of clicked item in an products inventory
    const productsInventoryRef = ref(
      database,
      `productsInventory/${itemIndex}` // like  productsInventory/0
    );
    //decreasing the number of stocks of the selected item
    item.stock--;
    // updating the stock of selected item
    update(productsInventoryRef, item);
  }
});

// SHOWING NO. OF ITEMS ON THE SHOPPING BAG
// selecting the span tag (id:total-items) where we need to display no. of cart items
const totalItems = document.querySelector("#total-items");
// calling onValue function that will populate no. of items in cart whenever items new items added
onValue(cartRef, (snapshot) => {
  // storing the snapshot object into cart items
  const cartItems = snapshot.val();
  // converting the object into an array and finding the length and assigning to span tag
  totalItems.innerHTML = Object.keys(cartItems).length;
});
