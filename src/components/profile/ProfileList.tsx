/**
 * 📋 Profile List Component
 * Listado de perfiles públicos con búsqueda y filtros
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Users,
  Star,
  MapPin,
  Calendar,
  ChevronDown,
  Grid,
  List,
  RefreshCw
} from 'lucide-react';
import { listPublicProfiles, getDefaultAvatar } from '../../services/profileService';
import type { PublicUserProfile } from '../../types/profile';
import { PaginationControls } from '../common/PaginationControls';
import { SearchBar } from '../common/SearchBar';

// ============================================
// TIPOS
// ============================================

interface ProfileListProps {
  initialSearch?: string;
  pageSize?: number;
}

interface ProfileCardProps {
  profile: PublicUserProfile;
  viewMode: 'grid' | 'list';
}

type SortOption = 'profileCompleteness' | 'joinDate' | 'lastActive';

// ============================================
// COMPONENTES AUXILIARES
// ============================================

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, viewMode }) => {
  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short'
    }).format(new Date(date));
  };

  if (viewMode === 'list') {
    return (
      <Link
        to={`/profile/public/${profile._id}`}
        className="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow p-6"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <img
                src={profile.avatar || getDefaultAvatar(profile.displayName || 'Usuario')}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {profile.displayName}
                </h3>
                {profile.expertise && (
                  <p className="text-sm text-blue-600 font-medium">{profile.expertise}</p>
                )}
                {profile.bio && (
                  <p className="text-gray-600 mt-1 line-clamp-2">{profile.bio}</p>
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-gray-500 ml-4">
                <Star size={12} className="text-yellow-500" />
                <span>{profile.profileCompleteness}%</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              {profile.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} />
                  <span>{profile.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Desde {formatDate(profile.joinDate || new Date().toISOString())}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <Link
      to={`/profile/public/${profile._id}`}
      className="block bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        {/* Avatar y completeness */}
        <div className="flex items-start justify-between mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            <img
              src={profile.avatar || getDefaultAvatar(profile.displayName || 'Usuario')}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Star size={12} className="text-yellow-500" />
            <span>{profile.profileCompleteness}%</span>
          </div>
        </div>
        
        {/* Información principal */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
          {profile.displayName}
        </h3>
        
        {profile.expertise && (
          <p className="text-sm text-blue-600 font-medium mb-2">{profile.expertise}</p>
        )}
        
        {profile.bio && (
          <p className="text-gray-600 text-sm line-clamp-3 mb-4">{profile.bio}</p>
        )}
        
        {/* Footer */}
        <div className="flex flex-col gap-2 text-xs text-gray-500">
          {profile.location && (
            <div className="flex items-center gap-1">
              <MapPin size={12} />
              <span className="truncate">{profile.location}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Desde {formatDate(profile.joinDate || new Date().toISOString())}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export const ProfileList: React.FC<ProfileListProps> = ({
  initialSearch = '',
  pageSize = 12
}) => {
  // Estados principales
  const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de filtros y búsqueda
  const [search, setSearch] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>('profileCompleteness');
  // const [expertise, setExpertise] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  // Estados UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // const [showFilters, setShowFilters] = useState(false);

  // ============================================
  // EFECTOS
  // ============================================

  useEffect(() => {
    loadProfiles();
  }, [page, sortBy]);

  useEffect(() => {
    // Resetear página cuando cambia la búsqueda
    if (page !== 1) {
      setPage(1);
    } else {
      loadProfiles();
    }
  }, [search]);

  // ============================================
  // FUNCIONES
  // ============================================

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page,
        limit: pageSize,
        search: search || undefined,
        sortBy
      };
      
      const response = await listPublicProfiles(params);
      
      setProfiles(response.data);
      setTotalPages(response.pagination.pages);
      setTotalResults(response.pagination.total);
    } catch (error: any) {
      console.error('Error loading profiles:', error);
      setError(error.message || 'Error al cargar perfiles');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((searchTerm: string) => {
    setSearch(searchTerm);
  }, []);

  const handleRefresh = () => {
    loadProfiles();
  };

  // const getSortLabel = (sort: SortOption): string => {
  //   switch (sort) {
  //     case 'profileCompleteness': return 'Completitud del perfil';
  //     case 'joinDate': return 'Fecha de registro';
  //     case 'lastActive': return 'Última actividad';
  //     default: return sort;
  //   }
  // };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Perfiles Públicos</h1>
            <p className="text-gray-600 mt-2">
              Descubre y conecta con otros miembros de la comunidad
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            Actualizar
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={search}
              onChange={handleSearch}
              placeholder="Buscar por nombre, biografía o expertise..."
              className="w-full"
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="profileCompleteness">Completitud</option>
                <option value="joinDate">Más recientes</option>
                <option value="lastActive">Última actividad</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Results info */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
          <div>
            {loading ? (
              'Cargando...'
            ) : (
              `${totalResults} perfil${totalResults !== 1 ? 'es' : ''} encontrado${totalResults !== 1 ? 's' : ''}`
            )}
          </div>
          
          {search && (
            <div>
              Búsqueda: "<span className="font-medium">{search}</span>"
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando perfiles...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="bg-red-100 text-red-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar perfiles</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 text-gray-400 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron perfiles</h3>
          <p className="text-gray-600">
            {search 
              ? `No hay perfiles que coincidan con "${search}"`
              : 'No hay perfiles públicos disponibles en este momento'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Profiles Grid/List */}
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {profiles.map((profile) => (
              <ProfileCard
                key={profile._id}
                profile={profile}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                hasNextPage={page < totalPages}
                hasPreviousPage={page > 1}
                startIndex={(page - 1) * 12 + 1}
                endIndex={Math.min(page * 12, totalResults)}
                totalItems={totalResults}
                itemsPerPage={12}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileList;