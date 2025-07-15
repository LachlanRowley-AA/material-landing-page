'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Divider, 
  Stack,
  Text,
  Title,
  ThemeIcon,
  useMantineTheme,
  Timeline,
} from '@mantine/core';
import {
  Phone,
  Search,
  CheckCircle,
  Users,
  Shield,
  FileCheck,
  DollarSign,
  Award,
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

const ReferralJourneySection = () => {
  const [visibleSteps, setVisibleSteps] = useState(new Set<number>());
  const [isVisible, setIsVisible] = useState(false);
  const theme = useMantineTheme();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  

  useEffect(() => {
    setIsVisible(true);
    const animateSteps = () => {
      steps.forEach((_, index) => {
        setTimeout(() => {
          setVisibleSteps((prev) => new Set([...prev, index]));
        }, 300 + index * 200);
      });
    };
    setTimeout(animateSteps, 500);
  }, []);

  return (
    <Box py={80} px="md" bg={theme.colors.gray[0]}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
          transition={{ duration: 1 }}
        >
          <Stack align="center" mb="xl">
            <Title order={2}>The Referral Journey</Title>
            <Text size="lg" ta="center" maw={700}>
              From initial contact to successful funding — here's exactly what happens when you send us a lead
            </Text>
          </Stack>
        </motion.div>

        <Timeline active={steps.length} bulletSize={40} 
          lineWidth={4} mt="lg" reverseActive
          styles={(theme) => ({
            itemBullet: {
              backgroundColor: theme.colors.green[1],
            },
            itemLine: {
              backgroundColor: theme.colors.green[1],
            }
          })}
        >
          {steps.map((step, index) => {
            return (
                <Timeline.Item
                  title={<Title order={4}>{step.title}</Title>}
                  style={{
                    '--item-border-color': 'green',
                  }}
                  color={index >= steps.length-5 ? 'green' : 'blue'}
                >
                  <Text size="md" mt={4}>{step.description}</Text>
                  <div>{index===1 && 
                    <Divider size="xl" pt="md" label={isDesktop? "Integrated Implementation": "Full Implementation"} color={theme.colors.secondary[0]}
                      styles={{
                        label: {
                          fontSize:isDesktop ? "30px" : "15px",
                          color: theme.colors.secondary[0]
                        }
                      }}/>}
                      </div>
                </Timeline.Item>
            );
          })}
        </Timeline>
      </Container>
    </Box>
  );
};

export default ReferralJourneySection;
