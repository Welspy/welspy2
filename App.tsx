/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import RootStackNavigation from './src/navigation/stack/RootStackNavigation.tsx';
import {Platform, UIManager} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
if (Platform.OS === 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);


function App() {
  return (
    <RootStackNavigation/>
  )
}

export default App;
