import { toggleMenu } from "./toggleMenu.js";
import app from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
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
  // productsInventory.forEach((item, index) => {
  for (let key in productsInventory) {
    const item = productsInventory[key];
    // creating a new li
    const newListItem = document.createElement("li");
    // adding classes to li
    newListItem.classList.add("products-list", "hvr-float");
    // populating the li with the right div, img, and p tags.
    // checking the condition if stock is available then show the add to icon to page with other elements
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
      // if no stock then create new p element and add text out of stock and also hide add to cart icon
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
    // adding our new li into the ul tag
    productsContainer.appendChild(newListItem);
  }
  // });
  // }
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

const addToCart = (key) => {
  // pointing to particular node in list of productsInventory [0 || 1 || 2 || ...] based on selected parent element
  const productsInventoryRef = ref(
    database,
    `productsInventory/${key}` // like  productsInventory/0
  );

  // retrieving selected node from productsInventory list in firebase
  get(productsInventoryRef).then((snapshot) => {
    const productItem = snapshot.val();
    // pointing to hhe speciifc item of the cart
    const cartItemRef = ref(database, `/cart/${key}`);

    // checking condition if stock is greater than 0
    if (productItem.stock > 0) {
      // getting the specific item from the cart
      get(cartRef).then((snapshot) => {
        const cartSnapshot = snapshot.val();
        // checking if cartSnapshot exist
        if (cartSnapshot) {
          // checking if item already exist in the cart then update both product and cart
          if (cartSnapshot[key]) {
            // updating the sepcific item of productsInventory
            productItem.stock--;
            update(productsInventoryRef, productItem);
            // updating the quantityInCart proerty of cart item
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

// SHOWING NO. OF ITEMS ON THE SHOPPING BAG
// selecting the span tag (id:total-items) where we need to display no. of cart items
const totalItems = document.querySelector("#total-items");
// calling onValue function that will populate no. of items in cart whenever items new items added
onValue(cartRef, (snapshot) => {
  // storing the snapshot object into cart items
  const cartItems = snapshot.val();
  let totalItemsInCart = 0;
  // calculating the no. of items using for in loop
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
});

const shoppingCartIcon = document.querySelector(".shopping-bag img");
const shoppingCartItems = document.querySelector(".cartDesignContainer");

shoppingCartIcon.addEventListener("click", (e) => {
  // shoppingCartItems.classList.toggle("cartDesignContainer");
  if (
    shoppingCartItems.style.display == "" ||
    shoppingCartItems.style.display == "none"
  ) {
    shoppingCartItems.style.display = "block";
  } else {
    shoppingCartItems.style.display = "none";
  }
});

const quantityMinus = document.querySelector(".minus");
const quantityPlus = document.querySelector(".plus");
const quantityNumber = document.querySelector(".number input");

// console.log(quantityNumber);
// quantityMinus.forEach (minusButton => {
//   minusButton.addEventListener('click', () => {
//     console.log(quantityNumber.value);
//     if (quantityNumber.value > 1 ) {
//       quantityNumber.value --;
//     } else {
//       //get rid of item from cart
//       console.log('item removed from cart');
//     }
//   });
// });

quantityMinus.addEventListener("click", () => {
  if (quantityNumber.value > 1) {
    quantityNumber.value--;
  } else {
    //get rid of item from cart
    console.log("item removed from cart");
  }
});

quantityPlus.addEventListener("click", () => {
  if (quantityNumber.value < 10 /*change this to be quantity in stock later*/) {
    quantityNumber.value++;
  } else {
    //get rid of item from cart
    console.log("No more quantity left");
  }
});
