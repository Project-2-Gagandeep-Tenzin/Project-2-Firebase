export const productsContainer = document.querySelector(".products-container");

// Displayed list of products on a page
export const displayItems = (productsInventory) => {
  productsContainer.innerHTML = "";

  for (let key in productsInventory) {
    const item = productsInventory[key];
    // created new li element which contains specific product
    const newListItem = document.createElement("li");
    newListItem.classList.add("products-list", "hvr-float");
    // checked if product item exists in inventory
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
      // display this list when item is out of stock
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
    // Appended new li into the ul tag
    productsContainer.appendChild(newListItem);
  }
};
