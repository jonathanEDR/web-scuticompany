// 🎯 Sistema de Sugerencias Basadas en Selección de Texto
// Exportaciones centralizadas para el sistema completo

// Hooks
export { useSelectionMenu } from '../hooks/useSelectionMenu';

// Componentes
export { SelectionContextMenu } from '../components/SelectionContextMenu';

// Servicios
export { selectionAIService } from '../services/selectionAIService';

// Types
export type { 
  AIActionRequest, 
  AIActionResponse
} from '../services/selectionAIService';

export type { 
  MenuPosition,
  SelectionMenuState 
} from '../hooks/useSelectionMenu';

export type { AIAction } from '../components/SelectionContextMenu';