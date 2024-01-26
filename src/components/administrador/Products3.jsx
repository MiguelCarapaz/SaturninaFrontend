import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa6";
import { BsSliders2Vertical } from "react-icons/bs";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import * as actions from "../../redux/action/index";
import { TbPointFilled } from "react-icons/tb";
import Swal from 'sweetalert2';

const Products3 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("category:todos");
  const [appliedCategory, setAppliedCategory] = useState("Todos");
  const [selectedCategory, setSelectedCategory] = useState("category:todos");
  const [selectedOptions, setSelectedOptions] = useState({});
  const [sidebarCategories, setSidebarCategories] = useState([]);
  const [isSliderBarOpen, setIsSliderBarOpen] = useState(true);
  const dispatch = useDispatch();
  const [priceRange, setPriceRange] = useState([0, 999]);

  const navigate = useNavigate();

  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(1, prevPage - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const addProductToCart = (product) => {
    const { id, name, precio, tallas, colores } = product;
    const { size, color } = selectedOptions[id] || {};
    const hasTallas = Array.isArray(tallas) && tallas.length > 0;
    const hasColores = Array.isArray(colores) && colores.length > 0;

    if (
      (!hasTallas || (hasTallas && size)) &&
      (!hasColores || (hasColores && color))
    ) {
      dispatch(
        actions.agregarAlCarrito({
          ...product,
          id_producto: id,
          nombre_producto: name,
          talla: hasTallas ? size : "", 
          color: hasColores ? color : "", 
        })
      );
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona talla y/o color antes de añadir al carrito.',
      });
    }
  };

  const handleDelete = async (productId) => {
    const isConfirmed = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo",
    });

    if (!isConfirmed.value) {
      return;
    }

    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${productId}`,  {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        setData((prevData) => prevData.filter((product) => product.id !== productId));
        console.log(`Producto con ID ${productId} eliminado con éxito.`);

        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          text: 'El producto ha sido eliminado con éxito.',
        });
      } else {
        const errorData = await response.json();
        console.error(`Error al eliminar el producto con ID ${productId}: ${errorData.message}`);

        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar el producto',
          text: errorData.message || 'El producto tiene pedidos pendientes.',
        });
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);

      Swal.fire({
        icon: 'error',
        title: 'Error en la solicitud de eliminación',
        text: 'Hubo un error en la solicitud para eliminar el producto.',
      });
    }
  };

  const handleUpdate = (productId) => {
    console.log(`Actualizar producto con ID: ${productId}`);
    navigate(`/admin/actualizar-producto/${productId}`);
  };


  useEffect(() => {
    let componentMounted = true;

    const fetchData = async () => {
      try {
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setSidebarCategories([
            { id: "category:todos", name: "Todos" },
            ...categoriesData.detail,
          ]);
        } else {
          console.error("Error fetching categories:", categoriesResponse.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      try {
        const productsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
        const productsResult = await productsResponse.json();

        if (componentMounted) {
          if (productsResult.detail) {
            setData(productsResult.detail);
          } else {
            console.error("No hay productos disponibles.");
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      if (componentMounted) {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      componentMounted = false;
    };
  }, []);

  const filterProduct = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);

    // Actualiza el estado appliedCategory con el nombre de la categoría seleccionada
    const categoryName = categoryId === "category:todos" ? "Todos" : getCategoryName(categoryId);
    setAppliedCategory(categoryName);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getCategoryName = (categoryId) => {
    const category = sidebarCategories.find((category) => category.id === categoryId);
    return category ? category.name : "";
  };


  const ShowProducts = () => {
    const [searchInput, setSearchInput] = useState("");

    const filteredProducts = Array.isArray(data)
      ? data.filter(
          (product) =>
            (currentCategory === "category:todos" || product.category === currentCategory) &&
            (searchInput === "" || product.name.toLowerCase().includes(searchInput.toLowerCase()))
        )
      : [];

    const indexOfLastProduct = currentPage * 6;
    const indexOfFirstProduct = indexOfLastProduct - 6;
    const currentProducts = filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );

    const SliderBarContent = (
      <div className={`slider-bar ${isSliderBarOpen ? 'd-block' : 'd-none'}`} style={{ maxWidth: '270px', width: '100%'}}>
        <div className="mb-2 d-flex align-items-center">
          <span style={{ marginLeft:'30px', fontWeight: 'bold' }}>{truncateText('Home', 14)}</span>
          <FaChevronRight  style={{ marginLeft: '5px', marginRight: '5px', fontSize: '18px' }} />
          <span>{truncateText(appliedCategory, 14)}</span>
        </div>
        <div className="card" style={{ margin: '20px', borderRadius: '20px' }}>
          <div className="card-body">
            <b>
              <p className="mb-3">Filtros</p>
            </b>
            <BsSliders2Vertical
              className="icon-inside-card"
              onClick={() => setIsSliderBarOpen(!isSliderBarOpen)}
              size={20}
              style={{
                marginLeft: 'auto',
                marginRight: '10px',
                marginTop: '-35px',
                cursor: 'pointer',
              }}
            />
            <hr className="my-2" style={{ border: '1px solid black' }} />
            {sidebarCategories.map((category) => (
              <div
                key={category.id}
                className={`mb-2 d-flex align-items-center`}
                style={{
                  cursor: 'pointer',
                  borderRadius: '5px',
                }}
              >
                <p
                  className={`mb-0`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedCategory(category.id);
                  }}
                  style={{
                    flex: 1,
                    whiteSpace: 'pre-line', 
                    fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                    opacity: selectedCategory === category.id ? 1 : 0.7,
                  }}
                >
                  {truncateText(category.name, 14)}
                </p>
                <FaChevronRight  style={{ marginLeft: '50px',fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                    opacity: selectedCategory === category.id ? 1 : 0.7, }} />
              </div>
            ))}
            <hr className="my-2" style={{ border: '1px solid black' }} />
            <button
              className="btn btn-dark mt-3 w-100"
              style={{
                backgroundColor: "black",
                color: "white",
                borderRadius: "20px",
              }}
              onClick={() => {
                filterProduct(selectedCategory);
              }}
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      </div>
    );
    


  const SliderIcon = (
    <div
      className={`ml-5 icon-container`}
      style={{ display: isSliderBarOpen ? 'none' : 'block' }}
    >
      <BsSliders2Vertical
        className="icon"
        onClick={() => setIsSliderBarOpen(!isSliderBarOpen)}
        size={20}
        style={{ marginRight:'10px', marginTop:'55px' }}
      />
    </div>
  );
  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row">
        <div className="ml-md-5 mb-4">
          {SliderIcon}
        </div>
        <div className={`ml-2 ${isSliderBarOpen ? 'd-lg-block' : 'd-none'}`}>
          {SliderBarContent}
        </div>
        <div className="flex-grow-1">
          <div className="text-center py-2 d-flex align-items-center">
            <input
              type="text"
              placeholder="Buscar productos 🔍"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="row">
            {currentProducts.map((product, index) => (
               <ShowProductDetails
               key={index}
               product={product}
               selectedOptions={selectedOptions}
               setSelectedOptions={setSelectedOptions}
               addProductToCart={() => addProductToCart(product)}
               handleDelete={() => handleDelete(product.id)}
               handleUpdate={() => handleUpdate(product.id)}
             />
            ))}
          </div>
          <div className="pagination text-center">
          <button className="btn btn-white m-1" onClick={handlePrevPage} style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(0, 0, 0, 0.5)'   }}>
          <BsArrowLeft style={{ marginRight: '5px' }} /> Retroceder
         </button>
         <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
  {Array.from({ length: Math.ceil(filteredProducts.length / 6) }).map(
    (_, index) => (
      <button
        key={index}
        onClick={() => paginate(index + 1)}
        className={`btn btn-white m-1 ${
          currentPage === index + 1 ? "active" : ""
        }`}
        style={{
          backgroundColor: currentPage === index + 1 ? 'rgba(169, 169, 169, 0.3)' : 'white',
          boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        {index + 1}
      </button>
    )
  )}
      </div>
        <button className="btn btn-white m-1" onClick={handleNextPage} style={{ display: 'flex', alignItems: 'center', marginLeft: '10px', border: '1px solid rgba(0, 0, 0, 0.5)' }}>
        Avanzar <BsArrowRight style={{ marginLeft: '5px' }} />
      </button>
      </div>

        </div>
      </div>
      {loading ? <p>Cargando...</p> : null}
    </div>
  );
};

const ShowProductDetails = ({ product, selectedOptions, setSelectedOptions, addProductToCart, handleDelete, handleUpdate }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.imagen.length - 1 : prevIndex - 1
    );
  };
  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.imagen.length - 1 ? 0 : prevIndex + 1
    );
  };
  const handleDragStart = (e) => {
    e.preventDefault();
    setDragStartX(e.clientX || e.touches[0].clientX);
  };

  const handleDragMove = (e) => {
    e.preventDefault();
    if (dragStartX !== null) {
      const currentX = e.clientX || e.touches[0].clientX;
      const deltaX = currentX - dragStartX;

      if (deltaX > 50) {
        // Swipe right
        handlePrevClick();
        setDragStartX(null);
      } else if (deltaX < -50) {
        // Swipe left
        handleNextClick();
        setDragStartX(null);
      }
    }
  };

  const handleDragEnd = () => {
    setDragStartX(null);
  };
   
  const images =
    Array.isArray(product.imagen) && product.imagen.length > 0 ? (
      <div className="carousel">
        <img
          className="card-img-top p-3"
          src={
            product.imagen[currentImageIndex]?.secure_url || "URL_POR_DEFECTO"
          }
          alt={`${product.name}-${currentImageIndex}`}
          style={{ height: "300px", borderRadius: "30px" }}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onDragStart={(e) => e.preventDefault()}
        />
        {product.imagen.length > 1 && (
          <div className="carousel-controls ">
            <div className="carousel-indicators">
              {product.imagen.map((image, index) => (
                <div
                  key={index}
                  className={`w-6 text-xl text-stone-700 ${
                    index === currentImageIndex ? "text-stone-200" : ""
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <TbPointFilled />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    ) : (
      <img
        className="card-img-top p-3"
        src={
          Array.isArray(product.imagen)
            ? product.imagen[currentImageIndex]?.secure_url || "URL_POR_DEFECTO"
            : null
        }
        alt={product.name}
        style={{ height: "300px" }}
      />
    );

  return (
    <div
      id={product.id_producto}
      key={product.id_producto}
      className="col-lg-4 col-md-6 col-sm-12 mb-4"
    >
      <div className="card h-100">
        {images}
        <div className="body">
          <b>
            <h5 className="card-title" style={{ color: 'black', marginLeft:'30px' }}>
              {product.name}
            </h5>
          </b>
        </div>
        <li className="list-group-item lead">
          <b style={{ color: 'black' , marginLeft:'30px'  }}>$ {product.precio}</b>
        </li>
        <li className="list-group-item">
          <div className="form-group">
          </div>
        </li>
        <div className="card-body">
  <div className="buttons d-flex flex-wrap justify-content-center align-items-center">
    <Link to={`/admin/product/${product.id}`} className="btn btn-dark m-2" style={{ fontFamily: "Gotham, sans-serif", fontSize: "1rem" }}>
      Ver
    </Link>
    <button className="btn btn-danger m-1" style={{ fontFamily: "Gotham, sans-serif", fontSize: "1rem" }} onClick={handleDelete}>
      Eliminar
    </button>
    <button className="btn btn-warning m-1" style={{ fontFamily: "Gotham, sans-serif", fontSize: "1rem" }} onClick={handleUpdate}>
      Actualizar
    </button>
  </div>
</div>

      </div>
    </div>
  );
};


return (
  <div className="container">
    {loading ? <p>Cargando...</p> : <ShowProducts />}
  </div>
);
};

export default Products3;
