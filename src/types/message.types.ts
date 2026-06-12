/**
 * 💬 TIPOS Y INTERFACES - SISTEMA DE MENSAJERÍA CRM
 * Definiciones TypeScript para el sistema completo de mensajes y plantillas
 */

// ========================================
// 📊 ENUMS Y TIPOS BÁSICOS
// ========================================

/**
 * Tipos de mensajes disponibles en el sistema
 */
export type MessageType =
  | 'nota_interna'      // Nota privada del equipo
  | 'mensaje_cliente'   // Mensaje enviado al cliente
  | 'respuesta_cliente' // Respuesta del cliente
  | 'notificacion';     // Notificación del sistema

/**
 * Estados posibles de un mensaje
 */
export type MessageStatus = 
  | 'enviado'      // Mensaje enviado exitosamente
  | 'pendiente'    // Pendiente de envío
  | 'fallido'      // Fallo en el envío
  | 'leido';       // Mensaje leído por el destinatario

/**
 * Canales de comunicación
 */
export type MessageChannel = 
  | 'sistema'          // Sistema interno
  | 'email'            // Correo electrónico
  | 'sms'              // Mensaje de texto
  | 'whatsapp'         // WhatsApp
  | 'chat';            // Chat en vivo

/**
 * Niveles de prioridad
 */
export type MessagePriority = 
  | 'baja' 
  | 'normal' 
  | 'alta' 
  | 'urgente';

/**
 * Roles de usuario
 */
export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'ADMIN' 
  | 'MODERATOR' 
  | 'CLIENT' 
  | 'USER';

// ========================================
// 👤 INTERFACES DE USUARIO
// ========================================

/**
 * Información del autor de un mensaje
 */
export interface MessageAuthor {
  userId: string;
  nombre: string;
  email: string;
  rol: UserRole;
  profileImage?: string; // URL del avatar de Clerk
}

/**
 * Información del destinatario de un mensaje
 */
export interface MessageRecipient {
  userId?: string | null;
  nombre?: string;
  email?: string;
  rol?: UserRole;
}

// ========================================
// 💬 INTERFACE PRINCIPAL: MENSAJE
// ========================================

/**
 * Interface completa de un mensaje del CRM
 */
export interface LeadMessage {
  _id: string;
  leadId: string | {
    _id: string;
    nombre?: string;
    correo?: string;
    estado?: string;
    usuarioRegistrado?: {
      userId: string;
      nombre?: string;
      email?: string;
      profileImage?: string | null;
    };
  };
  
  // Autor y destinatario
  autor: MessageAuthor;
  destinatario?: MessageRecipient;
  
  // Contenido
  tipo: MessageType;
  asunto?: string;
  contenido: string;
  
  // Privacidad y estado
  esPrivado: boolean;
  estado: MessageStatus;
  leido: boolean;
  fechaLeido?: string;
  lectoPor?: MessageAuthor[];
  
  // Canal y prioridad
  canal?: MessageChannel;
  prioridad: MessagePriority;
  
  // Threading (respuestas)
  respondidoA?: string | LeadMessage;
  respuestas?: string[];

  // Metadata
  etiquetas?: string[];
  metadata?: {
    emailId?: string;
    smsId?: string;
    notificationId?: string;
    [key: string]: any;
  };
  
