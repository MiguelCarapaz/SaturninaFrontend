export const ADD_CART = "cart/add";
export const DEL_CART = "cart/remove";
export const VACIAR_CARRITO = "cart/clear";

export const agregarAlCarrito = (producto) => ({
  type: ADD_CART,
  payload: producto,
});

export const eliminarDelCarrito = (producto) => ({
  type: DEL_CART,
  payload: producto,
});

export const vaciarCarrito = () => ({
  type: VACIAR_CARRITO,
});