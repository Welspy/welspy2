import {create, GetState, SetState, StoreApi, UseBoundStore} from 'zustand';
import {HookStateType} from '../type/storeType/HookStateType.ts';
import {AuthStateType} from '../type/storeType/AuthStateType.ts';
import {UserStateType} from '../type/storeType/UserStateType.ts';
import {ChallengeStateType} from '../type/storeType/ChallengeStateType.ts';

interface StoreType {
    hookState: UseBoundStore<StoreApi<HookStateType>>;
    authState: UseBoundStore<StoreApi<AuthStateType>>
    userState: UseBoundStore<StoreApi<UserStateType>>
    challengeState: UseBoundStore<StoreApi<ChallengeStateType>>
}

const store = {
    hookState : create<HookStateType>(() => ({
        hookQueue: [],
        queueSequence: []
    })),
    authState : create<AuthStateType>(() => ({
        accessToken : "",
        refreshToken: ""
    })),
    userState : create<UserStateType>(() => ({
        userInfo: {},
        challengeInfo: [],
        bankInfo: {}
    })),
    challengeState : create<ChallengeStateType>(() => ({
        currentList: [],
        myChallengeList: [],
        renderChallenge: {},
    }))
}

export default store;