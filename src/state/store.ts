import {create, StoreApi, UseBoundStore} from 'zustand';
import {HookStateType} from '../type/storeType/HookStateType.ts';
import {AuthStateType} from '../type/storeType/AuthStateType.ts';

interface StoreType {
    hookState: UseBoundStore<StoreApi<HookStateType>>;
    authState: UseBoundStore<StoreApi<AuthStateType>>
}

const store = {
    hookState : create<HookStateType>(() => ({
        hookQueue: [],
        queueSequence: []
    })),
    authState : create<AuthStateType>(() => ({
        accessToken : "",
        refreshToken: ""
    }))
}

export default store;