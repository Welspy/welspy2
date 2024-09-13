import {
    Alert,
    FlatList,
    Image, LayoutAnimation,
    Linking, Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity, UIManager,
    View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Height, Width} from '../../config/global/dimensions.ts';
import store from '../../state/store.ts';
import {ChallengeItemStateType} from '../../type/storeType/ChallengeItemStateType.ts';
import {MyChallengeResponseType} from '../../type/responseType/MyChallengeResponseType.ts';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
//@ts-ignore
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {WebView} from 'react-native-webview';
import Welspy from '../../hooks/Welspy.ts';
import {ChallengeUserResponseType} from '../../type/responseType/ChallengeUserResponseType.ts';
import DismissButton from '../../component/DismissButton.tsx';

const ChallengeInfoScreen = () => {

    const fullNavigation = useNavigation();

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (Platform.OS === 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const [renderItem, setRenderItem] = useState<ChallengeResponseType>()
    const [renderUserItem, setRenderUserItem] = useState<ChallengeUserResponseType[]>([])

    const {renderChallenge, userList, isReadyGetFull} = store.challengeState(state => state)
    const {hookQueue, queueSequence} = store.hookState(state => state)

    const BottomSheetRef = useRef<BottomSheet>(null);

    const [isScrollEnd, setScrollEnd] = useState(false);

    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const [userAvgGoal, setUserAvgGoal] = useState<number>();

    const categoriesEnum = {
        "TRAVEL" : '여행',
        "DIGITAL" : '디지털',
        "FASHION" : '패션',
        "TOYS" : '취미',
        "INTERIOR" : '인테리어',
        "ETC" : '기타'
    }

    useEffect(() => {
        if (queueSequence[0] === "room/user-list?GET") {
            console.log("test",hookQueue[0].response?.data)
            setRenderUserItem(hookQueue[0].response?.data.data)
            store.challengeState.setState({userList: hookQueue[0].response?.data?.data})
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            store.hookState.setState({hookQueue : [], queueSequence : []});
        } else if (queueSequence[0] === "room/join?POST") {
            console.log(hookQueue[0])
            if(hookQueue[0].isSuccess) {
                Alert.alert("화이팅!", "챌린지 가입이 완료되었습니다!", [{text: "확인" ,onPress: ()=>{fullNavigation.goBack()}}])
            }
            store.hookState.setState({hookQueue : [], queueSequence : []});
        }
    }, [queueSequence]);

    useEffect(() => {
        if(userList[0]) {
          setUserAvgGoal(
            Math.round(
              (userList
                ?.map(item => item.balance)
                .reduce((prev, curr) => prev + curr) /
                (Number(renderItem?.goalAmount) * userList?.length)) *
                100,
            ),
          );
        }
    }, [userList]);


    useEffect(() => {
        // console.log(renderChallenge);
        setRenderItem(renderChallenge);
    }, [renderChallenge]);



    useEffect(() => {
        store.navigationState.setState({isBottomTabVisible: false})
        Welspy.challenge.getChallengeUserList(1, 999, Number(renderChallenge?.idx))
        return () => {
            store.navigationState.setState({isBottomTabVisible: true})
            Welspy.challenge.getMyChallenge(1)
            if(!isReadyGetFull) {
                Welspy.challenge.getChallengeList(1, 4)
            }
        }
    },[fullNavigation]);



    return (
        <>
            <SafeAreaView style={styles.container}>
                <BottomSheet ref={BottomSheetRef} height={Height/1.08} hasDraggableIcon>
                    <View style={[styles.container, {paddingTop: 10}]}>
                        {/*@ts-ignore*/}
                        <WebView scrollEnabled={false} source={{uri : renderItem?.description?.split("|//+**+//|")[2]}} style={styles.webView}/>
                        <TouchableOpacity onPress={() => {Linking.openURL(`${renderItem?.description?.split("|//+**+//|")[2]}`,);}} style={styles.infoBottom} >
                            <Text style={{fontSize: 15, fontWeight: "400"}}>⎋ 링크 바로가기</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
                <Image src={`${!isScrollEnd ? renderItem?.imageUrl : ""}`} style={[styles.backgroundImage, {backgroundColor : isScrollEnd? "#FFF" : "transparent"}]}></Image>
                <ScrollView showsVerticalScrollIndicator={false} bounces={false} pagingEnabled={true} contentContainerStyle={{marginTop: 190, display: 'flex'}} onScroll={(event) => {
                    if(event.nativeEvent.contentOffset.y > 280) {
                        setScrollEnd(true);
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    } else {
                        setScrollEnd(false);
                    }
                }}>
                    <DismissButton style={{position: 'absolute', height: 70, justifyContent: "flex-start", marginTop: -210, width: Width, alignSelf: 'center', paddingHorizontal: "5%"}} onPress={() => fullNavigation.goBack()} />
                    <View style={styles.scrollContainer}>
                        {/*@ts-ignore*/}
                        <View style={styles.infoContainer}>
                            <View style={{width: "100%", flexDirection: 'row', height: '2.25%'}}>
                                <View style={styles.memberLimitText}>
                                    {/*@ts-ignore*/}
                                    <Text ellipsizeMode={"tail"} style={{color: "#5B94F3", fontWeight: "700", fontSize: 12.75}} numberOfLines={1}>#{categoriesEnum[renderItem?.category]}</Text>
                                </View>
                                {
                                    renderItem?.title?.split("|//+**+//|")[1].split(" ").map((item, index) => (
                                        <>
                                            {(item == "Apple" || item == "MacBook" || item == "apple" || item == "iPhone" || item == "iphone" || item == "iPad" || item == "iMac" || item == "pods" || item == "맥북" || item == "맥" || item == "아이폰" || item == "기타" || item == "guitar" || item == "piano" || item == "악기"|| item == "요리" || item == "도서") &&
                                              <View key={index} style={styles.memberLimitText}>
                                                <Text ellipsizeMode={'tail'} style={{color: '#5B94F3', fontWeight: '700', fontSize: 12.75}} numberOfLines={1}>#{item.length > 6 ? item.slice(0,3) : item}</Text>
                                              </View>
                                            }
                                        </>
                                    ))
                                }
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text numberOfLines={1} style={styles.infoTitle}>{renderItem?.title?.split("|//+**+//|")[0]}</Text>
                            </View>
                            <Text style={styles.infoDescription}>{renderItem?.description?.split("|//+**+//|")[0]}</Text>
                            {
                                renderItem?.title?.split("|//+**+//|")[1] != "()()()" ?
                                    <Pressable onPress={() => {BottomSheetRef.current.show()}} style={styles.itemInfoContainer} >
                                        <Image src={renderItem?.description?.split("|//+**+//|")[1]} style={{width: 100, height: 100, marginRight: 15}}></Image>
                                        <View style={{width: '70%', justifyContent: "flex-start"}}>
                                            <Text style={styles.infoGoalTitle}>{renderItem?.title?.split("|//+**+//|")[1]}</Text>
                                            <Text style={[styles.infoGoalTitle, {marginTop: 1, fontSize: Width/29}]}>{renderItem?.goalAmount}원</Text>
                                            <Text style={[styles.infoGoalTitle, {marginTop: Height/10, marginLeft: Width/2.4, fontSize: Width/38, position: 'absolute', textDecorationLine: 'underline'}]}>자세히보기</Text>
                                        </View>
                                    </Pressable> :
                                    <View style={[styles.itemInfoContainer, {justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}]}>
                                        <Text style={{fontSize: Width/27, fontWeight: "400"}}>목표 물품이 없습니다</Text>
                                        <Text style={{fontSize: Width/27, fontWeight: "400"}}>목표 금액</Text>
                                        <Text style={{fontSize: Width/19, fontWeight: "600", color: "#538eff"}}>{renderItem.goalAmount}원</Text>
                                    </View>
                            }
                            <Text style={[styles.infoSectionTitle, {marginTop: `${isScrollEnd ? 65 : 12}%`}]}></Text>
                            <Text style={styles.infoSectionTitle}>이런 사람들이 도전해요</Text>
                            <View style={[styles.itemInfoContainer, {height: Height/4.75, flexDirection: "column", shadowOpacity: 0.03}]}>
                                <Text style={{fontSize: Width/27, fontWeight: '400'}}>유저 수</Text>
                                <View style={{width: "100%", height: "25%", flexDirection: "row"}}>
                                    <Text style={{fontSize: Width/22, fontWeight: '500', color: "#538eff"}}>{renderUserItem?.length}</Text>
                                    <Text style={{fontSize: Width/27, fontWeight: '400', marginTop: 2}}> / {renderItem?.title?.split("|//+**+//|")[2]}</Text>
                                </View>
                                <Text style={{fontSize: Width/27, fontWeight: '400'}}>유저 평군 도달률</Text>
                                <View style={{width: "100%", height: "15%", alignItems: "flex-start", justifyContent: "space-around"}}>
                                    <View style={{width: "100%", backgroundColor: "#e4e4e4", height: "100%", borderRadius: Width/22.5, overflow: 'hidden'}}>
                                        <View style={{width: `${isNaN(Number(userAvgGoal)) ? 0 : Number(userAvgGoal)}%`, height: "100%", backgroundColor: "rgba(83,142,255,0.64)", alignItems: 'flex-end', justifyContent: 'center'}}>
                                            <Text style={{marginRight: 4}}>{userAvgGoal}%</Text>
                                        </View>
                                        {
                                            !Number(userAvgGoal) && <Text style={{fontSize: Width/35 ,marginLeft: Width/30, position: 'absolute', marginTop: Height/225}}>{0}%</Text>
                                        }
                                    </View>
                                    {/*<Text style={{fontSize: 14, fontWeight: '600', opacity: 0.4}}>챌린지 시작 날짜 : {`${year}.${month}.${day}`}</Text>*/}
                                </View>
                            </View>
                            <View style={[styles.itemInfoContainer, {height: Height/2.6, marginTop: Height/50, paddingHorizontal: 10}]}>
                                <View>
                                    <FlatList scrollEnabled={false} data={renderUserItem} renderItem={({item}) => (
                                        <View style={{flexDirection: 'row', width: Width/1.25, alignItems: "center", justifyContent: "space-between", height: Height/14}}>
                                            <Text style={{fontSize: Width/23.5, fontWeight: "600"}}>{item.name}</Text>
                                            <View style={{width: "83%", height: "100%", alignItems: "flex-start", justifyContent: "space-around"}}>
                                                <View style={{width: "100%", backgroundColor: "#e4e4e4", height: "37.5%", borderRadius: Width/35, overflow: 'hidden'}}>
                                                    <View style={{width: `${(item.balance / Number(renderItem?.goalAmount) * 100)}%`, height: "100%", backgroundColor: "rgba(83,142,255,0.64)", alignItems: 'flex-end', justifyContent: 'center'}}>
                                                        <Text style={{marginRight: 4}}>{Math.round(item.balance / Number(renderItem?.goalAmount) * 100)}%</Text>
                                                    </View>
                                                    {
                                                        item.balance == 0 && <Text style={{marginLeft: 9, position: 'absolute', marginTop: 3}}>{0}%</Text>
                                                    }
                                                </View>
                                                {/*<Text style={{fontSize: 14, fontWeight: '600', opacity: 0.4}}>챌린지 시작 날짜 : {`${year}.${month}.${day}`}</Text>*/}
                                            </View>
                                        </View>
                                    )}/>
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => {
                                if(Number(renderItem?.title?.split("|//+**+//|")[2]) <= renderUserItem.length) {
                                    Alert.alert("경고", "챌린지의 정원이 다 찼습니다!")
                                } else {
                                    Welspy.challenge.joinChallenge(Number(renderItem?.idx))
                                }
                            }} style={[styles.bottomButton, {backgroundColor: Number(renderItem?.title?.split("|//+**+//|")[2]) > renderUserItem.length ? "#5892ff" : "#AAA"}]}>
                                <Text style={{fontSize: Width/20, fontWeight: '500', color : 'white'}}>챌린지 가입하기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Width,
        height: Height / 2,
        backgroundColor: '#F8F8F8',
    },
    scrollContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: Height/2,
        backgroundColor: '#F8F8F8',
        // height: Height * 1.8,
    },
    backgroundImage: {
        width: Width,
        height: Height / 2.9,
        position: 'absolute',
    },
    infoContainer: {
        width: '100%',
        height: '100%',
        borderRadius: Width / 22,
        marginTop: -Height / 35,
        backgroundColor: '#fff',
        padding: '6%',
    },
    webView: {
        width: '100%',
        height: '90%',
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
    memberLimitText: {
        backgroundColor: '#CCDEFB',
        width: '16%',
        height: '100%',
        borderRadius: Width / 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Width / 55,
    },
    infoTitle: {
        fontSize: Width / 20,
        fontWeight: '500',
        marginTop: Height / 55,
        marginRight: Width / 50,
    },
    infoSectionTitle: {
        fontSize: Width / 22,
        fontWeight: '400',
        marginTop: Height / 40,
    },
    infoDescription: {
        fontSize: Width / 29,
        fontWeight: '400',
        color: '#717171',
        marginTop: Height / 250,
    },
    infoGoalTitle: {
        fontSize: Width / 24,
        fontWeight: '500',
        color: '#393939',
        marginTop: Height / 45,
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
        marginTop: 0,
    },
    bottomButton: {
        width: Width / 1.35,
        height: Height / 14.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5892ff',
        marginTop: Height / 20,
        alignSelf: 'center',
        borderRadius: Width / 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: Width / 100,
        shadowOpacity: 0.1,
    },
});

export default ChallengeInfoScreen;