import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import {AuthStackNavigationType} from '../type/navigationType/AuthStackNavigationType.ts';
import {NavigationProp} from '@react-navigation/native';
const OnBoarding = ({navigation} : {navigation : NavigationProp<AuthStackNavigationType>}) => {
  return (
    <View style={styles.wrapper}>
      <Image
        src={'https://i.ibb.co/7tcnc44/Logo-small-2.png'}
        style={styles.mainLogo}
      />
      <Text style={styles.appTitle}>Welspy</Text>
      <TouchableOpacity style={styles.loginBtn} onPress={() => {navigation.navigate("authSignIn")}}>
        <Text style={styles.loginBtnText}>로그인</Text>
      </TouchableOpacity>
      <View style={styles.guideWrapper}>
        <Text style={styles.guidePhrase1}>계정이 없으신가요?</Text>
        <TouchableOpacity onPress={() => {navigation.navigate("authSignUp")}}>
          <Text style={styles.guidePhrase2}>회원가입하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 393,
    height: 852,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainLogo: {
    width: 146,
    height: 152,
    resizeMode: 'contain',
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '700',
    color: '#5892ff',
    marginTop: 20,
    marginBottom: 10,
  },
  loginBtn: {
    width: 333,
    height: 50,
    backgroundColor: '#5892ff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'white',
  },
  guideWrapper: {
    width: 328,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  guidePhrase1: {
    fontSize: 12,
    fontWeight: '600',
  },
  guidePhrase2: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5892ff',
    marginLeft: 5,
  },
});

export default OnBoarding;
