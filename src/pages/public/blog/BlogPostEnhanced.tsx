/**
 * 📝 BlogPost Mejorado con IA
 * Versión avanzada del componente BlogPost con funcionalidades de IA integradas
 */

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Tag as TagIcon, Sparkles, Bot, BarChart3 } from 'lucide-react';
import { useBlogPost, useAIMetadata, useContentAnalysis, useAIRecommendations } from '../../../hooks/blog';
import { 
  ShareButtons, 
  TagList, 
  RelatedPosts, 
  TableOfContents, 
  PostNavigation, 
  SEOHead, 
  PostHeader,
  AuthorCard,
  LazyImage
} from '../../../components/blog/common';
import { CommentsList } from '../../../components/blog/comments';
import { AIMetadataComponent, QAComponent, AIRecommendations } from '../../../components/blog/ai';
import { sanitizeHTML } from '../../../utils/blog';
import PublicFooter from '../../../components/public/PublicFooter';

const BlogPostEnhanced: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useBlogPost(slug || '');
  
  // Hooks de IA
  const { metadata: aiMetadata, loading: aiLoading, error: aiError } = useAIMetadata(slug || '');
  const { 
    qaGeneration, 
    loading: qaLoading, 
    generateQA 
  } = useContentAnalysis(slug || '');
  const { 
    recommendations, 
    loading: recLoading 
  } = useAIRecommendations(slug || '', { limit: 4 });

  // Estado para pestañas de funcionalidades avanzadas
  const [activeAITab, setActiveAITab] = useState<'metadata' | 'qa' | 'recommendations'>('metadata');
  const [showAIFeatures, setShowAIFeatures] = useState(false);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog Web Scuti`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Generar Q&A automáticamente después de cargar el post
      setTimeout(() => {
        generateQA();
      }, 1000);
    }
  }, [post, generateQA]);

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

  const renderAIContent = () => {
    switch (activeAITab) {
      case 'metadata':
        return aiMetadata ? (
          <AIMetadataComponent metadata={aiMetadata} />
        ) : aiLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
        ) : aiError ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No se pudo cargar el análisis IA</p>
          </div>
        ) : null;

      case 'qa':
        return qaGeneration ? (
          <QAComponent qaData={qaGeneration} />
        ) : qaLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Generando preguntas y respuestas...</p>
          </div>
        );

      case 'recommendations':
        return recommendations.length > 0 ? (
          <AIRecommendations recommendations={recommendations} loading={recLoading} />
        ) : recLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay recomendaciones disponibles</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* SEO Head */}
      <SEOHead post={post} type="article" />
      
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

      {/* Botón flotante para funcionalidades IA */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowAIFeatures(!showAIFeatures)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          title="Funcionalidades IA"
        >
          <Sparkles className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8 lg:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Análisis IA Compacto */}
              {aiMetadata && (
                <AIMetadataComponent metadata={aiMetadata} compact />
              )}
              
              {/* Table of Contents */}
              <TableOfContents 
                content={post.content}
                maxLevel={3}
              />
              
              {/* Share Buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 lg:p-12">
              {/* Content */}
              <div 
                className="prose prose-lg lg:prose-xl max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:scroll-mt-24
                  prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed 
                  prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
                  prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-blue-600
                  prose-li:text-gray-700 dark:prose-li:text-gray-300
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-600 dark:prose-blockquote:border-blue-400 
                  prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                  prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-2
                  prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200
                  prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
                  prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-lg
                  prose-pre:shadow-lg prose-pre:border prose-pre:border-gray-700
                  prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
                  prose-hr:border-gray-200 dark:prose-hr:border-gray-700"
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }} 
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

            {/* Funcionalidades IA Expandidas */}
            {showAIFeatures && (
              <div className="space-y-6">
                {/* Pestañas IA */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8 px-6">
                      <button
                        onClick={() => setActiveAITab('metadata')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeAITab === 'metadata'
                            ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4 inline mr-2" />
                        Análisis IA
                      </button>
                      <button
                        onClick={() => setActiveAITab('qa')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeAITab === 'qa'
                            ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Bot className="w-4 h-4 inline mr-2" />
                        Q&A Automático
                      </button>
                      <button
                        onClick={() => setActiveAITab('recommendations')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeAITab === 'recommendations'
                            ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                      >
                        <Sparkles className="w-4 h-4 inline mr-2" />
                        Recomendaciones
                      </button>
                    </nav>
                  </div>
                </div>

                {/* Contenido de las pestañas IA */}
                {renderAIContent()}
              </div>
            )}

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

      <PublicFooter />
    </div>
  );
};

export default BlogPostEnhanced;