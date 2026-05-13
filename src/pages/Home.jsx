import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Projects from '../components/sections/Projects'
import Praktikum from '../components/sections/Praktikum'
import Certificates from '../components/sections/Certificates'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Projects />
        <Praktikum />
        <Certificates />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
