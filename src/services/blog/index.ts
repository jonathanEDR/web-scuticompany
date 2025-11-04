/**
 * 📦 Exportación centralizada de servicios del Blog
 */

export { blogPostApi, default as blogPostApiDefault } from './blogPostApi';
export { blogCommentApi, default as blogCommentApiDefault } from './blogCommentApi';
export { blogCategoryApi, default as blogCategoryApiDefault } from './blogCategoryApi';
export { blogModerationApi, default as blogModerationApiDefault } from './blogModerationApi';

// Re-exportar utilidades comunes
export { generateGuestId, getGuestId } from './blogCommentApi';
export { isValidColor, generateSlug } from './blogCategoryApi';
