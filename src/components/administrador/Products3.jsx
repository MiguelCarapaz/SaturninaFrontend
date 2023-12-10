import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useNavigate } from "react-router-dom";

const Products3 = () => {
  const navigate = useNavigate(); 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("category:todos");
  const [categories, setCategories] = useState([]);

  let componentMounted = true;
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products`);
        const result = await response.json();
        if (componentMounted) {
          setData(result.detail);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
        const result = await response.json();
        setCategories([
          { id: "category:todos", name: "Todos" },
          ...result.detail,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchProducts();
    fetchCategories();

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

  const handleDelete = async (productId) => {
    // Mostrar un mensaje de confirmación antes de eliminar el producto
    const isConfirmed = window.confirm("¿Estás seguro de que deseas eliminar este producto?");

    if (!isConfirmed) {
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
        // Eliminar el producto localmente después de que se haya eliminado con éxito en el servidor
        setData((prevData) => prevData.filter((product) => product.id !== productId));
        console.log(`Producto con ID ${productId} eliminado con éxito.`);
      } else {
        const errorData = await response.json();
        console.error(`Error al eliminar el producto con ID ${productId}: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error en la solicitud de eliminación:", error);
    }
  };

  const handleUpdate = (productId) => {
    console.log(`Actualizar producto con ID: ${productId}`);
    navigate(`/admin/actualizarproducto/${productId}`);
  };

  const ShowProducts = () => {
    const [searchInput, setSearchInput] = useState("");

    const filteredProducts = data.filter(
      (product) =>
        (currentCategory === "category:todos" ||
          product.category === currentCategory) &&
        (!searchInput || product.name.toLowerCase().includes(searchInput.toLowerCase()))
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

        <div className="row">
          <div className="col-md-6 col-sm-6 col-xs-12 col-12 py-2">
            <Link to="/admin/nuevoproducto" className="btn btn-success">
              Nuevo Producto
            </Link>
          </div>
          <div className="col-md-6 col-sm-6 col-xs-12 col-12 py-2 text-md-end">
            <input
              type="text"
              placeholder="Buscar productos 🔍"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
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

    const buttonGroupStyle = {
      justifyContent: "space-around",
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
          <div className="card-body">
            <div className="buttons" style={buttonGroupStyle}>
              <Link to={`/admin/product3/${product.id}`} className="btn btn-dark m-2" style={titleStyle}>
                Ver
              </Link>
              <button className="btn btn-danger m-1" style={titleStyle} onClick={() => handleDelete(product.id)}>
               Eliminar
              </button>
              <button className="btn btn-warning m-1" style={titleStyle} onClick={() => handleUpdate(product.id)}>
              Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container" style={{ backgroundColor: "rgba(218, 184, 215, 0.2)", maxWidth: "10000px" }}>
      <div className="row">
        <div className="col-12">
          <h2 className="display-5 text-center" style={{ fontFamily: "Gotham, sans-serif" }}>
            PRODUCTOS
          </h2>
          <hr />
        </div>
      </div>

      <div className="row justify-content-center">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </div>
  );
};

export default Products3;
