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
      name: "Solar",
      color: "#ff0000",
    },
    {
      name: "Wind",
      color: "#ccccff",
    },
    {
      name: "Other fossil",
      color: "#808080",
    },
    {
      name: "Other renewables",
      color: "#a020f0",
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
   * Näyttää eri tuotantotapojen sähköntuotantomäärät 
   * valitulta kuukaudelta kursorin ollessa kaavion päällä.
   */
  const renderTooltipContent = (o) => {
    const { payload, label } = o;
    const total = payload.reduce((result, entry) => result + entry.value, 0).toFixed(2);

  /**
   * Palauttaa lyhennetyn periodin nimen kokonaisena, jos kyseessä kuukausi
   * muuten palauttaa parametrinä annetun periodin sellaisenaan
   * @param {*} period kuukausi tai vuosi
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

  /**
   * Komponentti valintanappuloille joista vain yksi voi olla 
   * aktiivinen kerrallaan
   */
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
          <input 
            type="radio" 
            checked={value} 
            onChange={onChange}
          />
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

  /* const sortMethodsByFirstPeriod = () => {
    let methods = generationMethods.slice();
    let firstDataPoint = chartData[0];
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
    return methods;
  } */

  const sortMethodsByTotal = () => {
    let data = chartData;
    let totals = [];
    generationMethods.map((method) => {totals.push({key: method.name, value: 0})})
    data.map((dataPoint) => { 
      Object.entries(dataPoint).forEach(([key, value]) => {
        switch (key) {
          case "Bioenergy": totals[0].value += value; break;
          case "Nuclear": totals[1].value += value; break;
          case "Coal": totals[2].value += value; break;
          case "Gas": totals[3].value += value; break;
          case "Hydro":totals[4].value += value; break;
          case "Solar": totals[5].value += value; break;
          case "Wind":totals[6].value += value; break;
          case "Other fossil": totals[7].value += value; break;
          case "Other renewables": totals[8].value += value; break;
        }
      });
    });
    
    let methods = generationMethods.slice();
    var v1;
    var v2;
    methods.sort((a,b) => {
      totals.map(({key, value}) => {
        if(a.name === key) {
          v1 = value;
        } 
        if(b.name === key) {
          v2 = value;
        } 
      })
      return v2-v1;
    });
    return methods;
  } 

  /**
   * 
   * @param {*} e 
   * @param {*} year 
   */
  const setYear = (e, year) => {
    setSliderValue(year);
  }

  const marks = (values) => {
    var a = [];
    values.map((x) =>  a.push({value: x, label: x.toString()}));
    return a;
  };

  return (
  <>
    <h2 className='areachart-header'> Share of each substantial electricity generation method {activeButton === "monthly" && "in " + sliderValue} </h2>
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
      {sortMethodsByTotal().map((method) => 
        <Area 
          key={method.name} 
          type="monotone"
          dataKey={method.name} 
          stackId="1" 
          stroke={method.color} 
          fill={method.color} />)}
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