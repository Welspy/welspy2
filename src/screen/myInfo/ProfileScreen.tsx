import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {NavigationProp, useFocusEffect, useNavigation} from '@react-navigation/native';
import Welspy from '../../hooks/Welspy.ts';
import store from '../../state/store.ts';
//@ts-ignore
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {Height, Width} from '../../config/global/dimensions.ts';
import {BottomTabNavigationType} from '../../type/navigationType/BottomTabNavigationType.ts';
import {font} from "../../config/global/font.ts";
import {MyInfoStackNavigationType} from "../../type/navigationType/MyInfoStackNavigationType.ts";
import {StackNavigationProp} from "@react-navigation/stack";

const ProfileScreen = () => {
    const navigate = useNavigation<StackNavigationProp<MyInfoStackNavigationType>>();
    const tabNavigator = useNavigation<NavigationProp<BottomTabNavigationType>>();

    const {userInfo, bankInfo} = store.userState(state => state)
    const {hookQueue, queueSequence} = store.hookState(state => state);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const [renderBankLog, setRenderBankLog] = useState<{idx: number,
        name : string,
        money : number,
        bankType : string,
        createdDateTime : string}[]>([])

    useFocusEffect(
        useCallback(() => {
            Welspy.user.getProfile()
            Welspy.bank.getMyBank()
            Welspy.bank.getBankLog()
        },[])
    )

    useEffect(() => {
        if(queueSequence[0] == "bank/log-my?GET") {
            // console.log(hookQueue[0].response.data.data)
            setRenderBankLog(hookQueue[0].response.data.data)
            store.hookState.setState({hookQueue: [], queueSequence: []});
        }
    }, [queueSequence]);



    return (
        <SafeAreaView style={styles.wrapper}>
            <BottomSheet ref={bottomSheetRef} height={Height/1.08} hasDraggableIcon={true}>
                <Text style={[styles.sectionTitle, {marginLeft: 20, marginTop: 25, fontWeight: '500'}]}>소비 내역</Text>
                <ScrollView scrollEnabled={false} style={styles.listContentWrapper}>
                    {renderBankLog.length >= 2 ? (
                        renderBankLog.map((item, idx) => (
                            <View style={styles.listContentItem} key={idx}>
                                <View style={styles.itemContentWrapper}>
                                    <Image src={"https://i.ibb.co/BP2TRGy/Frame-88.jpg"} style={styles.circle} />
                                    <View style={styles.itemTextWrapper}>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemMoney}>{item.money}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <></>
                    )}
                </ScrollView>
            </BottomSheet>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{width: Width, alignItems: 'center'}}>
                <View style={styles.profileWrapper}>
                    <View style={styles.profileContentWrapper}>
                        <Image src={userInfo?.imageUrl} style={styles.profileImage} />
                        <View style={styles.textWrapper}>
                            <Text style={font.largeFontBlack}>{userInfo.name}</Text>
                            <Text style={font.mediumFontLightGray}>{userInfo.email}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.accountWrapper}>
                    <View style={styles.accountMainWrapper}>
                        <View style={styles.accountContentWrapper}>
                            <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cb5R90SsXu0vJHdbWsXI5s3Wig-74MgsLQ&s"} style={{width: "22%", height: Height/22, marginRight: "6%", marginTop: "2%"}}/>
                            <View style={styles.accountTextWrapper}>
                                <Text style={font.mediumFontBlack}>{`${userInfo.name} 님의 계좌`}</Text>
                                <Text style={font.largeFontBlack}>{bankInfo.balance?.toLocaleString()}원</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigate.navigate('profileSend')} style={styles.chargeButton}>
                            <Text style={styles.chargeButtonText}>결제</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <Text style={[font.largeFontBlack, {alignSelf: 'flex-start', marginLeft: Width/(100/7), marginBottom: 15}]}>소비 내역</Text>
                <ScrollView scrollEnabled={false} style={styles.listContentWrapper}>
                    {renderBankLog.length >= 2 ? (
                        renderBankLog.map((item, idx) => (
                            <View style={styles.listContentItem} key={idx}>
                                <View style={styles.itemContentWrapper}>
                                    <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cb5R90SsXu0vJHdbWsXI5s3Wig-74MgsLQ&s"} style={{width: "8%", height: Height/22, marginRight: "-10%",marginLeft: 10, marginTop: "2%"}}/>
                                    <View style={styles.itemTextWrapper}>
                                        <Text style={[font.mediumFontGray, {marginBottom: 3}]}>{item.bankType == "SEND" ? "지출" : "수입"}</Text>
                                        <Text style={[font.mediumFontBlack2, {fontWeight: "500"}]}>{item.money.toLocaleString()}원</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text></Text>
                    )}
                </ScrollView>
                <View style={{height: 200}}></View>
            </ScrollView>
            {/*<Text onPress={() => {tabNavigator.navigate('tabChallenge')}}style={[font.largeFontBlack, {alignSelf: 'flex-start', marginLeft: Width/(100/5), marginTop: 30}]} >🔥 진행중인 챌린지                                  ❯</Text>*/}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    profileWrapper: {
        width: Width/(100/90),
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 70,
    },
    profileContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 40,
        backgroundColor: 'rgba(220,220,220,0.63)',
    },
    textWrapper: {
        marginLeft: 10,
    },
    profileName: {
        fontSize: 20,
    },
    profileEmail: {
        fontSize: 12,
        color: '#A0A0A0',
    },
    editButton: {
        width: 71,
        height: 40,
        backgroundColor: '#5892ff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    accountWrapper: {
        width: Width/(100/90),
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.09,
        shadowRadius: 6,
        borderRadius: 20,
        marginBottom: 50,
    },
    accountMainWrapper: {
        width: 300,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    accountContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    accountImage: {
        width: 47.5,
        height: 47.5,
    },
    accountTextWrapper: {
        marginLeft: 10,
    },
    accountText: {
        fontSize: 15,
    },
    accountBalance: {
        fontSize: 16,
    },
    chargeButton: {
        width: 71,
        height: 40,
        backgroundColor: '#538eff',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chargeButtonText: {
        color: 'white',
        fontSize: 15,
    },
    sectionTitle: {
        fontSize: 18,
        marginBottom: 20,
    },
    listContentWrapper: {
        width: Width/(100/88),
    },
    listContentItem: {
        width: 333,
        height: 50,
        marginBottom: 20,
        flexDirection: 'row',
    },
    itemContentWrapper: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#d9d9d9',
    },
    itemTextWrapper: {
        marginLeft: 70,
    },
    itemName: {
        fontSize: 16,
    },
    itemMoney: {
        fontSize: 12,
    },
    moreButton: {
        width: 95,
        height: 25,
        backgroundColor: '#e2e2e2',
        borderColor: '#a0a0a0',
        borderWidth: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ProfileScreen;
