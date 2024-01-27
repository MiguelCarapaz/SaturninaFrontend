import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {  Navbar,Footer } from "../components/Dashboard";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { AuthContext } from "../context/AuthProvider";
import Swal from "sweetalert2";
import { Formik, Form, Field } from "formik";

const Login = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [userEmail, setUserEmail] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, [setAuth, navigate]);

  function checkAuthStatus() {
    const authToken = localStorage.getItem("authToken");
    if (authToken && !auth.authToken) {
      setAuth({ authToken });
    }
  }

  useEffect(() => {
    if (auth.authToken) {
      if (userEmail === "miguelotaku01@gmail.com") {
        navigate("/admin/dashboard");
      } else if (userEmail === "miguelcarapaz01@gmail.com") {
        navigate("/usuario/dashboard");
      }
    }
  }, [auth.authToken, userEmail, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (values, actions) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const authToken = data.detail.token;
        const id = data.detail.id;
        const role = data.detail.rol;
        const userEmail = data.detail.email;

        setUserData(data.detail);
        setUserEmail(userEmail);

        if (authToken) {
          localStorage.setItem("authToken", authToken);
          localStorage.setItem("id", id);
          setAuth({ authToken });

          if (role === "rol:74rvq7jatzo6ac19mc79") {
            navigate("/admin/dashboard");
          } else if (role === "rol:vuqn7k4vw0m1a3wt7fkb") {
            navigate("/usuario/dashboard");
          } else {
          }


        } else {
        }
      } else {
        const data = await response.json();
        if (response.status === 409) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Necesitas activar tu cuenta. Revisa tu correo para confirmar.",
          });
        } else {
          setError(
            data.error || "Correo o contraseña incorrectos. Verifica tus datos."
          );
        }
      }
    } catch (error) {
      setError("Error en la solicitud de inicio de sesión: " + error.message);
    }

    setLoading(false);
    actions.setSubmitting(false);
  };
   const esDispositivoMovil = window.innerWidth <= 768;

  return (
    <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <section className="flex-grow">
        <h2
          className="text-center mb-4"
          style={{ fontFamily: "Gotham, sans-serif" }}
        >
          Iniciar sesión
        </h2>
        <div
          style={{
            backgroundImage: `url(${
              esDispositivoMovil
                ? "hidden"
                : "/assets/login.svg"
            })`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="md:relative md:left-[60%] md:top-auto md:w-fit md:p-0 md:m-0 p-4 m-4">
            <Formik
              initialValues={{
                email: "",
                password: "",
                showPassword: false,
              }}
              onSubmit={handleLogin}
            >
              {({ isSubmitting, status, values, setFieldValue }) => (
                <Form>
                  <div className="my-3">
                    <label htmlFor="email">Correo electrónico</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      placeholder="ejemplo@gmail.com"
                      required
                    />
                  </div>
                  <div className="my-3">
                    <label htmlFor="password">Contraseña</label>
                    <div className="input-group">
                      <Field
                        type={values.showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        id="password"
                        placeholder="*********"
                        required
                      />
                      <div>
                        <button
                          type="button"
                          className="ml-2 h-full w-full text-white bg-slate-950 hover:bg-slate-500  font-medium rounded-lg text-xl p-2.5 flex justify-center "
                          onClick={() =>
                            setFieldValue("showPassword", !values.showPassword)
                          }
                        >
                          {values.showPassword ? (
                           Mostrar <AiOutlineEye />
                          ) : (
                            <AiOutlineEyeInvisible />
                          )}
                        </button>
                      </div>
                    </div>
                    {status && status.error && status.error.password && (
                      <p className="text-danger">{status.error.password}</p>
                    )}
                  </div>
                  <div className="my-3">
                    <p>
                      ¿No tienes una cuenta?{" "}
                      <Link
                        to="/register"
                        className="text-decoration-underline text-info"
                      >
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>
                  <div className="my-3">
                    <p>
                      ¿Olvidaste tu contraseña?{" "}
                      <Link
                        to="/recuperar-contrasena"
                        className="text-decoration-underline text-info"
                      >
                        Recupérala
                      </Link>
                    </p>
                  </div>
                  <div className="flex items-center w-full justify-center">
                    <button
                      type="submit"
                      className="ml-2 h-full  text-white bg-slate-950 hover:bg-slate-500 font-medium rounded-lg text-s p-2.5 flex justify-center"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
                    </button>
                  </div>
                  {error && <p className="text-danger text-center">{error}</p>}
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </section>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </section>
  );
};

export default Login;
