import React from 'react';
import { TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface FavoriteButtonProps {
    isFavorite: boolean;
    onPress: () => void;
    size?: number;
    style?: StyleProp<ViewStyle>;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onPress, size = 22, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={style} activeOpacity={0.7}>
            <FontAwesome
                name={isFavorite ? 'heart' : 'heart-o'}
                size={size}
                color={isFavorite ? '#F55' : '#888'}
            />
        </TouchableOpacity>
    );
};

export default FavoriteButton; 