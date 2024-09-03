import { useCallback } from 'react';
import axios from 'axios';
import { baseURL } from 'src/shared/utility/helpers';
import { useRouter } from 'next/router';
import { store } from 'src/redux/store';
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { removeAuthToken, removeUser } from 'src/redux/reducers/authSlice';

/**
 * Returns a function that can be used to call an API.
 * This function wraps the axios instance.
 */

const Axios = () => {
  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const callApi = useCallback(async ({ headers, ...rest }) => {
    try {
      const idToken = store.getState().user;

      const { data } = await axios({
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${idToken?.authToken}`,
          ...headers,
        },
        baseURL,
        ...rest,
        validateStatus: (status) => status >= 200 && status <= 299,
      });

      return data;
    } catch (err) {
      if (err && err.response && err.response.status === 401) {
        router.push('/');
        dispatch(removeUser())
        dispatch(removeAuthToken())
        enqueueSnackbar('Session Expired', { variant: 'error' });

      } else if (err && err.response && err.response.status === 503) {
        router.push('/404');
      }
      throw err;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return callApi;
};

export default Axios;
