import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {Chart as ChartJS} from 'chart.js/auto';
import axios from 'axios';
import { APP_CONFIG } from '../../config/app-config';


const TradeChart = ({ symbol }) => {
  const [chartData, setChartData] = useState({});
  const [holdingDays, setHoldingDays] = useState([]);
  const [holdingPrices, setHoldingPrices] = useState([]);

  useEffect(() => {
    getHoldingPricesByDates();
  }, [symbol]);

  const getHoldingPricesByDates = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
        const response = await axios.get(APP_CONFIG.API_ROOT + `/stocks/graph?symbol=${symbol}`,
        {
          headers: {
            Authorization: 'Bearer ' + user.data.access_token.token
          }
        });
        setDatesAndPricesStates(response.data.data);
      } catch (err) {
        console.error(err.message);
      }
};

  const setDatesAndPricesStates = data => {
    setHoldingDays([]);
    setHoldingPrices([]);
    for (let i = 0; data.length > i; i++) {
      setHoldingDays(prevState => [...prevState, data[i].label]);
      setHoldingPrices(prevState => [...prevState, data[i].close]);
    }
  };

  useEffect(() => {
    if (holdingDays.length > 0 && holdingPrices.length > 0 && symbol) {
      setChartData({
        labels: holdingDays,
        datasets: [
          {
            label: symbol,
            data: holdingPrices,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)',
            ],
          },
        ],
      });
    }
  }, [holdingPrices]);

  return (
    <div className="chart container">
      {holdingDays.length > 0 &&  Object.keys(chartData).length !== 0 &&  (
        <Line
          data={holdingDays.length > 0 ? chartData : null}
          options={{
            title: {
              display: true,
              text: `Average Prices For ${symbol} last 10 business days`,
              fontSize: 20,
            },
            legend: {
              display: true,
              position: 'right',
            },
            scales: {
              // yAxes: [
              //   {
              //     scaleLabel: {
              //       display: true,
              //       labelString: 'Price',
              //       fontSize: 15,
              //       fontStyle: 'italic',
              //     },
              //   },
              // ],
              // xAxes: [
              //   {
              //     scaleLabel: {
              //       display: true,
              //       labelString: 'Date',
              //       fontSize: 15,
              //       fontStyle: 'italic',
              //     },
              //   },
              // ],
            },
          }}
         height={100}
        />
      )}
    </div>
  );
};

export default TradeChart;
