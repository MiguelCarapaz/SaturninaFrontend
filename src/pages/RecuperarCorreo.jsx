import React, { useState } from "react";
import { Footer, Navbar } from "../components/Dashboard";
import { Formik, Form, Field } from "formik";
import Swal from "sweetalert2";

const RecuperarCorreo = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleRecoverAccount = async (values, actions) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/recover-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: values.email }),
        }
      );

      if (response.ok) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        actions.setSubmitting(false);
        actions.resetForm();

        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Hemos enviado un correo de recuperación a tu cuenta. Por favor, revisa tu bandeja de entrada.",
        }).then(() => {
          setShowChangePassword(true);
        });
      } else {
        const data = await response.json();
        if (response.status === 422) {
          actions.setStatus({
            error: "Necesita activar su cuenta.",
          });
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Necesita activar su cuenta.",
          });
        } else {
          actions.setStatus({
            error:
              data.error ||
              "Error en la solicitud de recuperación. Verifica tus datos.",
          });
          Swal.fire({
            icon: "error",
            title: "Error",
            text: actions.status.error,
          });
        }
        actions.setSubmitting(false);
      }
    } catch (error) {
      actions.setStatus({
        error: "Error en la solicitud de recuperación: " + error.message,
      });
      actions.setSubmitting(false);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: actions.status.error,
      });
    }
  };

  const renderRecoverAccount = () => {
    return (
      <Formik
        initialValues={{
          email: "",
        }}
        onSubmit={handleRecoverAccount}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <div className="p-4 flex flex-col items-center justify-start">
              <label className="mb-3 w-full" htmlFor="email">
                Correo electrónico
              </label>
              <Field
                type="email"
                name="email"
                className=" h-10 rounded-md w-full border-2 border-transparent shadow"
                id="email"
                placeholder="ejemplo@gmail.com"
                required
              />
            </div>
            <div className="my-3">
              <div className="text-center">
                <button
                  className="my-2 mx-auto bg-slate-950 hover:bg-slate-400 text-white h-10 p-2 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando correo..." : "Recuperar Cuenta"}
                </button>
              </div>
            </div>
            {status && status.error && (
              <p className="text-danger text-center">{status.error}</p>
            )}
            {status && status.message && (
              <p className="text-success text-center">{status.message}</p>
            )}
          </Form>
        )}
      </Formik>
    );
  };

  return (
    <>
    <section className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main
        className="h-dvh flex flex-col justify-center items-center"
        style={{
          backgroundImage: "url('/assets/recorver.svg')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h2
          className="text-center"
          style={{ fontFamily: "Gotham, sans-serif" }}
        >
          {showChangePassword ? "Cambiar Contraseña" : "Recuperar Cuenta"}
        </h2>

        <div className="m-auto w-2/5 h-3/5 flex flex-col items-center justify-center bg-white border-black rounded-md shadow-lg">
          <h4 className="tracking-wide leading-relaxed list-inside text-justify pl-10 pr-10">
            Introduzca su correo electrónico para el proceso de recuperación, le
            enviaremos un correo electrónico.
          </h4>
          <div className="w-full">{renderRecoverAccount()}</div>
        </div>
      </main>
      </section>
      <footer>
        <Footer className="mt-auto"/>
      </footer>
    </>
  );
};

export default RecuperarCorreo;
