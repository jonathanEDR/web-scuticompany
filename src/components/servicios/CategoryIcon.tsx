/**
 * 🏷️ CategoryIcon
 * Renderiza el icono de una categoría de servicio.
 * - Si `icon` es un nombre de icono Lucide (ej: "Rocket"), lo renderiza como icono de línea.
 * - Si es un emoji legacy guardado en la BD (ej: "📦"), lo traduce a su equivalente Lucide.
 */

import React from 'react';
import * as LucideIcons from 'lucide-react';

interface CategoryIconProps {
  icon?: string;
  size?: number;
  color?: string;
  className?: string;
}

/** Traduce emojis legacy a nombres de iconos Lucide equivalentes */
const EMOJI_TO_LUCIDE: Record<string, string> = {
  // Tech & desarrollo
  '💻': 'Monitor',
  '🖥️': 'Monitor',
  '⌨️': 'Keyboard',
  '🖱️': 'MousePointer2',
  '📱': 'Smartphone',
  '📲': 'Smartphone',
  // Diseño & arte
  '🎨': 'Palette',
  '✏️': 'Pencil',
  '📐': 'Ruler',
  // Marketing & negocio
  '📈': 'TrendingUp',
  '📉': 'TrendingDown',
  '📊': 'BarChart3',
  '🎯': 'Target',
  '📣': 'Megaphone',
  '📢': 'Megaphone',
  '💰': 'DollarSign',
  '💳': 'CreditCard',
  '🤝': 'Handshake',
  // Inteligencia & estrategia
  '🧠': 'Brain',
  '💡': 'Lightbulb',
  '🔭': 'Telescope',
  '🎓': 'GraduationCap',
  '🏆': 'Trophy',
  // Herramientas & soporte
  '🔧': 'Wrench',
  '⚙️': 'Settings',
  '🔨': 'Hammer',
  '🛠️': 'Wrench',
  '🔩': 'Settings',
  // Datos & cloud
  '🗄️': 'Database',
  '☁️': 'Cloud',
  '🔗': 'Link',
  '🌐': 'Globe',
  // Seguridad
  '🔒': 'Lock',
  '🔑': 'Key',
  '🛡️': 'Shield',
  // Comunicación
  '📞': 'Phone',
  '📧': 'Mail',
  '💬': 'MessageSquare',
  // Contenido & archivos
  '📝': 'FileText',
  '📋': 'ClipboardList',
  '📁': 'Folder',
  '📄': 'File',
  // Especiales
  '🚀': 'Rocket',
  '⚡': 'Zap',
  '✨': 'Sparkles',
  '🌟': 'Star',
  '⭐': 'Star',
  '🔥': 'Flame',
  '💎': 'Gem',
  '🎵': 'Music',
  '📷': 'Camera',
  '📦': 'Package',
  '🏷️': 'Tag',
  '🤖': 'Bot',
  '🌿': 'Leaf',
  '✂️': 'Scissors',
};

/** Devuelve el componente Lucide si `icon` es un nombre válido o un emoji mapeado, o null si es desconocido */
const getLucideIcon = (icon?: string): React.ComponentType<LucideIcons.LucideProps> | null => {
  if (!icon) return null;
  // Traducir emoji a nombre Lucide si existe en el mapa
  const resolved = EMOJI_TO_LUCIDE[icon] ?? icon;
  if (!/^[A-Z][A-Za-z0-9]*$/.test(resolved)) return null;
  const IconComponent = (LucideIcons as Record<string, unknown>)[resolved];
  return typeof IconComponent === 'function' || typeof IconComponent === 'object'
    ? (IconComponent as React.ComponentType<LucideIcons.LucideProps>)
    : null;
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  icon,
  size = 14,
  color,
  className = '',
}) => {
  const Icon = getLucideIcon(icon);

  if (Icon) {
    return <Icon size={size} strokeWidth={1.5} color={color} className={className} />;
  }

  // Emoji legacy o valor vacío
  return (
    <span className={className} style={{ fontSize: size, lineHeight: 1 }}>
      {icon || '•'}
    </span>
  );
};

export default CategoryIcon;
