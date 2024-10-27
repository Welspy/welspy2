import axios, {AxiosRequestConfig} from 'axios';
import store from '../state/store.ts';
import {serverURL} from '../config/server/server.ts';

const useCustomFetch = async (
    target: string,
    method: string,
    params: {
        [key: string]: any
    },
    isAuth: boolean,
) => {
    const config: AxiosRequestConfig = {
        url: `${serverURL}${target}`,
        method,
        headers: {
        },
    };

    if (method === 'GET' || method === 'DELETE') {
        config.params = params;
    } else {
        config.data = params;
    }

    console.log("getThe", config, target);

    if (isAuth) {
        const {accessToken, refreshToken} = store.authState.getState()
        //@ts-ignore
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    await axios(config)
        .then((res) => {
            // console.log(target,': [RES] :',res.data.data)
            store.hookState.setState((state) => ({hookQueue : [...state.hookQueue, {target, isSuccess: true, errorMessage: "", response: res,}], queueSequence: [...state.queueSequence, target+"?"+method]}))
        })
        .catch((err) => {
            // console.log(config.url,': [ERR] :',err.response)
            store.hookState.setState((state) => ({hookQueue : [...state.hookQueue, {target, isSuccess: false, errorMessage: err, response: "",}], queueSequence: [...state.queueSequence, target+"?"+method]}))
        })
};

export default useCustomFetch;
