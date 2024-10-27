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
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {Height, Width} from '../../config/global/dimensions.ts';
import store from '../../state/store.ts';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
//@ts-ignore
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {WebView} from 'react-native-webview';
import Welspy from '../../hooks/Welspy.ts';
import {ChallengeUserResponseType} from '../../type/responseType/ChallengeUserResponseType.ts';
import DismissButton from '../../component/DismissButton.tsx';
import {ChallengeProductResponseType} from "../../type/responseType/ChallengeProductResponseType.ts";
import {font} from "../../config/global/font.ts";

const ChallengeInfoScreen = () => {

    const fullNavigation = useNavigation();

    if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (Platform.OS === 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const [renderItem, setRenderItem] = useState<ChallengeResponseType>()
    const [renderProductItem, setRenderProductItem] = useState<ChallengeProductResponseType>()
    const [renderUserItem, setRenderUserItem] = useState<ChallengeUserResponseType[]>([])

    const {renderChallenge, userList, isReadyGetFull} = store.challengeState(state => state)
    const {hookQueue, queueSequence} = store.hookState(state => state)
    const {userInfo} = store.userState(state => state)

    const UserFlatListRef = useRef<FlatList>()
    const BottomSheetRef = useRef<BottomSheet>(null);

    const [isScrollEnd, setScrollEnd] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [userAvgGoal, setUserAvgGoal] = useState<number>();
    const [renderUserList, setRenderUserList] = useState<ChallengeUserResponseType[]>([])
    const [isToggleDescription, setToggleDescription] = useState<boolean>(false)

    const categoriesEnum = {
        "TRAVEL" : '여행',
        "DIGITAL" : '디지털',
        "FASHION" : '패션',
        "TOYS" : '취미',
        "INTERIOR" : '인테리어',
        "ETC" : '기타'
    }

    useEffect(() => {
        if (queueSequence[0] === "room/member?GET") {
            setRenderUserItem(hookQueue[0].response?.data?.data)
            store.challengeState.setState({userList: hookQueue[0].response?.data?.data})
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            store.hookState.setState({hookQueue : [], queueSequence : []});
        } else if (queueSequence[0] === "room/join?POST") {
            if(hookQueue[0].isSuccess) {
                Alert.alert(`${userInfo.name}님!`, "챌린지에 가입이 완료되었습니다!", [{text: "확인" ,onPress: ()=>{fullNavigation.goBack()}}])
            }
            store.hookState.setState({hookQueue : [], queueSequence : []});
        } else if (queueSequence[0] === "product?GET") {
            console.log("testetstes",hookQueue[0])
            if(hookQueue[0].isSuccess) {
                setRenderProductItem(hookQueue[0].response?.data?.data)
            }
            store.hookState.setState({hookQueue : [], queueSequence : []});
        }
    }, [queueSequence]);

    useEffect(() => {
        console.log(userList)
        setRenderUserList(userList);
        if(userList[0]) {
          setUserAvgGoal(
            Math.round(
              (Number(
                userList
                  .map(item => item.balance)
                  .reduce((a, b) => Number(a) + Number(b)),
              ) /
                userList.length /
                Number(renderItem?.goalMoney)) *
                100,
            ),
          );
        }
    }, [userList]);

    useEffect(() => {
        setRenderProductItem(renderProductItem)
    }, [renderProductItem]);

    useEffect(() => {
        console.log("adfadfasdfasdfdsa\nadfadfda\nadfadf\nadfadsf\nadfasd",renderItem)
        setRenderItem(renderItem)
    },[renderItem])

    useEffect(() => {
        setRenderUserList(renderUserItem);
        // console.log(renderUserItem)
    }, [renderUserItem]);


    useFocusEffect(
        useCallback(() => {
            store.navigationState.setState({isBottomTabVisible: false})
            console.log(renderChallenge)
            setRenderItem(renderChallenge);
            Welspy.product.getProductById(Number(renderChallenge.productId));
            Welspy.challenge.getChallengeUserList(1, 999, Number(renderChallenge?.roomId))
            return () => {
                store.navigationState.setState({isBottomTabVisible: true})
                Welspy.challenge.getMyChallenge(1)
                if(!isReadyGetFull) {
                    Welspy.challenge.getChallengeList(1, 4)
                }
            }
        },[])
    )

    useEffect(() => {
        if(renderItem?.productId) {
          Welspy.product.getProductById(renderItem?.productId);
        }
        // console.log(renderItem?.productImageUrl)
    }, [renderItem?.productId]);


    return (
        <>
            <SafeAreaView style={styles.container}>
                <BottomSheet ref={BottomSheetRef} height={Height/1.08} hasDraggableIcon>
                    <View style={[styles.container, {paddingTop: 10}]}>
                        {/*@ts-ignore*/}
                        <WebView scrollEnabled={false} source={{uri : renderProductItem?.description}} style={styles.webView}/>
                        <TouchableOpacity onPress={() => {Linking.openURL(`${renderProductItem?.description}`,);}} style={styles.infoBottom} >
                            <Text style={{fontSize: 15, fontWeight: "400", color: 'black'}}>⎋ 링크 바로가기</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
                <Image src={renderItem?.imageUrl} style={[styles.backgroundImage, {backgroundColor : isScrollEnd? "#FFF" : "", opacity: isScrollEnd ? 0 : 0.7}]}></Image>
                <ScrollView showsVerticalScrollIndicator={false} bounces={false} pagingEnabled={true} contentContainerStyle={{marginTop: 180, display: 'flex'}} onScroll={(event) => {
                    if(event.nativeEvent.contentOffset.y > 180) {
                        setScrollEnd(true);
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    } else {
                        setScrollEnd(false);
                    }
                }}>
                    <View style={styles.scrollContainer}>
                        {/*@ts-ignore*/}
                        <View style={styles.infoContainer}>
                            <View style={{width: "100%", flexDirection: 'row', height: '2.25%'}}>
                                <View style={styles.memberLimitText}>
                                    {/*@ts-ignore*/}
                                    <Text ellipsizeMode={"tail"} style={font.smallFontBlue} numberOfLines={1}>#{categoriesEnum[renderItem?.category]}</Text>
                                </View>
                                {
                                    renderProductItem?.name.split(" ").map((item, index) => (
                                        <>
                                            {(item == "Apple" || item == "MacBook" || item == "apple" || item == "iPhone" || item == "iphone" || item == "iPad" || item == "iMac" || item == "pods" || item == "맥북" || item == "맥" || item == "아이폰" || item == "기타" || item == "guitar" || item == "piano" || item == "악기"|| item == "요리" || item == "도서") &&
                                              <View key={index} style={[styles.memberLimitText]}>
                                                <Text ellipsizeMode={'tail'} style={font.smallFontBlue} numberOfLines={1}>#{item.length > 6 ? item.slice(0,3) : item}</Text>
                                              </View>
                                            }
                                        </>
                                    ))
                                }
                            </View>
                            <Text style={styles.infoTitle}>{renderItem?.title}</Text>
                            <Text style={[font.mediumFontLightGray, {marginTop: 7, textDecorationLine: 'line-through'}]}>{(renderProductItem?.price)?.toLocaleString()}원</Text>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={[font.largeFontBlue, {fontWeight: "700",marginTop: Platform.OS == 'ios' ? 2.25 : 1.25}]}>{renderProductItem?.discount}%</Text><Text style={[font.biggestFontBlack]}> {(renderProductItem?.discountedPrice)?.toLocaleString()}원</Text>
                            </View>
                            <Pressable onPress={() => {setToggleDescription(!isToggleDescription); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)}}><Text style={[styles.infoDescription, {margin: 0}]} numberOfLines={isToggleDescription ? 0 : 1}>{renderItem?.description}</Text></Pressable>
                            {
                                !isToggleDescription ? <Pressable onPress={() => {setToggleDescription(!isToggleDescription); LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)}}><Text style={[styles.infoDescription, {marginTop: 3, textDecorationLine: 'underline'}]}>더보기</Text></Pressable> : <></>
                            }
                            {
                                isScrollEnd && renderUserList.length >= 1 ? <View style={{marginTop: Platform.OS == 'ios' ? (Height/1.55) : (Height/1.65), position: 'absolute', alignSelf: 'center'}}>
                                    <Text style={styles.infoSectionTitle}>이런 사람들이 도전해요</Text>
                                    <View style={[styles.itemInfoContainer, {height: Height/4.75, flexDirection: "column", shadowOpacity: 0.05}]}>
                                    <Text style={font.mediumFontBlack}>유저 수</Text>
                                    <View style={{width: "100%", height: "25%", flexDirection: "row"}}>
                                        <Text style={font.mediumFontBlue}>{renderUserList?.length}</Text>
                                        <Text style={[{
                                            marginTop: Platform.OS == 'ios' ? 2 : 3.1
                                        }, font.smallFontLightGray]}> / {renderItem?.memberLimit}</Text>
                                    </View>
                                    <Text style={[font.smallFontBlack, {marginBottom: 4}]}>유저 평군 도달률</Text>
                                    <View style={{
                                        width: "100%",
                                        height: Platform.OS == "ios" ? Height / 37.5 : Height/32.5,
                                        alignItems: "flex-start",
                                        justifyContent: "space-around"
                                    }}>
                                        <View style={{
                                            width: "100%",
                                            backgroundColor: "#e4e4e4",
                                            height: "100%",
                                            borderRadius: Width / 22.5,
                                            overflow: 'hidden'
                                        }}>
                                            <View style={{
                                                width: `${isNaN(Number(userAvgGoal)) ? 0 : Number(userAvgGoal)}%`,
                                                height: "100%",
                                                backgroundColor: "rgba(83,142,255,0.64)",
                                                alignItems: 'flex-end',
                                                justifyContent: 'center',

                                            }}>
                                                {Number(userAvgGoal) > 15 &&
                                                    <Text style={[{marginRight: 4}, font.smallFontBlack]}>{userAvgGoal}%</Text>}
                                            </View>
                                            {
                                                !userAvgGoal ? <Text style={[{
                                                        marginLeft: 13.5,
                                                        position: 'absolute',
                                                        marginTop: 3,
                                                    }, font.smallFontBlack]}>{0}%</Text>
                                                    : Number(userAvgGoal) <= 15 && <Text style={[{
                                                    marginLeft: 5 + userAvgGoal * 3,
                                                    position: 'absolute',
                                                    marginTop: 3,
                                                }, font.smallFontBlack]}>{Math.round(userAvgGoal)}%</Text>
                                            }
                                        </View>
                                    </View>
                                </View>
                                <View style={[styles.itemInfoContainer, {
                                    height: Height / 2.6,
                                    marginTop: Height / 50,
                                    paddingHorizontal: 10
                                }]}>
                                    <View>
                                        <FlatList  showsHorizontalScrollIndicator={false} horizontal={true} pagingEnabled={true}
                                                   onScroll={(event) => {
                                                       const pageNumber = Math.floor(event.nativeEvent.contentOffset.x / (Width/1.25));
                                                       setCurrentPage(pageNumber+1);
                                                   }}
                                                   data={renderUserList
                                                        .reduce((acc, _, i) => {
                                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                        // @ts-expect-error
                                                        if (i % 5 === 0) acc.push(renderUserList.slice(i, i + 5));
                                                        return acc;}, [])}
                                                   renderItem={({ item }) => (
                                                        <View style={{
                                                            flexDirection: 'column',
                                                            width: Width / 1.15,
                                                            alignItems: "center",
                                                        }}>
                                                            {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                                                            {/*@ts-expect-error*/}
                                                            {item[0] != null && item?.map((user, index) => (
                                                                <View key={index} style={{
                                                                    flexDirection: 'row',
                                                                    width: Width / 1.25,
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                    height: Height / 14,
                                                                    marginBottom: 10
                                                                }}>
                                                                    <Image src={"https://i.ibb.co/k26Ly0G/user-1.png"} style={{
                                                                        width: "12%",
                                                                        height: Platform.OS == 'ios' ? "62.5%" : "73%",
                                                                        backgroundColor: "rgba(172,172,172,0.27)",
                                                                        borderRadius: Width / 10,
                                                                        marginTop: Platform.OS == 'ios' ? 3 : 4
                                                                    }} />
                                                                    <View style={{
                                                                        width: "83%",
                                                                        height: "100%",
                                                                        alignItems: "flex-start",
                                                                        justifyContent: "space-around"
                                                                    }}>
                                                                        <View style={{
                                                                            flexDirection: 'row',
                                                                            justifyContent: 'space-between',
                                                                            width: "97.5%",
                                                                            alignSelf: 'center',
                                                                            marginBottom: -17.5
                                                                        }}>
                                                                            <Text style={font.smallFontBlack}>{user.name}님</Text>
                                                                            <Text style={font.smallFontBlack}>{Math.round((Number(user?.balance) / Number(renderItem?.goalMoney) * 100))}%</Text>
                                                                        </View>
                                                                        <View style={{
                                                                            width: "100%",
                                                                            backgroundColor: "#e4e4e4",
                                                                            height: Platform.OS == "ios" ? Height / 37.5 : Height / 32.5,
                                                                            borderRadius: Width / 35,
                                                                            overflow: 'hidden',
                                                                            marginTop: Platform.OS == 'ios' ? 1 : 9,
                                                                        }}>
                                                                            <View style={{
                                                                                width: `${(Number(user?.balance) / Number(renderItem?.goalMoney) * 100)}%`,
                                                                                height: "100%",
                                                                                backgroundColor: "rgba(83,142,255,0.64)",
                                                                                alignItems: 'flex-end',
                                                                                justifyContent: 'center',
                                                                                overflow: 'visible',
                                                                            }}>
                                                                                {(Number(user?.balance) / Number(renderItem?.goalMoney) * 100) > 15 ?
                                                                                    <Text style={[font.smallFontBlack, { marginRight: 4 }]}>{Math.round(Number(user?.balance) / Number(renderItem?.goalMoney) * 100)}%</Text>
                                                                                    : <></>
                                                                                }
                                                                            </View>
                                                                            {user.balance == 0 ? <Text style={[{
                                                                                    marginLeft: 13.5,
                                                                                    position: 'absolute',
                                                                                    marginTop: Platform.OS == "ios" ? 3 : 2,
                                                                                }, font.smallFontBlack]}>{0}%</Text>
                                                                                : (Number(user?.balance) / Number(renderItem?.goalMoney) * 100) <= 15 &&
                                                                                <Text style={[{
                                                                                    marginLeft: 2 + ((Number(user?.balance) / Number(renderItem?.goalMoney) * 100) * 3),
                                                                                    position: 'absolute',
                                                                                    marginTop: Platform.OS == "ios" ? 3 : 2,
                                                                                }, font.smallFontBlack]}>{Math.round(Number(user?.balance) / Number(renderItem?.goalMoney) * 100)}%</Text>
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            ))}
                                                        </View>
                                                   )}
                                        keyExtractor={(item, index) => index.toString()}
                                        />
                                        <Text style={[font.smallFontGray, {alignSelf: 'center'}]}>{currentPage} / {Math.ceil(renderUserList.length / 5)}</Text>
                                    </View>
                                </View></View> : <View style={{height: 150}}></View>
                            }
                            {
                                isScrollEnd ?
                                    <TouchableOpacity onPress={() => {
                                        if(Number(renderItem?.memberLimit) <= renderUserList?.length) {
                                            Alert.alert("경고", "챌린지의 정원이 다 찼습니다!")
                                        } else {
                                            Alert.alert(`${userInfo.name}님!`, "챌린지에 가입하시겠습니까?", [{text: "확인" ,onPress: ()=>{Welspy.challenge.joinChallenge(Number(renderItem?.roomId))}}])
                                        }
                                    }} style={[styles.bottomButton, {backgroundColor: Number(renderItem?.memberLimit) > renderUserList?.length ? "#5892ff" : "#AAA", marginTop: ((Height*1.33) + (Platform.OS == 'ios' ? 0 : (-Height/80)))}]}>
                                        <Text style={[font.largeFontWhite, {marginTop: Platform.OS != 'ios' ? -3 : 0}]}>챌린지 가입하기</Text>
                                    </TouchableOpacity>
                                    : <>
                                        <TouchableOpacity onPress={() => {
                                            if(Number(renderItem?.memberLimit) <= renderUserList?.length) {
                                                Alert.alert("경고", "챌린지의 정원이 다 찼습니다!")
                                            } else {
                                                Alert.alert(`${userInfo.name}님!`, "챌린지에 가입하시겠습니까?", [{text: "확인" ,onPress: ()=>{Welspy.challenge.joinChallenge(Number(renderItem?.roomId))}}])
                                            }
                                        }} style={[styles.bottomButton, {backgroundColor: Number(renderItem?.memberLimit) > renderUserList?.length ? "#5892ff" : "#AAA", marginTop: ((Height / 1.9) + (Platform.OS == 'ios' ? 0 : (Height/15))), opacity: isScrollEnd ? 0 : 1}]}>
                                            <Text style={[font.largeFontWhite, {marginTop: Platform.OS != 'ios' ? -3 : 0}]}>챌린지 가입하기</Text>
                                        </TouchableOpacity>
                                    </>
                            }
                        </View>
                    </View>
                </ScrollView>
                <DismissButton style={{position: 'absolute', height: 70, justifyContent: "flex-start", marginTop: 40, width: Width, alignSelf: 'center', paddingHorizontal: "5%"}} onPress={() => fullNavigation.goBack()} />
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Width,
        height: Height/2,
        backgroundColor: '#f0f2f5',
    },
    scrollContainer: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: Height/2,
        backgroundColor: '#ffffff',
        height: Height * 1.7,
        borderRadius: Width / 30,
        marginTop: Height/40
    },
    backgroundImage: {
        width: Width,
        height: Height/3,
        position: 'absolute',
        opacity: 0.8,
        resizeMode: "cover",
    },
    infoContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff',
        marginTop: Height / 40,
        padding: '6%',
        paddingTop: 2,
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
        shadowOpacity: 0.25,
    },
    memberLimitText: {
        backgroundColor: '#CCDEFB',
        height: '100%',
        paddingHorizontal: 12,
        borderRadius: Width / 55,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Width / 55,
    },
    infoTitle: {
        fontSize: font.biggestFontBlack.fontSize,
        fontWeight: font.biggestFontBlack.fontWeight,
        color: 'black',
        marginTop: Height / 150,
        marginRight: 1,
    },
    infoSectionTitle: {
        fontSize: font.largeFontWhite.fontSize,
        fontWeight: font.largeFontBlack.fontWeight,
        color: 'black',
        // marginTop: Height / 40,
    },
    infoDescription: {
        fontSize: font.smallFontLightGray.fontSize,
        fontWeight: font.smallFontLightGray.fontWeight,
        color: font.smallFontLightGray.color,
        marginTop: Height / 100,
        // height:0,
    },
    infoGoalTitle: {
        fontSize: font.largeFontWhite.fontSize,
        fontWeight: font.largeFontBlack.fontWeight,
        color: 'black',
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
        shadowOpacity: 0.075,
        marginTop: 0,
    },
    bottomButton: {
        position: 'absolute',
        width: Width / 1.35,
        height: Height / 14.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5892ff',
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
