/**
 * 📦 Exportación centralizada de hooks del Blog
 */

// Posts
export {
  useBlogPosts,
  useFeaturedPosts,
  usePopularPosts,
  useSearchPosts,
} from './useBlogPosts';

// Posts Admin
export { useAdminPosts } from './useAdminPosts';

// Post individual
export {
  useBlogPost,
  usePostInteractions,
} from './useBlogPost';

// Comentarios
export {
  useComments,
  useCommentVote,
} from './useComments';

// Categorías
export {
  useCategories,
  useCategory,
  useCategoryPosts,
  useActiveCategoriesWithCount,
} from './useCategories';

// Moderación (Admin)
export {
  useModerationQueue,
  usePendingComments,
  useReportedComments,
  useModerationStats,
} from './useModerationQueue';

// Exports por defecto
export { default as useBlogPostsDefault } from './useBlogPosts';
export { default as useBlogPostDefault } from './useBlogPost';
export { default as useCommentsDefault } from './useComments';
export { default as useCategoriesDefault } from './useCategories';
export { default as useModerationQueueDefault } from './useModerationQueue';
