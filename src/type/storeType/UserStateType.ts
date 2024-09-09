import {HookQueueObjectType} from '../objectType/HookQueueObjectType.ts';
import {UserResponseType} from '../responseType/UserResponseType.ts';
import {MyChallengeResponseType} from '../responseType/MyChallengeResponseType.ts';
import {BankResponseType} from '../responseType/BankResponseType.ts';

export interface UserStateType {
    userInfo: UserResponseType;
    challengeInfo: MyChallengeResponseType;[];
    bankInfo: BankResponseType;
}