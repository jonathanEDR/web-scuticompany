import React from 'react';

interface MissionVisionConfigSectionProps {
  pageData: any;
  updateContent: (field: string, value: any) => void;
}

const MissionVisionConfigSection: React.FC<MissionVisionConfigSectionProps> = ({
  pageData,
  updateContent
}) => {
  const mission = pageData?.content?.mission || {};
  const vision = pageData?.content?.vision || {};

  return (
    <div className="space-y-8">
      {/* 🎯 SECCIÓN MISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            🎯 Nuestra Misión
          </h3>
        </div>

        <div className="space-y-4">
          {/* Título de la Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={mission.title || ''}
              onChange={(e) => updateContent('mission.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Título de la misión..."
            />
          </div>

          {/* Descripción de la Misión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={mission.description || ''}
              onChange={(e) => updateContent('mission.description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              placeholder="Describe la misión de la empresa..."
            />
          </div>
        </div>
      </div>

      {/* 🔮 SECCIÓN VISIÓN */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg dark:shadow-gray-900/50 p-6 border border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
            🔮 Nuestra Visión
          </h3>
        </div>

        <div className="space-y-4">
          {/* Título de la Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <input
              type="text"
              value={vision.title || ''}
              onChange={(e) => updateContent('vision.title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Título de la visión..."
            />
          </div>

          {/* Descripción de la Visión */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descripción
            </label>
            <textarea
              value={vision.description || ''}
              onChange={(e) => updateContent('vision.description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
              placeholder="Describe la visión de la empresa..."
            />
          </div>
        </div>
      </div>

      {/* 📊 Vista Previa */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          👁️ Vista Previa
        </h4>
        
        <div className="space-y-6">
          {/* Preview Misión */}
          {mission.title && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {mission.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {mission.description}
              </p>
            </div>
          )}

          {/* Preview Visión */}
          {vision.title && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {vision.title}
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                {vision.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionVisionConfigSection;