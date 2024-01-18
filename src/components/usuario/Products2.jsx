import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import * as actions from "../../redux/action/index";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";


const Products2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("category:todos");
  const [categories, setCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const dispatch = useDispatch();

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
  

  useEffect(() => {
    let componentMounted = true;
  
    const fetchData = async () => {
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
  
      try {
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
  
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories([
            { id: "category:todos", name: "Todos" },
            ...categoriesData.detail,
          ]);
        } else {
          console.error("Error fetching categories:", categoriesResponse.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
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

  const Loading = () => (
    <>
      <div className="col-12 py-5 text-center">
        <Skeleton height={40} width={560} />
      </div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
          <Skeleton height={592} />
        </div>
      ))}
    </>
  );

  const filterProduct = (categoryId) => {
    setCurrentCategory(categoryId);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
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

    return (
      <>
        <div className="buttons text-center py-5">
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              {index > 0 && index % 6 === 0 && <br />}
              <button
                className={`btn btn-outline-dark btn-sm m-2 ${
                  currentCategory === category.id ? "active" : ""
                }`}
                onClick={() => filterProduct(category.id)}
              >
                {category.name}
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="text-center py-2 d-flex justify-content-end">
          <input
            type="text"
            placeholder="Buscar productos 🔍"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
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
            />
          ))}
        </div>
        <div className="pagination text-center">
          {Array.from({ length: Math.ceil(filteredProducts.length / 6) }).map(
            (_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`btn btn-dark m-1 ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                {index + 1}
              </button>
            )
          )}
        </div>
      </>
    );
  };

  const ShowProductDetails = ({ product, selectedOptions, setSelectedOptions, addProductToCart }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleSizeChange = (e) => {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        [product.id]: {
          ...prevOptions[product.id],
          size: e.target.value,
        },
      }));
    };

    const handleColorChange = (e) => {
      setSelectedOptions((prevOptions) => ({
        ...prevOptions,
        [product.id]: {
          ...prevOptions[product.id],
          color: e.target.value,
        },
      }));
    };

    const productCardStyle = {
      fontFamily: "Gotham, sans-serif",
      fontSize: "0.9rem",
    };

    const imageStyle = {
      height: "300px",
    };

    const titleStyle = {
      fontFamily: "Gotham, sans-serif",
      fontSize: "1rem",
    };

    const descriptionStyle = {
      fontFamily: "Gotham, sans-serif",
      fontSize: "0.9rem",
      maxHeight: "3.6rem",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    };

    const centeredPriceStyle = {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    };

    const buttonGroupStyle = {
      justifyContent: "space-around",
    };

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

    const images = Array.isArray(product.imagen) && product.imagen.length > 0 ? (
      <div className="carousel">
        <img
          className="card-img-top p-3"
          src={product.imagen[currentImageIndex]?.secure_url || 'URL_POR_DEFECTO'}
          alt={`${product.name}-${currentImageIndex}`}
          style={imageStyle}
        />
        <div className="carousel-controls">
          <button
            className="btn btn-dark btn-sm"
            onClick={handlePrevClick}
          >
            {"<"}
          </button>
          <button
            className="btn btn-dark btn-sm"
            onClick={handleNextClick}
          >
            {">"}
          </button>
        </div>
      </div>
    ) : (
      <img
        className="card-img-top p-3"
        src={Array.isArray(product.imagen) ? product.imagen[currentImageIndex]?.secure_url || 'URL_POR_DEFECTO' : null}
        alt={product.name}
        style={imageStyle}
      />
    );

    return (
      <div
        id={product.id_producto}
        key={product.id_producto}
        className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4"
      >
        <div
          className="card text-center h-100"
          style={productCardStyle}
        >
          {images}
          <div className="card-body">
            <h5 className="card-title" style={titleStyle}>
              {product.name}
            </h5>
            <p className="card-text" style={descriptionStyle}>
              {product.descripcion}
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item lead" style={centeredPriceStyle}>
              $ {product.precio}
            </li>
            <li className="list-group-item">
              <div className="form-group">
                <label htmlFor={`selectSize${product.id_producto}`}>
                  Talla:
                </label>
                <select
                  className="form-control"
                  id={`selectSize${product.id_producto}`}
                  onChange={handleSizeChange}
                  value={selectedOptions[product.id]?.size || ""}
                >
                  <option key="" value="" disabled>
                    Selecciona una talla
                  </option>
                  {product.tallas &&
                    Array.isArray(product.tallas) &&
                    product.tallas.map((talla, index) => (
                      <option
                        key={`${talla.name}-${talla.status}`}
                        value={talla.name}
                      >
                        {talla.name}
                      </option>
                    ))}
                </select>
              </div>
            </li>
            <li className="list-group-item">
              <div className="form-group">
                <label htmlFor={`selectColor${product.id_producto}`}>
                  Color:
                </label>
                <select
                  className="form-control"
                  id={`selectColor${product.id_producto}`}
                  onChange={handleColorChange}
                  value={selectedOptions[product.id]?.color || ""}
                >
                  <option key="" value="" disabled>
                    Selecciona un color
                  </option>
                  {product.colores &&
                    Array.isArray(product.colores) &&
                    product.colores.map((color, index) => (
                      <option key={index} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                </select>
              </div>
            </li>
          </ul>
          <div className="card-body">
            <div className="buttons" style={buttonGroupStyle}>
              <button
                className="btn btn-dark m-1"
                style={titleStyle}
                onClick={() => addProductToCart(product)}
              >
                Añadir al carrito
              </button>
              <Link
                to={`/usuario/product2/${product.id}`}
                className="btn btn-outline-dark m-1"
                style={titleStyle}
              >
                Ver detalles
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ backgroundColor: "rgba(218, 184, 215, 0.2)", maxWidth: "10000px" }}>
      <h1 className="text-center display-6" style={{ fontFamily: "Gotham, sans-serif" }}>
        Productos
      </h1>
      <hr />
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default Products2;
