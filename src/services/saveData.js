import Axios from './AxiosHelper';

export default {
  saveData: (data) => {
    return Axios.post('/dataset/savedata', data).then((data) => data);
  },
};
