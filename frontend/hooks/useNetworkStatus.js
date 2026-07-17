// hooks/useNetworkStatus.js
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export default function useNetworkStatus() {
  const [conectado, setConectado] = useState(true);

  useEffect(() => {
    const unsub = NetInfo.addEventListener((estado) => {
      setConectado(!!estado.isConnected && estado.isInternetReachable !== false);
    });
    return unsub;
  }, []);

  return conectado;
}
