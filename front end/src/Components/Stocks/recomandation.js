import React, { useState, Fragment, useEffect } from 'react';
import axios from 'axios';
import ShowRecommendations from './showRecomandation';
import { Spinner } from 'react-bootstrap';
import { APP_CONFIG } from '../../config/app-config';
import { ToastContainer, toast } from 'react-toastify';
import './stock.css';

const Recommendation = props => {
  const [recommendedHoldings, setRecommendedHoldings] = useState([]);
  const [copyHoldings, setcopyHoldings] = useState([]);
  const [isSpinner, setSpinner] = useState(true);
  const [value, setValue] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [prior,setPrior] = useState('');

  useEffect(() => {
    getRecommendations();
  }, []);

  // getting data from parent
  const handleTrade = (symbol,userTotalHoldings)  => {
    props.handleSearchForHolding(symbol, userTotalHoldings);
  };

  const filterSubmit = e => {
    e.preventDefault();
    console.log(copyHoldings);
    let filterData = [];
    if(value && prior === 'low'){
    filterData = copyHoldings.filter(item => {
      return item.latestPrice <= value;
    })
    setRecommendedHoldings(filterData);
  } else {
    filterData = copyHoldings.filter(item => {
      return item.latestPrice > value;
    })
    setRecommendedHoldings(filterData);
  }
 }


  const handleInputChange = e => {
    e.preventDefault();
    console.log(e.target.value);
    setPrior(e.target.value);
  }

  const onSearchLiquidity = e => {
    e.preventDefault();
    setLiquidity(e.target.value);
  }

   // Value change
   const onSearchValue = e => {
    setValue(e.target.value);
  };


  // Recommendation fetch data
  const getRecommendations = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    axios
      .get(APP_CONFIG.API_ROOT + '/stocks/recommendation', {
        headers: {
          Authorization: 'Bearer ' + user.data.access_token.token
        }
      })
      .then(res => {
        setRecommendedHoldings(res.data.data);
        localStorage.setItem('userr', JSON.stringify(res.data.data))
        setcopyHoldings(res.data.data);
        setSpinner(false);
      })
      .catch(err => {
        console.log('error username response client side', err);
      });
  };

  return (
    <Fragment>
      <div className='container stock-container'>
      <div className='filter'>
      <form
        className="form-inline justify-content-center mt-3 selected-holding"
        >
        <h3>Portfolio Selection</h3>
        <div className='value'>
        <label>Capital</label>
        <input
          type="number"
          value={value}
          autoFocus
          onChange={e => onSearchValue(e)}
          className="form-control col-sm-3"
          placeholder="Enter capital"
        />
        </div>
        <div className='liquidity'>
        <label>Liquidity(%)</label>
        <input
          type="number"
          value={liquidity}
          autoFocus
          onChange={e => onSearchLiquidity(e)}
          className="form-control col-sm-3"
          placeholder="Enter liquidity %"
        />
        </div>
        <div className='prior'>
        <label>Risk Tolerance</label>
        <select className="form-control" name="prior" onChange={handleInputChange}>
           <option value="low">Low</option>
           <option value="medium">Medium</option>
           <option value="high">High</option>
         </select>
         </div>
        <button
          type="submit"
          className="btn btn-primary col-sm-2 filter-btn"
          onClick={filterSubmit}>
          Submit
        </button>
      </form>
      </div>
      <div className="text-center mt-5 h4 font-weight-light recommend-header">
        Other Recommendations
      </div>
      {isSpinner ? (
        <Spinner animation="border" className="spinner" />
      ) : (
        recommendedHoldings.map(recommendedHolding => (
          <ShowRecommendations
            recommendedHolding={recommendedHolding}
            key={recommendedHolding.marketCap}
            handleTrade={handleTrade}
          />
        ))
      )}
      </div>
    </Fragment>
  );
};

export default Recommendation;
