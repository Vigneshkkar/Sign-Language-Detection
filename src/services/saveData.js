import Axios from './AxiosHelper';

export default {
  saveData: (data) => {
    return Axios.post('/dataset/savedata', data).then((data) => data);
  },

  getWords: () => {
    return Axios.get('/dataset/getwords').then((data) => data);
  },
};
