import { UseCases } from '@/components/UseCases/Usecases';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import  Welcome  from '../components/Welcome';
import { Hero03 } from '@/components/Hero03/index';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator3/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { Header01 } from '@/components/Header';

export default function HomePage() {
  return (
    <>
      <Header01 />
      <div style={{paddingBottom:"40px"}}/>
      <Hero03 />
      <Feature02 />
      <Calculator />
      <UseCases />
      <FAQ />
      <section id ="footer"><ContactForm /></section>
      <Footer01 />
    </>
  );
}
