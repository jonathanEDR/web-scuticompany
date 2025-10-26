import { useTheme } from '../../contexts/ThemeContext';
import '../../styles/SimpleGoogleMap.css';

interface SimpleGoogleMapProps {
  googleMapsUrl?: string;
  height?: string;
  borderRadius?: string;
  companyName?: string;
  address?: string;
}

const SimpleGoogleMap = ({
  googleMapsUrl = '',
  height = '400px',
  borderRadius = '1rem',
  companyName = 'Nuestra Ubicación',
  address = ''
}: SimpleGoogleMapProps) => {
  const { theme } = useTheme();

  // Función mejorada para convertir URL de Google Maps a embed
  const getEmbedUrl = () => {
    console.log('🗺️ URL recibida:', googleMapsUrl);
    console.log('🏢 Empresa:', companyName);
    console.log('📍 Dirección:', address);
    
    if (!googleMapsUrl) {
      console.log('❌ No hay URL, usando default');
      return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15057.334840628334!2d-77.04276278715878!3d-12.04635330943029!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c6f0d54871b7%3A0x11b9b5b4c5a2b5c3!2sLima%2C%20Peru!5e0!3m2!1sen!2spe!4v1635959562000!5m2!1sen!2spe";
    }
    
    // Si ya es embed, usarla directamente
    if (googleMapsUrl.includes('/embed')) {
      console.log('✅ Ya es embed URL');
      return googleMapsUrl;
    }
    
    // NUEVO: Manejar URLs acortadas de Google Maps (goo.gl o maps.app.goo.gl)
    if (googleMapsUrl.includes('goo.gl') || googleMapsUrl.includes('maps.app.goo.gl')) {
      console.log('🔗 URL acortada detectada, creando embed personalizado...');
      
      // Método EFECTIVO: búsqueda específica en Perú usando la dirección real
      // Agregamos "Perú" al final para asegurar geolocalización correcta
      const locationQuery = `${address}, Huánuco, Perú`.replace(/\s+/g, '+').toLowerCase();
      const peruEmbedUrl = `https://maps.google.com/maps?width=100%25&height=600&hl=es&q=${locationQuery}&t=&z=17&ie=UTF8&iwloc=B&output=embed`;
      
      console.log('✅ URL embed creada para Perú:', peruEmbedUrl);
      return peruEmbedUrl;
    }
    
    // Si contiene 'google.com/maps', intentar convertir
    if (googleMapsUrl.includes('google.com/maps')) {
      // Método 1: Buscar coordenadas @lat,lng
      const coordMatch = googleMapsUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
      if (coordMatch) {
        const [, lat, lng] = coordMatch;
        const convertedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15057!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2spe!4v1635959562000!5m2!1sen!2spe`;
        console.log('✅ Convertida con coordenadas:', convertedUrl);
        return convertedUrl;
      }
      
      // Método 2: Reemplazar /maps/ por /maps/embed
      const simpleConvert = googleMapsUrl.replace('/maps/', '/maps/embed?pb=!1m18!1m12!1m3!1d15057!2d-77.042!3d-12.046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z!5e0!3m2!1sen!2spe!4v1635959562000!5m2!1sen!2spe&');
      console.log('✅ Conversión simple:', simpleConvert);
      return simpleConvert;
    }
    
    // Fallback: usar búsqueda por nombre y dirección
    console.log('⚠️ Usando fallback con búsqueda');
    const searchQuery = encodeURIComponent(`${companyName} ${address}`);
    return `https://www.google.com/maps/embed/v1/place?key=&q=${searchQuery}`;
  };

  const embedUrl = getEmbedUrl();

  // Función para abrir Google Maps en nueva pestaña
  const openInGoogleMaps = () => {
    console.log('🔗 Abriendo Google Maps...');
    
    if (googleMapsUrl && !googleMapsUrl.includes('/embed')) {
      // Si tenemos URL original, usarla
      console.log('✅ Usando URL original:', googleMapsUrl);
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Fallback: buscar coordenadas o usar búsqueda
      const coordMatch = embedUrl.match(/2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/);
      if (coordMatch) {
        const [, lng, lat] = coordMatch;
        const mapsUrl = `https://www.google.com/maps/@${lat},${lng},15z`;
        console.log('✅ Usando coordenadas extraídas:', mapsUrl);
        window.open(mapsUrl, '_blank', 'noopener,noreferrer');
      } else {
        // Último recurso: búsqueda por nombre con ubicación específica en Perú
        const searchUrl = `https://www.google.com/maps/search/${encodeURIComponent(address + ', Lima, Perú')}`;
        console.log('✅ Usando búsqueda en Perú:', searchUrl);
        window.open(searchUrl, '_blank', 'noopener,noreferrer');
      }
    }
  };

  // Siempre mostrar el mapa (usaremos default si no hay URL personalizada)

  return (
    <div 
      className="map-container"
      style={{ 
        position: 'relative', 
        height, 
        borderRadius, 
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        border: '1px solid rgba(139, 92, 246, 0.1)',
        cursor: 'pointer'
      }}
      onClick={openInGoogleMaps}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          openInGoogleMaps();
        }
      }}
      aria-label={`Abrir ${companyName} en Google Maps`}>
      {/* Google Maps Iframe */}
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 0, 
          borderRadius,
          filter: theme === 'dark' ? 'brightness(0.8) contrast(1.1)' : 'none'
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${companyName}`}
      />
      
      {/* Marcador central con radar animado */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Ondas de radar con mayor contraste */}
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          border: '3px solid rgba(139, 92, 246, 0.7)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'radarPulse 4s infinite',
          backdropFilter: 'blur(1px)'
        }} />
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          border: '3px solid rgba(139, 92, 246, 0.8)',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'radarPulse 4s infinite 1.3s',
          backdropFilter: 'blur(1px)'
        }} />
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          border: '3px solid rgba(139, 92, 246, 0.9)',
          backgroundColor: 'rgba(139, 92, 246, 0.2)',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          animation: 'radarPulse 4s infinite 2.6s',
          backdropFilter: 'blur(1px)'
        }} />
        
        {/* Marcador central más visible */}
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          border: '4px solid white',
          boxShadow: '0 6px 20px rgba(139, 92, 246, 0.9), 0 0 0 3px rgba(139, 92, 246, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'markerPulse 2s infinite alternate',
          backdropFilter: 'blur(2px)'
        }}>
          {/* Icono de ubicación */}
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: 'white',
            fontWeight: 'bold',
            fontSize: '10px',
            color: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 1px 2px rgba(139, 92, 246, 0.2)'
          }}>
            📍
          </div>
        </div>
      </div>

      {/* Overlay con información y click */}
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
          padding: '16px',
          color: 'white',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={openInGoogleMaps}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to top, rgba(139, 92, 246, 0.8), transparent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)';
        }}
      >
        <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '4px' }}>
          {companyName}
        </h3>
        {address && <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '4px' }}>{address}</p>}
        {/* Debug temporal - mostrar si hay URL personalizada */}
        <p style={{ fontSize: '10px', opacity: 0.6, marginBottom: '4px', color: googleMapsUrl ? '#90EE90' : '#FFB6C1' }}>
          {googleMapsUrl 
            ? (googleMapsUrl.includes('goo.gl') ? '🔗 URL acortada → Búsqueda en Perú' : '✅ URL personalizada configurada')
            : '⚠️ Usando ubicación por defecto'
          }
        </p>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '12px', 
          opacity: 0.75 
        }}>
          📍 <span>Haz clic para abrir en Google Maps</span>
          <svg 
            style={{ width: '12px', height: '12px', marginLeft: 'auto' }}
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path 
              fillRule="evenodd" 
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
              clipRule="evenodd" 
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SimpleGoogleMap;