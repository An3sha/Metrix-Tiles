import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import EditMode from "./EditMode";
import ViewMode from "./ViewMode";
import { Metric, SegmentGroup } from "./types";
import "./Home.css";

export interface CardType {
  id: number;
  isEditMode: boolean;
  metricId?: string;
  segmentKey?: string;
  segmentId?: string;
    timeseries?: Array<{ date: string; value: number }>;
}

interface KPICardProps {
  card: CardType;
  metrics: Metric[];
  segmentGroups: SegmentGroup[];
  onAddCard: (position: "left" | "right") => void;
  onUpdateCards: (update: (cards: CardType[]) => CardType[]) => void;
}


const KPICard: React.FC<KPICardProps> = ({
  card,
  metrics,
  segmentGroups,
  onAddCard,
  onUpdateCards,
}) => {
  const [timeseries, setTimeseries] = useState<Array<{ date: string; value: number }> | undefined>(card.timeseries);
  const [originalCard, setOriginalCard] = useState<CardType>(card);

  const handleToggleEditMode = async () => {
    if (card.isEditMode) {
      const updatedCard = { ...card, isEditMode: !card.isEditMode };
      onUpdateCards((prevCards: CardType[]) =>
        prevCards.map((c) => (c.id === card.id ? updatedCard : c))
      );

      const requestBody = {
        metric: card.metricId,
        segmentKey: card.segmentKey,
        segmentId: card.segmentId,
      };

      try {
        const response = await fetch("https://sundial-fe-interview.vercel.app/api/snapshot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("API response:", data.data["values"]);
        setTimeseries(data.data["values"]);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    } else {
      setOriginalCard(card);
      const updatedCard = { ...card, isEditMode: !card.isEditMode };
      onUpdateCards((prevCards: CardType[]) =>
        prevCards.map((c) => (c.id === card.id ? updatedCard : c))
      );
    }
  };

  const handleCancelEdit = () => {
    onUpdateCards((prevCards: CardType[]) =>
      prevCards.map((c) => (c.id === card.id ? originalCard : c))
    );
  };

  const metric = metrics.find((m) => m.id === card.metricId);
  const segmentGroup = segmentGroups.find(
    (sg) => sg.segmentKey === card.segmentKey
  );
  const segment = segmentGroup?.values.find(
    (s) => s.segmentId === card.segmentId
  );

  return (
    <Card className="card">
      <CardContent>
        {card.isEditMode ? (
          <EditMode
            card={card}
            metrics={metrics}
            segmentGroups={segmentGroups}
            onSave={handleToggleEditMode}
            onCancel={handleCancelEdit}
            onUpdateCards={onUpdateCards}
          />
        ) : (
          metric && segmentGroup && segment && (
            <ViewMode
              card={{ ...card, timeseries }}
              metric={metric} 
              segment={segment} 
              onEdit={handleToggleEditMode}
              onAddCard={onAddCard}
            />
          )
        )}
      </CardContent>
    </Card>
  );
};


export default KPICard;
