import {HookQueueObjectType} from '../objectType/HookQueueObjectType.ts';
import {GetState} from 'zustand';

export interface HookStateType {
    hookQueue: HookQueueObjectType[],
    queueSequence: string[]
}