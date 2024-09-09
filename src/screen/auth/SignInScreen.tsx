import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, TouchableOpacity, Image, StyleSheet, SafeAreaView, Button} from 'react-native';
import Welspy from '../../hooks/Welspy.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {AuthStackNavigationType} from '../../type/navigationType/AuthStackNavigationType.ts';
import store from '../../state/store.ts';
import {RootStackNavigationType} from '../../type/navigationType/RootStackNavigationType.ts';

const SignInScreen = () => {
    const navigation = useNavigation<NavigationProp<AuthStackNavigationType>>();
    const rootNavigation = useNavigation<NavigationProp<RootStackNavigationType>>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const {hookQueue, queueSequence} = store.hookState(state => state)

    useEffect(() => {
        if(queueSequence[0] == "auth/sign-in?POST") {
            console.log(queueSequence);
            console.log(hookQueue);
            if(hookQueue[0].isSuccess){
                store.authState.setState({accessToken : hookQueue[0].response.data.data.accessToken, refreshToken : hookQueue[0].response.data.data.refreshToken});
                console.log(hookQueue[0].response.data.data.accessToken);
                Welspy.user.getProfile();
                Welspy.bank.getMyBank();
            }
            store.hookState.setState({queueSequence: [], hookQueue: []});
        } else if (queueSequence[queueSequence.length -1] == "bank?GET") {
            store.userState.setState({bankInfo: hookQueue[0].response.data.data});
            store.hookState.setState({queueSequence: [], hookQueue: []});
        } else if (queueSequence[queueSequence.length -1] == "user?GET") {
            store.userState.setState({userInfo: hookQueue[0].response.data.data});
            store.hookState.setState({queueSequence: [], hookQueue: []});
            Welspy.challenge.getMyChallenge();
            Welspy.challenge.getChallengeList(1, 4);
        } else if (queueSequence[queueSequence.length -1] == "room/list/my?GET") {
            if(hookQueue[hookQueue.length-1].isSuccess){
                store.challengeState.setState({myChallengeList: hookQueue[0].response.data.data.reverse()});
            }
            store.hookState.setState({queueSequence: [], hookQueue: []});
        } else if (queueSequence[queueSequence.length -1] == "room/list?GET") {
            store.challengeState.setState({currentList: [...(hookQueue[0].response.data.data).reverse(), {}]});
            store.hookState.setState({queueSequence: [], hookQueue: []});
            rootNavigation.navigate("rootTab")
        }
    }, [queueSequence]);

    return (
        <SafeAreaView style={styles.wrapper}>
            <Image src={"https://i.ibb.co/7tcnc44/Logo-small-2.png"} style={styles.mainLogo} />
            <Text style={styles.title}>로그인</Text>
            <TextInput
                style={styles.input}
                placeholder="이메일을 입력해주세요"
                autoCapitalize="none"
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호를 입력해주세요"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(text) => setPassword(text)}
                onEndEditing={(event) => {
                    Welspy.auth.signIn({email, password : event.nativeEvent.text});
                }}
            />
            <View style={styles.searchWrapper}>
                <TouchableOpacity>
                    <Text style={styles.searchId}>아이디 찾기</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.loginBtn} onPress={() => {
                Welspy.auth.signIn({email, password});
            }}>
                <Text style={styles.loginBtnText}>로그인 하기</Text>
            </TouchableOpacity>
            <View style={styles.guideWrapper}>
                <Text style={styles.guidePhrase1}>계정이 없으신가요?</Text>
                <TouchableOpacity onPress={() => {navigation.navigate('authSignUp')}}>
                    <Text style={styles.guidePhrase2}>회원가입하기</Text>
                </TouchableOpacity>
            </View>
            <Button title={"바로 로그인"} onPress={() => {Welspy.auth.signIn({email : "test@test", password : "1234"})}}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainLogo: {
        width: "34%",
        height: "17%",
        resizeMode: 'contain',
    },
    title: {
        fontSize: 40,
        fontWeight: '600',
        marginTop: 21,
    },
    input: {
        width: 333,
        height: 50,
        fontSize: 16,
        borderRadius: 10,
        paddingLeft: 17,
        marginTop: 21,
        borderWidth: 1,
        borderColor: '#ccc',
        color: '#000',
    },
    searchWrapper: {
        width: 333,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 51,
    },
    searchId: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    loginBtn: {
        width: 333,
        height: 50,
        backgroundColor: '#5892ff',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 13,
    },
    loginBtnText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
    },
    guideWrapper: {
        width: 333,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: 8,
    },
    guidePhrase1: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    guidePhrase2: {
        fontSize: 12,
        fontWeight: '600',
        color: '#5892ff',
        marginLeft: 5,
    },
});

export default SignInScreen;
