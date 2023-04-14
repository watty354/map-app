import { async } from '@firebase/util';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { storeFormSend } from '../lib/firebase'
import { useDispatch, useSelector } from 'react-redux';
import { storeUserId, storeImage, storeName } from '../store/userSlice';

export const FormScreen = ({navigation}) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [inputText, setInputText] = useState('');
    const [userName, setName] = useState('');

    const clipName = useSelector((state) => state.user.displayName);
        //ログインしてるユーザを取得
        useEffect(() => {

            setName(clipName);
        }, []);

    const handleOptionPress = (option) => {
        setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (!selectedOption && !inputText) {
            Alert.alert('エラー', '全て入力してください');
            return;
        }

        Alert.alert('送信', '本当に送信しますか？', [
            {
                text: 'キャンセル',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            { text: 'OK', onPress: formSend },
        ]);
    };

    const formSend = async () => {
        await storeFormSend(selectedOption, inputText,userName);
        Alert.alert('成功', 'お問い合わせが送信されました。');
        navigation.navigate('Accunt');
    }

    return (
        <ScrollView style={styles.warrap}>
        <View style={styles.container}>
            <Text style={styles.title}>お問い合わせフォーム</Text>

            <Text style={styles.label}>お問い合わせ項目</Text>
            <View style={styles.optionContainer}>
                <TouchableOpacity
                    style={[
                        styles.option,
                        selectedOption === 'bug_report' && styles.selectedOption,
                    ]}
                    onPress={() => handleOptionPress('bug_report')}
                >
                    <Text
                        style={[
                            styles.optionText,
                            selectedOption === 'bug_report' && styles.selectedOptionText,
                        ]}
                    >
                        バグ報告
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.option,
                        selectedOption === 'suspicious_user' && styles.selectedOption,
                    ]}
                    onPress={() => handleOptionPress('suspicious_user')}
                >
                    <Text
                        style={[
                            styles.optionText,
                            selectedOption === 'suspicious_user' && styles.selectedOptionText,
                        ]}
                    >
                        不審なユーザ報告
                    </Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.label}>内容</Text>
            <TextInput
                multiline={true}
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="お問い合わせ内容を入力"
            />

            <ButtunPrompt action="送信" onPress={handleSubmit} />
        </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    warrap: {
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        marginTop: 100
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 18,
        marginTop: 20,
        marginBottom: 10,
        textAlign: 'left',
        alignSelf: 'stretch',
    },
    optionContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    option: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: '#EB6383',
    },
    optionText: {
        fontSize: 16,
    },
    selectedOptionText: {
        color: '#fff',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        alignSelf: 'stretch',
        marginBottom: 20,
        height: 200,
        textAlignVertical: 'top',
    },
});
