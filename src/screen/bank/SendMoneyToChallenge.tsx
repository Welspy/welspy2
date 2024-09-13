import {
    Alert,
    FlatList,
    Image, LayoutAnimation,
    Pressable, SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Welspy from '../../hooks/Welspy.ts';
import ChallengeList from '../../component/challengeList/ChallengeList.tsx';
import {Height, Width} from '../../config/global/dimensions.ts';
import React, {useEffect, useRef} from 'react';
import store from '../../state/store.ts';
//@ts-ignore
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import DismissButton from '../../component/DismissButton.tsx';
import CircleGraph from '../../component/CircleGraph.tsx';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

const SendMoneyToChallenge = () => {

    const categoriesEnum = {
        "TRAVEL" : '여행',
        "DIGITAL" : '디지털',
        "FASHION" : '패션',
        "TOYS" : '취미',
        "INTERIOR" : '인테리어',
        "ETC" : '기타'
    }

    const {myChallengeList, renderMyChallenge} = store.challengeState(state => state)
    const {bankInfo} = store.userState(state => state)
    const {hookQueue, queueSequence} = store.hookState(state => state)

    const navigation = useNavigation();

    const scrollViewRef = useRef<ScrollView>(null);

    const [selectedId, setSelectedId] = React.useState<number>(0);
    const [sendMoney, setSendMoney] = React.useState<number>(0);
    const [renderItem, setRenderItem] = React.useState<ChallengeResponseType>();

    const BottomSheetRef = useRef<BottomSheet>(null);
    useEffect(() => {
        if (selectedId != 0) {
            Welspy.challenge.getChallengeById(selectedId);
        }
    }, [selectedId]);

    useEffect(() => {
        console.log(queueSequence);
        if(queueSequence[0] == "room?GET") {
            store.challengeState.setState({renderMyChallenge: [hookQueue[0]?.response?.data?.data, myChallengeList?.filter(item => Number(item.roomId) == Number(selectedId))[0]]});
            store.hookState.setState({hookQueue: [], queueSequence: []});
        } else if (queueSequence[0] == "bank/to-room?PATCH") {
            if(hookQueue[0].isSuccess) {
                Alert.alert("성공", "챌린지에 성공적으로 돈이 저축되었습니다", [{text: "확인", style: 'default', onPress: ()=>{navigation.goBack()}}])
            } else {
                Alert.alert("실패", "챌린지에 돈이 저축되지 않았습니다", [{text: "확인", style: 'default', onPress: ()=>{navigation.goBack()}}])
            }
            Welspy.bank.getMyBank()
            store.hookState.setState({hookQueue: [], queueSequence: []});
        }
    }, [queueSequence]);
    useEffect(() => {
        setRenderItem(renderMyChallenge[0])
    }, [renderMyChallenge]);

    useEffect(() => {
        console.log(sendMoney);
        Welspy.bank.getMyBank()
    }, [sendMoney]);

    return (
        <SafeAreaView>
            <DismissButton onPress={() => {navigation.goBack()}} />
            <BottomSheet ref={BottomSheetRef} height={Height/1.08} hasDraggableIcon>
                <ScrollView ref={scrollViewRef} horizontal={true} contentContainerStyle={{width:Width*2, height:Height}}>
                    <View style={{width: Width, height: Height}}>
                        <View style={styles.scrollContainer}>
                            <View style={{width: "100%"}}>
                                <View style={styles.sectionHeaderContainer}>
                                    <View style={styles.category}>
                                        {/*@ts-ignore*/}
                                        <Text ellipsizeMode={"tail"} style={{color: "#5B94F3", fontWeight: "700", fontSize: 12.75}} numberOfLines={1}>#{categoriesEnum[renderItem?.category]}</Text>
                                    </View>
                                    {
                                            renderItem?.title?.split("|//+**+//|")[1].split(" ").map((item, index) => (
                                                <>
                                                    {(item == "Apple" || item == "MacBook" || item == "apple" || item == "iPhone" || item == "iphone" || item == "iPad" || item == "iMac" || item == "pods" || item == "맥북" || item == "맥" || item == "아이폰" || item == "기타" || item == "guitar" || item == "piano" || item == "악기"|| item == "요리" || item == "도서") &&
                                                      <View key={index} style={styles.category}>
                                                        <Text ellipsizeMode={'tail'} style={{color: '#5B94F3', fontWeight: '700', fontSize: 12.75}} numberOfLines={1}>#{item.length > 6 ? item.slice(0,3) : item}</Text>
                                                      </View>
                                                    }
                                                </>
                                            ))
                                        }
                                </View>
                                <Text style={[styles.infoTitle, {marginBottom: Height/200}]}>{renderItem?.title?.split("|//+**+//|")[0]}</Text>
                                <Text style={{fontSize: Width/27, marginBottom: Height/120, color: '#878787', fontWeight: "400"}}>{renderItem?.description?.split("|//+**+//|")[0]}</Text>
                            </View>
                            <View style={[styles.userContainer, {marginTop: -20}]}>
                                <View style={{flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "center"}}>
                                    <Text style={{fontSize: Width/30, fontWeight: '400'}}>챌린지 목표까지</Text>
                                </View>
                                    <View style={{alignSelf: 'center', alignItems: "center"}}>
                                        <Text style={{fontSize: Width/21, fontWeight: '600', marginBottom: 20, color: "#538eff"}}> {Number(Number(renderItem?.goalAmount) - (Number(renderMyChallenge[1]?.balance))).toLocaleString()}원 </Text>
                                    </View>
                                    <View onLayout={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);}} style={{marginBottom: "10%"}}>
                                        <CircleGraph
                                            radius={Width/5}
                                            strokeWidth={Width/23}
                                            percentage={renderMyChallenge[1]?.balance ? (Number(renderMyChallenge[1]?.balance) / Number(renderItem?.goalAmount)) * 100 : 100}
                                            color1={"#58b9ff"}
                                            color2={"#357bff"}
                                        />
                                        {/*<Text style={{fontSize: Width/12.5, fontWeight: "600", alignSelf: 'center', marginTop: Height/10, position: 'absolute'}}>{0}%</Text>*/}
                                    </View>
                                    <Text style={{position: "absolute", alignSelf: 'center', marginTop: 170, fontSize: 18}}>{Math.round((Number(renderMyChallenge[1]?.balance) / Number(renderItem?.goalAmount)) * 100)}%</Text>
                                    {/*    <View style={{position: 'absolute', opacity: 0.8}}>*/}
                                    {/*        <TouchableOpacity style={{width: Width/4, height: Height/8, marginHorizontal: Width/(4/3)/2/1.15, marginTop: Height/7}} onPress={() => BottomSheetRef.current.show()}>*/}
                                    {/*            <Image src={`${renderItem?.description?.split("|//+**+//|")[1]}`} style={{width: "80%", height: "80%", alignSelf: 'center'}} />*/}
                                    {/*            <Text style={{width: "135%", alignSelf: 'center', textAlign: 'center'}} numberOfLines={1}>{`${renderItem?.title?.split("|//+**+//|")[1]}`.split(" ").map((item)=>{return item + " "}).slice(0,2)}</Text>*/}
                                    {/*            <Text style={{width: "135%", alignSelf: 'center', textAlign: 'center', fontWeight: "500", fontSize: Width/16}} numberOfLines={1}>{0}%</Text>*/}
                                    {/*        </TouchableOpacity>*/}
                                    {/*    </View>*/}
                                </View>
                                <Text style={{fontSize: Width/22, fontWeight: "500", marginTop: -70, marginBottom: 10}}>이 목표를 향해 가고 있어요!</Text>
                                <Pressable onPress={() => {BottomSheetRef.current.show()}} style={styles.itemInfoContainer} >
                                    <Image src={renderItem?.description?.split("|//+**+//|")[1]} style={{width: 100, height: 100, marginRight: 15}}></Image>
                                    <View style={{width: '70%', justifyContent: "flex-start"}}>
                                        <Text style={styles.infoGoalTitle}>{renderItem?.title?.split("|//+**+//|")[1]}</Text>
                                        <Text style={[styles.infoGoalTitle, {marginTop: 1, fontSize: Width/29}]}>{renderItem?.goalAmount}원</Text>
                                        <Text style={[styles.infoGoalTitle, {marginTop: Height/10, marginLeft: Width/2.4, fontSize: Width/38, position: 'absolute', textDecorationLine: 'underline'}]}>자세히보기</Text>
                                    </View>
                                </Pressable>
                                <TouchableOpacity
                                    style={{
                                        width: '100%',
                                        height: '8.5%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#538eff',
                                        borderRadius: Width / 50,
                                    }}
                                    onPress={() => {
                                        scrollViewRef.current?.scrollTo({
                                            x: Width,
                                            animated: true,
                                        });
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: '#FFF',
                                            fontSize: Width / 24,
                                            fontWeight: '500',
                                        }}>
                                        해당 챌린지에 저축
                                    </Text>
                                </TouchableOpacity>
                            </View>
                    </View>
                    <View style={{width: Width, height: Height}}>
                        <DismissButton
                            onPress={() => {
                                scrollViewRef.current?.scrollTo({
                                    x: 0,
                                    animated: true,
                                })
                            }}></DismissButton>
                        <View>
                            <Text style={styles.label}>입금 금액</Text>
                            <TextInput
                                style={[styles.input, {alignSelf: "center"}]}
                                placeholder={"송금할 금액을 입력하세요"}
                                autoCapitalize="none"
                                onChangeText={(text) => setSendMoney(Number(text))}
                                keyboardType="numeric"
                            />
                            {
                                Number(bankInfo.balance) < sendMoney &&
                                <Text style={{fontSize: 15, color: "rgba(216,0,0,0.65)", marginLeft: "6.5%", marginBottom: 20, marginTop: 10, fontWeight: "600"}}>잔액이 {bankInfo.balance}원이에요.</Text>
                            }
                        </View>
                        <Toast />
                        <TouchableOpacity
                            style={{
                                width: '88%',
                                height: '6.75%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#538eff',
                                borderRadius: Width / 50,
                                alignSelf: 'center',
                                marginTop: '100%',
                            }}
                            onPress={() => {
                                if (Number(bankInfo.balance) < sendMoney) {
                                    Toast.show({
                                        type: "error",
                                        text1: "잔액이 부족합니다"
                                    })
                                } else {
                                    Welspy.bank.sendBankLog(sendMoney, "SEND", "챌린지 충전")
                                    store.challengeState.setState(prev => ({bankList: [...prev.bankList, {id: Number(renderItem?.idx), balance: sendMoney}]}))
                                }
                            }}
                        >
                            <Text
                                style={{
                                    color: '#FFF',
                                    fontSize: Width / 24,
                                    fontWeight: '500',
                                }}>
                                확인
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </BottomSheet>
            <ScrollView style={{overflow: "hidden", marginTop: -30}} contentContainerStyle={{paddingBottom: 80}}>
                <Text style={{fontSize: 19.5, fontWeight: "500", color: "#000000", marginTop: 40, marginBottom: -30, marginLeft: "6%"}}>충전할 챌린지 선택</Text>
                <FlatList scrollEnabled={false} style={{marginTop: 30}} data={myChallengeList} renderItem={({item}) => (
                    <TouchableOpacity onPress={() => {setSelectedId(Number(item.roomId));BottomSheetRef.current.show()}} style={styles.selectorContainer}>
                        <Text numberOfLines={1} style={{fontSize: Width/25, fontWeight: "400", marginTop: 15, position: 'absolute', marginLeft: 20}}>{item?.title?.split("|//+**+//|")[0]}</Text>
                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 22}}>
                            <Image src={item.description?.split("|//+**+//|")[1]} style={{width: Width/5, height: Height/10, marginTop: -4}}/>
                            <View style={{alignItems: "center", width: "72.5%"}}>
                                <Text numberOfLines={2} style={{width: "85%", color: "#3c3c3c", marginTop: 10, fontSize: 13.75, alignSelf: "flex-start"}}>{item?.title?.split("|//+**+//|")[1]}</Text>
                                <Text style={{width: "100%", marginTop: 2, fontSize: 13, fontWeight: "500", color: "#357bff"}}>{item.goalAmount} 원</Text>
                            </View>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 9}}>
                            <View style={{width: "90%", backgroundColor: "#e4e4e4", height: "25%", borderRadius: Width/50, overflow: 'hidden'}}>
                                <View style={{width: `${(Number(item?.balance) / Number(item?.goalAmount) * 100)}%`, height: "100%", backgroundColor: "rgba(83,142,255,0.64)", alignItems: 'flex-end', justifyContent: 'center'}}>
                                </View>
                            </View>
                            <Text style={{fontSize: 12, marginTop: -5}}>{Math.round(Number(item?.balance) / Number(item?.goalAmount) * 100)}%</Text>
                        </View>
                    </TouchableOpacity>
                )} />
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    webView: {
        width: '100%',
        height: '90%',
    },
    scrollContainer: {
        width: '100%',
        // height: Height*1.3,
        padding: "6.5%"
    },
    sectionHeaderContainer: {
        flexDirection: 'row',
        width: '100%',
        height: Height/35,
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        marginBottom: "2.25%",
    },
    section: {
        height: '60%',
        borderTopStartRadius: Width/30,
        borderTopEndRadius: Width/30,
        backgroundColor: 'rgba(119,119,119,0.25)',
    },
    infoTitle: {
        fontSize: Width / 18,
        fontWeight: "600",
        alignSelf: 'flex-start',
        color: "#222"
    },
    category: {
        backgroundColor: '#CCDEFB',
        width: '16%',
        height: '100%',
        borderRadius: Width / 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Width / 55,
    },
    userContainer: {
        width: "103%",
        alignSelf: 'center',
        marginBottom: Height / 45,
        padding: Width / 90,
        borderRadius: Width / 30,
        overflow: 'visible',
        paddingTop: Height/20,
        paddingBottom: Height/20,
        marginTop: 10
    },
    infoBottom: {
        backgroundColor: '#ffffff',
        width: '40%',
        height: '8%',
        position: 'absolute',
        marginLeft: Width / 1.9,
        marginTop: Height / (100 / 75),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Width / 17.5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: Width / 50,
        shadowOpacity: 0.125,
    },
    selectorContainer: {
        width: '90%',
        height: Height/5.7,
        borderRadius: Width / 20,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12.5,
        },
        shadowRadius: Width / 50,
        shadowOpacity: 0.045,
        padding: Width/25,
        marginTop: Height / 35,
    },
    itemInfoContainer: {
        flexDirection: 'row',
        width: '102%',
        alignSelf: 'center',
        height: Height/6,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        padding: Width / 20,
        borderRadius: Width / 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: Width / 80,
        shadowOpacity: 0.07,
        marginBottom: 60,
    },
    infoGoalTitle: {
        fontSize: Width / 24,
        fontWeight: '500',
        color: '#393939',
        marginTop: Height / 45,
    },
    label: {
        fontSize: 20,
        fontWeight: "700",
        alignSelf: "flex-start",
        marginLeft: "9.5%",
        marginTop: 40,
        marginBottom: 5,
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 13,
        paddingTop: 15,
        width: '87%',
        fontSize: 19,
        fontWeight: '500',
    }
})

export default SendMoneyToChallenge;