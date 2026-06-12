import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import DynamicIcon, { AVAILABLE_SIDEBAR_ICONS } from './DynamicIcon';

// Iconos extra relevantes para módulos, beneficios y tecnologías de sistemas
const EXTRA_ICONS = [
  { name: 'Package', label: 'Paquete' },
  { name: 'ShoppingCart', label: 'Carrito' },
  { name: 'CreditCard', label: 'Tarjeta' },
  { name: 'Store', label: 'Tienda' },
  { name: 'Utensils', label: 'Restaurante' },
  { name: 'UtensilsCrossed', label: 'Cocina' },
  { name: 'ChefHat', label: 'Chef' },
  { name: 'UserCheck', label: 'Usuario OK' },
  { name: 'UserPlus', label: 'Agregar Usuario' },
  { name: 'Cpu', label: 'CPU' },
  { name: 'Server', label: 'Servidor' },
  { name: 'Database', label: 'Base de datos' },
  { name: 'MonitorSmartphone', label: 'Multiplataforma' },
  { name: 'Smartphone', label: 'Móvil' },
  { name: 'Monitor', label: 'Monitor' },
  { name: 'Laptop', label: 'Laptop' },
  { name: 'Tablet', label: 'Tablet' },
  { name: 'Truck', label: 'Delivery' },
  { name: 'ShieldCheck', label: 'Seguro' },
  { name: 'CheckCircle2', label: 'Check OK' },
  { name: 'Trophy', label: 'Trofeo' },
  { name: 'DollarSign', label: 'Dólares' },
  { name: 'Banknote', label: 'Billete' },
  { name: 'Receipt', label: 'Recibo' },
  { name: 'Calculator', label: 'Calculadora' },
  { name: 'PieChart', label: 'Pastel' },
  { name: 'Hammer', label: 'Martillo' },
  { name: 'Paintbrush', label: 'Pincel' },
  { name: 'Scissors', label: 'Tijeras' },
  { name: 'Printer', label: 'Impresora' },
  { name: 'Wifi', label: 'WiFi' },
  { name: 'Cloud', label: 'Nube' },
  { name: 'CloudUpload', label: 'Subir Nube' },
  { name: 'HardDrive', label: 'Disco' },
  { name: 'QrCode', label: 'QR Code' },
  { name: 'Barcode', label: 'Barcode' },
  { name: 'Package2', label: 'Caja' },
  { name: 'Box', label: 'Caja 2' },
  { name: 'Boxes', label: 'Cajas' },
  { name: 'ClipboardCheck', label: 'Check Lista' },
  { name: 'FileSpreadsheet', label: 'Planilla' },
  { name: 'AlarmClock', label: 'Alarma' },
  { name: 'MapPin', label: 'Ubicación' },
  { name: 'Phone', label: 'Teléfono' },
  { name: 'Headphones', label: 'Auriculares' },
  { name: 'ShoppingBag', label: 'Bolsa' },
  { name: 'Tag', label: 'Etiqueta' },
  { name: 'Gem', label: 'Gema' },
  { name: 'Lightbulb', label: 'Bombilla' },
  { name: 'Flag', label: 'Bandera' },
];

// Lista completa sin duplicados
const ALL_ICONS = [
  ...AVAILABLE_SIDEBAR_ICONS,
  ...EXTRA_ICONS.filter(e => !AVAILABLE_SIDEBAR_ICONS.find(s => s.name === e.name)),
];

interface LucideIconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  color?: string;
  placeholder?: string;
  label?: string;
}

const LucideIconPicker: React.FC<LucideIconPickerProps> = ({
  value,
  onChange,
  color = '#9333ea',
  placeholder = 'Package',
  label,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_ICONS;
    const q = search.toLowerCase();
    return ALL_ICONS.filter(i =>
      i.name.toLowerCase().includes(q) || i.label.toLowerCase().includes(q)
    );
  }, [search]);

  const currentLabel = ALL_ICONS.find(i => i.name === value)?.label || value || placeholder;
  const displayValue = value || placeholder;

  return (
    <div ref={ref} className="relative">
      {label && (
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-400 dark:hover:border-purple-500 transition-colors text-left"
      >
        <span className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-md bg-purple-50 dark:bg-purple-900/20">
          <DynamicIcon name={displayValue} size={16} color={color} strokeWidth={1.5} />
        </span>
        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{currentLabel}</span>
        <ChevronDown size={14} strokeWidth={1.5} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden"
          style={{ minWidth: '260px' }}
        >
          {/* Search */}
          <div className="p-2 border-b border-gray-100 dark:border-gray-700">
            <div className="relative">
              <Search size={13} strokeWidth={1.5} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar icono..."
                className="w-full pl-7 pr-7 py-1.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 text-gray-800 dark:text-gray-200"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={12} strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>

          {/* Grid */}
          <div className="p-2 max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="text-xs text-center text-gray-400 py-4">Sin resultados</p>
            ) : (
              <div className="grid grid-cols-7 gap-1">
                {filtered.map(({ name, label: lbl }) => (
                  <button
                    key={name}
                    type="button"
                    title={lbl}
                    onClick={() => { onChange(name); setOpen(false); setSearch(''); }}
                    className={`p-1.5 rounded-lg flex items-center justify-center transition-all hover:scale-110 ${
                      value === name
                        ? 'bg-purple-100 dark:bg-purple-900/40 ring-1 ring-purple-500'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <DynamicIcon name={name} size={18} color={value === name ? color : undefined} strokeWidth={1.5}
                      className={value === name ? '' : 'text-gray-500 dark:text-gray-400'}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer: input directo */}
          <div className="px-3 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <p className="text-[10px] text-gray-400 mb-1">O escribe el nombre directamente:</p>
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-400 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LucideIconPicker;
