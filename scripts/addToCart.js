import app from "./firebase.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const database = getDatabase(app);
export const cartRef = ref(database, "/cart");

export const addToCart = (key) => {
  const productsInventoryRef = ref(database, `productsInventory/${key}`);
  const cartItemRef = ref(database, `/cart/${key}`);

  // retrieving selected node from productsInventory list in firebase
  get(productsInventoryRef).then((snapshot) => {
    const productItem = snapshot.val();
    if (productItem.stock > 0) {
      get(cartRef).then((snapshot) => {
        const cartSnapshot = snapshot.val();
        if (cartSnapshot) {
          // checking if item already exist in the cart then update both product and cart
          if (cartSnapshot[key]) {
            productItem.stock--;
            update(productsInventoryRef, productItem);
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
