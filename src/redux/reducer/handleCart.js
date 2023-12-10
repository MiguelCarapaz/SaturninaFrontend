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
      const existe2 = state.find((x) => x.id === producto.id);

      if (existe2) {
        console.log('El artículo existe. Actualizando cantidad o eliminando del carrito.');
        return existe2.cantidad > 1
          ? state.map((x) => (x.id === producto.id ? { ...x, cantidad: x.cantidad - 1 } : x))
          : state.filter((x) => x.id !== producto.id);
      } else {
        console.log('El artículo no existe. No se requiere ninguna acción.');
        return state;
      }

    case VACIAR_CARRITO:
      console.log('Vaciando el carrito.');
      return [];

    default:
      return state;
  }
};

export default handleCart;
