import { useMemo } from 'react';
import type { ValueAddedData } from '../types';
import { getMappedValueAddedData, getCardStyles } from '../utils';

export const useValueAddedData = (
  data: ValueAddedData | undefined,
  theme: 'light' | 'dark'
) => {
  // Si no hay datos del CMS, retornar valores vacíos
  if (!data) {
    return {
      mappedData: null,
      cardStyles: getCardStyles(undefined, theme),
      currentBackgroundImage: null,
      valueItems: []
    };
  }

  const valueAddedData = data;

  const mappedData = useMemo(
    () => getMappedValueAddedData(valueAddedData),
    [valueAddedData]
  );

  const cardStyles = useMemo(
    () => getCardStyles(valueAddedData.cardsDesign, theme),
    [valueAddedData.cardsDesign, theme]
  );

  const currentBackgroundImage = useMemo(() => {
    if (!mappedData.backgroundImage) return null;
    return theme === 'light'
      ? mappedData.backgroundImage.light
      : mappedData.backgroundImage.dark;
  }, [mappedData.backgroundImage, theme]);

  const valueItems = mappedData.cards || [];

  return {
    mappedData,
    cardStyles,
    currentBackgroundImage,
    valueItems
  };
};
