import {createContext, useEffect, useState} from "react";
import {products} from "../assets/assets.js";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";

export const ShopContext = createContext()

const ShopContextProvider = (props) => {
    const currency = 'р'
    const delivery_fee = 10
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [inCart, setInCart] = useState(false)
    const [retOption, setRetOption] = useState(null)

    let [proceedBtn, setProceedBtn] = useState(false)
    const addToCart = async (itemId, retOption) => {
        if (!retOption) {
            toast.error('Пожалуйста, выберите вариант возможного возврата товара!')
            return
        } else {
            toast("Продукт добавлен в корзину!", {
                position: "top-center", // Позиция: по центру сверху
                autoClose: 2000, // Уведомление исчезает через 2 секунды
                style: { backgroundColor: "black", color: 'white' }, // Оранжевый цвет фона
            });
        }

        let cartData = structuredClone(cartItems) // create copy of cartItems array

        if (cartData[itemId]) {
            if (cartData[itemId][retOption]) { // если выбрано то добавляем один продукт в корзину
                cartData[itemId][retOption] += 1

                setProceedBtn(true)
            } else {
                cartData[itemId][retOption] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][retOption] = 1
        }

        setCartItems(cartData)
    }

    useEffect(() => {
        console.log(cartItems)
    }, [cartItems])

    const getCartCount = () => {
        let totalCount = 0
        for (const items in cartItems) {

            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item]

                    }


                }catch (err) {
                    toast.error('Не удалось добавить продукт в корзину %(', err.message)
                }

            }
        }
        return totalCount
    }
    useEffect(() => {

    }, [getCartCount()])

    const updateQuantity = async (itemId, retOption, quantity) => {

        let cartData = structuredClone(cartItems)

        cartData[itemId][retOption] = quantity // modified amount of products

        setCartItems(cartData)
    }

    function getCartAmount() { // getting overral amount of products in cart
        let totalAmount = 0
        for (const items in cartItems) { // getting on item
            let itemInfo = products.find((product) => {
                return product._id === items
            })
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) { // quantity of products in cart more than zero
                        // getting total fee sum of product
                        totalAmount += itemInfo.price * cartItems[items][item]

                    }
                }
                catch (error) {
                    toast.error('we unable to deduct total fee of products', error.message)
                }
            }
        }
        return totalAmount
    }
    const value = {
      cartItems, addToCart, inCart, setInCart, retOption, setRetOption,  currency,
        delivery_fee, products, showModal, setShowModal, getCartCount,
        updateQuantity, getCartAmount, proceedBtn, setProceedBtn, navigate
    }





    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}
export default ShopContextProvider