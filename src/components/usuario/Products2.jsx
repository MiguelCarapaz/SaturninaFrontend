import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCart } from "../../redux/action";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Products2 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState(""); // Nuevo estado para el término de búsqueda
  const productsPerPage = 6;

  let componentMounted = true;
  const dispatch = useDispatch();

  const addProduct = (product) => {
    dispatch(addCart(product));
  };

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.com/products/");
      if (componentMounted) {
        setData(await response.clone().json());
        setLoading(false);
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const Loading = () => {
    return (
      <>
        <div className="col-12 py-5 text-center">
          <Skeleton height={40} width={560} />
        </div>
        {Array.from({ length: productsPerPage }).map((_, index) => (
          <div key={index} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
            <Skeleton height={592} />
          </div>
        ))}
      </>
    );
  };

  const filterProduct = (cat) => {
    setCurrentCategory(cat);
    setCurrentPage(1);
  };

  // Función para filtrar productos por nombre o letras
  const searchProducts = (e) => {
    setSearchTerm(e.target.value);
  };

  const ShowProducts = () => {
    const filteredProducts = currentCategory === "All" ? data : data.filter((item) => item.category === currentCategory);

    // Filtrar productos por término de búsqueda
    const filteredProductsBySearch = filteredProducts.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProductsBySearch.slice(indexOfFirstProduct, indexOfLastProduct);

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
      <>
        <div className="buttons text-center py-5">
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("All")} style={titleStyle}>
            Todos
          </button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("men's clothing")} style={titleStyle}>
            Camisetas
          </button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("women's clothing")} style={titleStyle}>
            Gorras
          </button>
          <button className="btn btn-outline-dark btn-sm m-2" onClick={() => filterProduct("jewelery")} style={titleStyle}>
            Pantalones
          </button>
          <div style={{ display: "flex", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Buscar productos 🔍"
              value={searchTerm}
              onChange={searchProducts}
              style={{
                fontFamily: "Gotham, sans-serif",
                fontSize: "1.1rem",
                border: "1px solid black",
                textAlign: "center",
                marginLeft: "auto",
                marginRight: "15px",
              }}
            />
          </div>
        </div>

        <div className="row">
          {currentProducts.map((product) => {
            const [selectedSize, setSelectedSize] = useState("");
            const [selectedColor, setSelectedColor] = useState("");

            return (
              <div id={product.id} key={product.id} className="col-md-4 col-sm-6 col-xs-8 col-12 mb-4">
                <div className="card text-center h-100" style={productCardStyle}>
                  <img className="card-img-top p-3" src={product.image} alt="Card" style={imageStyle} />
                  <div className="card-body">
                    <h5 className="card-title" style={titleStyle}>
                      {product.title.substring(0, 12)}...
                    </h5>
                    <p className="card-text" style={descriptionStyle}>
                      {product.description}
                    </p>
                  </div>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item lead" style={centeredPriceStyle}>
                      $ {product.price}
                    </li>
                  </ul>
                  <div className="card-body">
                    <div className="buttons" style={buttonGroupStyle}>
                      <button className="btn btn-dark m-1" style={titleStyle} onClick={() => addProduct(product)}>
                        Añadir al carrito
                      </button>
                      <Link to={"/usuario/product2/" + product.id} className="btn btn-dark m-2" style={titleStyle}>
                        Ver
                      </Link>
                    </div>
                    <div className="buttons">
                      <div className="select-wrapper" style={titleStyle}>
                        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                          <option value="">Seleccione una Talla</option>
                          <option value="Talla S">Talla S</option>
                          <option value="Talla M">Talla M</option>
                          <option value="Talla X">Talla X</option>
                        </select>
                      </div>
                      <div className="select-wrapper" style={titleStyle}>
                        <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                          <option value="">Seleccione un Color</option>
                          <option value="Rojo">Rojo</option>
                          <option value="Azul">Azul</option>
                          <option value="Verde">Verde</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
            );
          })}
        </div>

        <div className="pagination text-center">
          {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }).map((_, index) => (
            <button key={index} onClick={() => paginate(index + 1)} className="btn btn-dark m-1">
              {index + 1}
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
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
    </>
  );
};

export default Products2;
