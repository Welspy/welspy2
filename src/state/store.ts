import { create, UseBoundStore, StoreApi } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HookStateType } from '../type/storeType/HookStateType.ts';
import { AuthStateType } from '../type/storeType/AuthStateType.ts';
import { UserStateType } from '../type/storeType/UserStateType.ts';
import { ChallengeStateType } from '../type/storeType/ChallengeStateType.ts';
import { ChallengeItemStateType } from '../type/storeType/ChallengeItemStateType.ts';
import { NavigationStateType } from '../type/storeType/NavigationStateType.ts';

interface StoreType {
    hookState: UseBoundStore<StoreApi<HookStateType>>;
    authState: UseBoundStore<StoreApi<AuthStateType>>;
    userState: UseBoundStore<StoreApi<UserStateType>>;
    challengeState: UseBoundStore<StoreApi<ChallengeStateType>>;
    challengeItemState: UseBoundStore<StoreApi<ChallengeItemStateType>>;
    navigationState: UseBoundStore<StoreApi<NavigationStateType>>;
}

const store: StoreType = {
    hookState: create<HookStateType>(() => ({
        hookQueue: [],
        queueSequence: []
    })),

    authState: create<AuthStateType>()(
        persist(
            (set) => ({
                accessToken: "",
                refreshToken: "",
                setAccessToken: async (token: string) => {
                    set(() => ({ accessToken: token }));
                },
                setRefreshToken: async (token: string) => {
                    set(() => ({ refreshToken: token }));
                },
                removeTokens: async () => {
                    set(() => ({ accessToken: "", refreshToken: "" }));
                },
                isLoggedIn: async () => {
                    const token = await AsyncStorage.getItem("accessToken");
                    return !!token;
                }
            }),
            {
                name: "authState",
                getStorage: () => AsyncStorage,
            }
        )
    ),

    userState: create<UserStateType>(() => ({
        userInfo: {},
        challengeInfo: [],
        bankInfo: {}
    })),

    challengeState: create<ChallengeStateType>(() => ({
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

    challengeItemState: create<ChallengeItemStateType>(() => ({
        itemList: []
    })),

    navigationState: create<NavigationStateType>(() => ({
        isBottomTabVisible: true,
        alarmState: {
            challenge: 0,
            main: 3,
            user: 0,
            allOf: 3,
        },
        settings: {
            view: "DARK",
            alarmVisible: true,
        },
        tabHistory: false
    }))
}

export default store;
