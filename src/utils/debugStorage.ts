// Debug utility to inspect localStorage contents
export const debugStorageContents = () => {
  console.log('=== STORAGE DEBUG ===');
  
  // Check if localStorage is available
  if (typeof Storage === "undefined") {
    console.log('localStorage is not supported');
    return;
  }
  
  // Get the prayer storage key content
  const STORAGE_KEY = 'getblessed_prayers';
  const rawData = localStorage.getItem(STORAGE_KEY);
  
  console.log('Raw localStorage data for key "' + STORAGE_KEY + '":', rawData);
  
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      console.log('Parsed prayers:', parsed);
      console.log('Total prayers in storage:', Array.isArray(parsed) ? parsed.length : 'Not an array');
      
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('Prayer IDs in storage:');
        parsed.forEach((p: any, index: number) => {
          console.log(`  ${index + 1}. ID: ${p.id}, Type: ${p.type}, Content: "${p.content?.substring(0, 30)}..."`);
        });
      }
    } catch (error) {
      console.log('Error parsing stored data:', error);
    }
  } else {
    console.log('No data found in localStorage for prayers');
  }
  
  console.log('=== END STORAGE DEBUG ===');
};

// Global debug function
(window as any).debugStorage = debugStorageContents;