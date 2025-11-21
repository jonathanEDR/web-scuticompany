/**
 * ✏️ RichTextEditor Component
 * Editor de contenido rico con TipTap - Versión Profesional
 * Estilo: Similar a Medium, Notion, WordPress
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Link2, Unlink, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Youtube, Palette, Highlighter
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  minHeight?: string;
  maxHeight?: string;
  showToolbar?: boolean;
  showWordCount?: boolean;
  className?: string;
  // Props para detección de cursor
  onCursorChange?: (position: any) => void;
  registerEditor?: (element: HTMLElement) => void;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = 'Escribe aquí...',
  editable = true,
  minHeight = '300px',
  maxHeight = '600px',
  showToolbar = true,
  showWordCount = true,
  className = '',
  onCursorChange,
  registerEditor
}: RichTextEditorProps) {
  
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Configurar editor con extensiones profesionales
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        // ✅ IMPORTANTE: Deshabilitar las extensiones que vamos a agregar manualmente
        link: false,
        underline: false,
        // Configurar mejor espaciado para párrafos
        paragraph: {
          HTMLAttributes: {
            class: 'mb-4 leading-relaxed'
          }
        },
        // Configurar mejor espaciado para listas
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-6 mb-4 space-y-2'
          }
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-6 mb-4 space-y-2'
          }
        },
        // Configurar citas con mejor estilo
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-700 dark:text-gray-300'
          }
        },
        // Configurar código con mejor estilo
        code: {
          HTMLAttributes: {
            class: 'bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400'
          }
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-900 text-gray-100 p-4 rounded-lg my-4 font-mono text-sm overflow-x-auto'
          }
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 hover:underline cursor-pointer'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4 shadow-md'
        },
        inline: false
      }),
      Highlight.configure({
        HTMLAttributes: {
          class: 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded'
        },
        multicolor: true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '¿Cuál es el título?';
          }
          return placeholder;
        },
        showOnlyWhenEditable: true,
        showOnlyCurrent: false
      }),
      TextStyle,
      Color
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onSelectionUpdate: ({ editor }) => {
      // Detectar cambios de cursor y posición
      if (onCursorChange) {
        const { from, to } = editor.state.selection;
        onCursorChange({ from, to, isCursor: from === to });
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate dark:prose-invert max-w-none focus:outline-none px-6 py-4 min-h-[400px] prose-headings:font-bold prose-h1:text-4xl prose-h1:mb-4 prose-h2:text-3xl prose-h2:mb-3 prose-h3:text-2xl prose-h3:mb-2 prose-p:text-base prose-p:leading-7 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:font-bold prose-ul:my-4 prose-ol:my-4 prose-li:my-1'
      },
      // ✅ CRÍTICO: Prevenir que otros handlers capturen eventos del editor
      handleDOMEvents: {
        keydown: (_view, event) => {
          // Permitir que el editor maneje sus propios atajos
          // Solo bloquear si es Tab o Escape Y hay sugerencias de IA activas
          if ((event.key === 'Tab' || event.key === 'Escape') && 
              document.querySelector('.ai-suggestion-active')) {
            return false; // Dejar pasar al handler de IA
          }
          return false; // Dejar que TipTap maneje todos los demás eventos
        },
        click: () => {
          // Siempre permitir clicks en el editor
          return false;
        }
      }
    }
  });

  // ✅ Actualizar contenido del editor cuando cambia el prop content EXTERNAMENTE
  // Solo actualizar si el contenido cambió desde fuera (ej: al cargar un post)
  // Evitar actualizar cuando el usuario está escribiendo
  useEffect(() => {
    if (!editor) return;
    
    const editorContent = editor.getHTML();
    const isEditorEmpty = editorContent === '<p></p>' || editorContent === '';
    const hasNewContent = content && content !== editorContent;
    
    // Solo actualizar si:
    // 1. El editor está vacío y hay contenido nuevo (carga inicial)
    // 2. El contenido es diferente y no está siendo editado activamente
    if (hasNewContent && (isEditorEmpty || !editor.isFocused)) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Registrar el editor DOM para detección de cursor
  useEffect(() => {
    if (editor && registerEditor) {
      const editorElement = editor.view.dom;
      registerEditor(editorElement);
    }
  }, [editor, registerEditor]);

  if (!editor) {
    return null;
  }

  // Funciones del toolbar
  const setLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const unsetLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  const addImage = () => {
    const url = window.prompt('🖼️ Ingresa la URL de la imagen:');
    if (url) {
      // Usar la extensión Image de TipTap para mejor manejo
      editor.chain().focus().setImage({ src: url, alt: 'Imagen del blog' }).run();
    }
  };

  const addYouTube = () => {
    const url = window.prompt('🎥 Ingresa la URL del video de YouTube:');
    if (url) {
      // Extraer ID del video
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) {
        // Iframe responsive con aspect ratio 16:9
        const iframe = `<div class="relative w-full" style="padding-bottom: 56.25%;"><iframe class="absolute top-0 left-0 w-full h-full rounded-lg shadow-md" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
        editor.chain().focus().insertContent(iframe).run();
      } else {
        alert('❌ URL de YouTube no válida. Usa un enlace como: https://www.youtube.com/watch?v=...');
      }
    }
  };

  const setColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setShowColorPicker(false);
  };

  // Colores predefinidos
  const colors = [
    '#000000', '#666666', '#999999', '#CCCCCC', '#FFFFFF',
    '#FF0000', '#FF9900', '#FFFF00', '#00FF00', '#00FFFF',
    '#0000FF', '#9900FF', '#FF00FF', '#FF0080', '#FF8080'
  ];

  // Obtener estadísticas
  const text = editor.getText();
  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;
  const charCount = text.length;

  return (
    <div className={`rich-text-editor border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 ${className}`}>
      {/* Toolbar */}
      {showToolbar && (
        <div className="border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-1">
          {/* Formato de texto */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('bold') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Negrita (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('italic') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Cursiva (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('underline') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Subrayado (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('strike') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Tachado"
            >
              <Strikethrough className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleCode().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('code') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Código"
            >
              <Code className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('highlight') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Resaltar texto"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </div>

          {/* Encabezados */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('heading', { level: 1 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Encabezado 1"
            >
              <Heading1 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('heading', { level: 2 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Encabezado 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('heading', { level: 3 }) ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Encabezado 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Listas */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('bulletList') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Lista con viñetas"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('orderedList') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive('blockquote') ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Cita"
            >
              <Quote className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
              title="Línea horizontal"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Alineación */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Alinear a la izquierda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Centrar"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Alinear a la derecha"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300 dark:bg-gray-600' : ''
              }`}
              title="Justificar"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Enlaces y Media */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <div className="relative">
              <button
                onClick={() => setShowLinkInput(!showLinkInput)}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${
                  editor.isActive('link') ? 'bg-gray-300 dark:bg-gray-600' : ''
                }`}
                title="Insertar enlace"
              >
                <Link2 className="w-4 h-4" />
              </button>

              {showLinkInput && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 z-10 w-64">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://ejemplo.com"
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded mb-2"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setLink();
                      }
                    }}
                  />
                  <div className="flex gap-1">
                    <button
                      onClick={setLink}
                      className="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Insertar
                    </button>
                    <button
                      onClick={() => setShowLinkInput(false)}
                      className="px-2 py-1 text-sm bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-700"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={unsetLink}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-30"
              title="Quitar enlace"
              disabled={!editor.isActive('link')}
            >
              <Unlink className="w-4 h-4" />
            </button>

            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
              title="Insertar imagen"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              onClick={addYouTube}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
              title="Insertar video de YouTube"
            >
              <Youtube className="w-4 h-4" />
            </button>
          </div>

          {/* Color */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300"
                title="Color de texto"
              >
                <Palette className="w-4 h-4" />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-5 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Deshacer/Rehacer */}
          <div className="flex gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-30"
              title="Deshacer (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 disabled:opacity-30"
              title="Rehacer (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content - Área de escritura profesional */}
      <div 
        className="overflow-y-auto bg-white dark:bg-gray-800"
        style={{ minHeight, maxHeight }}
      >
        <EditorContent 
          editor={editor} 
          className="prose-editor-content"
        />
      </div>

      {/* Footer con estadísticas */}
      {showWordCount && (
        <div className="border-t border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex gap-4">
            <span>{wordCount} palabras</span>
            <span>{charCount} caracteres</span>
          </div>
          
          {!editable && (
            <span className="text-orange-600 dark:text-orange-400 font-medium">Modo solo lectura</span>
          )}
        </div>
      )}
    </div>
  );
}
