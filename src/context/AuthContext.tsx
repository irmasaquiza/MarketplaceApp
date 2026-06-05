import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  loginApi,
  logoutApi,
  registerClienteApi,
  type AuthUsuario,
  type LoginCredentials,
  type RegisterClientePayload,
} from '@/api/authApi';
import {
  extractIdClienteFromPayload,
  extractRoleFromPayload,
  parseJwtPayload,
} from '@/utils/jwt';

const TOKEN_KEY = 'marketplace.jwt';
const USUARIO_KEY = 'marketplace.usuario';
const ROL_KEY = 'marketplace.rol';

type AuthContextValue = {
  token: string | null;
  usuario: AuthUsuario | null;
  rol: string | null;
  idCliente: number | null;
  isReady: boolean;
  isAuthenticated: boolean;
  isCliente: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (payload: RegisterClientePayload) => Promise<void>;
  logout: () => Promise<void>;
  setToken: (token: string | null) => Promise<void>;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function persistSession(
  token: string | null,
  usuario: AuthUsuario | null,
  rol: string | null,
) {
  if (token) {
    await AsyncStorage.setItem(TOKEN_KEY, token);
    await AsyncStorage.setItem(USUARIO_KEY, JSON.stringify(usuario ?? null));
    await AsyncStorage.setItem(ROL_KEY, rol ?? '');
    return;
  }

  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(USUARIO_KEY);
  await AsyncStorage.removeItem(ROL_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<AuthUsuario | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(USUARIO_KEY),
      AsyncStorage.getItem(ROL_KEY),
    ])
      .then(([storedToken, storedUsuario, storedRol]) => {
        if (storedToken) {
          setTokenState(storedToken);
          setUsuario(storedUsuario ? (JSON.parse(storedUsuario) as AuthUsuario) : null);
          setRol(storedRol || null);
          return;
        }

        const envToken = process.env.EXPO_PUBLIC_JWT_TOKEN;
        if (envToken) {
          setTokenState(envToken);
          const payload = parseJwtPayload(envToken);
          setRol(extractRoleFromPayload(payload));
        }
      })
      .finally(() => setIsReady(true));
  }, []);

  const applySession = useCallback(
    async (nextToken: string, nextUsuario: AuthUsuario | null, nextRol: string | null) => {
      setTokenState(nextToken);
      setUsuario(nextUsuario);
      setRol(nextRol);
      await persistSession(nextToken, nextUsuario, nextRol);
    },
    [],
  );

  const setToken = useCallback(
    async (value: string | null) => {
      if (!value) {
        setTokenState(null);
        setUsuario(null);
        setRol(null);
        await persistSession(null, null, null);
        return;
      }

      const payload = parseJwtPayload(value);
      await applySession(value, usuario, extractRoleFromPayload(payload));
    },
    [applySession, usuario],
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const data = await loginApi(credentials);
      const payload = parseJwtPayload(data.token);

      await applySession(
        data.token,
        data.usuario,
        data.rol ?? extractRoleFromPayload(payload),
      );
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterClientePayload) => {
      await registerClienteApi(payload);
      await login({ username: payload.username, password: payload.password });
    },
    [login],
  );

  const logout = useCallback(async () => {
    if (token) {
      try {
        await logoutApi(token);
      } catch {
        // Limpia sesión local aunque el servidor falle.
      }
    }

    setTokenState(null);
    setUsuario(null);
    setRol(null);
    await persistSession(null, null, null);
  }, [token]);

  const getToken = useCallback(() => token, [token]);

  const idCliente = useMemo(() => {
    if (!token) return null;
    return extractIdClienteFromPayload(parseJwtPayload(token));
  }, [token]);

  const value = useMemo(
    () => ({
      token,
      usuario,
      rol,
      idCliente,
      isReady,
      isAuthenticated: Boolean(token),
      isCliente: rol === 'CLIENTE',
      login,
      register,
      logout,
      setToken,
      getToken,
    }),
    [token, usuario, rol, idCliente, isReady, login, register, logout, setToken, getToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }

  return context;
}
