import Tab from '../../config/global/tab.ts';
import MainScreen from '../../screen/main/MainScreen.tsx';
import ProfileScreen from '../../screen/myInfo/ProfileScreen.tsx';
import ChallengeInfoScreen from '../../screen/challenge/ChallengeInfoScreen.tsx';
import SearchChallengeScreen from '../../screen/challenge/SearchChallengeScreen.tsx';
import MainStackNavigation from '../stack/MainStackNavigation.tsx';
import SearchChallengeStackNavigation from '../stack/SearchChallengeStackNavigation.tsx';
import ChallengeStackNavigation from '../stack/ChallengeStackNavigation.tsx';
import ProfileStackNavigation from '../stack/MyInfoStackNavigation.tsx';
import store from '../../state/store.ts';
import Icon from "../../component/Icon.tsx";
import {useNavigation} from "@react-navigation/native";

const BottomTabNavigation = () => {
    const fullNavigation = useNavigation();
    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const getIconName = () => (route.name === 'tabSearch' ? 'search' : route.name === 'tabMain' ? "home" : route.name === 'tabChallenge' ? "challenge" : route.name === 'tabProfile' ? "profile" : "");
                const iconName = getIconName();
                return {
                    headerShown: false,
                    tabBarStyle: {
                        height: store.navigationState(state => state).isBottomTabVisible ? "12%" : "0%",
                        borderRadius: 30,
                        paddingRight: 6,
                        shadowOffset: {width: 1, height: 1},
                        shadowColor: "black",
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        overflow: 'hidden',
                        marginBottom: store.navigationState(state => state).isBottomTabVisible ? 5 : -40,
                    },
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    tabBarIcon: ({ color }) => <Icon onPress={() => fullNavigation.navigate(route)} name={iconName} size={22} color={color} />,
                }
            }} initialRouteName={'tabMain'}>
            <Tab.Screen name={"tabSearch"} options={{tabBarLabel: "챌린지 찾기"}} component={SearchChallengeStackNavigation}/>
            <Tab.Screen name={"tabChallenge"} options={{tabBarLabel: "내 챌린지"}} component={ChallengeStackNavigation}/>
            <Tab.Screen name={"tabMain"} options={{tabBarLabel: "홈 화면"}} component={MainStackNavigation}/>
            <Tab.Screen name={"tabProfile"} options={{tabBarLabel: "프로필"}} component={ProfileStackNavigation}/>
        </Tab.Navigator>
    )
}

export default BottomTabNavigation;