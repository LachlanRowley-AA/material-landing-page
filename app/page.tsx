import { UseCases } from '@/components/UseCases/Usecases';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Hero03 } from '@/components/Hero03/index';
import { Feature02 } from '@/components/feature-02';

export default function HomePage() {
  return (
    <>
      <Hero03 />
      <Feature02 />
      <UseCases />
    </>
  );
}
