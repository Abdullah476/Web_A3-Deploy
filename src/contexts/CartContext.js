import React, { createContext, useState, useEffect, useContext } from "react";
import CartItem from "../components/CartItem";

//  create context
export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // cart state
  const [cart, setCart] = useState([]);
  // item amount state
  const [itemsQuantity, setItemsQuantity] = useState(0);
  // total cart price
  const [total, setTotal] = useState(0);

  // update cart price
  useEffect(() => {
    const total = cart.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.amount;
    }, 0);
    setTotal(total);
  });

  //update items quantity
  useEffect(() => {
    if (cart) {
      const quantity = cart.reduce((accumulator, currentItem) => {
        return accumulator + 1;
      }, 0);
      setItemsQuantity(quantity);
    }
  }, [cart]);

  // add to cart
  const addToCart = (product, id) => {
    const newItem = { ...product, amount: 1 };
    // check if the item is already in the cart
    const cartItem = cart.find((item) => {
      return item.id === id;
    });
    // if the item is already in the cart
    if (cartItem) {
      const newCart = [...cart].map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount + 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
    } else {
      setCart([...cart, newItem]);
    }
  };

  // remove from cart
  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => {
      return item.id !== id;
    });
    setCart(newCart);
  };

  // clear cart
  const clearCart = () => {
    setCart([]);
  };

  // increase quantity
  const increaseQuantity = (id) => {
    const cartItem = cart.find((item) => item.id === id);
    addToCart(cartItem, id);
  };

  // decrease quantity
  const decreaseQuantity = (id) => {
    const cartItem = cart.find((item) => item.id === id);
    if (cartItem) {
      const newCart = cart.map((item) => {
        if (item.id === id) {
          return { ...item, amount: cartItem.amount - 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
    }
    if (cartItem.amount < 2) {
      removeFromCart(id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        itemsQuantity,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
