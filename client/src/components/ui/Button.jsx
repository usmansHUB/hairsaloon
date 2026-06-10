import { styled } from '../../styles/stitches.config';

const StyledButton = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '$2',
  fontFamily: '$body',
  fontWeight: 600,
  fontSize: '$sm',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  borderRadius: '$full',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',

  variants: {
    variant: {
      primary: {
        background: 'linear-gradient(135deg, $gold 0%, $goldDark 100%)',
        color: '$bg',
        boxShadow: '$glow',
        '&:hover:not(:disabled)': {
          transform: 'translateY(-2px)',
          boxShadow: '0 0 60px rgba(201, 169, 98, 0.35)',
        },
      },
      outline: {
        background: 'transparent',
        color: '$gold',
        border: '1px solid $borderStrong',
        '&:hover:not(:disabled)': {
          background: 'rgba(201, 169, 98, 0.1)',
          borderColor: '$gold',
        },
      },
      ghost: {
        background: 'transparent',
        color: '$creamMuted',
        '&:hover:not(:disabled)': { color: '$gold' },
      },
      danger: {
        background: 'rgba(232, 93, 93, 0.15)',
        color: '$error',
        border: '1px solid rgba(232, 93, 93, 0.3)',
        '&:hover:not(:disabled)': { background: 'rgba(232, 93, 93, 0.25)' },
      },
    },
    size: {
      sm: { padding: '$2 $4', fontSize: '$xs' },
      md: { padding: '$3 $6' },
      lg: { padding: '$4 $8', fontSize: '$md' },
    },
    fullWidth: {
      true: { width: '100%' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },

  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
    transform: 'none !important',
  },
});

export const Button = ({ children, variant, size, fullWidth, ...props }) => (
  <StyledButton variant={variant} size={size} fullWidth={fullWidth} {...props}>
    {children}
  </StyledButton>
);
