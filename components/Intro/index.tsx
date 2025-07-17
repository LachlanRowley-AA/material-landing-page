'use client'

import React from "react";
import { Container, Grid, Title, Text, useMantineTheme } from "@mantine/core";
import { motion} from 'motion/react';

export const IntroSection = () => {
  const theme = useMantineTheme();
  return (
    <Container size="xl" py="xl" id="finance">
      <Title order={1} mb="md">
        <Text inherit span c={theme.colors.secondary[0]}>Flexible Material Financing </Text>
        <span style={{ color: 'black' }}>for Your Business</span>
      </Title>

      {/* Paragraph 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0 }}
      >
        <Text size="xl" fw={500} c="black" mb="lg">
          Eazypay is powered by full-service asset finance specialists committed to helping businesses grow with tailored, strategic funding solutions.
        </Text>
      </motion.div>

      {/* Paragraph 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Text size="xl" fw={500} c="black" mb="lg">
          Building on our strong foundation in asset finance, we’re now focused on supporting the construction and trade sectors empowering businesses to access the building materials they need to complete projects efficiently and cost-effectively.
        </Text>
      </motion.div>

      {/* Paragraph 3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <Text size="xl" fw={500} c="black" mb="lg">
          We work hand-in-hand with clients to make high-quality materials more accessible through flexible, affordable finance options that preserve cash flow and keep projects on track.
        </Text>
      </motion.div>

      {/* Paragraph 4 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.8 }}
      >
        <Text size="xl" fw={500} c="black" mb="lg">
          Whether you're a builder starting a new development or a contractor managing a busy schedule, Eazypay is here to help you move forward with confidence.
        </Text>
      </motion.div>
    </Container>
  );
};
