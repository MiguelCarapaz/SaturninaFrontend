import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";
import { MdOutlineFilterList, MdOutlineFilterListOff } from "react-icons/md";
import { LuSearch } from "react-icons/lu";
import { TbPointFilled } from "react-icons/tb";
const Products = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentCategory, setCurrentCategory] = useState("category:todos");
  const [categories, setCategories] = useState([]);
  const [noProductsMessage, setNoProductsMessage] = useState(""); // Agregado
  const [showMenu, setShowMenu] = useState(true);

  useEffect(() => {
    let componentMounted = true;

    const fetchData = async () => {
      try {
        const productsResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/products`
        );
        if (!productsResponse.ok) {
          throw new Error(
            `Error fetching products: ${productsResponse.status}`
          );
        }
        const productsResult = await productsResponse.json();

        if (componentMounted) {
          setData(productsResult.detail);
          setNoProductsMessage("");
        }
      } catch (error) {
        console.error("Error fetching products:", error);

        if (
          error.message.includes("404") &&
          error.message.includes("No existe ningún producto")
        ) {
          setNoProductsMessage("No hay productos disponibles en este momento.");
        } else {
          setNoProductsMessage(
            "Error al cargar los productos. Por favor, inténtalo de nuevo más tarde."
          );
        }
      }

      try {
        const categoriesResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/category`
        );
        if (!categoriesResponse.ok) {
          throw new Error(
            `Error fetching categories: ${categoriesResponse.status}`
          );
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
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };
  const ShowProducts = () => {
    const [searchInput, setSearchInput] = useState("");

    const filteredProducts = Array.isArray(data)
      ? data.filter(
          (product) =>
            (currentCategory === "category:todos" ||
              product.category === currentCategory) &&
            (searchInput === "" ||
              product.name.toLowerCase().includes(searchInput.toLowerCase()))
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
        <section className="flex flex-row w-full">
          <section className="flex flex-col  p-3">
            <div className="flex flex-row justify-between w-full mb-6">
              <h5 className="w-full md:mr-28 mr-20">Filtros</h5>
              <button onClick={toggleMenu}>
                {showMenu ? (
                  <MdOutlineFilterListOff />
                ) : (
                  <MdOutlineFilterList />
                )}
              </button>
            </div>
            {showMenu && (
              <div className="flex flex-col items-center md:w-auto w-36">
                {categories.map((category, index) => (
                  <React.Fragment key={category.id}>
                    {index > 0 && index % 6 === 0 && <br />}
                    <button
                      className={`btn btn-outline-dark btn-sm m-2 w-full ${
                        currentCategory === category.id ? "active" : ""
                      }`}
                      onClick={() => filterProduct(category.id)}
                    >
                      {category.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            )}
          </section>
          <section className="flex flex-col items-center justify-center w-full">
            <div className="flex flex-row flex-wrap w-full items-center justify-center">
              <div className="flex flex-row items-center justify-center w-full mb-4">
                <input
                  type="text"
                  placeholder="Buscar productos.."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="rounded-lg p-1 bg-gray-100 text-black placeholder:text-black"
                />
                <LuSearch className="text-lg ml-2" />
              </div>
              {currentProducts.map((product, index) => (
                <ShowProductDetails key={index} product={product} />
              ))}
            </div>
            <div className="pagination text-center">
              {Array.from({
                length: Math.ceil(filteredProducts.length / 6),
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`btn btn-dark m-1 ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </section>
        </section>
      </>
    );
  };

  const ShowProductDetails = ({ product }) => {
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

    const productCardStyle = {
      fontFamily: "Gotham, sans-serif",
      fontSize: "0.9rem",
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

    const buttonGroupStyle = {
      justifyContent: "space-around",
    };

    const images = Array.isArray(product.imagen) ? (
      <div className="carousel bg-gray-200 rounded-xl">
        <img
          className="p-3 h-48 w-52"
          src={product.imagen[currentImageIndex]?.secure_url}
          alt={`${product.name}-${currentImageIndex}`}
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
                    index === currentImageIndex ? "text-stone-300" : ""
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
        src={
          Array.isArray(product.imagen)
            ? product.imagen[currentImageIndex]?.secure_url
            : null
        }
        alt={product.name}
      />
    );

    return (
      <div
        id={product.id_producto}
        key={product.id_producto}
        className="mb-5 mr-3"
      >
        <div
          className="text-center h-full flex flex-col items-center justify-center"
          style={productCardStyle}
        >
          {images}
          <div className="w-full">
            <h5 className="w-full text-start mt-3 font-semibold" style={titleStyle}>
              {product.name}
            </h5>
            
            <p className="text-start text-2xl">$ {product.precio}</p>
          </div>
          <div className="w-full flex items-center justify-center">
            <div  style={buttonGroupStyle}>
              <Link
                to={`/product/${product.id}`}
                className="btn btn-outline-dark m-1 w-fit"
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
    <>
      <h2
        className="text-center mb-5"
        id="productos"
        style={{ fontFamily: "Gotham, sans-serif" }}
      >
        Productos
      </h2>
      <div className="flex flex-row items-center justify-center w-full ">
        {loading ? <Loading /> : <ShowProducts />}
      </div>
    </>
  );
};

export default Products;
