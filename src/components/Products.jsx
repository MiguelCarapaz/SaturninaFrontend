import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("category:todos");
  const [categories, setCategories] = useState([]);
  const [noProductsMessage, setNoProductsMessage] = useState(""); // Agregado

  useEffect(() => {
    let componentMounted = true;

    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
        if (!productsResponse.ok) {
          throw new Error(`Error fetching products: ${productsResponse.status}`);
        }
        const productsResult = await productsResponse.json();

        if (componentMounted) {
          setData(productsResult.detail);
          setNoProductsMessage(""); 
        }
      } catch (error) {
        console.error("Error fetching products:", error);

        if (error.message.includes("404") && error.message.includes("No existe ningún producto")) {
          setNoProductsMessage("No hay productos disponibles en este momento.");
        } else {
          setNoProductsMessage("Error al cargar los productos. Por favor, inténtalo de nuevo más tarde.");
        }
      }

      try {
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
        if (!categoriesResponse.ok) {
          throw new Error(`Error fetching categories: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories([
          { id: "category:todos", name: "Todos" },
          ...categoriesData.detail,
        ]);
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
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
      <>
        <div className="buttons text-center py-5">
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              {(index > 0 && index % 6 === 0) && <br />}
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
          {currentProducts.map((product) => (
            <ShowProductDetails key={product.id_producto} product={product} />
          ))}
        </div>

        <div className="pagination text-center">
          {Array.from({ length: Math.ceil(filteredProducts.length / 6) }).map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`btn btn-dark m-1 ${currentPage === index + 1 ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </>
    );
  };

  const ShowProductDetails = ({ product }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevClick = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? product.imagen.length - 1 : prevIndex - 1));
    };

    const handleNextClick = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex === product.imagen.length - 1 ? 0 : prevIndex + 1));
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

    const images = Array.isArray(product.imagen)
      ? (
        <div className="carousel">
          <img
            className="card-img-top p-3"
            src={product.imagen[currentImageIndex]?.secure_url}
            alt={`${product.name}-${currentImageIndex}`}
            style={imageStyle}
          />
          {product.imagen.length > 1 && (
            <div className="carousel-controls">
              <button className="btn btn-dark btn-sm" onClick={handlePrevClick}>
                {"<"}
              </button>
              <button className="btn btn-dark btn-sm" onClick={handleNextClick}>
                {">"}
              </button>
            </div>
          )}
        </div>
      )
      : (
        <img
          className="card-img-top p-3"
          src={Array.isArray(product.imagen) ? product.imagen[currentImageIndex]?.secure_url : null}
          alt={product.name}
          style={imageStyle}
        />
      );

    return (
      <div id={product.id_producto} key={product.id_producto} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
        <div className="card text-center h-100" style={productCardStyle}>
          {images}
          <div className="card-body">
            <h5 className="card-title" style={titleStyle}>
              {product.name.substring(0, 12)}...
            </h5>
            <p className="card-text" style={descriptionStyle}>
              {product.descripcion}
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item lead" style={centeredPriceStyle}>
              $ {product.precio}
            </li>
          </ul>
          <div className="card-body">
            <div className="buttons" style={buttonGroupStyle}>
              <Link
                to={`/product/${product.id}`}
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
    <div className="container py-5" style={{ backgroundColor: "rgba(218, 184, 215, 0.2)", maxWidth: "10000px" }}>
      <h1 className="text-center display-6" style={{ fontFamily: "Gotham, sans-serif" }}>
        Productos
      </h1>
      <hr />
      {loading ? <Loading /> : <ShowProducts />}
    </div>
  );
};

export default Products;
