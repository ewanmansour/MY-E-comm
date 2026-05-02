import { useCallback, useEffect, useState } from "react";
import { products as fallbackProducts } from "../assets/assets";
import { createOrder, fetchOrders, fetchProducts, loginUser, signupUser } from "../lib/api";
import { ShopContext } from "./ShopContextValue";

const readStorage = (key, fallbackValue) => {
    try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : fallbackValue;
    } catch {
        localStorage.removeItem(key);
        return fallbackValue;
    }
};

const ShopContextProvider = (props) => {

    const currency = '$';
    const delivery_fee = 10;

    const [products, setProducts] = useState(fallbackProducts);
    const [productsError, setProductsError] = useState('');
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState(() => readStorage('cartItems', {}));
    const [orders, setOrders] = useState([]);
    const [auth, setAuth] = useState(() => readStorage('auth', { user: null, token: '' }));

    const refreshProducts = useCallback(async () => {
        setLoadingProducts(true);

        try {
            const apiProducts = await fetchProducts();
            setProducts(apiProducts);
            setProductsError('');
        } catch (error) {
            setProducts(fallbackProducts);
            setProductsError(error.message);
        } finally {
            setLoadingProducts(false);
        }
    }, []);

    const addToCart = (itemId, size) => {
        if (!size) return false;

        setCartItems((current) => {
            const cartCopy = { ...current };
            cartCopy[itemId] = { ...(cartCopy[itemId] || {}) };
            cartCopy[itemId][size] = (cartCopy[itemId][size] || 0) + 1;
            return cartCopy;
        });

        return true;
    };

    const updateQuantity = (itemId, size, quantity) => {
        setCartItems((current) => {
            const cartCopy = { ...current };
            const nextQuantity = Number(quantity);

            if (!cartCopy[itemId]) return cartCopy;

            if (nextQuantity <= 0) {
                delete cartCopy[itemId][size];
            } else {
                cartCopy[itemId][size] = nextQuantity;
            }

            if (Object.keys(cartCopy[itemId]).length === 0) {
                delete cartCopy[itemId];
            }

            return cartCopy;
        });
    };

    const getCartCount = () => {
        let totalCount = 0;

        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                totalCount += cartItems[itemId][size];
            }
        }

        return totalCount;
    };

    const getCartAmount = () => {
        let totalAmount = 0;

        for (const itemId in cartItems) {
            const product = products.find((item) => item._id === itemId || String(item.id) === itemId);
            if (!product) continue;

            for (const size in cartItems[itemId]) {
                totalAmount += product.price * cartItems[itemId][size];
            }
        }

        return totalAmount;
    };

    const clearCart = () => {
        setCartItems({});
    };

    const loadOrders = useCallback(async (authToken = auth.token) => {
        if (!authToken) {
            setOrders([]);
            return [];
        }

        const apiOrders = await fetchOrders(authToken);
        setOrders(apiOrders);
        return apiOrders;
    }, [auth.token]);

    const placeOrder = async (deliveryInfo, paymentMethod) => {
        const items = [];

        for (const itemId in cartItems) {
            const product = products.find((item) => item._id === itemId || String(item.id) === itemId);
            if (!product) continue;

            for (const size in cartItems[itemId]) {
                items.push({
                    productId: itemId,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    size,
                    quantity: cartItems[itemId][size],
                });
            }
        }

        const order = await createOrder({
            deliveryInfo,
            paymentMethod,
            items,
        }, auth.token);

        setOrders((current) => [order, ...current]);
        clearCart();
        refreshProducts();
        return order;
    };

    const signup = async (payload) => {
        const nextAuth = await signupUser(payload);
        setAuth(nextAuth);
        await loadOrders(nextAuth.token);
        return nextAuth;
    };

    const login = async (payload) => {
        const nextAuth = await loginUser(payload);
        setAuth(nextAuth);
        await loadOrders(nextAuth.token);
        return nextAuth;
    };

    const logout = () => {
        setAuth({ user: null, token: '' });
        setOrders([]);
    };

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (auth.user && auth.token) {
            localStorage.setItem('auth', JSON.stringify(auth));
        } else {
            localStorage.removeItem('auth');
        }
    }, [auth]);

    useEffect(() => {
        if (auth.token) {
            loadOrders(auth.token).catch(() => setOrders([]));
        }
    }, [auth.token, loadOrders]);

    const value = {
        products,
        productsError,
        loadingProducts,
        refreshProducts,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        addToCart,
        updateQuantity,
        getCartCount,
        getCartAmount,
        placeOrder,
        orders,
        loadOrders,
        user: auth.user,
        token: auth.token,
        signup,
        login,
        logout
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )

}

export default ShopContextProvider;
