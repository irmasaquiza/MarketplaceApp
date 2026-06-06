import * as Device from 'expo-device';
import { Platform } from 'react-native';

export function resolveApiBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '');
  }

  if (Platform.OS === 'android' && !Device.isDevice) {
    return 'https://10.0.2.2:44366/api/v1';
  }

  return 'https://busvuelosapi0517-f7bxa0hjh8f8a2at.brazilsouth-01.azurewebsites.net/api/v1';
}
