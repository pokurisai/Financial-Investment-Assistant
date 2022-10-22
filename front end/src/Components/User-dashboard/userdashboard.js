import './userdashboard.css';
import Header from '../Header/Header';
import React, { useState } from 'react';
import Recommendation from '../../Components/Stocks/recomandation';
import { APP_CONFIG } from '../../config/app-config';
import TradeHeader from '../../Components/Stocks/TradeHeader';
import AddHolding from '../../Components/Stocks/AddHolding';
import SelectedHoldings from '../../Components/Stocks/SelectedHoldings';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';


function UserDashboard() {
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [sharesPurchased, setSharesPurchased] = useState(0);
  const [userTotalHolding, setUserTotalHolding] = useState(0);
  const [isLoader, setLoader] = useState(true);

  // Update share 
  const updateShares = shares => {
    setSharesPurchased(shares);
  };

  const toggleAlertState = (alertMsg, sharesCount) => {
    setLoader(true);
    toast.success( `Successfully ${alertMsg} ${sharesCount} shares from
      ${selectedHolding.symbol} for a total of ${sharesCount * selectedHolding.latestPrice}`);
  };

  const sellShares = (holding, shares) => {
    setLoader(false);
    sellStock(holding, shares);
  };

  const buyShares = (holding, shares) => {
    // send an http request to buy stocks
    setLoader(false);
    buyStock(holding, shares);
  };


  // buy stocks http call
  const buyStock = async (holding, shares) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.post(APP_CONFIG.API_ROOT+ `/buy/stock`, {
        holding,
        shares,
      }, 
      { headers: {
        Authorization: 'Bearer ' + user.data.access_token.token
      }}
      );
      toggleAlertState('purchased',shares);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  // sell stocks http call
  const sellStock = async (holding, shares) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.post(APP_CONFIG.API_ROOT+ `/sell/stock`, {
        holding,
        shares,
      }, 
      { headers: {
        Authorization: 'Bearer ' + user.data.access_token.token
      }}
      );
      toggleAlertState('sold', shares);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };


  const handleSearchForHolding = (symbol, userTotalHoldings) => {
    setUserTotalHolding(userTotalHoldings);
    searchForHolding(symbol)
      .then(res => setSelectedHolding(res.data))
      .catch(err => console.error('error get holdings', err));
  }

  const searchForHolding = async symbol => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(APP_CONFIG.API_ROOT+ `/stocks/search/?symbol=${symbol}`,{
        headers: {
          Authorization: 'Bearer ' + user.data.access_token.token
        }
      });
      return response.data;
    } catch (err) {
      console.error('error in search for holding', err.message);
    }
  }


  return (
  <div>
    <Header />
    <TradeHeader />
      <AddHolding handleSearchForHolding={handleSearchForHolding}  />
      {isLoader ? (
    <div>
      {selectedHolding ? (
          <SelectedHoldings
            selectedHolding={selectedHolding}
            buyShares={buyShares}
            sellShares={sellShares}
            updateShares={updateShares}
            userTotalHolding = {userTotalHolding}
          />
        ) : null}
    <Recommendation handleSearchForHolding={handleSearchForHolding} />
    </div>) : 
    (
      <Spinner animation="border" className="spinner" />)
      }
    <ToastContainer />
  </div>
  );
}

export default UserDashboard;
