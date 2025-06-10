'use client';

import { JumboTitle } from '../JumboTitle/JumboTitle';
import { 
  Box, 
  Container, 
  Stack, 
  Text, 
  rem, 
  Card, 
  TextInput, 
  Button,
  Group,
  ThemeIcon,
  useMantineTheme 
} from '@mantine/core';
import { motion } from 'motion/react';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconBuilding, 
  IconCurrencyDollar,
  IconSend
} from '@tabler/icons-react';
import { createClient } from "@supabase/supabase-js"


interface FormData {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  amountRequired: string;
}

const formFields = [
  {
    key: 'name' as keyof FormData,
    label: 'Full Name',
    placeholder: 'Enter your full name',
    icon: IconUser,
    type: 'text'
  },
  {
    key: 'email' as keyof FormData,
    label: 'Email Address',
    placeholder: 'Enter your email address',
    icon: IconMail,
    type: 'email'
  },
  {
    key: 'phone' as keyof FormData,
    label: 'Phone Number',
    placeholder: 'Enter your phone number',
    icon: IconPhone,
    type: 'tel'
  },
  {
    key: 'businessName' as keyof FormData,
    label: 'Business Name',
    placeholder: 'Enter your business name',
    icon: IconBuilding,
    type: 'text'
  },
  {
    key: 'amountRequired' as keyof FormData,
    label: 'Amount Required',
    placeholder: 'Enter amount required',
    icon: IconCurrencyDollar,
    type: 'text'
  }
];

// const supabase = createClient(process.env.SUPABASE_URL, import.meta.env.SUPABASE_KEY)

export const ContactForm = () => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    amountRequired: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', formData);
    setIsSubmitting(false);
    
    // Reset form or handle success
    // setFormData({ name: '', email: '', phone: '', businessName: '', amountRequired: '' });
  };

  return (
    <Box
      bg="white"
      py={{ base: rem(60), md: rem(30) }}
      px={{ base: "0px", md: "xl" }}
      style={{ 
        minHeight: "60vh",
      }}
    >
      <Container size="md" px={{base: "0px"}}>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          viewport={{ once: true }}
        >
          <Stack align="center" gap="lg" mb={{ base: rem(40), md: rem(40) }}>
            <JumboTitle 
              order={2} 
              fz="md" 
              ta="center" 
              style={{ textWrap: 'balance' }} 
              c="#01E194"
              fw={700}
              mb="sm"
            >
              Apply now to confirm eligibility
            </JumboTitle>
            <Text 
              size="lg" 
              c="rgba(0, 0, 0, 0.7)" 
              ta="center"
              maw={600}
              style={{ lineHeight: 1.6 }}
            >
              Tell us about your business needs and we'll get back to you ASAP.
            </Text>
          </Stack>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Card 
            padding="xl" 
            radius="lg" 
            bg="rgba(20, 20, 20, 0.05)"
            style={{ 
              border: "1px solid rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                {formFields.map((field, index) => (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0.0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      ease: 'easeInOut', 
                      delay: index * 0.1 
                    }}
                    viewport={{ once: true }}
                  >
                    <TextInput
                      label={field.label}
                      placeholder={field.placeholder}
                      type={field.type}
                      size="lg"
                      radius="md"
                      value={formData[field.key]}
                      onChange={(e) => handleInputChange(field.key, e.target.value)}
                      leftSection={
                        <ThemeIcon
                          size={20}
                          radius="md"
                          variant="transparent"
                          color="#01E194"
                        >
                          <field.icon size={20} />
                        </ThemeIcon>
                      }
                      
                      required
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0.0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Button
                    type="submit"
                    size="xl"
                    radius="lg"
                    fullWidth
                    loading={isSubmitting}
                    leftSection={<IconSend size={20} />}
                    styles={{
                      root: {
                        background: "linear-gradient(135deg, #01E194 0%, #00C878 100%)",
                        border: "none",
                        padding: `${rem(16)} ${rem(24)}`,
                        height: rem(56),
                        marginTop: rem(20),
                        fontSize: rem(18),
                        fontWeight: 600,
                        transition: "all 0.3s ease",
                        '&:hover': {
                          background: "linear-gradient(135deg, #00C878 0%, #01E194 100%)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 8px 32px rgba(1, 225, 148, 0.3)",
                        },
                        '&:active': {
                          transform: "translateY(0px)",
                        }
                      },
                      label: {
                        color: 'black',
                      }
                    }}
                  >
                    {isSubmitting ? 'Submitting...' : 'Get My Quote'}
                  </Button>
                </motion.div>
              </Stack>
            </form>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0.0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut', delay: 0.8 }}
          viewport={{ once: true }}
        >
          {/* <Stack align="center" gap="sm" mt="xl">
            <Group gap="xs">
              {[...Array(5)].map((_, i) => (
                <Text key={i} size="lg" c="#01E194">★</Text>
              ))}
            </Group>
            <Text 
              size="sm" 
              c="rgba(0, 0, 0, 0.6)" 
              ta="center"
            >
              Trusted by hundreds of Australian businesses
            </Text>
          </Stack> */}
        </motion.div>
      </Container>
    </Box>
  );
};