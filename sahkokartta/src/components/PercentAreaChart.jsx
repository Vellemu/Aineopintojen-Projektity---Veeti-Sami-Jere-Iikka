/* eslint-disable react/prop-types */
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { fetchChartData } from '../api';
import { useState, useEffect } from 'react';
import { Slider } from '@mui/material';

/**
 * 
 */
const PercentAreaChart = ({countryCode}) => {
  const [chartData, setChartData] = useState(null);
  const [sliderValue, setSliderValue] = useState(2017);
  const [activeButton, setActiveButton] = useState("monthly");
  const monthlyDataYears = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
  const startYear = 2000;
  const currentYear = 2024;
  const generationMethods = [
    {
      name: "Bioenergy",
      color: "#00dd00",
    },
    {
      name: "Nuclear",
      color: "#dddd00",
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
    },
  ];

  useEffect(() => {
    /**
     * Haetaan kuukausittainen data joltain vuodelta 2017-2024 väliltä tai vuosittainen data
     * 2000-2024 riippuen slider ja radiobutton valinnoista
     */
    const getGenerationData = async () => { 
      const promise = fetchChartData(countryCode, activeButton, sliderValue); 
      const data = await promise;

      var areachartData = [];
      if(activeButton === "monthly") { 
        areachartData = [{period: "jan"}, {period: "feb"}, {period: "mar"}, {period: "apr"}, {period: "may"}, {period: "jun"}, 
                          {period: "jul"}, {period: "aug"}, {period: "sep"}, {period: "oct"}, {period: "nov"}, {period: "dec"}]
      }
      else {
        var years = [];
        var year = startYear;
        while (year < currentYear) {
          years.push({period: year++});
        }
        areachartData = years;
      }

      var dataPoint;
      var i = 0;
      areachartData.map((o) => {     
        dataPoint = data.slice(i).filter((entry) => entry.date === data[i].date);
        dataPoint.map((entry) => {
          Object.defineProperty(o, entry.series, {value: entry.generation_twh, enumerable: true});
          i++;
        }); 
      });
      setChartData(areachartData);
    }
    getGenerationData();
  },[countryCode, sliderValue, activeButton]);

  /**
   * 
   * @param {*} e 
   * @param {*} year 
   */
  const setYear = (e, year) => {
    setSliderValue(year);
  }

  /**
   * 
   * @param {*} values 
   * @returns 
   */
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

  /**
   * 
   * @param {*} period 
   * @returns 
   */
  const getFullName = (period) => {
    switch (period) {
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
    return period;
  }

  /**
   * 
   * @param {*} value 
   * @param {*} total 
   * @returns 
   */
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

  /**
   * Järjestää datan suurimmasta tuotantotavasta pieninpään ensimmäisen 
   * datapisteen(ajanjakson) perusteella
   * @returns 
   */
  const renderData = () => {
    let methods = generationMethods;
    const firstDataPoint = chartData[0];
    var v1;
    var v2;
    methods.sort((a,b) => {
      Object.entries(firstDataPoint).forEach(([key, value]) => {
        if(a.name === key) {
          v1 = value;
        } 
        if(b.name === key) {
          v2 = value;
        } 
      })
      return v2-v1;
    });
    return (
      methods.map((method) => 
        <Area 
          key={method.name} 
          type="monotone"
          dataKey={method.name} 
          stackId="1" 
          stroke={method.color} 
          fill={method.color} />)
    ) 
  }

  return (
  <>
    {chartData && 
    <AreaChart width={800} height={400} className='areachart'
        data={chartData}
        stackOffset='expand'
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="period" />
      <YAxis tickFormatter={(decimal) => `${decimal * 100}%`} />
      <Tooltip
        content={renderTooltipContent} 
        wrapperStyle={{ backgroundColor: "#ffffff",  paddingLeft: "5px", paddingRight: "5px", borderRadius: "25px"}} 
      />
      {renderData()}
    </AreaChart>}
    
    <ul className='methodlist'>
      {generationMethods.map((method) => 
      <li 
        key={method.name} 
        style={{color: method.color}}
      >{method.name}
      </li>)}
    </ul>
    
    <div className='radiobuttons'>
    <RadioButtons
      activeButton={activeButton} 
      setActiveButton={setActiveButton}/>
    </div>
    
    {activeButton === "monthly" && 
    <Slider className='slider'
      step={null}
      marks={marks(monthlyDataYears)}
      defaultValue={2017}
      min={2017}
      max={2024}
      valueLabelDisplay="auto"
      onChange={setYear}
    />}  
  </>    
  )  
}
export default PercentAreaChart