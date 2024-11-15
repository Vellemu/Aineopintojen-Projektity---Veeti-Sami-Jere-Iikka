/* eslint-disable react/prop-types */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchChartData } from '../api';
import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';

/**
 * TODO: Vuosittainen datan esitys kuukausittaisen lisäksi
 * TODO: Värikoodatut tuotantotapojen tekstit näkyviin sivulle
 */
const PercentAreaChart = ({countryCode}) => {
  const [chartData, setChartData] = useState(null);
  const [sliderValue, setSliderValue] = useState(2017);
  const [activeButton, setActiveButton] = useState("monthly");
  const monthlyDataYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const generationMethods = [
    {
      name: "Bioenergy",
      color: "#00ff00",
    },
    {
      name: "Coal",
      color: "#000000"
    },
    {
      name: "Gas",
      color: "#ff00ff",
    },
    {
      name: "Hydro",
      color: "#00d4ff",
    },
    {
      name: "Nuclear",
      color: "#cccc00",
    },
    {
      name: "Other fossil",
      color: "#808080",
    },
    {
      name: "Other renewables",
      color: "#a020f0",
    },
    {
      name: "Solar",
      color: "#ff0000",
    },
    {
      name: "Wind",
      color: "#ccccff",
    }
  ];

  useEffect(() => {
    /**
     * Haetaan valitun vuoden kuukausittainen sähköntuotantodata ja 
     * järjestetään se kuukausittain sen kaaviota varten. 
     * TODO: järkevämpi/siistimpi totetus for-silmukkujen sijaan
     */
    const getMonthlyData = async () => { 
      const promise = fetchChartData(countryCode, activeButton, sliderValue); 
      const data = await promise;
      /* console.log(data); */
      var areachartData = [];
      if(activeButton === "monthly") { 
        areachartData = [{period: "jan"}, {period: "feb"}, {period: "mar"}, {period: "apr"}, {period: "may"}, {period: "jun"}, {period: "jul"}, {period: "aug"}, {period: "sep"}, {period: "oct"}, {period: "nov"}, {period: "dec"}]
      }
      else {
        var startYear = 2000;
        var currentYear = 2024;
        var years = [];
        while (startYear < currentYear) {
          years.push({period: startYear++});
        }
        areachartData = years;
      }
      for (var m = 0, i = 0; data[i] != null && m < areachartData.length; m++) {
        for(; ; i++) {
          Object.defineProperty(areachartData[m], data[i].series, {value: data[i].generation_twh});
          if (data[i+1] == null || data[i].date != data[i+1].date) {
            i++;
            break;
          }
        }
      }
      console.log(areachartData);
      setChartData(areachartData);
    }
    getMonthlyData();
  },[countryCode, sliderValue, activeButton]);
 
  const setYear = (e, year) => {
    setSliderValue(year);
  }

  const marks = (values) => {
    var a = [];
    values.map((x) =>  a.push({value: x, label: x.toString()}));
    return a;
  };
      
  /**
   * Näyttää eri tuotantotapojen sähköntuotantomäärät 
   * valitulta kuukaudelta kursorin ollessa kaavion päällä.
   */
  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0).toFixed(2);

  const getFullName = (month) => {
    switch (month) {
      case "jan": return "January";
      case "feb": return "February"
      case "mar": return "March"
      case "apr": return "April"
      case "may": return "May"
      case "jun": return "June"
      case "jul": return "July"
      case "aug": return "August"
      case "sep": return "September"
      case "oct": return "October"
      case "nov": return "November"
      case "dec": return "December"
    }
    return month;
  }

  const getPercent = (value, total) => {
    const ratio = total > 0 ? value / total : 0;
    return (ratio * 100).toFixed(2);
  };

  return (
    <div className="customized-tooltip-content">
      <p className="total">{`${getFullName(label)}: (Total: ${total} TWh)`}</p>
      <ul className="list">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value} TWh (${getPercent(entry.value, total)}%)`}
          </li>
        ))}
      </ul>
    </div>
  )
  };

  const RadioButtons = ({activeButton, setActiveButton}) => {
    
    const handleYearly = () => {
      setActiveButton("yearly");
    };

    const handleMonthly = () => {
      setActiveButton("monthly");
    };

    const RadioButton = ({label, value, onChange}) => {
      return(
        <label>
          <input type="radio" checked={value} onChange={onChange} />
          {label}
        </label>
      )
    };
    
    return (
      <>
        <RadioButton 
          label="Yearly"
          value={activeButton === "yearly"}
          onChange={handleYearly}
        />
        <RadioButton 
          label="Monthly"
          value={activeButton === "monthly"}
          onChange={handleMonthly}
        />
      </>
   )
  };

  return (
    <>
    <div className='areachart-container'>
      {chartData && 
      <AreaChart width={800} height={400} className='areachart'
          data={chartData}
          stackOffset='expand'
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis tickFormatter={(decimal) => `${decimal * 100}%`} />
        <Tooltip content={renderTooltipContent} />
        {generationMethods.map((method) => <Area 
          key={method.name} 
          type="monotone"
          dataKey={method.name} 
          stackId="1" 
          stroke={method.color} 
          fill={method.color} />)}
      </AreaChart>}
        {activeButton === "monthly" && <Slider className='slider'
          step={null}
          marks={marks(monthlyDataYears)}
          defaultValue={2017}
          min={2017}
          max={2024}
          valueLabelDisplay="auto"
          onChange={setYear}    
        />}  
        <ul className='methodlist'>
          {generationMethods.map((method) => <li 
            key={method.name} 
            style={{color: method.color}}
            >{method.name}</li>)}
        </ul>
        <RadioButtons className='radiobuttons' activeButton={activeButton} setActiveButton={setActiveButton}/>
    </div>
    </>    
  )  
}
export default PercentAreaChart