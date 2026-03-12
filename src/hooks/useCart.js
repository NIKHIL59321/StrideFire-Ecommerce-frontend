import { useContext } from "react";
import CartContext from "../context/cartContext";

const useCart=()=>{
    return useContext(CartContext)
}

export default useCart;