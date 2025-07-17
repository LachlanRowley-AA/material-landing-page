'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Divider, 
  Stack,
  Text,
  Title,
  Timeline,
  SegmentedControl,
  useMantineTheme,
} from '@mantine/core';
import {
  Phone,
  Search,
  CheckCircle,
  Users,
  Shield,
  FileCheck,
  DollarSign,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMediaQuery } from '@mantine/hooks';

const steps = [
  {
    icon: Phone,
    title: 'Immediate Response',
    description: 'Speed is our priority — we contact your lead ASAP',
  },
  {
    icon: Search,
    title: 'Discovery Call',
    description: "We deep dive into the customer's goals, situation, and financial needs",
  },
  {
    icon: CheckCircle,
    title: 'Fit Assessment',
    description: 'Honest evaluation — we only proceed if we can genuinely help',
  },
  {
    icon: Users,
    title: 'Pre-qualification',
    description: 'Strategic workshop with our network of trusted lenders',
  },
  {
    icon: Shield,
    title: 'Credit-Safe Options',
    description: 'Present tailored solutions while protecting their credit score',
  },
  {
    icon: FileCheck,
    title: 'Approval Process',
    description: 'Submit application and handle all documentation seamlessly',
  },
  {
    icon: DollarSign,
    title: 'Funding & Support',
    description: 'Deal completes with lifetime customer support included',
  },
];

const integrationSteps = [
  {
    icon: Phone,
    title: 'Immediate Response',
    description: 'Speed is our priority — we contact you ASAP',
  },
  {
    icon: Search,
    title: 'Discovery Call',
    description: "We deep dive into your business's goals, situation, and customers' financial pain points",
  },
  {
    icon: Search,
    title: 'Custom Page',
    description: "We create a cobranded page and QR code for you to add to your invoices",
  },
  {
    icon: CheckCircle,
    title: 'Database or CRM API Integration',
    description: "We design custom software to integrate with your database so you don't have to change a thing. From Salesforce to Google Sheets.",
  },
  {
    icon: Users,
    title: 'Client Unique Links',
    description: `We dynamically create custom links for each of your customers so that each customer can see data specific to them.
    Tech-savvy and don't want us touching your database? We can provide the tools for you to do this yourself.`,
  },
];

const ReferralJourneySection = () => {
  const [visibleSteps, setVisibleSteps] = useState(new Set<number>());
  const [isVisible, setIsVisible] = useState(false);
  const [selectedJourney, setSelectedJourney] = useState<'Integration' | 'Referral' >('Integration');
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const currentSteps = selectedJourney === 'Referral' ? steps : integrationSteps;

  useEffect(() => {
    setIsVisible(true);
    const animateSteps = () => {
      currentSteps.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSteps((prev) => new Set([...prev, index]));
        }, 300 + index * 200);
      });
    };
    setVisibleSteps(new Set()); // Reset steps before animating
    setTimeout(animateSteps, 300);
  }, [selectedJourney]);

  return (
    <Box py={30} px="xs" bg={theme.colors.gray[0]}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 1 }}
        >
          <Stack align="center" mb="xl">
            <Title order={1} fz={{md:"80"}}>The <Text inherit span c="#0e5287">eazy</Text><Text inherit span c="#149a91">pay</Text> Journey</Title>
            <Text size="lg" ta="center" maw={700}>
              From initial contact to successful funding — here's exactly what happens
            </Text>
            <SegmentedControl
              value={selectedJourney}
              onChange={(value) => setSelectedJourney(value as 'Integration' | 'Referral')}
              data={['Integration', 'Referral']}
              size="lg"
              color="green"
              radius="md"
            />
          </Stack>
        </motion.div>

        <Timeline
          active={currentSteps.length}
          bulletSize={40}
          lineWidth={4}
          mt="lg"
          reverseActive
          styles={{
            itemBullet: {
              backgroundColor: theme.colors.green[1],
            },
          }}
        >
          {currentSteps.map((step, index) => (
            <Timeline.Item
              key={index}
              title={<Title order={4}>{step.title}</Title>}
              color={index >= currentSteps.length - 2  ? 'green' : 'blue'}
            >
              <Text size="md" mt={4}>{step.description}</Text>

              {selectedJourney === 'Integration' && index === 2 && (
                <Divider
                  size="xl"
                  pt="md"
                  label={isDesktop ? 'Integrated Implementation' : 'Full Implementation'}
                  color={theme.colors.secondary?.[0] || 'green'}
                  styles={{
                    label: {
                      fontSize: isDesktop ? '30px' : '15px',
                      color: theme.colors.secondary?.[0] || 'green',
                    },
                  }}
                />
              )}
            </Timeline.Item>
          ))}
        </Timeline>
      </Container>
    </Box>
  );
};

export default ReferralJourneySection;
