import Stack from '../../config/global/stack.ts';
import ProfileScreen from '../../screen/myInfo/ProfileScreen.tsx';

const ChallengeStackNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"challengeProfile"} component={ProfileScreen}/>
            <Stack.Screen name={"challengeMyProfile"} component={ProfileScreen}/>
        </Stack.Navigator>
    )
}

export default ChallengeStackNavigation;