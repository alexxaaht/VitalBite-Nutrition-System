import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('nutri_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('nutri_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (dish) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === dish.id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevItems, { ...dish, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (dishId) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === dishId);

            if (existingItem.quantity === 1) {
                return prevItems.filter((item) => item.id !== dishId);
            } else {
                return prevItems.map((item) =>
                    item.id === dishId ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
        });
    };

    const clearCart = () => setCartItems([]);

    const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCalories = cartItems.reduce((sum, item) => sum + (item.calories * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            clearCart,
            cartCount,
            cartTotal,
            cartCalories
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);