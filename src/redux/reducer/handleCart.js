import { ADD_CART, DEL_CART, VACIAR_CARRITO } from "../action/index";

const cart = [];

const handleCart = (state = cart, action) => {
  const producto = action.payload;
  switch (action.type) {
    case ADD_CART:
      const existe = state.find((x) => x.id === producto.id);
      if (existe) {
        console.log('El artículo ya existe. Actualizando cantidad.');
        return state.map((x) => (x.id === producto.id ? { ...x, cantidad: x.cantidad + 1 } : x));
      } else {
        console.log('El artículo no existe. Agregando al carrito.');
        return [...state, { ...producto, cantidad: 1 }];
      }

      case DEL_CART:
        if (action.reduceQuantity && action.payload.cantidad > 1) {
          console.log('El artículo existe. Reduciendo cantidad.');
          return state.map((item) =>
            item.id === action.payload.id ? { ...item, cantidad: item.cantidad - 1 } : item
          );
        } else {
          console.log('El artículo existe. Eliminando producto del carrito.');
          return state.filter((item) => item.id !== action.payload.id);
        }
      

    case VACIAR_CARRITO:
      console.log('Vaciando el carrito.');
      return [];

    default:
      return state;
  }
};

export default handleCart;
