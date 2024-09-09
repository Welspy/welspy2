import {ChallengeResponseType} from '../responseType/ChallengeResponseType.ts';
import {MyChallengeResponseType} from '../responseType/MyChallengeResponseType.ts';

export interface ChallengeStateType {
    currentList : ChallengeResponseType[];
    myChallengeList : MyChallengeResponseType[];
    renderChallenge : ChallengeResponseType | MyChallengeResponseType;
}