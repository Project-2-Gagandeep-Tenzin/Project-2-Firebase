import {
    ref,
    get,
    onValue,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import {
    productsInventoryRef,
    productsContainer,
    displayItems,
} from "./products.js";

import {
    database,
    cartRef,
    addToCart,
    cartInfoElement,
    displayCart,
    displayTotalSize,
    emptyCart,
    updateItemFromCart,
    removeProductFromCart,
} from "./cart.js";

// using onvalue to display list of products on page and populate those on every change
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

// Showing the list of items on cart widget and populate those on every change
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
                    alert(
                        `No more quantity left for ${cartItemSnapshot.title} `
                    );
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

// Toggle Menu
const hamburger = document.querySelector(".hamburger");
const navMenuBar = document.querySelector(".nav");
const shoppingBag = document.querySelector(".shopping-bag");

const shoppingCartIcon = document.querySelector(".shopping-bag img");
const shoppingCartItems = document.querySelector(".cart-design-container");

shoppingCartIcon.addEventListener("click", () => {
    if (
        shoppingCartItems.style.display == "" ||
        shoppingCartItems.style.display == "none"
    ) {
        shoppingCartItems.style.display = "block";
    } else {
        shoppingCartItems.style.display = "none";
    }
});

hamburger.addEventListener("click", () => {
    navMenuBar.classList.toggle("nav-sm");
    shoppingBag.classList.toggle("nav-sm");
});

const navbar = document.querySelector("#navbar");

window.addEventListener("scroll", function () {
    let scrollTop = window.scrollY;

    if (scrollTop >= 40) {
        navbar.style.top = "0px";
        navbar.style.transitionDuration = "0.2s";
    } else {
        navbar.style.top = "40px";
        navbar.style.transitionDuration = "0.2s";
    }
});
