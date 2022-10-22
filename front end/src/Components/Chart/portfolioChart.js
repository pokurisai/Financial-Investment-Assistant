import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { APP_CONFIG } from "../../config/app-config";
import axios from "axios";

const PortfolioChart = () => {
  const [chartData, setChartData] = useState({});
  const [holdings, setHoldings] = useState([]);
  const [holdingNames, setHoldingNames] = useState([]);
  const [holdingShares, setHoldingShares] = useState([]);

  useEffect(() => {
    getHoldings();
  }, []);

  const getHoldings = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(
        APP_CONFIG.API_ROOT + `/shares/transactions`,
        {
          headers: {
            Authorization: "Bearer " + user.data.access_token.token,
          },
        }
      );
      setHoldings(response.data.data);
    } catch (err) {
      console.error("Error in get holdings", err.message);
    }
  };

  useEffect(() => {
    setHoldingNames([]);
    setHoldingShares([]);
    for (let i = 0; holdings.length > i; i++) {
      setHoldingNames((prevState) => [
        ...prevState,
        holdings[i].stocks.companyName,
      ]);
      setHoldingShares((prevState) => [
        ...prevState,
        holdings[i].stocks.shares,
      ]);
    }
  }, [holdings]);

  useEffect(() => {
    setChartData({
      labels: holdingNames,
      datasets: [
        {
          label: "Shares",
          data: holdingShares,
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
        },
      ],
    });
  }, [holdingNames]);

  return (
    <div className="chart chart-portfolio">
      {holdingNames.length > 0 && (
        <Pie
          data={holdingNames.length > 0 ? chartData : null}
          options={{
            title: {
              display: true,
              fontSize: 15,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
          width={600}
          height={250}
        />
      )}
    </div>
  );
};

export default PortfolioChart;
