import { useState, useCallback, useRef, useEffect } from 'react';

export interface MenuPosition {
  x: number;
  y: number;
}

export interface SelectionMenuState {
  isVisible: boolean;
  position: MenuPosition;
  selectedText: string;
  selectionContext: any;
}

export const useSelectionMenu = () => {
  const [menuState, setMenuState] = useState<SelectionMenuState>({
    isVisible: false,
    position: { x: 0, y: 0 },
    selectedText: '',
    selectionContext: null
  });

  const menuRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  
  // Función simple para limpiar selección
  const clearSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
  }, []);

  // Calcular posición del menú basada en selección
  const calculateMenuPosition = useCallback((selection: Selection): MenuPosition => {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Posición inicial: centro de la selección, ligeramente arriba
    let x = rect.left + (rect.width / 2);
    let y = rect.top - 10;

    // Ajustar si se sale de la ventana
    const menuWidth = 280; // Ancho estimado del menú
    const menuHeight = 200; // Alto estimado del menú
    
    // Ajuste horizontal
    if (x + menuWidth / 2 > window.innerWidth - 20) {
      x = window.innerWidth - menuWidth / 2 - 20;
    }
    if (x - menuWidth / 2 < 20) {
      x = menuWidth / 2 + 20;
    }

    // Ajuste vertical
    if (y - menuHeight < 20) {
      y = rect.bottom + 10; // Mostrar debajo si no hay espacio arriba
    }

    return { x, y };
  }, []);

  // Mostrar menú cuando hay selección válida
  const showMenu = useCallback((selection: Selection) => {
    if (!selection || selection.isCollapsed) return;

    const text = selection.toString().trim();
    if (text.length < 3) return; // Texto muy corto

    const position = calculateMenuPosition(selection);
    
    setMenuState({
      isVisible: true,
      position,
      selectedText: text,
      selectionContext: {
        text,
        wordCount: text.split(/\s+/).length,
        isCode: /```/.test(text) || /`.*`/.test(text),
        context: 'selection'
      }
    });

    // Limpiar timeout anterior
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, [calculateMenuPosition]);

  // Ocultar menú
  const hideMenu = useCallback(() => {
    setMenuState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  // Ocultar menú con delay
  const hideMenuDelayed = useCallback((delay: number = 150) => {
    hideTimeoutRef.current = setTimeout(hideMenu, delay);
  }, [hideMenu]);

  // Cancelar ocultación
  const cancelHide = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
  }, []);

  // Manejar selección de texto
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        hideMenuDelayed(300); // Delay más largo para permitir hover en menú
        return;
      }

      const text = selection.toString().trim();
      if (text.length >= 3) {
        showMenu(selection);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [showMenu, hideMenuDelayed]);

  // Manejar clicks fuera del menú
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideMenu();
        clearSelection();
      }
    };

    if (menuState.isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuState.isVisible, hideMenu, clearSelection]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && menuState.isVisible) {
        hideMenu();
        clearSelection();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [menuState.isVisible, hideMenu, clearSelection]);

  return {
    menuState,
    menuRef,
    hideMenu,
    hideMenuDelayed,
    cancelHide,
    showMenu
  };
};