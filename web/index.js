import { AppRegistry } from 'react-native';
import App from '../App.web';

// Register the app for web
AppRegistry.registerComponent('crossplatform', () => App);

// Run the app
AppRegistry.runApplication('crossplatform', {
  rootTag: document.getElementById('root'),
});