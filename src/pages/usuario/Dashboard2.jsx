import { Navbar2, Product2, Footer2 } from "../../components/usuario/usuario";
import { Comments2 } from "./Comments2";


function Dashboard2() {
  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar2 />
      </header>

      <main>
        <Product2 />
      </main>
      <Footer2 />
    </>
  );
}

export default Dashboard2