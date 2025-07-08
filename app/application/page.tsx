'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Stack, Text, Title, Anchor, Alert, Loader, Modal, Group } from '@mantine/core';
import { IconDownload, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { UserDetails } from '@/components/HomepageClient';

//Signed pdf imports
import template from '@/lib/template.json';
import wet_template from '@/lib/wet_template.json'
import { generate } from '@pdfme/generator';
import { multiVariableText, rectangle, text } from '@pdfme/schemas'

// Configuration
const CONFIG = {
  colors: {
    primary: '#01E194',
    text: '#FFFFFF',
    control: '#01E194'
  },
  api: {
    ipService: 'https://api.ipify.org?format=json'
  },
  dateFormat: {
    locale: 'en-AU',
    options: {
      day: '2-digit' as const,
      month: '2-digit' as const,
      year: 'numeric' as const
    }
  }
};

type LoadingState = {
  ip: boolean;
  pdfGeneration: boolean;
};

type ErrorState = {
  ip: string | null;
  pdfGeneration: string | null;
  sessionData: string | null;
};

export default function Page() {
  const [hasSigned, setHasSigned] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const [userIP, setUserIP] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<LoadingState>({ ip: true, pdfGeneration: false });
  const [errors, setErrors] = useState<ErrorState>({ ip: null, pdfGeneration: null, sessionData: null });
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; type: 'signature' | 'wet' | null }>({ open: false, type: null });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const iframeRef = useRef<HTMLDivElement>(null);

  // Fetch user's IP address
  const fetchUserIP = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, ip: true }));
      setErrors(prev => ({ ...prev, ip: null }));
      
      const response = await fetch(CONFIG.api.ipService);
      if (!response.ok) {
        throw new Error('Failed to fetch IP address');
      }
      
      const data = await response.json();
      if (!data.ip) {
        throw new Error('Invalid IP response');
      }
      
      setUserIP(data.ip);
    } catch (error) {
      console.error('Error fetching IP address:', error);
      setErrors(prev => ({ ...prev, ip: 'Unable to fetch IP address. Please try again.' }));
      setUserIP('IP_FETCH_FAILED');
    } finally {
      setLoading(prev => ({ ...prev, ip: false }));
    }
  }, []);

  // Get current date
  const getCurrentDate = useCallback(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString(CONFIG.dateFormat.locale, CONFIG.dateFormat.options);
    setCurrentDate(formatted);
  }, []);

  // Load user data from session storage
  const loadUserData = useCallback(() => {
    try {
      const sessionData = sessionStorage.getItem('userData');
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        setUserData(parsed);
        setErrors(prev => ({ ...prev, sessionData: null }));
      }
    } catch (error) {
      console.error('Error parsing session data:', error);
      setErrors(prev => ({ ...prev, sessionData: 'Invalid session data found' }));
    }
  }, []);

  // Initialize component
  useEffect(() => {
    fetchUserIP();
    getCurrentDate();
    loadUserData();
  }, [fetchUserIP, getCurrentDate, loadUserData]);

  // Generate PDF with error handling
  const generatePDF = useCallback(async (includeSignature: boolean) => {
    try {
      setLoading(prev => ({ ...prev, pdfGeneration: true }));
      setErrors(prev => ({ ...prev, pdfGeneration: null }));

      const applicantName = userData?.name || 'APPLICANT_NAME';
      if(applicantName === 'APPLICANT_NAME') {
        console.log(userData);
      }
      
      const inputs = [
        {
          APPLICANT_FULL_NAME: JSON.stringify({ APPLICANT_FULL_NAME: applicantName }),
          APPLICANT_SIGNED_IP: JSON.stringify({ IP: userIP }),
          APPLICANT_SIGNED_DATE: JSON.stringify({ APPLICANT_SIGNED_DATE: currentDate }),
          ...(includeSignature && { SIGNATURE: JSON.stringify({ SIGNATURE: applicantName }) })
        }
      ];

      const selectedTemplate = includeSignature ? template : wet_template;
      const pdf = await generate({ 
        template: selectedTemplate, 
        inputs, 
        plugins: { rectangle, text, multiVariableText } 
      });

      const blob = new Blob([new Uint8Array(pdf.buffer)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = includeSignature ? 'signed-document.pdf' : 'wetsign-document.pdf';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setHasSigned(true);
      setSuccessMessage(`Document ${includeSignature ? 'with signature' : 'for wet signing'} downloaded successfully!`);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrors(prev => ({ 
        ...prev, 
        pdfGeneration: 'Failed to generate PDF. Please try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, pdfGeneration: false }));
      setConfirmModal({ open: false, type: null });
    }
  }, [userData, userIP, currentDate]);

  // Handle signature download
  const handleSignWithSignature = useCallback(() => {
    setConfirmModal({ open: true, type: 'signature' });
  }, []);

  // Handle wet signature download
  const handleSignWithoutSignature = useCallback(() => {
    setConfirmModal({ open: true, type: 'wet' });
  }, []);

  // Confirm PDF generation
  const handleConfirmGeneration = useCallback(() => {
    if (confirmModal.type === 'signature') {
      generatePDF(true);
    } else if (confirmModal.type === 'wet') {
      generatePDF(false);
    }
  }, [confirmModal.type, generatePDF]);

  // Handle navigation to next section
  const handleNext = useCallback(() => {
    setShowIframe(true);
    setTimeout(() => {
      iframeRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  // Retry IP fetch
  const retryIPFetch = useCallback(() => {
    fetchUserIP();
  }, [fetchUserIP]);

  // Check if buttons should be disabled
  const isButtonDisabled = loading.ip || loading.pdfGeneration || !!errors.ip;

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

        {/* Loading State */}
        {loading.ip && (
          <Group gap="xs">
            <Loader size="sm" />
            <Text size="sm">Loading your information...</Text>
          </Group>
        )}

        {/* Error States */}
        {errors.ip && (
          <Alert 
            icon={<IconAlertCircle size="1rem" />} 
            title="Network Error" 
            color="red"
          >
            {errors.ip}
            <Button variant="light" color="red" size="xs" onClick={retryIPFetch} mt="sm">
              Retry
            </Button>
          </Alert>
        )}

        {errors.sessionData && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Session Warning" color="yellow">
            {errors.sessionData}
          </Alert>
        )}

        {errors.pdfGeneration && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="PDF Generation Error" color="red">
            {errors.pdfGeneration}
          </Alert>
        )}

        {/* Success Message */}
        {successMessage && (
          <Alert icon={<IconCheck size="1rem" />} title="Success" color="green">
            {successMessage}
          </Alert>
        )}

        {/* Action Buttons */}
        <Stack w="100%" maw={400}>
          <Button 
            variant="outline" 
            color={CONFIG.colors.primary} 
            onClick={handleSignWithoutSignature}
            disabled={isButtonDisabled}
            loading={loading.pdfGeneration && confirmModal.type === 'wet'}
            leftSection={<IconDownload size="1rem" />}
          >
            Sign with your signature
          </Button>

          <Button 
            variant="filled" 
            color={CONFIG.colors.primary} 
            onClick={handleSignWithSignature}
            disabled={isButtonDisabled}
            loading={loading.pdfGeneration && confirmModal.type === 'signature'}
            leftSection={<IconDownload size="1rem" />}
          >
            Quick sign (IP verified)
          </Button>
        </Stack>

        <Button 
          mt="xl" 
          size="lg" 
          onClick={handleNext} 
          disabled={!hasSigned}
          color={CONFIG.colors.primary}
        >
          Next
        </Button>

        {/* User Info Display */}
        {userData && (
          <Text size="sm" c="dimmed" ta="center">
            Signed as: {userData.name}
          </Text>
        )}
      </Stack>

      {/* Confirmation Modal */}
      <Modal
        opened={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, type: null })}
        title="Confirm Document Generation"
        centered
      >
        <Stack>
          <Text>
            {confirmModal.type === 'signature' 
              ? 'Generate a document with your digital signature?' 
              : 'Generate a document for wet signing?'
            }
          </Text>
          
          <Group gap="md" justify="flex-end">
            <Button 
              variant="light" 
              onClick={() => setConfirmModal({ open: false, type: null })}
            >
              Cancel
            </Button>
            <Button 
              color={CONFIG.colors.primary} 
              onClick={handleConfirmGeneration}
              loading={loading.pdfGeneration}
            >
              Generate PDF
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Spacer */}
      <div style={{ height: '100vh' }} />

      {/* Iframe Section */}
      <div ref={iframeRef} style={{ height: '100vh', width: '100vw' }}>
        {showIframe && (
          <iframe
            title="lend iframe"
            src={`https://application.lend.com.au/quote?force_send=0&commercial_list=2,3,5,6,7,8,10,11,12,16,13,14&af=002nsal&send_type=Manual&application_type=commercial&bs_months=6_months&additional_options=21,48,50&requested_docs=56,40,41&brand_colour=${CONFIG.colors.primary.replace('#', '')}&text_colour=${CONFIG.colors.text.replace('#', '')}&control_colour=${CONFIG.colors.control.replace('#', '')}&iframe=true`}
            height="100%"
            width="100%"
            style={{ border: 'none' }}
            loading="lazy"
          />
        )}
      </div>
    </>
  );
}