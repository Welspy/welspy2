import Stack from '../../config/global/stack.ts';
import ProfileScreen from '../../screen/myInfo/ProfileScreen.tsx';
import SendMoneyToChallenge from "../../screen/bank/SendMoneyToChallenge.tsx";

const ProfileStackNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="profileProfile" screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"profileProfile"} component={ProfileScreen} />
            <Stack.Screen name={"profileSend"} component={SendMoneyToChallenge} />
        </Stack.Navigator>
    )
}

export default ProfileStackNavigation;
