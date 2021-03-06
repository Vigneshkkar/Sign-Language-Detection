import axios from 'axios';
let BaseURL = 'http://127.0.0.1:5000/api/v1/';
// let BaseURL = 'https://6454-142-115-62-84.ngrok.io/api/v1/';

if (process.env.REACT_APP_STAGE === 'production') {
  BaseURL = `${window.location.protocol}//${window.location.hostname}/api/v1/`;
}
console.log(process.env.REACT_APP_STAGE);

const AxiosHelper = axios.create({
  baseURL: BaseURL,
});

export default AxiosHelper;
