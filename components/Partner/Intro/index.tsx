'use client'

import React from "react";
import {
  Container,
  Title,
  Text,
  Box,
  Stack,
  ThemeIcon,
  useMantineTheme,
} from "@mantine/core";
import { motion } from 'motion/react';
import { Shield, LineChart, Handshake } from "lucide-react";

export const IntroSection = () => {
  const theme = useMantineTheme();

  return (
    <Container size="xl" py="xl" id="finance">
      <Title order={1} mb="md">
        <Text inherit span c={theme.colors.secondary[0]}>
          Unlock More Sales{" "}
        </Text>
        <Text inherit span c="black">
          at No Cost or Risk With{" "}
          <Text inherit span c={theme.colors.primary[0]}></Text>
          <Text inherit span c={theme.colors.secondary[0]}>Breezi</Text>
        </Text>
      </Title>

      <Stack gap="xl" mt="lg">
        {/* Section 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Text size="xl" fw={600} c="black" mb="xs">
            More Sales, Less Risk
          </Text>
          <Text size="lg" fw={500} c="black">
            Eazypay helps you grow sales by offering
            customers flexible ways to manage their purchases without exposing your
            business to Credit risk, extra admin overhead and {" "}
              <Text inherit span fw={600}>without changing your current accounts process</Text>.
          </Text>
        </motion.div>

        {/* Section 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Text size="xl" fw={600} c="black" mb="xs">
            Sales Without Friction
          </Text>
          <Text size="lg" fw={500} c="black">
            Remove financial blockers at checkout. Our purchasing support helps
            your customers say yes to larger orders, faster, enabling more projects
            and more confident buying decisions.
          </Text>
        </motion.div>

        {/* Section 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <Text size="xl" fw={600} c="black" mb="xs">
            Trusted, Transparent, Supportive
          </Text>
          <Text size="lg" fw={500} c="black" mb="lg">
            We operate with full transparency and professionalism; no brand risk,
            no surprises. Our team is dedicated to educating and supporting your
            customers, so you can focus on delivering great service.
          </Text>

          <Text size="lg" fw={500} c="black">
            Join Eazypay’s network of trusted suppliers and offer a smarter path to
            purchasing while growing sales safely and sustainably.
          </Text>
        </motion.div>
                {/* Quotation block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Box
            p="md"
            bg={theme.colors.gray[0]}
            style={{
              borderLeft: `4px solid ${theme.colors.primary[6]}`,
              fontStyle: "italic",
            }}
          >
            <Text size="lg" fw={600} c="black">
              “We make it easy for your customers to access what they need while
              you stay in control, get paid upfront, and build long-term loyalty.”
            </Text>
          </Box>
        </motion.div>
      </Stack>
    </Container>
  );
};

export default IntroSection;
