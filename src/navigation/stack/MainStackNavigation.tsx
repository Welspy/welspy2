import Stack from '../../config/global/stack.ts';
import MainScreen from '../../screen/main/MainScreen.tsx';
import CreateChallengeScreen from '../../screen/challenge/CreateChallengeScreen.tsx';
import ChallengeInfoScreen from '../../screen/challenge/ChallengeInfoScreen.tsx';

const MainStackNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"mainMain"} component={MainScreen} />
            <Stack.Screen name={"mainCreate"} component={CreateChallengeScreen} />
            <Stack.Screen name={"mainChallenge"} component={ChallengeInfoScreen} />
        </Stack.Navigator>
    )
}

export default MainStackNavigation;