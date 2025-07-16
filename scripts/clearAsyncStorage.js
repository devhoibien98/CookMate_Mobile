/**
 * Script to clear AsyncStorage data
 * Run this in React Native debugger console or Metro console
 */

// Import AsyncStorage
const AsyncStorage = require('@react-native-async-storage/async-storage').default;

// Clear specific key
async function clearKey(key) {
    try {
        await AsyncStorage.removeItem(key);
        console.log(`✅ Cleared key: ${key}`);
    } catch (error) {
        console.error(`❌ Error clearing key ${key}:`, error);
    }
}

// Clear all AsyncStorage
async function clearAll() {
    try {
        await AsyncStorage.clear();
        console.log('✅ All AsyncStorage data cleared');
    } catch (error) {
        console.error('❌ Error clearing all AsyncStorage:', error);
    }
}

// Debug - show all data
async function debugStorage() {
    try {
        const keys = await AsyncStorage.getAllKeys();
        console.log('📋 AsyncStorage keys:', keys);

        if (keys.length > 0) {
            const values = await AsyncStorage.multiGet(keys);
            values.forEach(([key, value]) => {
                console.log(`📋 ${key}:`, value);
            });
        } else {
            console.log('📋 AsyncStorage is empty');
        }
    } catch (error) {
        console.error('❌ Error debugging AsyncStorage:', error);
    }
}

// Clear favorites only
async function clearFavorites() {
    await clearKey('favoriteRecipes');
}

// Export for use in console
if (typeof global !== 'undefined') {
    global.clearAsyncStorage = clearAll;
    global.clearKey = clearKey;
    global.debugAsyncStorage = debugStorage;
    global.clearFavorites = clearFavorites;
}

// Example usage:
// clearAsyncStorage();     // Clear all
// clearFavorites();        // Clear favorites only
// debugAsyncStorage();     // Show all data
// clearKey('someKey');     // Clear specific key

console.log(`
🔧 AsyncStorage Debug Tools loaded!

Available commands:
• clearAsyncStorage()     - Clear ALL AsyncStorage data
• clearFavorites()        - Clear favorites only
• debugAsyncStorage()     - Show all stored data
• clearKey('keyName')     - Clear specific key

Examples:
clearAsyncStorage();
clearFavorites();
debugAsyncStorage();
clearKey('favoriteRecipes');
`); 