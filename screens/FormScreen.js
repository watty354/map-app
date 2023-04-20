import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, TextInput, ScrollView, Linking } from 'react-native';
import { ButtunPrompt } from '../components/ButtunPrompt'
import { storeFormSend } from '../lib/firebase'
import { useSelector } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export const FormScreen = ({ route, navigation }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [inputText, setInputText] = useState('');
    const [userName, setName] = useState('');
    const [reportName, setReportName] = useState('');

    const clipName = useSelector((state) => state.user.displayName);
    //ログインしてるユーザを取得
    useEffect(() => {
        setName(clipName);
    }, []);

    useEffect(() => {
        if (route.params && route.params.reportUserName) {
          setReportName(route.params.reportUserName);
          setSelectedOption('suspicious_user');
          const { reportUserName } = route.params;
          setInputText(`報告するユーザー：${reportUserName.displayName}\n内容：\n`);
        }
      }, [route.params]);

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
        await storeFormSend(selectedOption, inputText, userName);
        Alert.alert('お問い合わせが送信されました。');
        navigation.navigate('Accunt');
    }

    return (
        <ScrollView style={styles.warrap}>
            {/* Twitter */}
            <View style={styles.container}>
                <View style={styles.subContainer}>
                    <Text style={styles.subtext}>\TwitterのDMからだと即座に対応できます！/</Text>
                    <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/nominau_nomi')}>
                        <FontAwesome name="twitter" size={48} color="#1DA1F2" />
                    </TouchableOpacity>
                </View>
                {/* <Text style={styles.title}>お問い合わせフォーム</Text> */}

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
                    placeholder="お問い合わせ内容を入力。不審なユーザ報告の場合は、ユーザ名も記入してください"
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
        marginTop: 60
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
    subContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32
    },
    subtext: {
        fontSize: 12,
        marginBottom: 6
    }

});
