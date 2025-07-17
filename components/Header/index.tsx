'use client';

import {
  Anchor,
  Burger,
  Button,
  Container,
  ContainerProps,
  Flex,
  Group,
  MantineBreakpoint,
  MantineRadius,
  Text,
  Image,
} from '@mantine/core';
import { IconArrowRight } from '@tabler/icons-react';
import { motion } from 'motion/react';
import NextLink from 'next/link';
import classes from './index.module.css';
import { text } from 'stream/consumers';
import { useMediaQuery } from '@mantine/hooks';

export type HeaderLink = {
  label: string;
  href: string;
};

const HEADER_LINKS: HeaderLink[] = [
  { label: 'Home', href: 'Home' },
  { label: 'About', href: 'About' },
];

type Header01Props = ContainerProps & {
  /** Logo to display in the header */
  logo?: React.ReactNode;

  /** Links to display in the header */
  links?: HeaderLink[];

  /** Title for the call to action button */
  callToActionTitle?: string;

  /** Title for CtA button on mobile */
  callToActionSmall?: string;

  /** URL for the call to action button */
  callToActionUrl?: string;

  /** Callback for when the menu is toggled */
  onMenuToggle?: () => void;

  /** Whether the menu is open */
  isMenuOpen?: boolean;

  /** Breakpoint at which the menu is displayed */
  breakpoint?: MantineBreakpoint;

  /** Border radius of the header */
  radius?: MantineRadius | number;
};

const scrollToSection = (id: string) => {
  const section = document.getElementById(id);
  if (section) {
    const yOffset = -30; // scroll 20px above the section
    const y =
      section.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  } else {
    console.log('section not found');
  }
};



export const Header01 = ({
  style,
  breakpoint = 'xs',
  logo = (
    <Image src="/logo_transparent.png" h={30} maw={200}/>
  ),
  callToActionTitle = 'Submit an Application',
  callToActionSmall = 'Submit',
  callToActionUrl = 'contact',
  links = HEADER_LINKS,
  onMenuToggle,
  isMenuOpen,
  h = 60,
  ...containerProps
}: Header01Props) => {
  const isSmall = useMediaQuery('(max-width: 768px)'); // sm breakpoint
  return(
  <Container
  className={classes.container}
  component="header"
  style={{ ...style, position: 'relative' }}
  w={{ base: '100%' }}
  h={h}
  maw="100vw"
  {...containerProps}
>
  <Flex
    justify="space-between"
    align="center"
    h="100%"
    gap="xs"
    wrap="nowrap"
    style={{ position: 'relative' }}
  >
    {/* LEFT: Logo */}
    <Group gap={0} style={{ flexShrink: 0 }}>
      {logo}
    </Group>

    {/* CENTER: Links absolutely centered */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      viewport={{ once: true }}
      style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Flex
        px="lg"
        gap="lg"
        align="center"
        visibleFrom={breakpoint}
        className={classes['link-container']}
      >
        {links.map((link) => (
          <Button
            key={link.href}
            className={classes.link}
            onClick={(e: any) => {
              e.preventDefault();
              scrollToSection(link.href);
            }}
            td="none"
            bg="transparent"
            fz="lg"
          >
            {link.label}
          </Button>
        ))}
      </Flex>
    </motion.div>

    {/* RIGHT: CTA */}
    <Button
      onClick={(e: any) => {
        e.preventDefault();
        scrollToSection(callToActionUrl);
      }}
      bg="transparent"
      className={classes.cta}
      radius="xl"
      rightSection={<IconArrowRight size={16} />}
      style={{ flexShrink: 0 }}
      styles={{
        label: {
          color: '#149a91',
        },
        section: {
          color: '#149a91',
        },
      }}
    >
      {isSmall ? callToActionSmall : callToActionTitle}
    </Button>
  </Flex>
</Container>
)};