import Stack from '../../config/global/stack.ts';
import SearchChallengeScreen from '../../screen/challenge/SearchChallengeScreen.tsx';
import ChallengeInfoScreen from '../../screen/challenge/ChallengeInfoScreen.tsx';
import CreateChallengeScreen from '../../screen/challenge/CreateChallengeScreen.tsx';

const SearchChallengeStackNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="searchSearch">
            <Stack.Screen name={"searchSearch"} component={SearchChallengeScreen} />
            <Stack.Screen name={"searchChallenge"} component={ChallengeInfoScreen} />
            <Stack.Screen name={"searchCreate"} component={CreateChallengeScreen} />
        </Stack.Navigator>
    );
}

export default SearchChallengeStackNavigation;