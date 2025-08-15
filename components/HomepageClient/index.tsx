'use client';
import { Container, Grid, Center, Loader } from '@mantine/core';
import { Feature02 } from '@/components/feature-02';
import { Calculator } from '@/components/Calculator/Calculator';
import { Footer01 } from '@/components/footer/footer';
import { FAQ } from '@/components/FAQ/Faq';
import { UserDataDisplay } from '@/components/AccountData';
import { UseCases } from '@/components/UseCases/Usecases';
import { AgreementWidget } from '@/components/AgreementWidget';
import { Header01 } from '@/components/Header';
import Welcome from '@/components/Welcome';
import { UserDetails } from '@/lib/UserDetails';
import { useEffect, useState } from 'react';
import { UnsavedChangesProvider } from '@/components/unsavedChanges';

interface HomepageClientProps {
  userDetails: UserDetails | null;
  parsedBalance: number;
}

export default function HomepageClient({ userDetails, parsedBalance }: HomepageClientProps) {
  const [sessionReady, setSessionReady] = useState(false);
    useEffect(() => {
        if (userDetails) {
            sessionStorage.setItem('userData', JSON.stringify(userDetails));
            sessionStorage.setItem('loanAmount', parsedBalance.toString());
            sessionStorage.setItem('customTimeframe', '12');
        }
        setSessionReady(true);
  } , [userDetails, parsedBalance]);
    if (!userDetails || !sessionReady) {
      return (
        <div />
    );
  }

  return (
      <UnsavedChangesProvider>
        <Header01 />
        <div style={{ paddingBottom: '40px' }} />
        <Container px={{ base: '0px', md: '20px', lg: '40px' }} mx={{ base: '0px' }} fluid>
          <section id="Home"><Welcome name={userDetails.name}/></section>
          <UserDataDisplay userDetails={userDetails} />
          <Grid style={{ overflow: 'hidden' }} mx="xl">
            <Grid.Col span={{ md: 12 }}>
              <Calculator startingAmount={parsedBalance ?? 80000} />
            </Grid.Col>
            {/* <Grid.Col span={{ md: 3 }}>
              <section id="contact"><AgreementWidget /></section>
            </Grid.Col> */}
          </Grid>
        </Container>
        <section id="About"><Feature02 /></section>
        <UseCases />
        <FAQ />
        <Footer01 />
      </UnsavedChangesProvider>
  );
}
