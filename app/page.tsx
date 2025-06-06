import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import { Hero03 } from '@/components/Hero03/index';
import { Feature02 } from '@/components/feature-02';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <Hero03 />
      <Feature02 />
    </>
  );
}
