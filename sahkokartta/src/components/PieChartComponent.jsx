import React, { useState, useEffect } from 'react';
import '../sahkokartta.css';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fetchChartData } from '../api';
import { Slider } from '@mui/material';

const PieChartComponent = ({ countryCode }) => {
  const [chartData, setChartData] = useState(null);
  //const [sliderValue, setSliderValue] = useState(2017); // Default to 2017
  const [year, setYear] = useState(2017); // Default year
  const [month, setMonth] = useState(1); // Default month (January)
  const [activeButton, setActiveButton] = useState("monthly"); // "monthly" or "yearly"
  const monthlyDataYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const startYear = 2000;
  const currentYear = 2024;

  const COLORS = {
    Bioenergy: "#00dd00",
    Coal: "#000000",
    Gas: "#ff00ff",
    Hydro: "#00d4ff",
    "Net imports": "#8c564b",
    Nuclear: "#dddd00",
    "Other fossil": "#808080",
    "Other renewables": "#a020f0",
    Solar: "#ff0000",
    Wind: "#ccccff",
  };

  useEffect(() => {
    const getGenerationData = async () => {
      const sliderValue = activeButton === "monthly" ? { year, month } : year;
      const data = await fetchChartData(countryCode, activeButton, sliderValue);

      const processedData = [];
      const groupedData = {};

      // Aggregate data for pie chart
      data.forEach((entry) => {
        if (!groupedData[entry.series]) {
          groupedData[entry.series] = 0;
        }
        groupedData[entry.series] += entry.generation_twh;
      });

      Object.keys(groupedData).forEach((key) => {
        processedData.push({ name: key, value: parseFloat(groupedData[key].toFixed(2)) });
      });

      setChartData(processedData);
    };

    getGenerationData();
  }, [countryCode, activeButton, year, month]);

  const handleYearChange = (e, newValue) => {
    setYear(newValue);
  };

  const handleMonthChange = (e, newValue) => {
    setMonth(newValue);
  };

  //const handleSliderChange = (e, newValue) => {
    //setSliderValue(newValue); };

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label={(entry) => `${entry.name}: ${entry.value} TWh`}
            isAnimationActive={true} // Enable animation
            animationDuration={100}
            >
              {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || "#ccc"} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      {activeButton === "monthly" && (
        <div>
          {/* Year Slider */}
          <Slider className="custom-slider"
            value={year}
            onChange={handleYearChange}
            step={1}
            marks={monthlyDataYears.map((year) => ({
              value: year,
              label: year.toString(),
            }))}
            min={2017}
            max={2024}
            valueLabelDisplay="auto"
            
            />
          {/* Month Slider */}
          <Slider className="custom-slider"
            value={month}
            onChange={handleMonthChange}
            step={1}
            marks={[
              { value: 1, label: "Jan" },
              { value: 2, label: "Feb" },
              { value: 3, label: "Mar" },
              { value: 4, label: "Apr" },
              { value: 5, label: "May" },
              { value: 6, label: "Jun" },
              { value: 7, label: "Jul" },
              { value: 8, label: "Aug" },
              { value: 9, label: "Sep" },
              { value: 10, label: "Oct" },
              { value: 11, label: "Nov" },
              { value: 12, label: "Dec" },
            ]}
            min={1}
            max={12}
            valueLabelDisplay="auto"
            
            />
        </div>
      )}

      {activeButton === "yearly" && (
        <Slider className="custom-slider"
          value={year}
          onChange={handleYearChange}
          step={1}
          marks={[
            { value: 2017, label: 2017 },
            { value: currentYear, label: currentYear.toString() },
          ]}
          min={2017}
          max={currentYear}
          valueLabelDisplay="auto"
          
        />
      )}

      <div className='radio-button'>
        <label>
          <input
            type="radio"
            value="monthly"
            checked={activeButton === "monthly"}
            onChange={() => {
              setActiveButton("monthly")
              setYear(2017);
              setMonth(1);
            }}
              />
          Monthly
        </label>
        <label>
          <input
            type="radio"
            value="yearly"
            checked={activeButton === "yearly"}
            onChange={() => {
              setActiveButton("yearly")
              //setYear(startYear);
            }}
          />
          Yearly
        </label>
      </div>
    </div>
  );
};

export default PieChartComponent;
