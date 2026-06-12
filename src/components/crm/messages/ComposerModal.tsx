/**
 * ✉️ COMPOSER MODAL - Modal de redacción de mensajes del CRM
 * Encapsula la selección de destinatario (solicitud o usuario directo),
 * la carga de leads/usuarios/plantillas y el envío del mensaje.
 */

import React, { useState, useEffect } from 'react';
import { FileText, Send, X, Inbox, User, MousePointerClick } from 'lucide-react';
import { MessageComposer } from './MessageComposer';
import { messageService, templateService } from '../../../services/messageService';
import { crmService } from '../../../services/crmService';
import * as directMessageService from '../../../services/directMessageService';
import type {
  MessageTemplate,
  CreateInternalMessageData,
  CreateClientMessageData,
} from '../../../types/message.types';

interface ComposerModalProps {
  mode: 'internal' | 'client';
  onClose: () => void;
  /** Se invoca tras enviar exitosamente, para que el padre recargue la bandeja */
  onMessageSent: () => void;
}

export const ComposerModal: React.FC<ComposerModalProps> = ({ mode, onClose, onMessageSent }) => {
  // Destinatario
  const [messageTarget, setMessageTarget] = useState<'lead' | 'user'>('lead');
  const [selectedLead, setSelectedLead] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');

  // Datos
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [directUsers, setDirectUsers] = useState<directMessageService.DirectUser[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);

  // ========================================
  // 📊 CARGA DE DATOS
  // ========================================

  useEffect(() => {
    loadLeads();
    loadTemplates();
  }, []);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const response = await crmService.getLeads({ page: 1, limit: 100 });
      if (response.success && response.data) {
        setLeads(response.data || []);
      }
    } catch (error) {
      console.error('Error cargando leads:', error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const loadDirectUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await directMessageService.getAllActiveUsers();
      setDirectUsers(response.users || []);
    } catch (error: any) {
      console.error('❌ Error cargando usuarios:', error);
      setDirectUsers([]);
      alert(`Error cargando usuarios: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await templateService.getTemplates();
      if (response.success && response.data) {
        setTemplates(response.data.plantillas || []);
      }
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    }
  };

  // ========================================
  // 📨 ENVÍO
  // ========================================

  const handleSendMessage = async (data: CreateInternalMessageData | CreateClientMessageData) => {
    try {
      if (messageTarget === 'user' && selectedUser) {
        // Mensaje directo a usuario sin lead
        await directMessageService.sendDirectMessage(selectedUser, {
          asunto: data.asunto,
          contenido: data.contenido,
          prioridad: data.prioridad,
          canal: 'sistema',
        });
      } else if (messageTarget === 'lead' && selectedLead) {
        // Mensaje tradicional a través de lead
        if (mode === 'internal') {
          await messageService.sendInternalMessage(data as CreateInternalMessageData);
        } else {
          await messageService.sendClientMessage(data as CreateClientMessageData);
        }
      } else {
        throw new Error('Debe seleccionar un destinatario');
      }

      onMessageSent();
      onClose();
    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
    }
  };

  // ========================================
  // 🎨 RENDER
  // ========================================

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {mode === 'internal'
              ? <><FileText size={22} strokeWidth={1.5} />Nueva Nota Interna</>
              : <><Send size={22} strokeWidth={1.5} />Mensaje a Cliente</>
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={24} strokeWidth={2} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Selector de Tipo de Destinatario */}
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                <Inbox size={14} strokeWidth={1.5} />Tipo de Destinatario
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMessageTarget('lead');
                    setSelectedUser('');
                    if (leads.length === 0) loadLeads();
                  }}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5
                    ${messageTarget === 'lead'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  <FileText size={14} strokeWidth={1.5} />Solicitud
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMessageTarget('user');
                    setSelectedLead('');
                    if (directUsers.length === 0) loadDirectUsers();
                  }}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5
                    ${messageTarget === 'user'
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    }
                  `}
                >
                  <User size={14} strokeWidth={1.5} />Usuario Directo
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {messageTarget === 'lead'
                  ? 'Envía mensaje a una solicitud activa'
                  : 'Envía mensaje directo a cualquier usuario registrado'
                }
              </p>
            </div>

            {/* Selector de Lead (si target es 'lead') */}
            {messageTarget === 'lead' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seleccionar Solicitud *
                </label>
                {isLoadingLeads ? (
                  <div className="flex items-center gap-2 text-gray-500 py-8">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span>Cargando solicitudes...</span>
                  </div>
                ) : leads.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      No hay solicitudes disponibles
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Crea una solicitud primero para poder enviar mensajes
                    </p>
                  </div>
                ) : (
                  <select
                    value={selectedLead}
                    onChange={(e) => setSelectedLead(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">-- Seleccione una solicitud --</option>
                    {leads.map((lead) => (
                      <option key={lead._id} value={lead._id}>
                        {lead.nombre} {lead.empresa ? `- ${lead.empresa}` : ''} ({lead.tipoServicio})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Selector de Usuario Directo (si target es 'user') */}
            {messageTarget === 'user' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Seleccionar Usuario *
                </label>
                {isLoadingUsers ? (
                  <div className="flex items-center gap-2 text-gray-500 py-8">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                    <span>Cargando usuarios...</span>
                  </div>
                ) : directUsers.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      No hay usuarios disponibles
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      No se encontraron usuarios activos
                    </p>
                  </div>
                ) : (
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">-- Seleccione un usuario --</option>
                    {directUsers.map((user) => (
                      <option key={user.clerkId} value={user.clerkId}>
                        {user.fullName} - {user.email} ({user.role})
                        {user.messageCount > 0 ? ` • ${user.messageCount} mensajes` : ''}
                      </option>
                    ))}
                  </select>
                )}
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Todos los usuarios registrados en el sistema
                </p>
              </div>
            )}

            {/* Message Composer - Solo se muestra cuando hay un destinatario seleccionado */}
            {(messageTarget === 'lead' && selectedLead) || (messageTarget === 'user' && selectedUser) ? (
              <MessageComposer
                leadId={messageTarget === 'lead' ? selectedLead : 'virtual'}
                leadData={messageTarget === 'lead' ? leads.find(l => l._id === selectedLead) : undefined}
                messageType={mode}
                onSend={handleSendMessage}
                onCancel={onClose}
                templates={templates}
                showSubject={true}
                showPriority={true}
              />
            ) : (
              <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <MousePointerClick size={40} strokeWidth={1.5} className="mb-3 text-gray-400 dark:text-gray-500 mx-auto" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {messageTarget === 'lead'
                    ? 'Selecciona una solicitud para continuar'
                    : 'Selecciona un usuario para continuar'
                  }
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  El formulario de mensaje aparecerá aquí
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComposerModal;
