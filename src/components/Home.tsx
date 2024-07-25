import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import KPICard, { CardType } from './KPICards'; 
import { Metric, SegmentGroup } from './types'; 
import './Home.css';

export default function Home() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [segmentGroups, setSegmentGroups] = useState<SegmentGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [metricsResponse, segmentsResponse] = await Promise.all([
        fetch('https://sundial-fe-interview.vercel.app/api/metrics'),
        fetch('https://sundial-fe-interview.vercel.app/api/segments')
      ]);

      const metricsData = await metricsResponse.json();
      const segmentsData = await segmentsResponse.json();

      setMetrics(metricsData.data);
      setSegmentGroups(segmentsData.data);

      initializeCards(metricsData.data, segmentsData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

const initializeCards = (metricsData: Metric[], segmentsData: SegmentGroup[]) => {
  const initialCards: CardType[] = [
    {
      id: 1,
      isEditMode: false,
      metricId: metricsData[0]?.id,
      segmentKey: segmentsData[0]?.segmentKey || '',
      segmentId: segmentsData[0]?.values[0]?.segmentId || '',
      timeseries: [
        { date: '2024-07-20', value: 100 },
        { date: '2024-07-21', value: 105 },
        { date: '2024-07-22', value: 210 },
        { date: '2024-07-23', value: 115 },
        { date: '2024-07-24', value: 120 },
        { date: '2024-07-25', value: 525 },
        { date: '2024-07-26', value: 130 },
        { date: '2024-07-27', value: 335 }
      ]
    },
    {
      id: 2,
      isEditMode: false,
      metricId: metricsData[1]?.id,
      segmentKey: segmentsData[0]?.segmentKey || '',
      segmentId: segmentsData[0]?.values[1]?.segmentId || '',
      timeseries: [
        { date: '2024-07-20', value: 200 },
        { date: '2024-07-21', value: 105 },
        { date: '2024-07-22', value: 210 },
        { date: '2024-07-23', value: 215 },
        { date: '2024-07-24', value: 420 },
        { date: '2024-07-25', value: 225 },
        { date: '2024-07-26', value: 730 },
        { date: '2024-07-27', value: 235 }
      ]
    },
    {
      id: 3,
      isEditMode: false,
      metricId: metricsData[2]?.id,
      segmentKey: segmentsData[0]?.segmentKey || '',
      segmentId: segmentsData[0]?.values[2]?.segmentId || '',
      timeseries: [
        { date: '2024-07-20', value: 340 },
        { date: '2024-07-21', value: 305 },
        { date: '2024-07-22', value: 310 },
        { date: '2024-07-23', value: 315 },
        { date: '2024-07-24', value: 320 },
        { date: '2024-07-25', value: 325 },
        { date: '2024-07-26', value: 330 },
        { date: '2024-07-27', value: 335 }
      ]
    }
  ];

  setCards(initialCards);
};


const addCard = (index: number, position: 'left' | 'right') => {
  const newCards = [...cards];
  const newCard: CardType = { id: Date.now(), isEditMode: true, metricId: '', segmentKey: '', segmentId: '', timeseries: [] };

  if (position === 'left') {
    newCards.splice(index, 0, newCard);
  } else {
    newCards.splice(index + 1, 0, newCard);
  }

  setCards(newCards);
  console.log("New card added:", newCard);
};



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <Box className="cards-container">
        {cards.map((card, index) => (
          <KPICard
            key={card.id}
            card={card}
            metrics={metrics}
            segmentGroups={segmentGroups}
            onAddCard={(position) => addCard(index, position)}
            onUpdateCards={setCards}
          />
        ))}
      </Box>
    </div>
  );
}
