const shoppingCartIcon = document.querySelector(".shopping-bag img");
const shoppingCartItems = document.querySelector(".cart-design-container");

export const toggleCart = shoppingCartIcon.addEventListener("click", (e) => {
  if (
    shoppingCartItems.style.display == "" ||
    shoppingCartItems.style.display == "none"
  ) {
    shoppingCartItems.style.display = "block";
  } else {
    shoppingCartItems.style.display = "none";
  }
});
