import {create, GetState, SetState, StoreApi, UseBoundStore} from 'zustand';
import {HookStateType} from '../type/storeType/HookStateType.ts';
import {AuthStateType} from '../type/storeType/AuthStateType.ts';
import {UserStateType} from '../type/storeType/UserStateType.ts';
import {ChallengeStateType} from '../type/storeType/ChallengeStateType.ts';
import {ChallengeItemStateType} from '../type/storeType/ChallengeItemStateType.ts';
import {NavigationStateType} from '../type/storeType/NavigationStateType.ts';

interface StoreType {
    hookState: UseBoundStore<StoreApi<HookStateType>>;
    authState: UseBoundStore<StoreApi<AuthStateType>>
    userState: UseBoundStore<StoreApi<UserStateType>>
    challengeState: UseBoundStore<StoreApi<ChallengeStateType>>
    challengeItemState: UseBoundStore<StoreApi<ChallengeItemStateType>>
    navigationState: UseBoundStore<StoreApi<NavigationStateType>>
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
        renderMyChallenge: [{},{}],
        currentChallengeIdx: 0,
        fullChallengeList: [],
        isReadyGetFull: false,
        userList: [],
        bankList: [],
        currentProduct: {
            idx: 0,
            name: "",
            discount: 0,
            discountedPrice: 0,
            price: 0,
            imageUrl: "",
            description: "",
        }
    })),
    challengeItemState : create<ChallengeItemStateType>(() => ({
        itemList: []
    })),
    navigationState : create<NavigationStateType>(() => ({
        isBottomTabVisible: true
    }))
}

export default store;