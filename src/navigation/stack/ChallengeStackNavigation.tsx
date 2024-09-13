import Stack from '../../config/global/stack.ts';
import ProfileScreen from '../../screen/myInfo/ProfileScreen.tsx';
import ChallengeInfoScreen from '../../screen/challenge/ChallengeInfoScreen.tsx';
import MyChallengeInfoScreen from '../../screen/challenge/MyChallengeInfoScreen.tsx';

const ChallengeStackNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName={'challengeChallenge'}>
            <Stack.Screen name={'challengeChallenge'} component={MyChallengeInfoScreen} />
            <Stack.Screen name={'challengeProfile'} component={ProfileScreen} />
        </Stack.Navigator>
    );
}

export default ChallengeStackNavigation;