import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { styled } from '../styles/stitches.config';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { ServiceImage, StylistImage } from '../components/ui/SafeImage';
import { servicesApi, stylistsApi, appointmentsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Page = styled('div', { padding: '$12 $6 $20', maxWidth: '960px', margin: '0 auto' });
const Title = styled('h1', { fontFamily: '$display', fontSize: '$4xl', color: '$cream', textAlign: 'center', marginBottom: '$4' });
const Sub = styled('p', { color: '$textMuted', textAlign: 'center', marginBottom: '$12' });

const Form = styled('form', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$6',
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$xl',
  padding: '$8',
});

const Steps = styled('div', {
  display: 'flex',
  justifyContent: 'center',
  gap: '$4',
  marginBottom: '$10',
});

const Step = styled('div', {
  width: 36,
  height: 36,
  borderRadius: '$full',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '$sm',
  fontWeight: 600,
  border: '1px solid $border',
  color: '$textMuted',

  variants: {
    active: { true: { background: '$gold', color: '$bg', borderColor: '$gold' } },
    done: { true: { background: 'rgba(201,169,98,0.2)', color: '$gold', borderColor: '$gold' } },
  },
});

const Slots = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '$3',
  '@sm': { gridTemplateColumns: 'repeat(5, 1fr)' },
});

const SlotBtn = styled('button', {
  padding: '$3',
  borderRadius: '$md',
  fontSize: '$sm',
  border: '1px solid $border',
  color: '$textMuted',
  transition: 'all 0.2s',

  variants: {
    selected: {
      true: { background: '$gold', color: '$bg', borderColor: '$gold' },
    },
  },
});

const PickerLabel = styled('span', {
  fontSize: '$xs',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '$creamMuted',
  display: 'block',
  marginBottom: '$4',
});

const PickerGrid = styled('div', {
  display: 'grid',
  gap: '$4',
  gridTemplateColumns: 'repeat(2, 1fr)',
  '@md': { gridTemplateColumns: 'repeat(3, 1fr)' },
});

const PickerCard = styled('button', {
  border: '1px solid $border',
  borderRadius: '$lg',
  overflow: 'hidden',
  textAlign: 'left',
  background: '$bgElevated',
  transition: 'all 0.2s',

  '&:hover': { borderColor: '$borderStrong' },

  variants: {
    selected: {
      true: {
        borderColor: '$gold',
        boxShadow: '$glow',
      },
    },
  },
});

const PickerImage = styled('div', {
  aspectRatio: '4/3',
  overflow: 'hidden',

  '& img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
});

const PickerBody = styled('div', { padding: '$3 $4' });
const PickerTitle = styled('div', {
  fontFamily: '$display',
  fontSize: '$md',
  color: '$cream',
  lineHeight: 1.3,
});
const PickerMeta = styled('div', {
  fontSize: '$xs',
  color: '$textMuted',
  marginTop: '$1',
});

const Error = styled('p', { color: '$error', fontSize: '$sm', textAlign: 'center' });
const Success = styled('div', {
  textAlign: 'center',
  padding: '$12',
  '& svg': { color: '$success', marginBottom: '$6' },
});

const SummaryPanel = styled('div', {
  background: 'linear-gradient(135deg, rgba(201,169,98,0.08) 0%, rgba(201,169,98,0.04) 100%)',
  border: '1px solid rgba(201,169,98,0.3)',
  borderRadius: '$lg',
  padding: '$6',
  marginBottom: '$8',
});

const SummaryTitle = styled('h3', {
  fontFamily: '$display',
  fontSize: '$lg',
  color: '$cream',
  marginBottom: '$4',
});

const SummaryRow = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: '$textMuted',
  fontSize: '$sm',
  marginBottom: '$3',
  paddingBottom: '$3',
  borderBottom: '1px solid rgba(201,169,98,0.2)',

  '&:last-child': { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 },
});

