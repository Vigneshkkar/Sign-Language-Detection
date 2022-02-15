import axios from 'axios';
let BaseURL = 'http://127.0.0.1:5000/api/v1/';

if (process.env.REACT_APP_STAGE === 'production') {
  BaseURL = 'https://vigneshkkar.in/api/';
}
console.log(process.env.REACT_APP_STAGE);

const AxiosHelper = axios.create({
  baseURL: BaseURL,
});

export default AxiosHelper;
