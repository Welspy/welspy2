import {ChallengeResponseType} from '../responseType/ChallengeResponseType.ts';
import {MyChallengeResponseType} from '../responseType/MyChallengeResponseType.ts';
import {ChallengeUserResponseType} from '../responseType/ChallengeUserResponseType.ts';

export interface ChallengeStateType {
    currentList : ChallengeResponseType[];
    myChallengeList : MyChallengeResponseType[];
    renderChallenge : ChallengeResponseType;
    renderMyChallenge : [ChallengeResponseType, MyChallengeResponseType];
    currentChallengeIdx: string;
    fullChallengeList: ChallengeResponseType[];
    isReadyGetFull: boolean;
    userList: ChallengeUserResponseType[];
    bankList: {id : number, balance: number}[];
}