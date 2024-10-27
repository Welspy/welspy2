import Tab from '../../config/global/tab.ts';
import MainStackNavigation from '../stack/MainStackNavigation.tsx';
import SearchChallengeStackNavigation from '../stack/SearchChallengeStackNavigation.tsx';
import ChallengeStackNavigation from '../stack/ChallengeStackNavigation.tsx';
import ProfileStackNavigation from '../stack/MyInfoStackNavigation.tsx';
import store from '../../state/store.ts';
import Icon from "../../component/Icon.tsx";
import {useNavigation} from "@react-navigation/native";
import ProductionScreen from "../../screen/challenge/ProductionScreen.tsx";
import {Platform, View} from "react-native";
import {Height} from "../../config/global/dimensions.ts";
import {useEffect} from "react";

const BottomTabNavigation = () => {
    const {alarmState} = store.navigationState(state => state)
    const fullNavigation = useNavigation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const getIconName = () => (route.name === 'tabSearch' ? 'search' : route.name === 'tabMain' ? "home" : route.name === 'tabChallenge' ? "challenge" : route.name === 'tabProfile' ? "profile" : route.name === 'tabProduction' ? 'production' : '');
                const iconName = getIconName();
                return {
                    headerShown: false,
                    tabBarBackground: () => <><View style={{borderRadius: 30, backgroundColor: '#FFF', width: "100%", height: Height/(100/30), position: 'absolute', marginTop: Platform.OS == 'ios' ? -63 : -73, shadowColor: "#222",
                        shadowOffset: {width: 1, height: -2},
                        shadowRadius: 40,
                        shadowOpacity: 0.125,}}></View><View style={{position: 'absolute', width: 66, height: 66, backgroundColor: '#FFF', marginTop: Platform.OS == 'ios' ? -80 : -90, alignSelf: 'center', borderRadius: Height/10, borderColor: iconName == "search" ? '#5b94f3' : "#e6e6e6", borderWidth: 3}}></View></>,
                    tabBarBadgeStyle: {backgroundColor: '#5b94f3', color: 'white', fontSize:11, height: 17, justifyContent: 'center', marginTop: 7, marginLeft: 2, fontWeight: "500"},
                    tabBarStyle: {
                        height: store.navigationState(state => state).isBottomTabVisible ? "0%" : "0%",
                        paddingHorizontal: 15,
                        position: 'absolute',
                        backgroundColor: 'transparent',
                        borderTopWidth: 0,
                        marginBottom: store.navigationState(state => state).isBottomTabVisible ? 5 : -100,
                    },
                    tabBarItemStyle: {
                        marginTop: Platform.OS == 'ios' ? -68 : -78,
                    },
                    tabBarLabelStyle: {
                        marginBottom: Platform.OS == 'ios' ? -7.5 : 9,
                    },
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    tabBarIcon: ({ color }) => <Icon onPress={() => fullNavigation.navigate(route)} name={iconName} size={22} color={color} />,
                }
            }} initialRouteName={'tabMain'}>
            <Tab.Screen name={"tabChallenge"} options={{tabBarLabel: "내 챌린지", tabBarBadge: alarmState.challenge == 0 ? undefined : alarmState.challenge}} component={ChallengeStackNavigation}/>
            <Tab.Screen name={"tabMain"} options={{tabBarLabel: "홈", tabBarBadge: alarmState.main == 0 ? undefined : alarmState.main}} component={MainStackNavigation}/>
            <Tab.Screen name={"tabSearch"} options={{tabBarLabel: "챌린지 찾기", tabBarIconStyle: {marginTop: Platform.OS == 'ios' ? -22 : -12}}} component={SearchChallengeStackNavigation}/>
            <Tab.Screen name={"tabProduction"} options={{tabBarLabel: "상품", }} component={ProductionScreen}/>
            <Tab.Screen name={"tabProfile"} options={{tabBarLabel: "프로필", tabBarBadge: alarmState.user == 0 ? undefined : alarmState.user}} component={ProfileStackNavigation}/>
        </Tab.Navigator>
    )
}

export default BottomTabNavigation;
