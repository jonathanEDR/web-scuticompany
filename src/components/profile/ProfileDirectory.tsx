/**
 * 📋 ProfileDirectory - Directorio Avanzado de Perfiles
 * Lista completa con filtros avanzados, búsqueda y ordenamiento
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Users,
  Star,
  MapPin,
  ChevronDown,
  X,
  Loader,
  AlertCircle,
  Grid,
  List,
  ArrowUpDown,
  User,
  ExternalLink,
  Award
} from 'lucide-react';
import {
  listPublicProfiles
} from '../../services/profileService';
import type { PublicUserProfile } from '../../types/profile';

interface FilterState {
  search: string;
  expertise: string[];
  sortBy: 'profileCompleteness' | 'joinDate' | 'lastActive';
  sortOrder: 'asc' | 'desc';
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

type ViewMode = 'grid' | 'list';

const ProfileDirectory: React.FC = () => {
  // Estados principales
  const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Estados de filtros
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    expertise: [],
    sortBy: 'profileCompleteness',
    sortOrder: 'desc'
  });

  // Estados de UI
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });

  // Opciones disponibles
  const expertiseOptions = [
    'Desarrollo Web',
    'Desarrollo Móvil',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'UI/UX Design',
    'Marketing Digital',
    'SEO',
    'E-commerce',
    'Blockchain',
    'Ciberseguridad',
    'Cloud Computing'
  ];

  const sortOptions = [
    { value: 'profileCompleteness', label: 'Completitud del Perfil' },
    { value: 'joinDate', label: 'Fecha de Registro' },
    { value: 'displayName', label: 'Nombre' },
    { value: 'lastActive', label: 'Última Actividad' }
  ];

  // Cargar perfiles
  const loadProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search || undefined,
        sortBy: filters.sortBy
      };

      const response = await listPublicProfiles(params);
      setProfiles(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages
      }));
    } catch (err: any) {
      setError(err.message || 'Error al cargar los perfiles');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, pagination.limit]);

  // Efectos
  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput }));
        setPagination(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleExpertiseToggle = (expertise: string) => {
    setFilters(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleSortChange = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      expertise: [],
      sortBy: 'profileCompleteness',
      sortOrder: 'desc'
    });
    setSearchInput('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getCompletenessColor = (score: number): string => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    if (score >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getCompletenessLabel = (score: number): string => {
    if (score >= 90) return 'Experto';
    if (score >= 80) return 'Avanzado';
    if (score >= 60) return 'Intermedio';
    if (score >= 40) return 'Básico';
    return 'Nuevo';
  };

  // Componente de perfil individual
  const ProfileCard: React.FC<{ profile: PublicUserProfile }> = ({ profile }) => {
    const completenessColor = getCompletenessColor(profile.profileCompleteness || 0);
    const completenessLabel = getCompletenessLabel(profile.profileCompleteness || 0);

    if (viewMode === 'list') {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {profile.displayName || 'Usuario'}
                  </h3>
                  {profile.bio && (
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                </div>
                
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${completenessColor}`}>
                  {profile.profileCompleteness || 0}% {completenessLabel}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {profile.location}
                    </div>
                  )}
                  
                  {profile.expertise && Array.isArray(profile.expertise) && profile.expertise.length > 0 && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {profile.expertise.length} especialización{profile.expertise.length !== 1 ? 'es' : ''}
                    </div>
                  )}
                </div>

                <Link
                  to={`/perfil/${profile._id}`}
                  className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                >
                  Ver Perfil
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Vista de grid
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 group">
        <div className="text-center">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
            {profile.avatar ? (
              <img 
                src={profile.avatar} 
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
            )}
          </div>

          {/* Nombre y bio */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
            {profile.displayName || 'Usuario'}
          </h3>
          
          {profile.bio && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 h-12">
              {profile.bio}
            </p>
          )}

          {/* Badge de completeness */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${completenessColor} mb-4`}>
            <Award className="w-3 h-3 mr-1" />
            {profile.profileCompleteness || 0}% {completenessLabel}
          </div>

          {/* Metadata */}
          <div className="space-y-2 text-sm text-gray-500 mb-4">
            {profile.location && (
              <div className="flex items-center justify-center">
                <MapPin className="w-4 h-4 mr-1" />
                {profile.location}
              </div>
            )}
            
            {profile.expertise && Array.isArray(profile.expertise) && profile.expertise.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {profile.expertise.slice(0, 2).map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs"
                  >
                    {skill}
                  </span>
                ))}
                {profile.expertise.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{profile.expertise.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Botón */}
          <Link
            to={`/perfil/${profile._id}`}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Ver Perfil
            <ExternalLink className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Directorio de Perfiles</h1>
              <p className="mt-2 text-gray-600">
                Conecta con otros miembros de la comunidad SCUTI
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {/* Toggle de vista */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Búsqueda */}
            <div className="flex-1 lg:max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Buscar por nombre o biografía..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Controles de filtros */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                <ChevronDown className={`w-4 h-4 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Ordenamiento rápido */}
              <div className="flex items-center space-x-2">
                {sortOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => handleSortChange(option.value as FilterState['sortBy'])}
                    className={`inline-flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      filters.sortBy === option.value
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option.label}
                    <ArrowUpDown className="w-3 h-3 ml-1" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de filtros expandido */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Filtro por expertise */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Especialización</h3>
                  <div className="flex flex-wrap gap-2">
                    {expertiseOptions.map(expertise => (
                      <button
                        key={expertise}
                        onClick={() => handleExpertiseToggle(expertise)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          filters.expertise.includes(expertise)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {expertise}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-end justify-end">
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Resultados */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-indigo-600 mx-auto mb-4" />
              <p className="text-gray-600">Cargando perfiles...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error al cargar perfiles</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadProfiles}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron perfiles</h3>
            <p className="text-gray-600 mb-6">
              {filters.search || filters.expertise.length > 0
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Aún no hay perfiles públicos disponibles'
              }
            </p>
            {(filters.search || filters.expertise.length > 0) && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Limpiar Filtros
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Información de resultados */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Mostrando {profiles.length} de {pagination.total} perfil{pagination.total !== 1 ? 'es' : ''}
              </p>
              
              <div className="text-sm text-gray-500">
                Página {pagination.page} de {pagination.pages}
              </div>
            </div>

            {/* Grid/Lista de perfiles */}
            <div className={`grid gap-6 mb-8 ${
              viewMode === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {profiles.map(profile => (
                <ProfileCard key={profile._id} profile={profile} />
              ))}
            </div>

            {/* Paginación */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>

                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pagination.page === page
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                {pagination.pages > 5 && (
                  <>
                    {pagination.pages > 6 && <span className="px-2 text-gray-500">...</span>}
                    <button
                      onClick={() => handlePageChange(pagination.pages)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        pagination.page === pagination.pages
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pagination.pages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileDirectory;