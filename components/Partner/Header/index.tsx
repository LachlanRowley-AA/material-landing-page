'use client';

import {
  Anchor,
  Burger,
  Button,
  Container,
  ContainerProps,
  Drawer,
  Flex,
  Group,
  MantineBreakpoint,
  MantineRadius,
  Text,
  Image,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import NextLink from 'next/link';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import classes from './index.module.css';

export type HeaderLink = {
  label: string;
  href: string;
};

const HEADER_LINKS: HeaderLink[] = [
  { label: 'Looking for Finance', href: '/' },
  { label: 'Become a Partner', href: '/partner' },
];

type Header01Props = ContainerProps & {
  logo?: React.ReactNode;
  links?: HeaderLink[];
  callToActionTitle?: string;
  callToActionSmall?: string;
  callToActionUrl?: string;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
  breakpoint?: MantineBreakpoint;
  radius?: MantineRadius | number;
};

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    const yOffset = -30;
    const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  } else {
    console.log('section not found');
  }
};

export const Header01 = ({
  style,
  breakpoint = 'xs',
  logo = (
    <Image src="/logo.svg" h={20} maw={150} w="auto" fit="contain" />
  ),
  callToActionTitle = 'Enquire Now',
  callToActionSmall = 'Submit',
  callToActionUrl = 'contact',
  links = HEADER_LINKS,
  onMenuToggle,
  isMenuOpen,
  h = 60,
  ...containerProps
}: Header01Props) => {
  const isSmall = useMediaQuery('(max-width: 768px)');
  const theme = useMantineTheme();
  const [drawerOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Container
        className={classes.container}
        component="header"
        style={{ ...style }}
        w={{ base: '100%' }}
        h={h}
        maw="100vw"
        {...containerProps}
      >
        <Flex
          justify="space-between"
          align="center"
          h="100%"
          style={{ overflow: 'hidden' }}
          gap="xs"
          wrap="nowrap"
        >
          <Group gap={0} style={{ flexShrink: 0 }} px="md">
            {logo}
          </Group>

          {/* Desktop Links */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: 'fit-content', opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            viewport={{ once: true }}
          >
            <Flex
              flex={1}
              justify="center"
              px="lg"
              h="100%"
              align="center"
              wrap="nowrap"
              visibleFrom={breakpoint}
              gap="lg"
              className={classes['link-container']}
            >
              {links.map((link) => (
                <Button
                  key={link.href}
                  className={classes.link}
                  td="none"
                  bg="transparent"
                  fz="lg"
                  component={NextLink}
                  href={link.href}
                >
                  {link.label}
                </Button>
              ))}
            </Flex>
          </motion.div>

          {/* Mobile Burger */}
          {isSmall && (
            <Burger
              opened={drawerOpened}
              onClick={drawerOpened ? close : open}
              aria-label="Toggle navigation"
              size="sm"
              mr="sm"
            />
          )}

          {/* CTA Button */}
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              scrollToSection(callToActionUrl);
            }}
            bg="transparent"
            className={classes.cta}
            radius="xl"
            rightSection={<IconArrowRight size={16} />}
            style={{ flexShrink: 0, border: `1px solid ${theme.colors.primary[0]}` }}
            styles={{
              label: { color: theme.colors.secondary[0] },
              section: { color: theme.colors.secondary[0] },
            }}
          >
            {isSmall ? callToActionSmall : callToActionTitle}
          </Button>
        </Flex>
      </Container>

      {/* Mobile Drawer Menu */}
      <Drawer
        opened={drawerOpened}
        onClose={close}
        title="Navigation"
        padding="md"
        size="xs"
        zIndex={9999}
      >
        <Flex direction="column" gap="sm">
          {links.map((link) => (
            <Button
              key={link.href}
              component={NextLink}
              href={link.href}
              variant="light"
              onClick={close}
              fullWidth
            >
              {link.label}
            </Button>
          ))}
        </Flex>
      </Drawer>
    </>
  );
};

export default Header01;
