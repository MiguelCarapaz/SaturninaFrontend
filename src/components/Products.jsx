import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("category:todos");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let componentMounted = true;

    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
        const productsResult = await productsResponse.json();
        if (componentMounted) {
          setData(productsResult.detail);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }

      try {
        const categoriesResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          if (componentMounted) {
            setCategories([
              { id: "category:todos", name: "Todos" },
              ...categoriesData.detail,
            ]);
          }
        } else {
          console.error("Error fetching categories:", categoriesResponse.status);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }

      setLoading(false);
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

    const filteredProducts = data.filter(
      (product) =>
        (currentCategory === "category:todos" || product.category === currentCategory) &&
        (searchInput === "" ||
          product.name.toLowerCase().includes(searchInput.toLowerCase()))
    );

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
            <ShowProductDetails key={product.id} product={product} />
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
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

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

    return (
      <div id={product.id} key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
        <div className="card text-center h-100" style={productCardStyle}>
          <img
            className="card-img-top p-3"
            src={product.imagen.secure_url}
            alt={product.name}
            style={imageStyle}
          />
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
          <Link
            to={"/product/" + product.id}
            className="btn btn-dark m-2"
            style={titleStyle}
          >
            Ver
          </Link>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="container"
        style={{ backgroundColor: "rgba(218, 184, 215, 0.2)", maxWidth: "10000px" }}
      >
        <div className="row">
          <div className="col-12">
            <h2 className="display-5 text-center">PRODUCTOS</h2>
            <hr />
          </div>
        </div>

        <div className="row justify-content-center">
          {loading ? <Loading /> : <ShowProducts />}
        </div>
      </div>
    </>
  );
};

export default Products;
