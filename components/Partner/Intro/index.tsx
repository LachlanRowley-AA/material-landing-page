'use client'

import React from "react";
import { Container, Grid, Title, Text, useMantineTheme } from "@mantine/core";
import { motion} from 'motion/react';

export const IntroSection = () => {
  const theme = useMantineTheme();
  return (
    <Container size="xl" py="xl" id="finance">
      <Title order={1} mb="md">
        <Text inherit span c={theme.colors.secondary[0]}>Offer Easy Finance </Text>
        <Text inherit span c="black">to Your Customers with  
          <Text inherit span c={theme.colors.primary[0]}> eazy</Text>
          <Text inherit span c={theme.colors.secondary[1]}>pay</Text>
        </Text>
      </Title>

      {/* Paragraph 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0 }}
      >
        <Text size="xl" fw={600} c="black" mb="lg">
          No admin, 0 fees
        </Text>        
        <Text size="xl" fw={500} c="black" mb="lg">
          Eazypay helps suppliers grow their sales by offering flexible finance solutions directly to their customers without the admin or risk of managing payment plans.
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
          By partnering with Eazypay, you can remove financial friction at checkout making it easier for your customers to say yes to larger orders and complete more projects with confidence.
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
          Our simple onboarding process and seamless finance options help your customers access the materials they need now, while you get paid upfront, every time.
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
          Join Eazypay’s network of trusted suppliers and start offering smarter, more flexible payment options that strengthen customer loyalty and drive business growth.
        </Text>
      </motion.div>
    </Container>
  );
};
export default IntroSection;