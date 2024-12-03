import axios from 'axios';

//sgis 토근 발급

//prettier-ignore
const API_URL = '/api/sigs/OpenAPI3';

export const getAccessToken = async () => {
  const response = await axios.get(`${API_URL}/auth/authentication.json`, {
    params: {
      consumer_key: process.env.NEXT_PUBLIC_CONSUMER_ID,
      consumer_secret: process.env.NEXT_PUBLIC_CONSUMER_SECRET,
    },
  });

  return response.data.result.accessToken;
};

export const getCity = async (lat: string, long: string, token: string) => {
  const response = await axios.get(`${API_URL}/addr/rgeocodewgs84.json`, {
    params: {
      x_coor: long,
      y_coor: lat,
      accessToken: token,
    },
  });

  console.log(response.data.result[0]);
  return response.data.result[0];
};
