# Fix: Favorites không được clear khi logout

## Vấn đề

Khi userA logout và userB login, favorites của userA vẫn còn trong favorites của userB. Điều này xảy ra vì favorites được lưu trong AsyncStorage với key `'favoriteRecipes'` và không được clear khi logout.

## Giải pháp

### 1. Cập nhật AuthContext

- Thêm `await AsyncStorage.removeItem('favoriteRecipes');` trong hàm `signOut`
- Đảm bảo favorites được clear khi user logout

### 2. Cập nhật useFavorites hook

- Thêm function `clearFavoritesOnLogout()` để clear favorites và reset state
- Function này được gọi khi user logout

### 3. Cập nhật UserProfile

- Import `useFavorites` hook
- Gọi `clearFavoritesOnLogout()` trước khi gọi `signOut()`
- Đảm bảo favorites được clear trước khi logout

## Code changes

### AuthContext.tsx

```typescript
const signOut = async () => {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("user");
  // Clear favorites when user logs out
  await AsyncStorage.removeItem("favoriteRecipes");
  setToken(null);
  setUser({
    userId: "",
    username: "",
    email: "",
    role: "",
    isDeleted: false,
  });
};
```

### useFavorites.ts

```typescript
// Clear favorites and reset state (for logout)
const clearFavoritesOnLogout = React.useCallback(async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setFavorites([]);
    setIsLoading(false);
    console.log("Favorites cleared on logout");
  } catch (error) {
    console.error("Error clearing favorites on logout:", error);
  }
}, []);
```

### UserProfile.tsx

```typescript
const { clearFavoritesOnLogout } = useFavorites();

<TouchableOpacity
    style={styles.logoutRow}
    onPress={async () => {
        await clearFavoritesOnLogout();
        await signOut();
    }}
>
```

## Testing

- UserA login và thêm favorites
- UserA logout
- UserB login
- Kiểm tra favorites của UserB không có favorites của UserA

## Lưu ý

- Favorites được refresh tự động khi navigate đến màn hình favorites (useFocusEffect)
- Không cần thêm logic đặc biệt cho login vì favorites sẽ được load lại từ AsyncStorage
