/**
 * ✏️ RichTextEditor Component
 * Editor de contenido rico con TipTap
 */

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  Link2, Unlink, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Image as ImageIcon, Youtube, Palette
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

  // Configurar editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:underline'
        }
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
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
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none px-4 py-3',
        placeholder
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
    const url = window.prompt('URL de la imagen:');
    if (url) {
      // Insertar imagen como HTML
      editor.chain().focus().insertContent(`<img src="${url}" alt="Imagen" />`).run();
    }
  };

  const addYouTube = () => {
    const url = window.prompt('URL del video de YouTube:');
    if (url) {
      // Extraer ID del video
      const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
      if (videoId) {
        const iframe = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        editor.chain().focus().insertContent(iframe).run();
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
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive('bulletList') ? 'bg-gray-300' : ''
              }`}
              title="Lista con viñetas"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive('orderedList') ? 'bg-gray-300' : ''
              }`}
              title="Lista numerada"
            >
              <ListOrdered className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive('blockquote') ? 'bg-gray-300' : ''
              }`}
              title="Cita"
            >
              <Quote className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setHorizontalRule().run()}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Línea horizontal"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>

          {/* Alineación */}
          <div className="flex gap-1 border-r border-gray-300 dark:border-gray-600 pr-2">
            <button
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
              }`}
              title="Alinear a la izquierda"
            >
              <AlignLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
              }`}
              title="Centrar"
            >
              <AlignCenter className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
              }`}
              title="Alinear a la derecha"
            >
              <AlignRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-300' : ''
              }`}
              title="Justificar"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* Enlaces y Media */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <div className="relative">
              <button
                onClick={() => setShowLinkInput(!showLinkInput)}
                className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                  editor.isActive('link') ? 'bg-gray-300' : ''
                }`}
                title="Insertar enlace"
              >
                <Link2 className="w-4 h-4" />
              </button>

              {showLinkInput && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10 w-64">
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://ejemplo.com"
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded mb-2"
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
                      className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={unsetLink}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Quitar enlace"
              disabled={!editor.isActive('link')}
            >
              <Unlink className="w-4 h-4" />
            </button>

            <button
              onClick={addImage}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Insertar imagen"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            <button
              onClick={addYouTube}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title="Insertar video de YouTube"
            >
              <Youtube className="w-4 h-4" />
            </button>
          </div>

          {/* Color */}
          <div className="flex gap-1 border-r border-gray-300 pr-2">
            <div className="relative">
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-2 rounded hover:bg-gray-200 transition-colors"
                title="Color de texto"
              >
                <Palette className="w-4 h-4" />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-2 z-10">
                  <div className="grid grid-cols-5 gap-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setColor(color)}
                        className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
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
              className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
              title="Deshacer (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </button>

            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              className="p-2 rounded hover:bg-gray-200 transition-colors disabled:opacity-30"
              title="Rehacer (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div 
        className="overflow-y-auto prose prose-slate dark:prose-invert max-w-none p-4"
        style={{ minHeight, maxHeight }}
      >
        <EditorContent editor={editor} />
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
