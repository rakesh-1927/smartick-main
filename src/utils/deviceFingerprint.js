// Generate a unique device fingerprint
export const getDeviceFingerprint = async () => {
  try {
    const fingerprint = {
      // Browser info
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints,
      
      // Screen info
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      screenDepth: window.screen.colorDepth,
      screenPixelDepth: window.screen.pixelDepth,
      
      // Device memory (if available)
      deviceMemory: navigator.deviceMemory || 'unknown',
      
      // Hardware concurrency
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      
      // Connection info
      connection: navigator.connection?.effectiveType || 'unknown',
      
      // Timezone
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      
      // Local storage test
      storageAvailable: isLocalStorageAvailable(),
    };

    // Create a hash from the fingerprint
    const fingerprintString = JSON.stringify(fingerprint);
    const hash = await hashString(fingerprintString);
    
    return {
      fingerprint,
      hash,
    };
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    return null;
  }
};

// Check if local storage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Hash function using SubtleCrypto
const hashString = async (str) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Store device fingerprint in local storage
export const storeDeviceFingerprint = async () => {
  const result = await getDeviceFingerprint();
  if (result) {
    localStorage.setItem('deviceFingerprint', result.hash);
    return result.hash;
  }
  return null;
};

// Retrieve stored device fingerprint
export const getStoredDeviceFingerprint = () => {
  return localStorage.getItem('deviceFingerprint');
};

// Verify current device matches stored fingerprint
export const verifyDeviceFingerprint = async () => {
  const currentFingerprint = await getDeviceFingerprint();
  const storedFingerprint = getStoredDeviceFingerprint();
  
  if (!currentFingerprint || !storedFingerprint) {
    return false;
  }
  
  return currentFingerprint.hash === storedFingerprint;
};
