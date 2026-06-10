import { styled } from '../../styles/stitches.config';

const Field = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const Label = styled('label', {
  fontSize: '$xs',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '$creamMuted',
});

const StyledInput = styled('input', {
  width: '100%',
  padding: '$3 $4',
  background: '$bgElevated',
  border: '1px solid $border',
  borderRadius: '$md',
  color: '$text',
  fontSize: '$md',
  transition: 'border-color 0.2s, box-shadow 0.2s',

  '&::placeholder': { color: '$textMuted' },
  '&:focus': {
    outline: 'none',
    borderColor: '$gold',
    boxShadow: '0 0 0 3px rgba(201, 169, 98, 0.15)',
  },
});

const StyledSelect = styled('select', {
  width: '100%',
  padding: '$3 $4',
  background: '$bgElevated',
  border: '1px solid $border',
  borderRadius: '$md',
  color: '$text',
  fontSize: '$md',
  cursor: 'pointer',
  '&:focus': {
    outline: 'none',
    borderColor: '$gold',
  },
});

const StyledTextarea = styled('textarea', {
  width: '100%',
  padding: '$3 $4',
  background: '$bgElevated',
  border: '1px solid $border',
  borderRadius: '$md',
  color: '$text',
  fontSize: '$md',
  minHeight: '100px',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
    borderColor: '$gold',
  },
});

const ErrorText = styled('span', {
  fontSize: '$xs',
  color: '$error',
});

export const Input = ({ label, error, ...props }) => (
  <Field>
    {label && <Label>{label}</Label>}
    <StyledInput {...props} />
    {error && <ErrorText>{error}</ErrorText>}
  </Field>
);

export const Select = ({ label, error, children, ...props }) => (
  <Field>
    {label && <Label>{label}</Label>}
    <StyledSelect {...props}>{children}</StyledSelect>
    {error && <ErrorText>{error}</ErrorText>}
  </Field>
);

export const Textarea = ({ label, error, ...props }) => (
  <Field>
    {label && <Label>{label}</Label>}
    <StyledTextarea {...props} />
    {error && <ErrorText>{error}</ErrorText>}
  </Field>
);
