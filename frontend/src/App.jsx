import React from 'react'
import Navbar from './Navbar'
import Hero from './Hero'
import Process from './Process'
import CTA from './CTA'
import Features from './Features'
import Footer from './Footer'
import HeroCards from './HeroCards'


function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <HeroCards/>
      <Features />
      <CTA />
      <Process />
      <Footer />
    </>
  )
}

export default App;