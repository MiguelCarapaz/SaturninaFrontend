import { Navbar3, Product3, Footer3 } from "../../components/administrador/administrador";



function Dashboard3() {
  return (
    <>
      <main className="mt-auto">
        <header className="sticky top-0 z-50">
          <Navbar3 />
        </header>
        <Product3 />
      </main>
      <Footer3 className="mt-auto" />
    </>
  );
}

export default Dashboard3