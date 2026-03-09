/**
 * 🎥 Sala de Reuniones Virtual - SERSI Integration
 * 
 * Panel para acceder a salas de reuniones virtuales 2D (SERSI)
 * - Admins: Configurar API keys + ver/entrar a espacios
 * - Usuarios: Ver espacios disponibles + entrar via popup
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SmartDashboardLayout from '../../components/SmartDashboardLayout';
import { useDashboardHeaderGradient } from '../../hooks/cms/useDashboardHeaderGradient';
import axios from 'axios';

// ─── Configuración de API ───
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: `${API_URL}/meeting`,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error obteniendo token de Clerk:', error);
  }
  return config;
});

// ─── Tipos ───
interface SersiSpace {
  _id: string;
  name: string;
  description?: string;
  status?: string;
  settings?: {
    allowGuests?: boolean;
    maxCapacity?: number;
  };
}

interface SersiConfig {
  configured: boolean;
  source: string | null;
  apiKey: string | null;
  apiSecret: string | null;
  updatedAt: string | null;
  hasEnvVars: boolean;
  enabled: boolean;
}

// ─── Componente Principal ───
const MeetingRoom: React.FC = () => {
  const { canAccessAdmin } = useAuth();
  const { headerGradient } = useDashboardHeaderGradient();

  // Estados principales
  const [spaces, setSpaces] = useState<SersiSpace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notConfigured, setNotConfigured] = useState(false);

  // Estados de configuración (solo admin)
  const [showConfig, setShowConfig] = useState(false);
  const [config, setConfig] = useState<SersiConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiSecretInput, setApiSecretInput] = useState('');
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estado del popup
  const [windowOpen, setWindowOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // ─── Cargar espacios ───
  const loadSpaces = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotConfigured(false);

      const response = await api.get('/spaces');
      if (response.data.success) {
        setSpaces(response.data.data || []);
      }
    } catch (err: any) {
      if (err.response?.status === 500 && err.response?.data?.message?.includes('no configurada')) {
        setNotConfigured(true);
      } else {
        setError(err.response?.data?.message || 'Error al cargar espacios');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Cargar config (admin) ───
  const loadConfig = useCallback(async () => {
    if (!canAccessAdmin) return;
    try {
      setConfigLoading(true);
      const response = await api.get('/config');
      if (response.data.success) {
        setConfig(response.data.data);
      }
    } catch (err: any) {
      console.error('Error cargando config:', err);
    } finally {
      setConfigLoading(false);
    }
  }, [canAccessAdmin]);

  // ─── Guardar config ───
  const saveConfig = async () => {
    if (!apiKeyInput.trim() || !apiSecretInput.trim()) {
      setSaveMessage({ type: 'error', text: 'Ambos campos son requeridos' });
      return;
    }

    try {
      setConfigLoading(true);
      setSaveMessage(null);

      const response = await api.put('/config', {
        apiKey: apiKeyInput.trim(),
        apiSecret: apiSecretInput.trim()
      });

      if (response.data.success) {
        setSaveMessage({ type: 'success', text: '✅ Claves guardadas correctamente' });
        setApiKeyInput('');
        setApiSecretInput('');
        await loadConfig();
        await loadSpaces();
      }
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error al guardar configuración'
      });
    } finally {
      setConfigLoading(false);
    }
  };

  // ─── Eliminar config ───
  const deleteConfig = async () => {
    if (!confirm('¿Eliminar la configuración de SERSI? Se usarán las variables de entorno si están disponibles.')) {
      return;
    }

    try {
      setConfigLoading(true);
      const response = await api.delete('/config');
      if (response.data.success) {
        setSaveMessage({ type: 'success', text: 'Configuración eliminada' });
        await loadConfig();
        await loadSpaces();
      }
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error al eliminar configuración'
      });
    } finally {
      setConfigLoading(false);
    }
  };

  // ─── Abrir espacio en popup ───
  const openSpace = (spaceId: string) => {
    const url = `https://scmeet.vercel.app/join/${encodeURIComponent(spaceId)}`;
    const width = Math.min(1200, window.screen.availWidth - 100);
    const height = Math.min(800, window.screen.availHeight - 100);
    const left = Math.round((window.screen.availWidth - width) / 2);
    const top = Math.round((window.screen.availHeight - height) / 2);

    const popup = window.open(
      url,
      'sersi-meeting-room',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes,resizable=yes`
    );

    if (popup) {
      setWindowOpen(true);
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setWindowOpen(false);
        }
      }, 1000);
    } else {
      alert('El navegador bloqueó la ventana emergente. Por favor, permite popups para este sitio.');
    }
  };

  // ─── Copiar enlace de invitación ───
  const copyInviteLink = async (spaceId: string) => {
    const url = `https://scmeet.vercel.app/join/${encodeURIComponent(spaceId)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(spaceId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback para navegadores sin clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(spaceId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // ─── Effects ───
  useEffect(() => {
    loadSpaces();
  }, [loadSpaces]);

  useEffect(() => {
    if (canAccessAdmin && showConfig) {
      loadConfig();
    }
  }, [canAccessAdmin, showConfig, loadConfig]);

  // ─── Renderizar Panel de Configuración (Admin) ───
  const renderConfigPanel = () => {
    if (!canAccessAdmin || !showConfig) return null;

    return (
      <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header del panel */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚙️</span>
            <div>
              <h3 className="font-bold text-lg">Configuración de SERSI</h3>
              <p className="text-indigo-100 text-sm">Gestiona las claves API de la integración</p>
            </div>
          </div>
          <button
            onClick={() => setShowConfig(false)}
            className="text-white/70 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Estado actual */}
          {config && (
            <div className={`p-4 rounded-lg border ${
              config.configured
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span>{config.configured ? '✅' : '⚠️'}</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  {config.configured ? 'Configurado' : 'No configurado'}
                </span>
              </div>
              {config.configured && (
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Fuente: <span className="font-mono bg-gray-200 dark:bg-gray-700 px-1 rounded">{config.source}</span></p>
                  <p>API Key: <span className="font-mono">{config.apiKey}</span></p>
                  <p>API Secret: <span className="font-mono">{config.apiSecret}</span></p>
                  {config.updatedAt && (
                    <p>Última actualización: {new Date(config.updatedAt).toLocaleString('es-ES')}</p>
                  )}
                </div>
              )}
              {config.hasEnvVars && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  💡 Variables de entorno disponibles como fallback
                </p>
              )}
            </div>
          )}

          {configLoading && !config && (
            <div className="text-center py-4 text-gray-500">Cargando configuración...</div>
          )}

          {/* Formulario de claves */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Key
              </label>
              <input
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="sk_live_..."
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Secret
              </label>
              <input
                type="password"
                value={apiSecretInput}
                onChange={(e) => setApiSecretInput(e.target.value)}
                placeholder="Tu API Secret de SERSI"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Mensaje de estado */}
          {saveMessage && (
            <div className={`p-3 rounded-lg text-sm ${
              saveMessage.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            }`}>
              {saveMessage.text}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={saveConfig}
              disabled={configLoading || !apiKeyInput.trim() || !apiSecretInput.trim()}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {configLoading ? 'Validando...' : '🔑 Guardar claves'}
            </button>
            {config?.configured && config?.source === 'database' && (
              <button
                onClick={deleteConfig}
                disabled={configLoading}
                className="px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg font-medium hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 transition-all border border-red-200 dark:border-red-800"
              >
                🗑️ Eliminar
              </button>
            )}
          </div>

          {/* Ayuda */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-400">
              💡 Obtén tus claves API en{' '}
              <a
                href="https://scmeet.vercel.app/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium hover:text-blue-800 dark:hover:text-blue-300"
              >
                scmeet.vercel.app/dashboard
              </a>
              {' → Documentación API → Autenticación'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ───
  return (
    <SmartDashboardLayout>
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div
          className="rounded-xl p-6 mb-6 text-white shadow-lg"
          style={{ background: headerGradient }}
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎥</span>
              <div>
                <h1 className="text-2xl font-bold">Sala de Reuniones</h1>
                <p className="text-white/80 text-sm">Oficina virtual interactiva con SERSI</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Botón Actualizar */}
              <button
                onClick={loadSpaces}
                disabled={loading}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all backdrop-blur-sm disabled:opacity-50"
              >
                {loading ? '⏳' : '🔄'} Actualizar
              </button>
              {/* Botón Config (solo admin) */}
              {canAccessAdmin && (
                <button
                  onClick={() => setShowConfig(!showConfig)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all backdrop-blur-sm ${
                    showConfig
                      ? 'bg-white/30 ring-2 ring-white/50'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  ⚙️ Configuración
                </button>
              )}
            </div>
          </div>

          {/* Indicador de sala abierta */}
          {windowOpen && (
            <div className="mt-3 px-4 py-2 bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-400/30 flex items-center gap-2">
              <span className="animate-pulse">🟢</span>
              <span className="text-sm">Sala de reuniones abierta en otra ventana</span>
            </div>
          )}
        </div>

        {/* Panel de configuración (admin) */}
        {renderConfigPanel()}

        {/* Estado: Cargando */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Cargando espacios de reunión...</p>
          </div>
        )}

        {/* Estado: No Configurado */}
        {!loading && notConfigured && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <span className="text-6xl block mb-4">🔧</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Sala de reuniones no configurada
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {canAccessAdmin
                ? 'Configura las claves API de SERSI para habilitar las salas de reuniones.'
                : 'Contacta al administrador para habilitar esta función.'}
            </p>
            {canAccessAdmin && !showConfig && (
              <button
                onClick={() => setShowConfig(true)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                ⚙️ Configurar ahora
              </button>
            )}
          </div>
        )}

        {/* Estado: Error */}
        {!loading && error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-200 dark:border-red-800 p-8 text-center">
            <span className="text-6xl block mb-4">❌</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Error al cargar espacios
            </h2>
            <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={loadSpaces}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600 transition-all"
            >
              🔄 Reintentar
            </button>
          </div>
        )}

        {/* Estado: Sin espacios */}
        {!loading && !notConfigured && !error && spaces.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
            <span className="text-6xl block mb-4">📭</span>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              No hay espacios disponibles
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {canAccessAdmin
                ? 'Crea un espacio en el dashboard de SERSI para comenzar.'
                : 'No hay salas de reuniones disponibles en este momento.'}
            </p>
            {canAccessAdmin && (
              <a
                href="https://scmeet.vercel.app/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md"
              >
                🌐 Ir a SERSI Dashboard
              </a>
            )}
          </div>
        )}

        {/* Lista de espacios */}
        {!loading && !notConfigured && !error && spaces.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {spaces.map((space) => (
              <div
                key={space._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Header del card */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg shadow-md">
                        🏢
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {space.name}
                        </h3>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          space.status === 'active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {space.status === 'active' ? '● Activo' : space.status || 'Desconocido'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {space.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                      {space.description}
                    </p>
                  )}

                  {/* Info adicional */}
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {space.settings?.maxCapacity && (
                      <span className="flex items-center gap-1">
                        👥 Max: {space.settings.maxCapacity}
                      </span>
                    )}
                    {space.settings?.allowGuests && (
                      <span className="flex items-center gap-1 text-green-500">
                        🔓 Invitados permitidos
                      </span>
                    )}
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => openSpace(space._id)}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg text-sm"
                    >
                      🚀 Entrar
                    </button>
                    {space.settings?.allowGuests && (
                      <button
                        onClick={() => copyInviteLink(space._id)}
                        className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all border ${
                          copiedId === space._id
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-700'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                      >
                        {copiedId === space._id ? '✅ Copiado' : '🔗 Invitar'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer informativo */}
        {!loading && !notConfigured && !error && spaces.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              💡 Las salas se abren en una ventana separada. Asegúrate de permitir ventanas emergentes en tu navegador.
              {canAccessAdmin && (
                <>
                  {' '}Gestiona tus espacios en{' '}
                  <a
                    href="https://scmeet.vercel.app/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:text-indigo-600 underline"
                  >
                    SERSI Dashboard
                  </a>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </SmartDashboardLayout>
  );
};

export default MeetingRoom;
