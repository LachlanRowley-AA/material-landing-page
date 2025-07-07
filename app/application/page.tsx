'use client';

import { useRef, useState } from 'react';
import { Button, Stack, Text, Title, Anchor } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';


//Signed pdf imports
import template from '@/lib/template.json'; // Your exported template
import wet_template from '@/lib/wet_template.json'
import { generate } from '@pdfme/generator';
import { multiVariableText, rectangle, text } from '@pdfme/schemas'


export default function Page() {
  const [hasSigned, setHasSigned] = useState(false);
  const [showIframe, setShowIframe] = useState(true);
  const iframeRef = useRef<HTMLDivElement>(null);

  const handleSignWithSignature = async () => {
    const inputs = [
      {
        APPLICANT_FULL_NAME: '{"APPLICANT_FULL_NAME": "Lachlan Rowley"}',
        APPLICANT_SIGNED_IP: '{"IP": "123456789101"}',
        APPLICANT_SIGNED_DATE: '{"APPLICANT_SIGNED_DATE": "01/01/1444"}',
        SIGNATURE: '{"SIGNATURE": "Lachlan Rowley"}',
      }
    ];
    const pdf = await generate({ template, inputs, plugins: { rectangle, text, multiVariableText } });
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signed-document.pdf'; // Specify the filename
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const handleSignWithoutSignature = async () => {
    const inputs = [
      {
        APPLICANT_FULL_NAME: '{"APPLICANT_FULL_NAME": "Lachlan Rowley"}',
        APPLICANT_SIGNED_IP: '{"IP": "123456789101"}',
        APPLICANT_SIGNED_DATE: '{"APPLICANT_SIGNED_DATE": "01/01/1444"}',
      }
    ];
    const pdf = await generate({ template: wet_template, inputs, plugins: { rectangle, text, multiVariableText } });
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wetsign-document.pdf'; // Specify the filename
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const handleQuickSign = async () => {
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
          Please download and sign our             
          <Anchor size="xl" href="/privacyform" fw={1500} target="_blank">
            {'  '}privacy policy
          </Anchor>
          
        </Title>
        <Text ta="center">
          You will need to upload it later. Choose one of the signing methods below:
        </Text>

        <Stack w="100%" maw={400}>
          <Button variant="outline" color="#01E194" onClick={handleSignWithoutSignature}>
            Sign with your signature<IconDownload />
          </Button>

          <Button variant="filled" color="#01E194" onClick={handleSignWithSignature}>
            Quick sign (IP verified) <IconDownload />
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
