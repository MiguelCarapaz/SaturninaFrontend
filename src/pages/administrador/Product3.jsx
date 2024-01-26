import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";


import { Footer3, Navbar3, Comentarios3 } from "../../components/administrador/administrador";

const Product3 = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const getProduct = async () => {
      setLoading(true);
      setLoading2(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`);
        const data = await response.json();
        setProduct(data.detail);
        setLoading(false);
        setLoading2(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        setLoading2(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/category`);
        if (response.ok) {
          const categoriasData = await response.json();
          setCategories(categoriasData.detail);
        } else {
          console.error("Error al obtener las categorías:", response.status);
        }
      } catch (error) {
        console.error("Error en la solicitud de categorías:", error);
      }
    };

    getProduct();
    fetchCategories();
  }, [id]);

  const Loading = () => {
    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 py-3">
              <Skeleton height={400} width={400} />
            </div>
            <div className="col-md-6 py-5">
              <Skeleton height={30} width={250} />
              <Skeleton height={90} />
              <Skeleton height={40} width={70} />
              <Skeleton height={50} width={110} />
              <Skeleton height={120} />
              <Skeleton height={40} width={110} inline={true} />
              <Skeleton className="mx-3" height={40} width={110} />
            </div>
          </div>
        </div>
      </>
    );
  };

  const ShowProduct = () => {
    const categoryName = categories.find((cat) => cat.id === product.category)?.name || "Desconocida";

    return (
      <>
        <div className="container my-5 py-2">
          <div className="row">
            <div className="col-md-6 col-sm-12 py-3">
              <div className="image-container">
                <img
                  className="img-fluid"
                  src={product.imagen?.[currentImageIndex]?.secure_url || ""}
                  alt={product.name}
                />
                {product.imagen && product.imagen.length > 1 && (
                  <>
                  </>
                )}
              </div>
              {product.imagen && product.imagen.length > 1 && (
                <div className="thumbnail-container mt-3">
                  {product.imagen.map((img, index) => (
                    <img
                      key={index}
                      className={`thumbnail ${index === currentImageIndex ? "selected" : ""}`}
                      src={img.secure_url}
                      alt={product.name}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
            <div className="col-md-6 col-md-6 py-5">
              <h4 className="text-uppercase text-muted">{categoryName}</h4>
              <h2 className="display-5">{product.name}</h2>
              <h3 className="display-6 my-4">${product.precio}</h3>
              <p className="lead">{product.descripcion}</p>

              {product.colores && product.colores.length > 0 && (
                <div>
                  <h5 style={{ display: 'inline-block', marginRight: '10px' }}>Colores:</h5>
                    {product.colores.map((color, index) => (
                    <span key={index}>
                    {color.name}
                    {index < product.colores.length - 1 && ', '}
                    </span>
                    ))}
                </div>
              )}

              {product.tallas && product.tallas.length > 0 && (
                <div>
              <h5 style={{ display: 'inline-block', marginRight: '10px' }}>Tallas:</h5>
              {product.tallas.map((talla, index) => (
                <span key={index}>
                  {talla.name}
                  {index < product.tallas.length - 1 && ', '}
                </span>
              ))}
            </div>


              )}

        
            </div>
          </div>
        </div>
        <Comentarios3 productId={product.id} />
      </>
    );
  };

  return (
    <>
      <Navbar3 />
      <div className="container">
        <div className="row">{loading ? <Loading /> : <ShowProduct />}</div>
        <div className="row my-5 py-5">
          <div className="d-none d-md-block"></div>
        </div>
      </div>
      <Footer3 />
      <style>{`
        .image-container {
          position: relative;
        }
        
        .arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          cursor: pointer;
        }
        
        .left-arrow {
          left: 10px;
        }
        
        .right-arrow {
          right: 10px;
        }
        
        .thumbnail-container {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          margin-top: 10px;
        }
        
        .thumbnail {
          width: 60px;
          height: 60px;
          cursor: pointer;
          border: 2px solid #ddd;
          border-radius: 4px;
        }
        
        .selected {
          border-color: #4caf50;
        }
        
        .img-fluid {
          width: 320px;
          height: 320px;
        }
      `}</style>
    </>
  );
};

export default Product3;
