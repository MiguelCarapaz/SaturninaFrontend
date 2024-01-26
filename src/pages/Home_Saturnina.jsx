import { Link } from "react-router-dom";
function Home_Saturnina() {
    return (
      <section className="flex flex-row h-full w-full md:w-auto">
        <div className="flex flex-col  md:items-center md:justify-normal justify-center items-center w-full">
          <h1 className=" font-bold mt-5 mb-4">SATURNINA</h1>
          <p className=" text-justify text-xl p-5">
            Echa un vistazo a nuestra variada gama de prendas personalizadas y
            diseñadas para resaltar tu individualidad y satisfacer su sentido
            del estilo.
          </p>
          <Link to="/login" className="no-underline">
            <button className="ml-2 mb-20 md:mb-0 text-white bg-slate-950 hover:bg-slate-500 font-medium rounded-lg text-s p-2.5 flex justify-center">
              Compra ahora
            </button>
          </Link>
        </div>
        <img
          src="public\assets\star.svg"
          alt="estrella"
          className="hidden md:relative md:block  md:left-[30%] md:bottom-60 md:w-20"
        />
        <img
          src="public\assets\star.svg"
          alt="estrella"
          className="hidden md:block md:relative right-20"
        />
        <img
          src="public\assets\metalica-saturnina.webp"
          alt="imagen-metalica"
          className=" hidden md:block md:justify-end"
        />
      </section>
    );
}

export default Home_Saturnina;

