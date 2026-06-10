import { useEffect, useState } from 'react';
import { Calendar, Clock, User, Scissors } from 'lucide-react';
import { styled } from '../styles/stitches.config';
import { Button } from '../components/ui/Button';
import { appointmentsApi } from '../api/client';

const Page = styled('div', { padding: '$12 $6 $20', maxWidth: '900px', margin: '0 auto' });
const Title = styled('h1', { fontFamily: '$display', fontSize: '$4xl', color: '$cream', marginBottom: '$12', textAlign: 'center' });

const List = styled('div', { display: 'flex', flexDirection: 'column', gap: '$6' });

const ApptCard = styled('div', {
  background: '$bgCard',
  border: '1px solid $border',
  borderRadius: '$lg',
  padding: '$6',
  display: 'grid',
  gap: '$4',
  '@md': { gridTemplateColumns: '1fr auto', alignItems: 'center' },
});

const ApptTitle = styled('h3', { fontFamily: '$display', fontSize: '$2xl', color: '$cream' });
const Row = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  fontSize: '$sm',
  color: '$textMuted',
  '& svg': { color: '$gold', flexShrink: 0 },
});

const Status = styled('span', {
  padding: '$1 $3',
  borderRadius: '$full',
  fontSize: '$xs',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',

  variants: {
    status: {
      pending: { background: 'rgba(201,169,98,0.15)', color: '$gold' },
      confirmed: { background: 'rgba(107,207,138,0.15)', color: '$success' },
      completed: { background: 'rgba(154,146,136,0.15)', color: '$textMuted' },
      cancelled: { background: 'rgba(232,93,93,0.15)', color: '$error' },
    },
  },
});

const Empty = styled('p', { textAlign: 'center', color: '$textMuted', padding: '$16' });

export const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    appointmentsApi.mine()
      .then((data) => setAppointments(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    await appointmentsApi.cancel(id);
    load();
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <Page><Empty>Loading...</Empty></Page>;

  return (
    <Page>
      <Title>My Appointments</Title>
      {appointments.length === 0 ? (
        <Empty>No appointments yet. Book your first visit!</Empty>
      ) : (
        <List>
          {appointments.map((appt) => (
            <ApptCard key={appt._id}>
              <div>
                <ApptTitle>
                  {Array.isArray(appt.services) && appt.services.length > 0
                    ? appt.services.map(s => s.name).join(', ')
                    : 'Services'}
                </ApptTitle>
                <Row><User size={16} /> {appt.stylist?.name}</Row>
                <Row><Calendar size={16} /> {formatDate(appt.date)}</Row>
                <Row><Clock size={16} /> {appt.timeSlot}</Row>
                <Row><Scissors size={16} /> {appt.totalDuration} min · ${appt.totalPrice}</Row>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                <Status status={appt.status}>{appt.status}</Status>
                {['pending', 'confirmed'].includes(appt.status) && (
                  <Button variant="danger" size="sm" onClick={() => handleCancel(appt._id)}>
                    Cancel
                  </Button>
                )}
              </div>
            </ApptCard>
          ))}
        </List>
      )}
    </Page>
  );
};
