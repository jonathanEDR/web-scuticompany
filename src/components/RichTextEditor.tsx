import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { Color } from '@tiptap/extension-color';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Link } from '@tiptap/extension-link';
import { useEffect } from 'react';
import '../styles/editor.css';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
}

const RichTextEditor = ({ value, onChange, placeholder, label }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6]
        }
      }),
      TextStyle,
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-purple-600 underline',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] px-4 py-3',
      },
    },
  });

  // Actualizar contenido cuando el valor externo cambia
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 transition-colors">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 px-4 pt-3">
          {label}
        </label>
      )}

      {/* Toolbar */}
      <div className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-2 flex flex-wrap gap-1">
        {/* Headings */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 1 }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Título 1"
            type="button"
          >
            H1
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 2 }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Título 2"
            type="button"
          >
            H2
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('heading', { level: 3 }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Título 3"
            type="button"
          >
            H3
          </button>
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('paragraph') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Párrafo"
            type="button"
          >
            P
          </button>
        </div>

        {/* Font Family */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <select
            onChange={(e) => {
              if (e.target.value === 'unset') {
                editor.chain().focus().unsetFontFamily().run();
              } else {
                editor.chain().focus().setFontFamily(e.target.value).run();
              }
            }}
            className="px-2 py-1 rounded text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200"
            title="Tipo de fuente"
          >
            <option value="unset">Por defecto</option>
            <option value="Montserrat">Montserrat</option>
            <option value="'Open Sans'">Open Sans</option>
            <option value="Arial">Arial</option>
            <option value="Georgia">Georgia</option>
            <option value="'Times New Roman'">Times New Roman</option>
            <option value="'Courier New'">Courier New</option>
            <option value="Verdana">Verdana</option>
            <option value="'Comic Sans MS'">Comic Sans</option>
            <option value="Impact">Impact</option>
          </select>
        </div>

        {/* Text Formatting */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1 rounded text-sm font-bold ${
              editor.isActive('bold') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Negrita"
            type="button"
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1 rounded text-sm italic ${
              editor.isActive('italic') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Cursiva"
            type="button"
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`px-3 py-1 rounded text-sm underline ${
              editor.isActive('underline') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Subrayado"
            type="button"
          >
            U
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`px-3 py-1 rounded text-sm line-through ${
              editor.isActive('strike') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Tachado"
            type="button"
          >
            S
          </button>
        </div>

        {/* Text Alignment */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Alinear izquierda"
            type="button"
          >
            ←
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Centrar"
            type="button"
          >
            ↔
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Alinear derecha"
            type="button"
          >
            →
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Justificar"
            type="button"
          >
            ⇄
          </button>
        </div>

        {/* Lists */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('bulletList') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Lista con viñetas"
            type="button"
          >
            •
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('orderedList') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Lista numerada"
            type="button"
          >
            1.
          </button>
        </div>

        {/* Link */}
        <div className="flex border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
          <button
            onClick={setLink}
            className={`px-3 py-1 rounded text-sm ${
              editor.isActive('link') ? 'bg-purple-600 text-white' : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
            }`}
            title="Insertar enlace"
            type="button"
          >
            🔗
          </button>
          {editor.isActive('link') && (
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              className="px-3 py-1 rounded text-sm bg-red-500 text-white hover:bg-red-600"
              title="Quitar enlace"
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        {/* Text Color */}
        <div className="flex items-center">
          <label className="text-xs text-gray-600 dark:text-gray-300 mr-1">Color:</label>
          <input
            type="color"
            onInput={(e) => editor.chain().focus().setColor((e.target as HTMLInputElement).value).run()}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-8 h-8 rounded cursor-pointer"
            title="Color de texto"
          />
          <button
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="ml-1 px-2 py-1 rounded text-xs bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
            title="Resetear color"
            type="button"
          >
            Reset
          </button>
        </div>

        {/* Clear Formatting */}
        <div className="flex ml-auto">
          <button
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            className="px-3 py-1 rounded text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50"
            title="Limpiar formato"
            type="button"
          >
            Limpiar formato
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white dark:bg-gray-800">
        <EditorContent editor={editor} placeholder={placeholder} />
      </div>

      {/* Character count */}
      <div className="border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
        {editor.storage.characterCount?.characters() || 0} caracteres
      </div>
    </div>
  );
};

export default RichTextEditor;
