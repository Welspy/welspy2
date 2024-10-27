export interface NavigationStateType {
    isBottomTabVisible: boolean;
    alarmState: {
        challenge: number,
        main: number,
        user: number,
        allOf: number,
    },
    tabHistory: boolean,
}
