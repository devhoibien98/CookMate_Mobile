export const PREDEFINED_INGREDIENTS = {
    animals: [
        'thịt gà',
        'thịt heo',
        'trứng',
        'vịt',
        'bơ',
        'bò'
    ],
    seafood: [
        'tôm',
        'cá',
    ],
    fruits_vegetables: [
        'hành tây',
        'gừng',
        'cà rốt',
        'rau cải',
        'hành',
        'măng',
        'nấm',
        'bắp'
    ],
};

export const CATEGORY_INFOS = [
    {
        key: 'animals',
        label: 'Main ingredients from animals',
    },
    {
        key: 'seafood',
        label: 'Seafood',
    },
    {
        key: 'fruits_vegetables',
        label: 'Fruits and Vegetables',
    },
] as const;