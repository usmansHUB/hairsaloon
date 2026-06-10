import { styled } from '../../styles/stitches.config';

export const Card = styled('div', {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  overflow: 'hidden',
  transition: 'transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease',

  variants: {
    hoverable: {
      true: {
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '$elevated',
          borderColor: '$borderStrong',
        },
      },
    },
    padding: {
      none: {},
      md: { padding: '$6' },
      lg: { padding: '$8' },
    },
  },
  defaultVariants: {
    padding: 'none',
  },
});

export const CardImage = styled('div', {
  position: 'relative',
  aspectRatio: '4/3',
  overflow: 'hidden',

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.6s ease',
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to top, $bg 0%, transparent 60%)',
  },
});

export const CardBody = styled('div', {
  padding: '$6',
});

export const CardTitle = styled('h3', {
  fontFamily: '$display',
  fontSize: '$2xl',
  fontWeight: 600,
  color: '$cream',
  marginBottom: '$2',
});

export const CardText = styled('p', {
  fontSize: '$sm',
  color: '$textMuted',
  lineHeight: 1.7,
});
