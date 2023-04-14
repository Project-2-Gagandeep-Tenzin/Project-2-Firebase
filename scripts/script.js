import { toggleMenu } from "./toggleMenu.js";
import app from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
  onValue,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import { products } from "./data.js";

// Step 1: Set up our FIREBASE database. This includes initializing our database and our dbRef.
const database = getDatabase(app);
const dbRef = ref(database);

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

// creating a function that gets the data from firebase and add the the page
const displayItems = (currentStocks) => {
  // getting the ul which contains the product info
  const productsContainer = document.querySelector(".products-container");
  // emptying the ul 
  productsContainer.innerHTML = "";
  // looping through currentStocks array and passing item to a call back function
  currentStocks.forEach((item) => {
    // creating a new li
    const newListItem = document.createElement("li");
    // adding classes to li
    newListItem.classList.add("products-list", "hvr-float");
    // populating the li with the right div, img, and p tags.
    newListItem.innerHTML = `
    <div class="product">
    <img src=${item.url} alt="picture of ${item.title}" />
    <img class="cart" src=${item.icon} alt="picture of shopping cart"  width="30" height="30" />
    <p>${item.title}</p>
    <p>$${item.price}</p>
    </div>`;

    // adding our new li into the ul tag
    productsContainer.appendChild(newListItem);
  });
};
