import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';

import { name as appName } from './app.json';
import App from './src/App';

// if (__DEV__) {
//   import('@/reactotron.config');
// }

// AppRegistry.registerComponent(appName, () => App);
registerRootComponent(App);