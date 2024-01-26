import { Navbar3, Product3, Footer3 } from "../../components/administrador/administrador";



function Dashboard3() {
  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar3 />
      </header>
      <main>
        <Product3 />
      </main>
      <Footer3 />
    </>
  );
}

export default Dashboard3