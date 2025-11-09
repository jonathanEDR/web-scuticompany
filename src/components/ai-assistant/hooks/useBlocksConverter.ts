/**
 * 🎣 useBlocksConverter
 * Hook para convertir entre bloques estructurados y texto plano
 */

import type { Block } from '../BlockEditor/types';

export const useBlocksConverter = () => {
  /**
   * Convertir texto plano a bloques
   * Formato esperado:
   * - Lista: "- Item 1\n- Item 2"
   * - FAQ: "**Pregunta:** Texto\nRespuesta\n\n**Pregunta:** Texto\nRespuesta"
   */
  const textToBlocks = (text: string, type: 'list' | 'faq'): Block[] => {
    if (!text || !text.trim()) return [];

    const blocks: Block[] = [];

    if (type === 'list') {
      const lines = text.split('\n');
      lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed) {
          // Remover marcadores comunes: -, •, *, números
          const content = trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+\.\s*/, '');
          if (content) {
            blocks.push({
              id: `block_${Date.now()}_${index}`,
              type: 'list-item',
              order: index,
              content,
              icon: '✓'
            });
          }
        }
      });
    } else if (type === 'faq') {
      // Intentar formato P:/R: (usado por backend)
      const lines = text.split('\n');
      let currentQuestion = '';
      let currentAnswer = '';
      let index = 0;

      lines.forEach((line) => {
        if (line.match(/^P:\s*/i)) {
          // Guardar FAQ anterior si existe
          if (currentQuestion && currentAnswer) {
            blocks.push({
              id: `block_${Date.now()}_${index}`,
              type: 'faq-item',
              order: index,
              question: currentQuestion,
              answer: currentAnswer
            });
            index++;
          }
          // Iniciar nueva pregunta
          currentQuestion = line.replace(/^P:\s*/i, '').trim();
          currentAnswer = '';
        } else if (line.match(/^R:\s*/i)) {
          // Respuesta
          currentAnswer = line.replace(/^R:\s*/i, '').trim();
        } else if (currentAnswer && line.trim()) {
          // Continuación de respuesta
          currentAnswer += ' ' + line.trim();
        }
      });

      // Guardar último FAQ
      if (currentQuestion && currentAnswer) {
        blocks.push({
          id: `block_${Date.now()}_${index}`,
          type: 'faq-item',
          order: index,
          question: currentQuestion,
          answer: currentAnswer
        });
      }

      // Si no hay matches con P:/R:, intentar formato **Pregunta:**
      if (blocks.length === 0) {
        const faqPattern = /\ \ Pregunta:\ \ \s (. ?)\n(. ?)(?=\n\ \ Pregunta:\ \ |\n*$)/gs;
        const matches = [...text.matchAll(faqPattern)];
        
        matches.forEach((match, idx) => {
          const question = match[1]?.trim();
          const answer = match[2]?.trim();
          if (question && answer) {
            blocks.push({
              id: `block_${Date.now()}_${idx}`,
              type: 'faq-item',
              order: idx,
              question,
              answer
            });
          }
        });
      }

      // Si aún no hay matches, intentar formato simple
      if (blocks.length === 0) {
        const paragraphs = text.split('\n\n');
        paragraphs.forEach((paragraph, idx) => {
          const parts = paragraph.split('\n');
          if (parts.length >= 2) {
            const question = parts[0].replace(/^¿/, '').replace(/\?$/, '').trim();
            const answer = parts.slice(1).join(' ').trim();
            if (question && answer) {
              blocks.push({
                id: `block_${Date.now()}_${idx}`,
                type: 'faq-item',
                order: idx,
                question,
                answer
              });
            }
          }
        });
      }
    }

    return blocks;
  };

  /**
   * Convertir bloques a texto plano
   */
  const blocksToText = (blocks: Block[]): string => {
    if (!blocks || blocks.length === 0) return '';

    return blocks
      .sort((a, b) => a.order - b.order)
      .map((block) => {
        if (block.type === 'list-item') {
          return `- ${block.content}`;
        } else if (block.type === 'faq-item') {
          return `P: ${block.question}\nR: ${block.answer}`;
        } else if (block.type === 'text') {
          return block.content;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n\n');
  };

  /**
   * Parsear respuesta de IA a bloques
   */
  const aiResponseToBlocks = (response: string, targetType: 'list' | 'faq'): Block[] => {
    // La IA puede devolver formato markdown, limpiar y convertir
    return textToBlocks(response, targetType);
  };

  return {
    textToBlocks,
    blocksToText,
    aiResponseToBlocks
  };
};
