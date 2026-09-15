import { useWindowDimensions } from 'react-native';

export default function useResponsive() {
  const { width, height } = useWindowDimensions();
  const esTablet = width >= 768;

  return {
    width,
    height,
    esTablet,
    esHorizontal: width > height,
    columnas: esTablet ? 2 : 1,
    ancho: esTablet ? 320 : Math.min(width * 0.72, 300),
    paddingHorizontal: esTablet ? 32 : 16,
  };
}