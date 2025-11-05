/**
 * 📊 Dashboard de Analytics Avanzados para Blog
 * Análisis de sentimientos, legibilidad, engagement y métricas semánticas
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3,
  TrendingUp,
  Eye,
  MessageCircle,
  Heart,
  Share2,
  Clock,
  Brain,
  Activity
} from 'lucide-react';
import { useBlogPosts } from '../../../hooks/blog';
import type { AIMetadata } from '../../../services/blog/blogAiApi';

interface AnalyticsData {
  posts: Array<{
    _id: string;
    title: string;
    slug: string;
    publishedAt: string;
    stats: {
      views: number;
      comments: number;
      likes: number;
      shares: number;
    };
    aiAnalysis?: AIMetadata;
  }>;
  totalStats: {
    totalViews: number;
    totalComments: number;
    totalLikes: number;
    totalShares: number;
    avgReadingTime: number;
    avgContentScore: number;
    avgSentimentScore: number;
    avgReadabilityScore: number;
  };
  sentimentDistribution: {
    positive: number;
    neutral: number;
    negative: number;
  };
  readabilityLevels: Record<string, number>;
  topicTrends: Array<{
    topic: string;
    count: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

export const BlogAnalyticsDashboard: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const { posts } = useBlogPosts({ 
    limit: 50, 
    isPublished: true,
    sort: 'publishedAt'
  });

  // Simular datos de analytics (en producción vendría de la API)
  useEffect(() => {
    const generateAnalyticsData = async () => {
      if (!posts.length) return;

      setLoading(true);

      // Simular procesamiento de datos
      const mockAnalytics: AnalyticsData = {
        posts: posts.map(post => ({
          ...post,
          stats: {
            views: Math.floor(Math.random() * 1000) + 100,
            comments: Math.floor(Math.random() * 50) + 5,
            likes: Math.floor(Math.random() * 100) + 10,
            shares: Math.floor(Math.random() * 25) + 2,
          },
          aiAnalysis: {
            contentScore: Math.floor(Math.random() * 40) + 60,
            sentiment: {
              score: (Math.random() - 0.5) * 2,
              magnitude: Math.random(),
              label: ['POSITIVE', 'NEUTRAL', 'NEGATIVE'][Math.floor(Math.random() * 3)] as any
            },
            readability: {
              score: Math.floor(Math.random() * 40) + 60,
              level: ['EASY', 'STANDARD', 'DIFFICULT'][Math.floor(Math.random() * 3)] as any,
              averageSentenceLength: Math.floor(Math.random() * 10) + 15,
              averageWordsPerSentence: Math.floor(Math.random() * 5) + 12,
            },
            keyTopics: ['JavaScript', 'React', 'Node.js', 'TypeScript'].slice(0, Math.floor(Math.random() * 3) + 1),
            // Agregar propiedades faltantes con valores por defecto
            summary: '',
            entities: [],
            keyPhrases: [],
            contentStructure: {
              hasIntroduction: true,
              hasConclusion: true,
              headingsCount: 5,
              paragraphsCount: 12,
              wordsCount: 1200,
              readingTimeMinutes: 6
            },
            suggestedKeywords: [],
            suggestedTags: [],
            improvements: []
          }
        })),
        totalStats: {
          totalViews: 15420,
          totalComments: 847,
          totalLikes: 1205,
          totalShares: 234,
          avgReadingTime: 4.2,
          avgContentScore: 82,
          avgSentimentScore: 0.65,
          avgReadabilityScore: 78
        },
        sentimentDistribution: {
          positive: 65,
          neutral: 25,
          negative: 10
        },
        readabilityLevels: {
          'VERY_EASY': 15,
          'EASY': 35,
          'STANDARD': 40,
          'DIFFICULT': 10
        },
        topicTrends: [
          { topic: 'JavaScript', count: 12, trend: 'up' },
          { topic: 'React', count: 8, trend: 'up' },
          { topic: 'TypeScript', count: 6, trend: 'stable' },
          { topic: 'Node.js', count: 4, trend: 'down' }
        ]
      };

      setTimeout(() => {
        setAnalyticsData(mockAnalytics);
        setLoading(false);
      }, 1500);
    };

    generateAnalyticsData();
  }, [posts, timeRange]);

  const MetricCard: React.FC<{
    title: string;
    value: string | number;
    change?: string;
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {change && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const SentimentChart: React.FC<{ data: AnalyticsData['sentimentDistribution'] }> = ({ data }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Distribución de Sentimientos
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Positivo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{data.positive}%</span>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-green-500 rounded-full" 
                style={{ width: `${data.positive}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Neutral</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{data.neutral}%</span>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-yellow-500 rounded-full" 
                style={{ width: `${data.neutral}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Negativo</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900 dark:text-white">{data.negative}%</span>
            <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-red-500 rounded-full" 
                style={{ width: `${data.negative}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TopPostsTable: React.FC<{ posts: AnalyticsData['posts'] }> = ({ posts }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Rendimiento de Posts
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Vistas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Engagement
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Puntuación IA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Sentimiento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {posts.slice(0, 10).map((post) => (
              <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {post.stats.views.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.stats.comments}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      {post.stats.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      {post.stats.shares}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    post.aiAnalysis && post.aiAnalysis.contentScore >= 80 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                      : post.aiAnalysis && post.aiAnalysis.contentScore >= 60
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                  }`}>
                    {post.aiAnalysis?.contentScore || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm ${
                    post.aiAnalysis?.sentiment.label === 'POSITIVE' 
                      ? 'text-green-600 dark:text-green-400'
                      : post.aiAnalysis?.sentiment.label === 'NEGATIVE'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}>
                    {post.aiAnalysis?.sentiment.label === 'POSITIVE' ? '😊' :
                     post.aiAnalysis?.sentiment.label === 'NEGATIVE' ? '😞' : '😐'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
            <div className="bg-gray-200 dark:bg-gray-700 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-400">No hay datos de analytics disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics del Blog</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Análisis avanzado con IA y métricas de rendimiento
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total de Vistas"
          value={analyticsData.totalStats.totalViews.toLocaleString()}
          change="+12% vs período anterior"
          icon={<Eye className="w-6 h-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Engagement Promedio"
          value={`${Math.round((analyticsData.totalStats.totalComments + analyticsData.totalStats.totalLikes) / posts.length)}`}
          change="+8% vs período anterior"
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Puntuación IA Media"
          value={analyticsData.totalStats.avgContentScore}
          change="+5% vs período anterior"
          icon={<Brain className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
        <MetricCard
          title="Tiempo de Lectura"
          value={`${analyticsData.totalStats.avgReadingTime}m`}
          change="-2% vs período anterior"
          icon={<Clock className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts y análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SentimentChart data={analyticsData.sentimentDistribution} />
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Temas Tendencia
          </h3>
          <div className="space-y-3">
            {analyticsData.topicTrends.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{topic.topic}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">({topic.count} posts)</span>
                </div>
                <div className={`flex items-center ${
                  topic.trend === 'up' ? 'text-green-600' : 
                  topic.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  <TrendingUp 
                    className={`w-4 h-4 ${topic.trend === 'down' ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de posts */}
      <TopPostsTable posts={analyticsData.posts} />
    </div>
  );
};