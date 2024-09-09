import Stack from '../../config/global/stack.ts';
import AuthStackNavigation from './AuthStackNavigation.tsx';
import BottomTabNavigation from '../bottomTab/BottomTabNavigation.tsx';
import {NavigationContainer} from '@react-navigation/native';

const RootStackNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="rootAuth" screenOptions={{headerShown: false}}>
        <Stack.Screen component={AuthStackNavigation} name={"rootAuth"} />
        <Stack.Screen component={BottomTabNavigation} name={"rootTab"} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootStackNavigation;