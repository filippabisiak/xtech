import { useEffect } from 'react'
import { About } from './components/About.tsx'
import { Atmosphere } from './components/Atmosphere.tsx'
import { Belief } from './components/Belief.tsx'
import { Bridge } from './components/Bridge.tsx'
import { Contact } from './components/Contact.tsx'
import { Cursor } from './components/Cursor.tsx'
import { Footer } from './components/Footer.tsx'
import { Header } from './components/Header.tsx'
import { Hero } from './components/Hero.tsx'
import { Process } from './components/Process.tsx'
import { ScrollHint } from './components/ScrollHint.tsx'
import { Services } from './components/Services.tsx'
import { Works } from './components/Works.tsx'
import { bindDriftLinks } from './lib/driftScroll.ts'
import { bindMagnet } from './lib/magnet.ts'

function App() {
  useEffect(() => {
    const unbindDrift = bindDriftLinks()
    const unbindMagnet = bindMagnet()
    return () => {
      unbindDrift()
      unbindMagnet()
    }
  }, [])

  return (
    <>
      <Atmosphere />
      <Cursor />
      <div className="site">
        <Header />
        <main>
          <Hero />
          <Belief />
          <Services />
          <Bridge />
          <Process />
          <About />
          <Works />
          <Contact />
        </main>
        <Footer />
        <ScrollHint />
      </div>
    </>
  )
}

export default App
