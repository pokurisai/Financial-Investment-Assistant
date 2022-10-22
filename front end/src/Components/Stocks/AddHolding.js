import React, { useState, useEffect, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';
import { searchForHolding } from '../../services/services';
import { ToastContainer, toast } from 'react-toastify';
import './stock.css';

const AddHolding = props => {
  const [symbol, setSymbol] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    performApiCall();
    const userr = JSON.parse(localStorage.getItem("userr"));
    let filterUserTh;
    if(userr && userr.length >0){
      filterUserTh = userr.filter(item => {
        return item.symbol.toUpperCase() === symbol.toUpperCase()
      })
    }
    if(filterUserTh.length > 0){
      props.handleSearchForHolding(symbol.toUpperCase(), filterUserTh[0].userTotalHoldings);
    }
    setSymbol('');
  };

  
  const onSearchSymbol = e => {
    setSymbol(e.target.value);
  };

  const performApiCall = async () => {
    try {
      const response = await searchForHolding(symbol);
      if (response === undefined) {
        toast.warning(symbol + "is not a valid symbol. Please try modifying your search.");
      }
    } catch (err) {
      toast.warning('No results found');
    }
  };

  return (
    <div className="container holding-wrapper">
      <form
        className="form-inline justify-content-center mt-3 selected-holding"
        >
        <input
          type="symbol"
          value={symbol}
          autoFocus
          onChange={e => onSearchSymbol(e)}
          className="form-control col-sm-5"
          placeholder="Enter stock symbol"
        />
        <button
          type="submit"
          className="btn btn-primary col-sm-2"
          onClick={handleSubmit}>
          Submit
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default AddHolding;
