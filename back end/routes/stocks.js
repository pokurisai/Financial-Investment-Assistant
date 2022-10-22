const express = require('express')
const router = express.Router()
const { StocksController, AuthenticationController } = require('../controllers');

router.get('/stocks/recommendation', AuthenticationController.isBearerAuthenticated, StocksController.recommendation);
router.get('/stocks/search', AuthenticationController.isBearerAuthenticated, StocksController.getStocks)
router.post('/buy/stock', AuthenticationController.isBearerAuthenticated, StocksController.buyStocks)
router.post('/sell/stock', AuthenticationController.isBearerAuthenticated, StocksController.sellStocks)
router.get('/shares/transactions', AuthenticationController.isBearerAuthenticated, StocksController.sharesTransaction)
router.get('/stocks/graph', AuthenticationController.isBearerAuthenticated, StocksController.graphsData)

module.exports = router;
