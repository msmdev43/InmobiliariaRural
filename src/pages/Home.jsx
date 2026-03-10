import Header from "../components/Header";
import Hero from "../components/Hero";
import FeaturedProperties from "../components/FeaturedProperties";
import Categories from "../components/Categories";
import About from "../components/About";
import Services from "../components/Services";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import "../styles/globals.css";

function Home() {
  return (
    <div className="app">
      <Header />
      <main>
        <Hero />
        <FeaturedProperties />
        <Categories />
        <About />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Home;