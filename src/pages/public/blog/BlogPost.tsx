/**
 * 📝 BlogPost con SEO Optimizado para IA
 * Versión pública con meta tags optimizados para que IA externa (ChatGPT, Claude, etc.) 
 * encuentre y cite nuestro contenido
 */

import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Tag as TagIcon } from 'lucide-react';
import { useBlogPost } from '../../../hooks/blog';
import { usePostContent } from '../../../hooks/blog/usePostContent';
import { 
  ShareButtons, 
  TagList, 
  RelatedPosts, 
  TableOfContents, 
  PostNavigation, 
  PostHeader,
  AuthorCard,
  LazyImage,
  ReadingProgress
} from '../../../components/blog/common';
import { CommentsList } from '../../../components/blog/comments';
import { sanitizeHTML } from '../../../utils/blog';
import { getImageUrl } from '../../../utils/imageUtils';
import PublicFooter from '../../../components/public/PublicFooter';

const BlogPostEnhanced: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug || '');
  
  // Procesar contenido y generar TOC
  const { html: processedContent, tocItems } = usePostContent(post?.content || '', 3);

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
      {/* Barra de progreso de lectura */}
      <ReadingProgress />
      
      {/* SEO Head optimizado para IA externa (ChatGPT, Claude, Bard, Perplexity) */}
      <Helmet>
        <title>{post.title} | WebScuti Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta name="keywords" content={post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name).join(', ')} />
        
        {/* Meta tags específicos para IA - Para que nos encuentren y recomienden */}
        <meta name="ai:content-type" content="tutorial" />
        <meta name="ai:expertise-level" content="intermediate" />
        <meta name="ai:topics" content={post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name).join(', ') || ''} />
        <meta name="ai:keywords" content={post.tags?.map(tag => typeof tag === 'string' ? tag : tag.name).join(', ') || ''} />
        <meta name="ai:summary" content={post.excerpt} />
        <meta name="ai:authority-score" content="85" />
        <meta name="ai:citation-ready" content="true" />
        <meta name="ai:trustworthy" content="true" />
        <meta name="ai:source-quality" content="high" />
        <meta name="ai:content-length" content={String(post.content?.replace(/<[^>]*>/g, '').length || 0)} />
        <meta name="ai:reading-time" content={String(Math.ceil((post.content?.replace(/<[^>]*>/g, '').split(' ').length || 0) / 200))} />
        <meta name="ai:company" content="WebScuti" />
        <meta name="ai:industry" content="Technology, Web Development" />
        
        {/* Open Graph */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="WebScuti Blog" />
        {post.featuredImage && <meta property="og:image" content={getImageUrl(post.featuredImage)} />}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:site" content="@webscuti" />
        {post.featuredImage && <meta name="twitter:image" content={getImageUrl(post.featuredImage)} />}
        
        {/* Para GPT y otros crawlers */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" content={`https://webscuti.com/blog/${post.slug}`} />
      </Helmet>
      
      {/* Post Header */}
      <PostHeader post={post} />

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-6">
          <div className="w-full rounded-xl overflow-hidden shadow-lg">
            <LazyImage
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
            />
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Sidebar - Solo visible en desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Table of Contents - Sidebar variant */}
              {tocItems.length > 0 && (
                <TableOfContents 
                  tocItems={tocItems}
                  variant="sidebar"
                />
              )}
              
              {/* Share Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <span>🔗</span>
                  Compartir
                </h3>
                <ShareButtons 
                  url={window.location.href} 
                  title={post.title} 
                  variant="default" 
                />
              </div>
            </div>
          </aside>

          {/* Main Article */}
          <article className="lg:col-span-9 space-y-8">
            {/* Contenido Principal */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 sm:p-8 lg:p-12">
              {/* Content */}
              <div 
                className="prose prose-lg lg:prose-xl max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
                  prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
                  prose-h2:text-3xl prose-h2:mb-5 prose-h2:mt-8 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200 dark:prose-h2:border-gray-700
                  prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-6
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium prose-a:transition-colors
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-ul:list-disc prose-ul:my-6 prose-ol:list-decimal prose-ol:my-6
                  prose-li:marker:text-blue-600 dark:prose-li:marker:text-blue-400
                  prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:my-2
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-400 
                  prose-blockquote:pl-6 prose-blockquote:pr-4 prose-blockquote:py-3 prose-blockquote:my-6
                  prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                  prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:rounded-r-lg
                  prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200
                  prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-xl
                  prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700 prose-pre:my-6 prose-pre:p-6
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:my-8
                  prose-hr:border-gray-200 dark:prose-hr:border-gray-700 prose-hr:my-8
                  prose-table:w-full prose-table:my-6
                  prose-th:bg-gray-100 dark:prose-th:bg-gray-700 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold
                  prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:px-4 prose-td:py-3"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(processedContent) }} 
              />

              {/* Tags Section */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 mb-4">
                    <TagIcon className="text-blue-600 dark:text-blue-400" size={20} />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Etiquetas</h3>
                  </div>
                  <TagList tags={post.tags} />
                </div>
              )}
              
              {/* Author Card */}
              {post.author && (
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Sobre el autor
                  </h3>
                  <AuthorCard author={post.author} />
                </div>
              )}
            </div>

            {/* Comments Section */}
            {post.allowComments && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
                <CommentsList postSlug={slug!} />
              </div>
            )}

            {/* Related Posts */}
            <RelatedPosts 
              currentPost={post}
            />

            {/* Navigation */}
            <PostNavigation currentPost={post} />
          </article>
        </div>
      </section>

      {/* Floating TOC Button - Solo visible en móvil/tablet */}
      {tocItems.length > 0 && (
        <div className="lg:hidden">
          <TableOfContents 
            tocItems={tocItems}
            variant="floating"
          />
        </div>
      )}

      <PublicFooter />
    </div>
  );
};

export default BlogPostEnhanced;