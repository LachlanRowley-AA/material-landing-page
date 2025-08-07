import LowTouchClient from './clientComponent';

export default async function HomePage(props: {
  params: Promise<{ audience: string; partner: string }>;
}) {
  const params = await props.params;
  const partner = params.partner;
  return <LowTouchClient partner={partner} />;
}
