import { ADD_CART, DEL_CART, VACIAR_CARRITO } from "../action/index";

const cart = [];

const handleCart = (state = cart, action) => {
  const producto = action.payload;
  switch (action.type) {
    case ADD_CART:
      const existe = state.find((x) => x.id === producto.id);
      if (existe) {
        return state.map((x) => (x.id === producto.id ? { ...x, cantidad: x.cantidad + 1 } : x));
      } else {
        return [...state, { ...producto, cantidad: 1 }];
      }

      case DEL_CART:
        if (action.reduceQuantity && action.payload.cantidad > 1) {
          return state.map((item) =>
            item.id === action.payload.id ? { ...item, cantidad: item.cantidad - 1 } : item
          );
        } else {
          return state.filter((item) => item.id !== action.payload.id);
        }
      

    case VACIAR_CARRITO:
      return [];

    default:
      return state;
  }
};

export default handleCart;
