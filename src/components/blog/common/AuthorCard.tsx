/**
 * 👤 AuthorCard Component
 * Tarjeta profesional del autor con bio y redes sociales
 */

import { User, Globe, Twitter, Linkedin, Github } from 'lucide-react';
import type { BlogAuthor } from '../../../types/blog';

interface AuthorCardProps {
  author: BlogAuthor;
  className?: string;
}

export default function AuthorCard({ author, className = '' }: AuthorCardProps) {
  // Manejar datos faltantes con fallbacks
  const authorName = author?.firstName && author?.lastName 
    ? `${author.firstName} ${author.lastName}`
    : author?.email?.split('@')[0] || 'Autor Anónimo';
  
  const displayRole = author?.role || 'Autor';
  const displayBio = author?.bio || 'Escritor apasionado por compartir conocimiento y experiencias.';
  
  return (
    <div className={`author-card bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {author?.avatar ? (
            <img
              src={author.avatar}
              alt={authorName}
              className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-md">
              <User className="text-white" size={40} />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {authorName}
            </h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400">
              {displayRole}
            </span>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
            {displayBio}
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {author.website && (
              <a
                href={author.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                aria-label="Sitio web del autor"
              >
                <Globe size={14} />
                <span className="hidden sm:inline">Sitio web</span>
              </a>
            )}

            {author.social?.twitter && (
              <a
                href={`https://twitter.com/${author.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Twitter del autor"
              >
                <Twitter size={14} />
              </a>
            )}

            {author.social?.linkedin && (
              <a
                href={author.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
                aria-label="LinkedIn del autor"
              >
                <Linkedin size={14} />
              </a>
            )}

            {author.social?.github && (
              <a
                href={`https://github.com/${author.social.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="GitHub del autor"
              >
                <Github size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}