  // Soft delete
  eliminado: boolean;
  eliminadoPor?: MessageAuthor;
  fechaEliminacion?: string;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

// ========================================
// 🗂️ INTERFACE: CONVERSACIÓN
// ========================================

/**
 * Conversación agregada por Lead (último mensaje + contadores)
 * Respuesta de GET /api/crm/messages/conversations
 */
export interface Conversation {
  leadId: string;
  lead: {
    _id: string;
    nombre?: string;
    correo?: string;
    estado?: string;
    tipoServicio?: string;
    usuarioRegistrado?: {
      userId: string;
      nombre?: string;
      email?: string;
      profileImage?: string | null;
    };
  } | null;
  totalMensajes: number;
  noLeidos: number;
  ultimoMensaje: LeadMessage;
}

/**
 * Respuesta del endpoint de conversaciones
 */
export interface ConversationListResponse {
  success: boolean;
  data: {
    conversaciones: Conversation[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

// ========================================
// 📋 INTERFACE: PLANTILLA DE MENSAJE
// ========================================

/**
 * Tipos de plantillas
 */
export type TemplateType = 
  | 'nota_interna' 
  | 'mensaje_cliente' 
  | 'email' 
  | 'sms';

/**
 * Categorías de plantillas
 */
export type TemplateCategory = 
  | 'bienvenida' 
  | 'seguimiento' 
  | 'cierre' 
  | 'soporte' 
  | 'general';

/**
 * Interface completa de una plantilla de mensaje
 */
export interface MessageTemplate {
  _id: string;
  
  // Información básica
  titulo: string;
  descripcion?: string;
  tipo: TemplateType;
  categoria: TemplateCategory;
  
  // Contenido
  asunto?: string;
  contenido: string;
  
  // Variables disponibles
  variablesDisponibles: TemplateVariable[];
  
  // Configuración
  esPrivada: boolean;
  esActiva: boolean;
  
  // Uso y estadísticas
  vecesUsada: number;
  ultimoUso?: string;
  favoritos?: MessageAuthor[];
  
  // Metadata
  etiquetas?: string[];
  creadoPor: MessageAuthor;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface para variables de plantilla
 */
export interface TemplateVariable {
  nombre: string;          // Ej: 'nombre'
  variable: string;        // Ej: '{nombre}'
  descripcion: string;     // Ej: 'Nombre del cliente'
  ejemplo?: string;        // Ej: 'Juan Pérez'
  requerida?: boolean;
}

// ========================================
// 📊 ESTADÍSTICAS Y MÉTRICAS
// ========================================

/**
 * Estadísticas de mensajes
 */
export interface MessageStats {
  total: number;
  porTipo: {
    [key in MessageType]?: number;
  };
  noLeidos: number;
  enviados: number;
  respondidos: number;
  promedioRespuesta?: number; // En horas
}

/**
 * Estadísticas de un lead
 */
export interface LeadMessageStats {
  totalMensajes: number;
  mensajesInternos: number;
  mensajesCliente: number;
  mensajesNoLeidos: number;
  ultimoMensaje?: LeadMessage;
  primerMensaje?: LeadMessage;
}

// ========================================
// 🔍 FILTROS Y BÚSQUEDA
// ========================================

/**
 * Filtros para búsqueda de mensajes
 */
export interface MessageFilters {
  leadId?: string;
  tipo?: MessageType | 'all';
  estado?: MessageStatus;
  leido?: boolean;
  esPrivado?: boolean;
  incluirPrivados?: boolean;
  canal?: MessageChannel;
  prioridad?: MessagePriority;
  desde?: string; // Fecha ISO
  hasta?: string; // Fecha ISO
  search?: string; // Búsqueda de texto
  etiquetas?: string[];
  autorId?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'prioridad';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Filtros para plantillas
 */
export interface TemplateFilters {
  tipo?: TemplateType | 'all';
  categoria?: TemplateCategory | 'all';
  esPrivada?: boolean;
  esActiva?: boolean;
  favoritos?: boolean;
  search?: string;
  creadoPorId?: string;
  page?: number;
  limit?: number;
}

// ========================================
// 📤 DATOS PARA ENVÍO (DTOs)
// ========================================

/**
 * Datos para crear mensaje interno (nota privada)
 */
export interface CreateInternalMessageData {
  leadId: string;
  contenido: string;
  asunto?: string;
  prioridad?: MessagePriority;
  etiquetas?: string[];
}

/**
 * Datos para crear mensaje a cliente
 */
export interface CreateClientMessageData {
  leadId: string;
  contenido: string;
  asunto?: string;
  prioridad?: MessagePriority;
  canal?: MessageChannel;
  usarPlantilla?: boolean;
  plantillaId?: string;
}

/**
 * Datos para responder mensaje
 */
export interface ReplyMessageData {
  messageId: string;
  contenido: string;
  esPrivado?: boolean;
}

/**
 * Datos para crear/actualizar plantilla
 */
export interface CreateTemplateData {
  titulo: string;
  descripcion?: string;
  tipo: TemplateType;
  categoria: TemplateCategory;
  asunto?: string;
  contenido: string;
  variablesDisponibles?: TemplateVariable[];
  esPrivada?: boolean;
  etiquetas?: string[];
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {
  esActiva?: boolean;
}

/**
 * Datos para usar una plantilla
 */
export interface UseTemplateData {
  leadId: string;
  variables: {
    [key: string]: string;
  };
  personalizacion?: string; // Contenido adicional personalizado
}

// ========================================
// 📦 RESPUESTAS API
// ========================================

/**
 * Paginación estándar
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

/**
 * Respuesta API estándar
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: string[];
}

/**
 * Respuesta de lista de mensajes
 */
export interface MessageListResponse extends ApiResponse<{
  mensajes: LeadMessage[];
  lead?: {
    id: string;
    nombre: string;
    email: string;
    usuarioRegistrado?: any;
  };
  stats?: LeadMessageStats;
  pagination: Pagination;
}> {}

/**
 * Respuesta de lista de plantillas
 */
export interface TemplateListResponse extends ApiResponse<{
  plantillas: (MessageTemplate & { esFavorito?: boolean })[];
  pagination: Pagination;
}> {}

/**
 * Respuesta de mensajes no leídos
 */
export interface UnreadMessagesResponse extends ApiResponse<{
  mensajes: LeadMessage[];
  total: number;
}> {}

/**
 * Respuesta de búsqueda
 */
export interface SearchMessagesResponse extends ApiResponse<{
  mensajes: LeadMessage[];
  pagination: Pagination;
}> {}

// ========================================
// 🎨 HELPERS Y UTILIDADES
// ========================================

/**
 * Opciones para el compositor de mensajes
 */
export interface MessageComposerOptions {
  showSubject?: boolean;
  showPriority?: boolean;
  showTemplates?: boolean;
  showVariables?: boolean;
  maxLength?: number;
  placeholder?: string;
  defaultPriority?: MessagePriority;
}

/**
 * Estado del compositor
 */
export interface MessageComposerState {
  content: string;
  subject?: string;
  priority: MessagePriority;
  selectedTemplate?: MessageTemplate;
  isSubmitting: boolean;
  error?: string;
}

/**
 * Props comunes para componentes de mensaje
 */
export interface MessageComponentProps {
  message: LeadMessage;
  onReply?: (messageId: string) => void;
  onMarkAsRead?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  canReply?: boolean;
  canDelete?: boolean;
  canViewPrivate?: boolean;
  isExpanded?: boolean;
}

/**
 * Props para timeline
 */
export interface MessageTimelineProps {
  leadId: string;
  messages: LeadMessage[];
  loading?: boolean;
  onLoadMore?: () => void;
  onRefresh?: () => void;
  onReply?: (messageId: string) => void;
  onMarkAsRead?: (messageId: string) => void;
  filters?: MessageFilters;
  emptyMessage?: string;
}

// ========================================
// 🔔 NOTIFICACIONES
// ========================================

/**
 * Notificación de mensaje nuevo
 */
export interface MessageNotification {
  id: string;
  messageId: string;
  leadId: string;
  type: 'new_message' | 'new_reply' | 'message_read';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

// ========================================
// 🎯 CONSTANTES
// ========================================

/**
 * Constantes del sistema
 */
export const MESSAGE_CONSTANTS = {
  MAX_CONTENT_LENGTH: 10000,
  MAX_SUBJECT_LENGTH: 200,
  DEFAULT_PAGE_SIZE: 50,
  MAX_ATTACHMENTS: 5,
  REFRESH_INTERVAL: 30000, // 30 segundos
  UNREAD_POLL_INTERVAL: 60000, // 1 minuto
} as const;

/**
 * Labels para tipos de mensaje
 */
export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  nota_interna: 'Nota Interna',
  mensaje_cliente: 'Mensaje a Cliente',
  respuesta_cliente: 'Respuesta del Cliente',
  email: 'Email',
  sms: 'SMS',
  notificacion: 'Notificación',
};

/**
 * Labels para estados
 */
export const MESSAGE_STATUS_LABELS: Record<MessageStatus, string> = {
  enviado: 'Enviado',
  pendiente: 'Pendiente',
  fallido: 'Fallido',
  leido: 'Leído',
};

/**
 * Labels para prioridades
 */
export const MESSAGE_PRIORITY_LABELS: Record<MessagePriority, string> = {
  baja: 'Baja',
  normal: 'Normal',
  alta: 'Alta',
  urgente: 'Urgente',
};

/**
 * Colores para tipos de mensaje (Tailwind)
 */
export const MESSAGE_TYPE_COLORS: Record<MessageType, string> = {
  nota_interna: 'blue',
  mensaje_cliente: 'green',
  respuesta_cliente: 'purple',
  email: 'indigo',
  sms: 'pink',
  notificacion: 'gray',
};

/**
 * Colores para prioridades (Tailwind)
 */
export const MESSAGE_PRIORITY_COLORS: Record<MessagePriority, string> = {
  baja: 'gray',
  normal: 'blue',
  alta: 'orange',
  urgente: 'red',
};

/**
 * Variables disponibles por defecto
 */
export const DEFAULT_TEMPLATE_VARIABLES: TemplateVariable[] = [
  {
    nombre: 'nombre',
    variable: '{nombre}',
    descripcion: 'Nombre del cliente',
    ejemplo: 'Juan Pérez',
    requerida: true,
  },
  {
    nombre: 'empresa',
    variable: '{empresa}',
    descripcion: 'Nombre de la empresa',
    ejemplo: 'Scuti Company',
    requerida: false,
  },
  {
    nombre: 'email',
    variable: '{email}',
    descripcion: 'Email del cliente',
    ejemplo: 'juan@ejemplo.com',
    requerida: false,
  },
  {
    nombre: 'telefono',
    variable: '{telefono}',
    descripcion: 'Teléfono del cliente',
    ejemplo: '+51 999 888 777',
    requerida: false,
  },
  {
    nombre: 'servicio',
    variable: '{servicio}',
    descripcion: 'Tipo de servicio solicitado',
    ejemplo: 'Desarrollo Web',
    requerida: false,
  },
  {
    nombre: 'fecha',
    variable: '{fecha}',
    descripcion: 'Fecha actual',
    ejemplo: '2 de Noviembre, 2025',
    requerida: false,
  },
];
