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

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown: false, tabBarStyle: {height: store.navigationState(state => state).isBottomTabVisible ? "10%" : "0%"}}} initialRouteName={'tabMain'}>
            <Tab.Screen name={"tabSearch"} component={SearchChallengeStackNavigation} />
            <Tab.Screen name={"tabChallenge"} component={ChallengeStackNavigation} />
            <Tab.Screen name={"tabMain"} component={MainStackNavigation} />
            <Tab.Screen name={"tabProfile"} component={ProfileStackNavigation} />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation;