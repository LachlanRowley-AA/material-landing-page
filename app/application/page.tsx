'use client';

import { useRef, useState } from 'react';
import { Button, Stack, Text, Title } from '@mantine/core';

export default function Page() {
  const [hasSigned, setHasSigned] = useState(false);
  const [showIframe, setShowIframe] = useState(true);
  const iframeRef = useRef<HTMLDivElement>(null);

  const handleSignWithSignature = async () => {
    // Download the form
    // window.open('/path-to/privacy-policy.pdf', '_blank');

    // // Call your API to log this action
    // await fetch('/api/signature/manual', {
    //   method: 'POST',
    //   body: JSON.stringify({ method: 'manual' }),
    //   headers: { 'Content-Type': 'application/json' },
    // });
    const payload = {
        id: 1,
        signature: 'bob',
        firstName: 'bob',
        lastName: 'smith',
        signedDate: '2025-07-04',
    }

    try { 
        const response = await fetch("https://asset-alley-privacy.netlify.app/api/signForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ applicants: [payload]}),
            });
        if (!response.ok) throw new Error("Request failed");

        const html = await response.text();

        //Download response 
      } catch (error) {
        //Throw error
      } finally {
          setHasSigned(true);
      }
    }



  const handleQuickSign = async () => {
    // Call your API to log quick sign
    // await fetch('/api/signature/quick', {
    //   method: 'POST',
    //   body: JSON.stringify({ method: 'quick', timestamp: new Date().toISOString() }),
    //   headers: { 'Content-Type': 'application/json' },
    // });

    setHasSigned(true);
  };

  const handleNext = () => {
    setShowIframe(true);
      iframeRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Stack align="center" justify="center" h="100vh" px="lg">
        <Title order={3} ta="center">
          Please download and sign our privacy policy.
        </Title>
        <Text ta="center">
          You will need to upload it later. Choose one of the signing methods below:
        </Text>

        <Stack w="100%" maw={400}>
          <Button variant="outline" color="#01E194" onClick={handleSignWithSignature}>
            Sign with your signature
          </Button>

          <Button variant="filled" color="#01E194" onClick={handleQuickSign}>
            Quick sign (IP verified)
          </Button>
        </Stack>

        <Button mt="xl" size="lg" onClick={handleNext} disabled={!hasSigned}>
          Next
        </Button>
      </Stack>

      {/* Push iframe 100vh down */}
      <div style={{ height: '100vh' }} />

      {/* Iframe Section */}
      <div ref={iframeRef} style={{ height: '100vh', width: '100vw' }}>
        {showIframe && (
          <iframe
            title="lend iframe"
            src="https://application.lend.com.au/quote?force_send=0&commercial_list=2,3,5,6,7,8,10,11,12,16,13,14&af=002nsal&send_type=Manual&application_type=commercial&bs_months=6_months&additional_options=21,48,50&requested_docs=56,40,41&brand_colour=01E194&text_colour=FFFFFF&control_colour=01E194&iframe=true"
            height="100%"
            width="100%"
            style={{ border: 'none' }}
          />
        )}
      </div>
    </>
  );
}
