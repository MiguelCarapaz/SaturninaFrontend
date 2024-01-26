import { Navbar, Product, Footer } from "../components/Dashboard";
import Home_Saturnina from "./Home_Saturnina";
import { Comments } from "./Comments";

function Dashboard() {
  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar />
      </header>
      <main>
        <Home_Saturnina />
        <Product />
        <Comments/>
      </main>

      <footer>
        <Footer />
      </footer>
    </>
  );
}

export default Dashboard