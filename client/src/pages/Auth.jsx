import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { styled } from '../styles/stitches.config';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const Page = styled('div', {
  minHeight: 'calc(100vh - 72px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '$8 $6',
  background: 'radial-gradient(ellipse at top, rgba(201,169,98,0.08) 0%, transparent 60%)',
});

const Card = styled('div', {
  width: '100%',
  maxWidth: '440px',
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  padding: '$10',
  boxShadow: '$elevated',
});

const Title = styled('h1', {
  fontFamily: '$display',
  fontSize: '$4xl',
  color: '$cream',
  textAlign: 'center',
  marginBottom: '$2',
});

const Sub = styled('p', {
  textAlign: 'center',
  color: '$textMuted',
  fontSize: '$sm',
  marginBottom: '$8',
});

const Form = styled('form', { display: 'flex', flexDirection: 'column', gap: '$5' });
const Error = styled('p', { color: '$error', fontSize: '$sm', textAlign: 'center' });
const Footer = styled('p', {
  textAlign: 'center',
  marginTop: '$6',
  fontSize: '$sm',
  color: '$textMuted',
  '& a': { color: '$gold', '&:hover': { textDecoration: 'underline' } },
});

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 440 }}>
        <Card>
          <Title>Welcome Back</Title>
          <Sub>Sign in to manage your appointments</Sub>
          <Form onSubmit={handleSubmit}>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <Error>{error}</Error>}
            <Button type="submit" fullWidth disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </Form>
          <Footer>
            New here? <Link to="/register">Create an account</Link>
          </Footer>
        </Card>
      </motion.div>
    </Page>
  );
};

export const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/book');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ width: '100%', maxWidth: 440 }}>
        <Card>
          <Title>Join Luxe Hair</Title>
          <Sub>Create your account and book your first visit</Sub>
          <Form onSubmit={handleSubmit}>
            <Input label="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            {error && <Error>{error}</Error>}
            <Button type="submit" fullWidth disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
          </Form>
          <Footer>
            Already a member? <Link to="/login">Sign in</Link>
          </Footer>
        </Card>
      </motion.div>
    </Page>
  );
};
