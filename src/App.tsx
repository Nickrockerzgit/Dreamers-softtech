import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/home/ScrollToTop";

import MainLayout from "./layouts/MainLayout";
import NoFooterLayout from "./layouts/NoFooterLayout";

import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Portfolio from "./pages/Portfolio";
import ContactInfo from "./pages/Contact";

import Blogs from "./pages/Blogs";
// import BlogDetail from "./pages/BlogDetail";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Routes WITH footer */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Service />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/blogs" element={<Blogs />} />
          {/* <Route path="/blog/:id" element={<BlogDetail />} /> */}
        </Route>

        {/* Routes WITHOUT footer */}
        <Route element={<NoFooterLayout />}>
          <Route path="/contact" element={<ContactInfo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
