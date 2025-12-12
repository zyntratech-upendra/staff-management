import Hero from './Homecomponents/Hero.jsx';
import Features from './Homecomponents/Features.jsx';
import HowItWorks from './Homecomponents/HowItWorks.jsx';
import CallToAction from './Homecomponents/CallToAction.jsx';
import Footer from './Homecomponents/Footer.jsx';

function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </div>
  );
}

export default Home;
