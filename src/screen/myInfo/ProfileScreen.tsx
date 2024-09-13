import React, {useEffect, useRef, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import Welspy from '../../hooks/Welspy.ts';
import store from '../../state/store.ts';
//@ts-ignore
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {Height} from '../../config/global/dimensions.ts';
import {BottomTabNavigationType} from '../../type/navigationType/BottomTabNavigationType.ts';

const ProfileScreen = () => {
    const navigate = useNavigation();
    const tabNavigator = useNavigation<NavigationProp<BottomTabNavigationType>>();

    const {userInfo, bankInfo} = store.userState(state => state)
    const {hookQueue, queueSequence} = store.hookState(state => state);

    const bottomSheetRef = useRef<BottomSheet>(null);

    const [renderBankLog, setRenderBankLog] = useState<{idx: number,
        name : string,
        money : number,
        bankType : string,
        createdDateTime : string}[]>([])

    useEffect(() => {
        Welspy.user.getProfile()
        Welspy.bank.getMyBank()
        Welspy.bank.getBankLog()
    }, [navigate]);


    useEffect(() => {
        if(queueSequence[0] == "bank/log?GET") {
            console.log(hookQueue[0].response.data.data)
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
            <View style={styles.profileWrapper}>
                <View style={styles.profileContentWrapper}>
                    <Image src={"https://i.ibb.co/k26Ly0G/user-1.png"} style={styles.profileImage} />
                    <View style={styles.textWrapper}>
                        <Text style={styles.profileName}>{userInfo.name}</Text>
                        <Text style={styles.profileEmail}>{userInfo.email}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.chargeButtonText}>수정</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.accountWrapper}>
                <View style={styles.accountMainWrapper}>
                    <View style={styles.accountContentWrapper}>
                        <Image src={"https://i.ibb.co/BP2TRGy/Frame-88.jpg"} style={styles.accountImage} />
                        <View style={styles.accountTextWrapper}>
                            <Text style={styles.accountText}>{`${userInfo.name} 님의 계좌`}</Text>
                            <Text style={styles.accountBalance}>{bankInfo.balance}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.chargeButton}>
                        <Text style={styles.chargeButtonText}>충전</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.sectionTitle}>소비 내역</Text>
            <ScrollView style={styles.listContentWrapper}>
                {renderBankLog.length >= 2 ? (
                    renderBankLog.slice(0, 3).map((item, idx) => (
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
            <TouchableOpacity style={styles.moreButton} onPress={() => bottomSheetRef.current.show()}>
                <Text>더 보기</Text>
            </TouchableOpacity>
            <Text onPress={() => {tabNavigator.navigate('tabChallenge')}} style={{fontSize: 21, marginTop: 35, marginLeft: 30, alignSelf: 'flex-start', fontWeight: '500'}}>🔥 진행중인 챌린지                                  ❯</Text>
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
        width: 315,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 80,
        marginBottom: 15,
    },
    profileContentWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: 45,
        height: 45,
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
        width: 345,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderRadius: 20,
        marginBottom: 50,
    },
    accountMainWrapper: {
        width: 290,
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
        width: 333,
        maxHeight: 220,
    },
    listContentItem: {
        width: 333,
        height: 50,
        marginBottom: 20,
        flexDirection: 'row',
    },
    itemContentWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    circle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#d9d9d9',
    },
    itemTextWrapper: {
        marginLeft: 10,
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
