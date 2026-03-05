import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./components/landing_page/Hero";
import About from "./components/landing_page/About";
import FAQ from "./components/landing_page/FAQ";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-full mx-auto px-0">
          <Hero />
          <About />
          <FAQ />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default App;
