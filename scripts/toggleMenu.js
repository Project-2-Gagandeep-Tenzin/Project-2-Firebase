// Toggle Menu
const hamburger = document.querySelector(".hamburger");
const navMenuBar = document.querySelector(".nav");
const shoppingBag = document.querySelector(".shopping-bag");
const toggleMenu = hamburger.addEventListener("click", () => {
  navMenuBar.classList.toggle("nav-sm");
  shoppingBag.classList.toggle("nav-sm");
});
