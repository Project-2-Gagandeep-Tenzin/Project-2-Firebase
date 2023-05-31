// Toggle Menu
const hamburger = document.querySelector(".hamburger");
const navMenuBar = document.querySelector(".nav");
const shoppingBag = document.querySelector(".shopping-bag");

const shoppingCartIcon = document.querySelector(".shopping-bag img");
const shoppingCartItems = document.querySelector(".cart-design-container");

export const toggleMenu = hamburger.addEventListener("click", () => {
    navMenuBar.classList.toggle("nav-sm");
    shoppingBag.classList.toggle("nav-sm");
});

// Toggle Cart Widget
export const toggleCart = shoppingCartIcon.addEventListener("click", () => {
    if (
        shoppingCartItems.style.display == "" ||
        shoppingCartItems.style.display == "none"
    ) {
        shoppingCartItems.style.display = "block";
    } else {
        shoppingCartItems.style.display = "none";
    }
});
