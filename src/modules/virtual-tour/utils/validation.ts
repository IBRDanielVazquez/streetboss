export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
  width?: number;
  height?: number;
}

/**
 * Valida un archivo de imagen para asegurar que es una panorámica equirectangular 2:1 válida.
 */
export function validate360Image(file: File, maxSizeBytes = 5 * 1024 * 1024): Promise<ImageValidationResult> {
  return new Promise((resolve) => {
    // 1. Validar formato
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return resolve({
        isValid: false,
        error: 'Formato no soportado. Debe ser JPG, PNG o WEBP.'
      });
    }

    // 2. Validar tamaño
    if (file.size > maxSizeBytes) {
      const mbLimit = (maxSizeBytes / (1024 * 1024)).toFixed(1);
      return resolve({
        isValid: false,
        error: `El archivo excede el límite de tamaño de ${mbLimit}MB.`
      });
    }

    // 3. Validar dimensiones y verificar corrupción cargando la imagen en un objeto Image
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      const aspectRatio = width / height;

      // Tolerancia pequeña de aspecto (ej. entre 1.95 y 2.05) para permitir recortes mínimos
      const isRatio2to1 = Math.abs(aspectRatio - 2.0) <= 0.05;

      if (!isRatio2to1) {
        resolve({
          isValid: false,
          error: `La imagen no cumple con la relación de aspecto equirectangular 2:1 (actualmente ${width}x${height}, ratio: ${aspectRatio.toFixed(2)}).`,
          width,
          height
        });
      } else if (width < 2048) {
        resolve({
          isValid: false,
          error: `Resolución insuficiente. La imagen debe tener al menos 2048px de ancho (actual: ${width}x${height}).`,
          width,
          height
        });
      } else {
        resolve({
          isValid: true,
          width,
          height
        });
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({
        isValid: false,
        error: 'El archivo de imagen está corrupto o no se pudo decodificar.'
      });
    };

    img.src = url;
  });
}
