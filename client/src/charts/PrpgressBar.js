import * as React from "react";
import { PieChart, pieArcClasses, pieClasses } from "@mui/x-charts/PieChart";
import { LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from "@mui/material";
import { useState, useEffect } from "react";
import GetgenderRatioAPI from "../API/GetgenderRatioAPI";
import CircularProgress from '@mui/material/CircularProgress';
export default function GenderAnalytics() {
const palette = ["#8DC63F", "#36A2EB", "#FFC107", "#FF5722"];
  const [genderAnalytics, setGenderAnalytics] = useState([]);

  const handleAnalytics = async () => {
    try {
      const token = localStorage.getItem("user_token");
      const response = await GetgenderRatioAPI(token);
      const transformed = response.data.map((item) => ({
        label: item.user_gender,
        value: Number(item.count),
      }));
      setGenderAnalytics(transformed);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleAnalytics();
  }, []);

    const maleData = genderAnalytics.find((item) => item.label.toLowerCase() === "male");
    const total = genderAnalytics.reduce((sum, item) => sum + item.value, 0);
    const malePercentage = maleData ? (maleData.value / total) * 100 : 0;

  return (
       <>
      {maleData ? (
        <Box mb={1}>
          <Box display="flex" justifyContent="space-end" mb={0.25}>
            {/* <Typography variant="body2">{maleData.label}</Typography> */}
            <Typography variant="body2" fontWeight="bold">
              {malePercentage.toFixed(1)}%
            </Typography>
          </Box>
          <Box width="45%">
            <LinearProgress
              variant="determinate"
              value={malePercentage}
              sx={{
                height: 4,
                borderRadius: 5,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: palette[0],
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          No male data found
        </Typography>
      )}
    </>
  );
}