import React from "react";
import { Select, MenuItem, Button, Box, Grid, Typography, SelectChangeEvent } from "@mui/material";
import { CardType } from "./KPICards";
import { Metric, SegmentGroup } from "./types";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import "./Home.css";

interface EditModeProps {
  card: CardType;
  metrics: Metric[];
  segmentGroups: SegmentGroup[];
  onSave: () => void;
  onCancel: () => void;
  onUpdateCards: (update: (cards: CardType[]) => CardType[]) => void;
}

const EditMode: React.FC<EditModeProps> = ({
  card,
  metrics,
  segmentGroups,
  onSave,
  onCancel,
  onUpdateCards,
}) => {
  const handleMetricChange = (event: SelectChangeEvent<string>) => {
    const updatedCard = { ...card, metricId: event.target.value };
    onUpdateCards((prevCards) =>
      prevCards.map((c) => (c.id === card.id ? updatedCard : c))
    );
  };

  const handleSegmentChange = (event: SelectChangeEvent<string>) => {
    const updatedCard = { ...card, segmentKey: event.target.value };
    onUpdateCards((prevCards) =>
      prevCards.map((c) => (c.id === card.id ? updatedCard : c))
    );
  };

  const handleSegmentValueChange = (event: SelectChangeEvent<string>) => {
    const updatedCard = { ...card, segmentId: event.target.value };
    onUpdateCards((prevCards) =>
      prevCards.map((c) => (c.id === card.id ? updatedCard : c))
    );
  };

  return (
    <div>
      <Box>
        <Select
          className="select"
          IconComponent={KeyboardArrowDownIcon}
          value={card.metricId || ""}
          onChange={handleMetricChange}
          displayEmpty
        >
          <MenuItem value="" disabled>
            Select Metric
          </MenuItem>
          {metrics.map((metric) => (
            <MenuItem key={metric.id} value={metric.id}>
              {metric.displayName}
            </MenuItem>
          ))}
        </Select>
        <Select
          className="select"
          value={card.segmentKey || ""}
          IconComponent={KeyboardArrowDownIcon}
          onChange={handleSegmentChange}
          displayEmpty
          style={{ marginTop: "8px" }}
        >
          <MenuItem value="" disabled>
            Select Segment Group
          </MenuItem>
          {segmentGroups.map((group) => (
            <MenuItem key={group.segmentKey} value={group.segmentKey}>
              {group.displayName}
            </MenuItem>
          ))}
        </Select>
        {card.segmentKey && (
          <Select
            className="select"
            value={card.segmentId || ""}
            IconComponent={KeyboardArrowDownIcon}
            onChange={handleSegmentValueChange}
            displayEmpty
            style={{ marginTop: "8px" }}
          >
            <MenuItem value="" disabled>
              Select Segment
            </MenuItem>
            {segmentGroups
              .find((group) => group.segmentKey === card.segmentKey)
              ?.values.map((segment) => (
                <MenuItem key={segment.segmentId} value={segment.segmentId}>
                  {segment.displayName}
                </MenuItem>
              ))}
          </Select>
        )}
      </Box>
      <Grid display="flex" gap="20px">
        <Button
          variant="contained"
          onClick={onCancel}
          style={{
            marginTop: "8px",
            backgroundColor: "#FF5D391F",
            borderRadius: "8px",
            padding: "6px 4px",
            width: "100px",
            boxShadow: "none",
          }}
        >
          <Typography sx={{ color: "#FF5D39", fontSize: "14px" }}>Cancel</Typography>
        </Button>
        <Button
          variant="contained"
          onClick={onSave}
          style={{
            marginTop: "8px",
            backgroundColor: "#119F97",
            borderRadius: "8px",
            padding: "6px 4px",
            width: "100px",
            boxShadow: "none",
          }}
        >
          <Typography sx={{ fontSize: "14px" }}>Save</Typography>
        </Button>
      </Grid>
    </div>
  );
};

export default EditMode;
