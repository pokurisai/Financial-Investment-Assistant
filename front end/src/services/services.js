import axios from 'axios';
import { APP_CONFIG } from '../config/app-config';

function fireRequest(url, params, method) {

    if (method === "GET")
        return getRequest(url, params);
    else if (method === "POST")
        return postRequest(url, params);

}

//API : axios.get
function getRequest(url, requestParams) {
    return axios.get(url, { params: requestParams }
    ).catch(error => {
        console.log("error", error)
    });
}

//API : axios.post
function postRequest(url, requestParams) {
    return axios.post(url, requestParams
    ).catch(error => {
        console.log("error", error)
    });

}

function genericRequest(url, params, method) {
    var requestUrl = APP_CONFIG.API_ROOT + url;
    return fireRequest(requestUrl, params, method);
}

export const searchForHolding = async symbol => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await axios.get(APP_CONFIG.API_ROOT + `/stocks/graph?symbol=${symbol}`,
      {
        headers: {
          Authorization: 'Bearer ' + user.data.access_token.token
        }
      });
      return response.data;
    } catch (err) {
      console.error('error in search for holding', err.message);
    }
  };

export { genericRequest }; 