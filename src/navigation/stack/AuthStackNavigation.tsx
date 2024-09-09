import Stack from '../../config/global/stack.ts';
import SignInScreen from '../../screen/auth/SignInScreen.tsx';
import SignUpScreen from '../../screen/auth/SignUpScreen.tsx';
import Onboarding from '../../screen/Onboarding.tsx';

const AuthStackNavigation = () => {
  return (
    <Stack.Navigator initialRouteName={'Onboard'} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="authOnboard" component={Onboarding} />
      <Stack.Screen name="authSignIn" component={SignInScreen} />
      <Stack.Screen name="authSignUp" component={SignUpScreen} />
    </Stack.Navigator>
  )
}

export default AuthStackNavigation;