const SummaryValue = styled('span', {
  fontWeight: 600,
  color: '$gold',
});

const ServicesList = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const ServiceItem = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  padding: '$3',
  background: 'rgba(0, 0, 0, 0.3)',
  borderRadius: '$md',
  fontSize: '$sm',
  color: '$textMuted',

  '& .service-name': { fontWeight: 600, color: '$cream' },
  '& .service-duration': { fontSize: '$xs', color: '$textMuted', marginTop: '$1' },
});

const RemoveServiceBtn = styled('button', {
  background: 'none',
  border: 'none',
  color: '$error',
  cursor: 'pointer',
  fontSize: '$xs',
  padding: '$1 $2',
  borderRadius: '$sm',
  transition: 'all 0.2s',
  '&:hover': { background: 'rgba(232, 93, 93, 0.15)' },
});

export const Book = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [stylists, setStylists] = useState([]);
  const [slots, setSlots] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [form, setForm] = useState({
    serviceIds: searchParams.get('service') ? [searchParams.get('service')] : [],
    stylistId: '',
    date: '',
    timeSlot: '',
    notes: '',
    guestName: '',
    guestEmail: '',
    guestPhone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { user } = useAuth();

  // Calculate totals for selected services
  const selectedServices = services.filter(s => form.serviceIds.includes(s._id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleToggleService = (serviceId) => {
    setForm(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter(id => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  const handleRemoveService = (serviceId) => {
    setForm(prev => ({
      ...prev,
      serviceIds: prev.serviceIds.filter(id => id !== serviceId),
    }));
  };

  useEffect(() => {
    Promise.all([servicesApi.getAll(), stylistsApi.getAll()])
      .then(([s, st]) => {
        setServices(Array.isArray(s) ? s : []);
        setStylists(Array.isArray(st) ? st : []);
      })
      .catch(() => {
        setServices([]);
        setStylists([]);
      });
  }, []);

  useEffect(() => {
    if (form.stylistId && form.date && form.serviceIds.length > 0) {
      appointmentsApi
        .getSlots(form.stylistId, form.date, form.serviceIds)
        .then((data) => {
          setSlots(Array.isArray(data?.slots) ? data.slots : []);
          setBookedSlots(Array.isArray(data?.bookedSlots) ? data.bookedSlots : []);
        })
        .catch(() => {
          setSlots([]);
          setBookedSlots([]);
        });
    } else {
      setSlots([]);
      setBookedSlots([]);
    }
  }, [form.stylistId, form.date, form.serviceIds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!user) {
      setError('You must be logged in to book. Please create an account or log in.');
      return;
    }
    if (form.serviceIds.length === 0 || !form.stylistId || !form.date || !form.timeSlot) {
      setError('Please complete all required fields. Select at least one service.');
      return;
    }
    setLoading(true);
    try {
      await appointmentsApi.create(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Page>
        <Success>
          <CheckCircle size={64} />
          <Title>Booking Confirmed!</Title>
          <Sub>We look forward to welcoming you. A confirmation has been saved to your account.</Sub>
          <Button onClick={() => navigate('/appointments')}>View My Appointments</Button>
        </Success>
      </Page>
    );
  }

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Page>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Title>Book Your Appointment</Title>
        <Sub>Select your services, stylist, and preferred time.</Sub>

        <Steps>
          <Step active={form.serviceIds.length > 0} done={form.serviceIds.length > 0}>1</Step>
          <Step active={!!form.stylistId} done={!!form.stylistId}>2</Step>
          <Step active={!!form.date} done={!!form.date}>3</Step>
          <Step active={!!form.timeSlot} done={!!form.timeSlot}>4</Step>
        </Steps>

        {/* Show summary panel if services are selected */}
        {form.serviceIds.length > 0 && (
          <SummaryPanel>
            <SummaryTitle>Booking Summary</SummaryTitle>
            <ServicesList>
              {selectedServices.map((service) => (
                <ServiceItem key={service._id}>
                  <div>
                    <div className="service-name">{service.name}</div>
                    <div className="service-duration">{service.duration} min · ${service.price}</div>
                  </div>
                  <RemoveServiceBtn
                    type="button"
                    onClick={() => handleRemoveService(service._id)}
                  >
                    Remove
                  </RemoveServiceBtn>
                </ServiceItem>
              ))}
            </ServicesList>
            <div style={{ marginTop: '$6', paddingTop: '$4', borderTop: '1px solid rgba(201,169,98,0.2)' }}>
              <SummaryRow>
                <span>Total Duration:</span>
                <SummaryValue>{totalDuration} min</SummaryValue>
              </SummaryRow>
              <SummaryRow>
                <span>Total Price:</span>
                <SummaryValue>${totalPrice}</SummaryValue>
              </SummaryRow>
            </div>
          </SummaryPanel>
        )}

        <Form onSubmit={handleSubmit}>
          <div>
            <PickerLabel>Choose services (select one or more)</PickerLabel>
            <PickerGrid>
              {services.map((s) => (
                <PickerCard
                  key={s._id}
                  type="button"
                  selected={form.serviceIds.includes(s._id)}
                  onClick={() => handleToggleService(s._id)}
                >
                  <PickerImage>
                    <ServiceImage service={s} />
                  </PickerImage>
                  <PickerBody>
                    <PickerTitle>{s.name}</PickerTitle>
                    <PickerMeta>${s.price} · {s.duration} min</PickerMeta>
                  </PickerBody>
                </PickerCard>
              ))}
            </PickerGrid>
          </div>

          <div>
            <PickerLabel>Choose your stylist</PickerLabel>
            <PickerGrid>
              {stylists.map((s) => (
                <PickerCard
                  key={s._id}
                  type="button"
                  selected={form.stylistId === s._id}
                  onClick={() => setForm({ ...form, stylistId: s._id, timeSlot: '' })}
                >
                  <PickerImage>
                    <StylistImage stylist={s} />
                  </PickerImage>
                  <PickerBody>
                    <PickerTitle>{s.name}</PickerTitle>
                    <PickerMeta>{s.title}</PickerMeta>
                  </PickerBody>
                </PickerCard>
              ))}
            </PickerGrid>
          </div>

          <Input
            label="Date"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value, timeSlot: '' })}
            min={minDate}
            required
          />

          {form.stylistId && form.date && (
            <div>
              <label style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--colors-creamMuted)', display: 'block', marginBottom: '0.75rem' }}>
                Available Times
              </label>
              {bookedSlots.length > 0 && (
                <p style={{ color: 'var(--colors-textMuted)', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                  Booked slots for this day: <strong style={{ color: 'var(--colors-cream)' }}>{bookedSlots.join(', ')}</strong>
                </p>
              )}
              {slots.length === 0 ? (
                <p style={{ color: 'var(--colors-textMuted)', fontSize: '0.875rem' }}>No available slots left for this day. Please choose another date or stylist.</p>
              ) : (
                <Slots>
                  {slots.map((slot) => (
                    <SlotBtn
                      key={slot}
                      type="button"
                      selected={form.timeSlot === slot}
                      onClick={() => setForm({ ...form, timeSlot: slot })}
                    >
                      {slot}
                    </SlotBtn>
                  ))}
                </Slots>
              )}
            </div>
          )}

          {!user && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--colors-textMuted)' }}>You must be logged in to book an appointment.</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                <Button type="button" onClick={() => navigate('/register')}>Create Account</Button>
                <Button type="button" onClick={() => navigate('/login')}>Log In</Button>
              </div>
            </div>
          )}

          <Textarea
            label="Notes (optional)"
            placeholder="Any special requests or allergies..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />

          {error && <Error>{error}</Error>}

          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </Form>
      </motion.div>
    </Page>
  );
};
