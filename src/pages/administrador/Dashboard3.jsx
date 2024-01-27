import { Navbar3, Product3, Footer3 } from "../../components/administrador/administrador";



function Dashboard3() {
  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar3 />
      </header>
      <main className="mt-auto">
        <Product3 />
      </main>
      <Footer3 className="mt-auto"/>
    </>
  );
}

export default Dashboard3