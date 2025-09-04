import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1E88E5' }, headerTintColor: '#fff' }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

 
