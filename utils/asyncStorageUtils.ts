import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Clear specific key from AsyncStorage
 */
export const clearAsyncStorageKey = async (key: string): Promise<void> => {
  try {
    console.log(`🗑️ Clearing AsyncStorage key: ${key}`);
    await AsyncStorage.removeItem(key);
    console.log(`✅ AsyncStorage key cleared: ${key}`);
  } catch (error) {
    console.error(`❌ Error clearing AsyncStorage key ${key}:`, error);
    throw error;
  }
};

/**
 * Clear ALL AsyncStorage data
 */
export const clearAllAsyncStorage = async (): Promise<void> => {
  try {
    console.log("🗑️ Clearing ALL AsyncStorage data");
    await AsyncStorage.clear();
    console.log("✅ All AsyncStorage data cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing all AsyncStorage data:", error);
    throw error;
  }
};

/**
 * Get all AsyncStorage keys
 */
export const getAllAsyncStorageKeys = async (): Promise<readonly string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log("📋 All AsyncStorage keys:", keys);
    return keys;
  } catch (error) {
    console.error("❌ Error getting AsyncStorage keys:", error);
    throw error;
  }
};

/**
 * Get multiple AsyncStorage values
 */
export const getMultipleAsyncStorageValues = async (
  keys: readonly string[]
): Promise<readonly [string, string | null][]> => {
  try {
    const values = await AsyncStorage.multiGet(keys);
    console.log("📋 AsyncStorage values:", values);
    return values;
  } catch (error) {
    console.error("❌ Error getting multiple AsyncStorage values:", error);
    throw error;
  }
};

/**
 * Debug: Show all AsyncStorage data
 */
export const debugAsyncStorage = async (): Promise<void> => {
  try {
    console.log("🔍 DEBUG: AsyncStorage contents");
    const keys = await getAllAsyncStorageKeys();

    if (keys.length === 0) {
      console.log("📋 AsyncStorage is empty");
      return;
    }

    const values = await getMultipleAsyncStorageValues(keys);

    values.forEach(([key, value]) => {
      console.log(`📋 ${key}:`, value);
    });
  } catch (error) {
    console.error("❌ Error debugging AsyncStorage:", error);
  }
};

/**
 * Clear specific keys (batch operation)
 */
export const clearMultipleAsyncStorageKeys = async (
  keys: readonly string[]
): Promise<void> => {
  try {
    console.log("🗑️ Clearing multiple AsyncStorage keys:", keys);
    await AsyncStorage.multiRemove(keys);
    console.log("✅ Multiple AsyncStorage keys cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing multiple AsyncStorage keys:", error);
    throw error;
  }
};

const HISTORY_KEY = "history_recipes";

export const addToHistory = async (item) => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    let historyArr = history ? JSON.parse(history) : [];
    // Xoá trùng nếu đã có
    historyArr = historyArr.filter((i) => i.id !== item.id);
    // Thêm mới lên đầu
    historyArr.unshift(item);
    // Giới hạn số lượng (tuỳ ý, ví dụ 20)
    if (historyArr.length > 20) historyArr = historyArr.slice(0, 20);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(historyArr));
  } catch (e) {
    console.log("Error saving history", e);
  }
};

export const getHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (e) {
    return [];
  }
};
