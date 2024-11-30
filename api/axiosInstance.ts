import axios from 'axios';

const sgisAPI = axios.create({
  baseURL: 'https://sgisapi.kostat.go.kr',
});
