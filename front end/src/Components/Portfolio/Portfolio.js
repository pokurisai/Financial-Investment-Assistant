import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Header from '../../Components/Header/Header';
import CurrentHoldings from '../Stocks/CurrentHoldings';
import { APP_CONFIG } from '../../config/app-config';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PortfolioChart from '../Chart/portfolioChart';
import './Portfolio.css';


const PortfolioPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [isUser, setUser] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [wallet, setWallet] = useState(0);
  const [tHoldings, setTholdings]= useState(0);
  useEffect(() => {
    const location = window.location.pathname;
    const user = JSON.parse(localStorage.getItem("user"));
    setFirstName(user.data.firstName +' '+ user.data.lastName);
    setWallet(user.data.wallet);
    if(location.includes('userdashboard')){
        setUser(true);
    }
    
    // Transaction http call
    const fetchHoldingsData = () => {
      getHoldings()
        .then(holdingsData => {
          const count = countHoldings(holdingsData.data);
          setHoldings(holdingsData.data);
        })
        .catch(err => console.error('error get holdings', err));
    };
    fetchHoldingsData();
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(
        APP_CONFIG.API_ROOT+  `/user/portfolio`,
        { headers: {
            Authorization: 'Bearer ' + user.data.access_token.token
          }
        }
      );
      setWallet(response.data.data.walletBalance);
      setTholdings(response.data.data.sharesAsset);
    if(response.data && response.data.data && response.data.data.length>0)
      setWallet(response.data.data[0].amount);
    } catch (err) {
      console.error('Error in get holdings', err.message);
    }
  };

  // Find total holding values
  const countHoldings = (data) => {
    return data.reduce((total, item) => (item.amount * item.shares) + total, 0)
  }
  const NoCurrentHoldings = () => {
    return (
      <Card className="text-center mt-5">
        <Card.Body className="d-block border">
          <Card.Title>You don't own any holdings as of yet.</Card.Title>
          <Card.Text>
            Go to our Trade page to start purchasing new stocks.{' '}
          </Card.Text>
             {!isUser &&
                <Link to="/admindashboard" className='logo'>Trade Page</Link>
                }
                {isUser &&
                <Link to="/userdashboard" className='logo'>Trade Page</Link>
            }
        </Card.Body>
      </Card>
    );
  };

  const getHoldings = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(
        APP_CONFIG.API_ROOT+  `/shares/transactions`,
        { headers: {
            Authorization: 'Bearer ' + user.data.access_token.token
          }
        }
      );
      return response.data;
    } catch (err) {
      console.error('Error in get holdings', err.message);
    }
  };

    return (
        <div>
            <Header />
        <section className="portfolio-container text-size container">
            <div className="text-center mt-3">
                <h2>Portfolio</h2>
                <h6>
                    Each account starts with $10,000 dollars.
                </h6>
                <hr />
            </div>
            <div className='user-wallet-info'>
                <div className="portfolio-top-wrapper d-flex align-items-start">
                    <Card className="user-info mt-3 w-50" align="center" border="dark">
                        <Card.Header className="h4">Account Information</Card.Header>
                        <ListGroup className="h5">
                            <ListGroup.Item>User: {firstName}</ListGroup.Item>
                            <ListGroup.Item>Account Balance: {wallet}</ListGroup.Item>
                            <ListGroup.Item>
                                Total Holding Value: {tHoldings}
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                    <PortfolioChart />
                </div>
            </div>
            <div className="user-holdings-list container">
                {holdings.length > 0 ? (
                holdings.map(holding => (
                    <CurrentHoldings holding={holding} key={holding.holding_id} />
                ))
                ) : (
                <NoCurrentHoldings />
                )}
      </div>
        </section>
        </div>
    );
};

export default PortfolioPage;
