import Stack from '../../config/global/stack.ts';
import AuthStackNavigation from './AuthStackNavigation.tsx';
import BottomTabNavigation from '../bottomTab/BottomTabNavigation.tsx';
import {NavigationContainer} from '@react-navigation/native';
import store from "../../state/store.ts";

const RootStackNavigation = () => {
    const {userInfo} = store.userState(state => state)
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="rootAuth" screenOptions={{headerShown: false}} detachInactiveScreens={false}>
          {/*{ !userInfo?.email &&*/}
              <Stack.Screen component={AuthStackNavigation} name={"rootAuth"} options={{gestureEnabled : false}} />
          {/*}*/}
        <Stack.Screen component={BottomTabNavigation} name={"rootTab"} options={{gestureEnabled : false}}  />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootStackNavigation;
