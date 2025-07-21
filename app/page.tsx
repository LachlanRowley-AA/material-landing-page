import { UseCases } from '@/components/UseCases/Usecases';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Hero03 } from '@/components/Hero03/index';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator3/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { ContactForm } from '@/components/Contact/Contact';
import { Header } from '@/components/Partner';
import { IntroSection } from '@/components/Intro';

export default function HomePage() {
  return (
    <>
      <Header />
      <Hero03 />
      <IntroSection />
      <Feature02 />
      <section id ="contact"><Calculator prefilled={false} /></section>
      <UseCases />
      <FAQ />
      <Footer01 />
    </>
  );
}
