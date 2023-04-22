import app from "./firebase.js";
import {
  getDatabase,
  ref,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

const database = getDatabase(app);

export const removeProductFromCart = (key) => {
  const cartItemRef = ref(database, `/cart/${key}`);
  const productsInventoryRef = ref(database, `/productsInventory/${key}`);
  get(productsInventoryRef).then((snapshot) => {
    const productSnapshot = snapshot.val();
    get(cartItemRef).then((snapshot) => {
      const cartItemSnapshot = snapshot.val();
      productSnapshot.stock += cartItemSnapshot.quantityInCart;
      update(productsInventoryRef, productSnapshot);
      remove(cartItemRef);
    });
  });
};

export const minusFromCart = (key) => {
  const cartItemRef = ref(database, `/cart/${key}`);
  const productItemRef = ref(database, `/productsInventory/${key}`);
  get(productItemRef).then((snapshot) => {
    const productItemSnapshot = snapshot.val();
    get(cartItemRef).then((snapshot) => {
      const cartItemSnapshot = snapshot.val();
      if (cartItemSnapshot) {
        if (cartItemSnapshot.quantityInCart > 1) {
          productItemSnapshot.stock++;
          update(productItemRef, productItemSnapshot);
          cartItemSnapshot.quantityInCart--;
          update(cartItemRef, cartItemSnapshot);
        } else {
          productItemSnapshot.stock++;
          update(productItemRef, productItemSnapshot);
          remove(cartItemRef);
          alert("Removed item from cart");
        }
      }
    });
  });
};
