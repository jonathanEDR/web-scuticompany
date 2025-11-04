import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Tag as TagIcon, Eye, MessageCircle } from 'lucide-react';
import { useBlogPost } from '../../../hooks/blog';
import { ShareButtons, ReadingTimeIndicator, CategoryBadge, TagList } from '../../../components/blog/common';
import { sanitizeHTML } from '../../../utils/blog';
import PublicFooter from '../../../components/public/PublicFooter';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug || '');

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog Web Scuti`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl animate-pulse space-y-6">
          <div className="bg-gray-200 dark:bg-gray-700 h-8 w-24 rounded"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-12 w-3/4 rounded"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-6 w-1/2 rounded"></div>
          <div className="bg-gray-200 dark:bg-gray-700 h-96 rounded"></div>
          {[...Array(8)].map((_, i) => (<div key={i} className="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>))}
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Artículo no encontrado</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">El artículo que buscas no existe o ha sido eliminado.</p>
            <Link to="/blog" className="inline-flex items-center gap-2 bg-blue-600 dark:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
              <ArrowLeft size={20} />
              Volver al blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium mb-6">
            <ArrowLeft size={20} />
            Volver al blog
          </Link>
          {post.category && <div className="mb-4"><CategoryBadge category={post.category} /></div>}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{post.title}</h1>
          {post.excerpt && <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">{post.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400">
            {post.author && (
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{post.author.firstName} {post.author.lastName}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{new Date(post.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <ReadingTimeIndicator minutes={post.readingTime} variant="minimal" />
            </div>
            {post.stats?.views && (
              <div className="flex items-center gap-2">
                <Eye size={18} />
                <span>{post.stats.views.toLocaleString()} vistas</span>
              </div>
            )}
          </div>
        </div>
      </section>
      {post.featuredImage && (
        <section className="bg-gray-900 dark:bg-gray-950">
          <div className="container mx-auto px-4 max-w-5xl">
            <img 
              src={post.featuredImage} 
              alt={post.title} 
              className="w-full h-96 object-cover" 
            />
          </div>
        </section>
      )}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ShareButtons url={window.location.href} title={post.title} variant="default" />
            </div>
          </aside>
          <article className="lg:col-span-11">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-8 md:p-12">
              <div 
                className="prose prose-lg max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed 
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline 
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-ul:list-disc prose-ol:list-decimal 
                  prose-li:text-gray-700 dark:prose-li:text-gray-300
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-400 
                  prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                  prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200
                  prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm 
                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} 
              />
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <TagIcon className="text-gray-400 dark:text-gray-500" size={20} />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Etiquetas</h3>
                  </div>
                  <TagList tags={post.tags} />
                </div>
              )}
              
              {/* Sección del autor */}
              {post.author && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    {post.author.avatar ? (
                      <img 
                        src={post.author.avatar} 
                        alt={`${post.author.firstName} ${post.author.lastName}`} 
                        className="w-16 h-16 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <User className="text-blue-600 dark:text-blue-400" size={32} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {post.author.firstName} {post.author.lastName}
                      </h3>
                      {post.author.bio && <p className="text-gray-600 dark:text-gray-300">{post.author.bio}</p>}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 lg:hidden">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Compartir</h3>
                <ShareButtons url={window.location.href} title={post.title} variant="default" />
              </div>
            </div>
            {post.allowComments && (
              <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 p-8">
                <div className="flex items-center gap-3 mb-4">
                  <MessageCircle className="text-blue-600 dark:text-blue-400" size={24} />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Comentarios ({post.stats?.commentsCount || 0})
                  </h2>
                </div>
                <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                  <MessageCircle className="mx-auto text-gray-400 dark:text-gray-500 mb-3" size={48} />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    La sección de comentarios estará disponible próximamente
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Podrás compartir tus opiniones y conectar con otros lectores
                  </p>
                </div>
              </div>
            )}
          </article>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};

export default BlogPost;