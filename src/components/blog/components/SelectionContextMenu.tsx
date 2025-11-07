import React from 'react';
import { 
  Expand, 
  RefreshCw, 
  FileText, 
  ArrowRight, 
  Lightbulb, 
  Search,
  Sparkles,
  X 
} from 'lucide-react';
import { useSelectionMenu } from '../hooks/useSelectionMenu';

export interface AIAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  shortcut?: string;
  color: string;
}

const AI_ACTIONS: AIAction[] = [
  {
    id: 'expand',
    label: 'Expandir',
    description: 'Desarrollar más este punto',
    icon: Expand,
    shortcut: 'E',
    color: 'text-blue-600 hover:bg-blue-50'
  },
  {
    id: 'rewrite',
    label: 'Reescribir',
    description: 'Mejorar redacción y estilo',
    icon: RefreshCw,
    shortcut: 'R',
    color: 'text-green-600 hover:bg-green-50'
  },
  {
    id: 'summarize',
    label: 'Resumir',
    description: 'Crear resumen conciso',
    icon: FileText,
    shortcut: 'S',
    color: 'text-purple-600 hover:bg-purple-50'
  },
  {
    id: 'continue',
    label: 'Continuar',
    description: 'Seguir desarrollando la idea',
    icon: ArrowRight,
    shortcut: 'C',
    color: 'text-orange-600 hover:bg-orange-50'
  },
  {
    id: 'examples',
    label: 'Ejemplificar',
    description: 'Agregar ejemplos prácticos',
    icon: Lightbulb,
    shortcut: 'X',
    color: 'text-yellow-600 hover:bg-yellow-50'
  },
  {
    id: 'seo',
    label: 'Optimizar SEO',
    description: 'Mejorar para SEO',
    icon: Search,
    shortcut: 'O',
    color: 'text-indigo-600 hover:bg-indigo-50'
  }
];

interface SelectionContextMenuProps {
  onActionSelect: (action: AIAction, selectedText: string) => void;
  onClose?: () => void;
}

export const SelectionContextMenu: React.FC<SelectionContextMenuProps> = ({
  onActionSelect,
  onClose
}) => {
  const { menuState, menuRef, hideMenu, cancelHide, hideMenuDelayed } = useSelectionMenu();

  // Manejar selección de acción
  const handleActionClick = (action: AIAction) => {
    onActionSelect(action, menuState.selectedText);
    hideMenu();
  };

  // Manejar shortcuts de teclado
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!menuState.isVisible) return;

      // Buscar acción por shortcut
      const action = AI_ACTIONS.find(a => 
        a.shortcut?.toLowerCase() === event.key.toLowerCase()
      );

      if (action) {
        event.preventDefault();
        handleActionClick(action);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [menuState.isVisible, menuState.selectedText]);

  if (!menuState.isVisible) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[280px] max-w-[320px]"
      style={{
        left: `${menuState.position.x - 140}px`, // Centrar horizontalmente
        top: `${menuState.position.y}px`,
        transform: 'translateY(-100%)'
      }}
      onMouseEnter={cancelHide}
      onMouseLeave={() => hideMenuDelayed(200)}
    >
      {/* Header */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-gray-700">IA Sugerencias</span>
        </div>
        <button
          onClick={() => { hideMenu(); onClose?.(); }}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-3 h-3 text-gray-400" />
        </button>
      </div>

      {/* Texto seleccionado (preview) */}
      <div className="px-4 py-2 border-b border-gray-50">
        <p className="text-xs text-gray-500 mb-1">Texto seleccionado:</p>
        <p className="text-sm text-gray-700 line-clamp-2">
          "{menuState.selectedText.length > 60 
            ? menuState.selectedText.substring(0, 60) + '...' 
            : menuState.selectedText}"
        </p>
      </div>

      {/* Acciones de IA */}
      <div className="py-1">
        {AI_ACTIONS.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action)}
              className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${action.color} text-left group`}
            >
              <div className="flex-shrink-0">
                <IconComponent className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 group-hover:text-current">
                    {action.label}
                  </span>
                  {action.shortcut && (
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500 group-hover:bg-current group-hover:bg-opacity-10">
                      {action.shortcut}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 group-hover:text-current group-hover:opacity-80">
                  {action.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer con info adicional */}
      <div className="px-4 py-2 border-t border-gray-50">
        <p className="text-xs text-gray-400 text-center">
          Presiona la tecla resaltada o haz clic para aplicar
        </p>
      </div>
    </div>
  );
};