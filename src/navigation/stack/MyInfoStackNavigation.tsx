import Stack from '../../config/global/stack.ts';
import ProfileScreen from '../../screen/myInfo/ProfileScreen.tsx';

const ProfileStackNavigation = () => {
    return (
        <Stack.Navigator initialRouteName="profileProfile" screenOptions={{ headerShown: false }}>
            <Stack.Screen name={"profileProfile"} component={ProfileScreen} />
        </Stack.Navigator>
    )
}

export default ProfileStackNavigation;