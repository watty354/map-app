import React from 'react';
import { Picker } from '@react-native-picker/picker';

export const PrefecturePicker = ({ selectedPrefecture, onValueChange }) => {
    return (
        <Picker
            selectedValue={selectedPrefecture}
            onValueChange={onValueChange}
            style={{ height: 200, width: 200, }}
        >
            <Picker.Item label="東京" value="東京" />
            <Picker.Item label="大阪" value="大阪" />
            <Picker.Item label="名古屋" value="名古屋" />
            <Picker.Item label="福岡" value="福岡" />
            <Picker.Item label="札幌" value="札幌" />
        </Picker>
    );
}

export const getPrefectureLatLng = (prefecture) => {
    const coordinates = {
        '東京': { lat: 35.6895, lng: 139.6917 },
        '大阪': { lat: 34.6937, lng: 135.5023 },
        '名古屋': { lat: 35.1815, lng: 136.9066 },
        '福岡': { lat: 33.6064, lng: 130.4181 },
        '札幌': { lat: 43.0621, lng: 141.3544 },
    };

    return coordinates[prefecture];
}
