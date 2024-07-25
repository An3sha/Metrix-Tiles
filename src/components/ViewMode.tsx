import React, { useMemo } from "react";
import { CardType } from "./KPICards";
import { Metric, Segment } from "./types"; 
import { Typography, Box, IconButton, Grid } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

interface ViewModeProps {
  card: CardType;
  metric: Metric; 
  segment: Segment; 
  onEdit: () => void;
  onAddCard: (position: "left" | "right") => void;
}

const ViewMode: React.FC<ViewModeProps> = ({
  card,
  metric,
  segment,
  onEdit,
  onAddCard,
}) => {
  const getTodaysValue = () => {
    const today = new Date().toISOString().split("T")[0]; 

    if (card.timeseries) {
      const todaysData = card.timeseries.find(
        (entry) => entry.date.trim().split("T")[0] === today
      );

      if (todaysData) {
        const value = todaysData.value;

        if (value >= 1000) {
          return (value / 1000).toFixed(1) + "K"; 
        }

        return value.toString();
      }

      return "NIL";
    }

    return "NIL";
  };

  const percentageChange = useMemo(() => {
    if (!card.timeseries || card.timeseries.length < 8) return 0;

    const latestValue = card.timeseries[0].value;
    const weekAgoValue = card.timeseries[7].value;

    if (weekAgoValue === 0) return 0;

    return ((latestValue - weekAgoValue) / weekAgoValue) * 100;
  }, [card.timeseries]);

  const chartOptions = useMemo(() => {
    const data = card.timeseries
      ? card.timeseries.map((point) => ({
          x: new Date(point.date).getTime(),
          y: point.value,
        }))
      : [];

    return {
      chart: {
        type: 'area',
        zoomType: 'x',
        height: 160, 
        width: 180,
      },
      title: {
        text: '',
      },
      subtitle: {
        text:"",
        align: 'left',
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%e %b',
        },
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      plotOptions: {
        area: {
          marker: {
            radius: 2,
          },
          lineWidth: 1,
          color: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, 'rgba(17, 159, 151, 2)'],
              [0.7, 'rgba(17, 159, 151, 0.2)']]
          },
          states: {
            hover: {
              lineWidth: 1,
            },
          },
          threshold: null,
        },
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          name: '',
          data,
        },
      ],
      credits: {
        enabled: false,
      },
    };
  }, [card.timeseries]);

  return (
    <div>
      <div onClick={onEdit}>
        <Typography
          variant="body2"
          color="black"
          fontSize="14px"
          marginTop="0px"
        >
          {metric?.displayName}, {segment?.displayName}
        </Typography>
        <Grid display="flex">
          <Box marginTop="60px">
            <Typography variant="body2" color="black" fontSize="28px">
              {getTodaysValue()}
            </Typography>
            <Grid display="flex" alignItems="center" gap="3px" marginTop="10px">
              <Typography>
                {percentageChange >= 0 ? (
                  <ArrowUpwardIcon
                    sx={{ color: "#119F97", width: "16px", height: "16px" }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    sx={{ color: "red", width: "16px", height: "16px" }}
                  />
                )}
              </Typography>
              <Typography className="percentage-change" variant="body2">
                {percentageChange.toFixed(1)}%
              </Typography>
              <Typography
                className="percentage-change"
                variant="body2"
                color="darkgray"
              >
                Δ7d
              </Typography>
            </Grid>
          </Box>
          <Box sx={{ height: "180px", width: "200px", flexShrink: 0 }}>
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </Box>
        </Grid>
      </div>
      <Box display="flex" justifyContent="space-between" mt={1}>
        <IconButton
          className="icon left-icon"
          sx={{ opacity: 0, transition: "opacity 0.3s ease" }}
          onClick={() => onAddCard("left")}
        >
          <AddCircleIcon sx={{ color: "#119F97" }} />
        </IconButton>
        <IconButton
          className="icon right-icon"
          sx={{ opacity: 0, transition: "opacity 0.3s ease" }}
          onClick={() => onAddCard("right")}
        >
          <AddCircleIcon sx={{ color: "#119F97" }} />
        </IconButton>
      </Box>
    </div>
  );
};

export default ViewMode;
