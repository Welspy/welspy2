import Tab from '../../config/global/tab.ts';
import MainScreen from '../../screen/main/MainScreen.tsx';
import ProfileScreen from '../../screen/myInfo/ProfileScreen.tsx';
import ChallengeInfoScreen from '../../screen/challenge/ChallengeInfoScreen.tsx';
import SearchChallengeScreen from '../../screen/challenge/SearchChallengeScreen.tsx';
import MainStackNavigation from '../stack/MainStackNavigation.tsx';
import SearchChallengeStackNavigation from '../stack/SearchChallengeStackNavigation.tsx';
import ChallengeStackNavigation from '../stack/ChallengeStackNavigation.tsx';
import ProfileStackNavigation from '../stack/MyInfoStackNavigation.tsx';

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator screenOptions={{headerShown: false}} initialRouteName={'TabMain'}>
            <Tab.Screen name={"tabMain"} component={MainStackNavigation} />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation;