import {
    FlatList,
    Image,
    LayoutAnimation, Linking, Platform, Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity, UIManager,
    View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Height, Width} from '../../config/global/dimensions.ts';
import store from '../../state/store.ts';
import Welspy from '../../hooks/Welspy.ts';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import DismissButton from '../../component/DismissButton.tsx';
import {ChallengeUserResponseType} from '../../type/responseType/ChallengeUserResponseType.ts';
import CircleGraph from '../../component/CircleGraph.tsx';
//@ts-ignore
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {WebView} from 'react-native-webview';
import {MyChallengeResponseType} from "../../type/responseType/MyChallengeResponseType.ts";
import {ChallengeProductResponseType} from "../../type/responseType/ChallengeProductResponseType.ts";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (Platform.OS === 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

const MyChallengeInfoScreen = () => {

    const categoriesEnum = {
        "TRAVEL" : '여행',
        "DIGITAL" : '디지털',
        "FASHION" : '패션',
        "TOYS" : '취미',
        "INTERIOR" : '인테리어',
        "ETC" : '기타'
    }

    const {myChallengeList, renderMyChallenge} = store.challengeState(state => state)
    const {hookQueue, queueSequence} = store.hookState(state => state)

    const [selectedId, setSelectedId] = useState<number>(0);
    const [renderMyItem, setRenderMyItem] = useState<MyChallengeResponseType>();
    const [renderItem, setRenderItem] = useState<ChallengeResponseType>()
    const [renderProductItem, setRenderProductItem] = useState<ChallengeProductResponseType>()
    const [renderUserItem, setRenderUserItem] = useState<ChallengeUserResponseType[]>([])

    const BottomSheetRef = useRef<BottomSheet>(null);

    const fullNavigation = useNavigation();

    useEffect(() => {
        if (selectedId != 0) {
            Welspy.challenge.getChallengeById(selectedId);
        }
    }, [selectedId]);

    useEffect(() => {
        console.log(queueSequence);
        if(queueSequence[0] == "room?GET") {
            store.challengeState.setState({renderMyChallenge: [hookQueue[0]?.response?.data?.data, myChallengeList.filter(item => Number(item.roomId) == Number(selectedId))[0]]});
            store.hookState.setState({hookQueue: [], queueSequence: []});
        } else if (queueSequence[0] === "room/member?GET") {
            setRenderUserItem(hookQueue[0].response?.data.data)
            store.challengeState.setState({userList: hookQueue[0].response?.data?.data})
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
        setRenderItem(renderMyChallenge[0])
        if (renderMyChallenge[0]?.roomId) {
            Welspy.challenge.getChallengeUserList(1, 4, renderMyChallenge[0].roomId)
        }
    }, [renderMyChallenge]);

    useEffect(() => {
        console.log(fullNavigation.getState()?.routes);
        if (myChallengeList.length == 0) {
            fullNavigation.goBack();
            Welspy.challenge.getMyChallenge(1,999)
        }
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    },[fullNavigation]);
    
    useEffect(() => {
        if(renderItem?.productId) {
          Welspy.product.getProductById(renderItem.productId);
        }
    }, [renderItem])



    return (
        <>
            <SafeAreaView style={styles.container}>
                <BottomSheet ref={BottomSheetRef} height={Height/1.08} hasDraggableIcon>
                    <View style={[styles.container, {paddingTop: 10}]}>
                        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                        {/*@ts-ignore*/}
                        <WebView scrollEnabled={false} source={{uri : renderProductItem?.description}} style={styles.webView}/>
                        <TouchableOpacity onPress={() => {Linking.openURL(`${renderProductItem?.description}`,);}} style={styles.infoBottom} >
                            <Text style={{fontSize: 15, fontWeight: "400"}}>⎋ 링크 바로가기</Text>
                        </TouchableOpacity>
                    </View>
                </BottomSheet>
                {
                    renderItem?.roomId ?
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={styles.scrollContainer}>
                                <DismissButton style={{height: Height/13.5, justifyContent: "flex-start", marginTop: -10, width: Width, alignSelf: 'center', paddingHorizontal: "5%"}} onPress={() => {store.challengeState.setState({renderMyChallenge: [{},{}]});setSelectedId(0);setRenderMyItem({});setRenderItem({})}}></DismissButton>
                                <View style={{width: "100%"}}>
                                    <View style={styles.sectionHeaderContainer}>
                                        <View style={styles.category}>
                                            {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                                            {/*@ts-ignore*/}
                                            <Text ellipsizeMode={"tail"} style={{color: "#5B94F3", fontWeight: "700", fontSize: 12.75}} numberOfLines={1}>#{categoriesEnum[renderItem?.category]}</Text>
                                        </View>
                                        {
                                            renderProductItem?.name?.split(" ").map((item, index) => (
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
                                    <Text style={[styles.infoTitle, {marginBottom: Height/200}]}>{renderItem.title}</Text>
                                    <Text style={{fontSize: Width/27, marginBottom: Height/120, color: '#878787', fontWeight: "400"}}>{renderItem.description}</Text>
                                    <View style={{width: "80%", height: Height/43.5, flexDirection: "row"}}>
                                        <Image src={"https://i.ibb.co/k26Ly0G/user-1.png"} style={{width: "7%", height: "85%", marginTop: 2, marginLeft: -1.5}}/>
                                        <Text style={{fontSize: Width/24, fontWeight: '500', color: "#538eff"}}> {renderUserItem?.length}</Text>
                                        <Text style={{fontSize: Width/28, fontWeight: '300', marginTop: 2.25}}> / {renderItem?.memberLimit}</Text>
                                    </View>
                                </View>
                                <View style={[styles.userContainer, {marginTop: -12.5}]}>
                                    <View style={{flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "center"}}>
                                        <Text style={{fontSize: Width/22, fontWeight: '400'}}>챌린지 목표까지</Text>
                                    </View>
                                    <View style={{alignSelf: 'center', alignItems: "center"}}>
                                        <Text style={{fontSize: Width/16, fontWeight: '600', marginBottom: 20, color: "#538eff"}}> {Number(Number(renderItem?.goalMoney) - (Number(renderMyChallenge[1]?.balance))).toLocaleString()}원 </Text>
                                    </View>
                                    <View onLayout={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);}} style={{marginBottom: "10%"}}>
                                        <CircleGraph
                                            radius={Width/4.25}
                                            strokeWidth={Width/22.5}
                                            percentage={renderMyItem?.balance ? (renderMyItem.balance / Number(renderItem?.goalMoney)) * 100 : 100}
                                            color1={"#58b9ff"}
                                            color2={"#357bff"}
                                        />
                                    </View>
                                    <Text style={{position: "absolute", alignSelf: 'center', marginTop: 190, fontSize: 24}}>{Math.round((Number(renderMyItem?.balance) / Number(renderItem?.goalMoney)) * 100)}%</Text>
                                    <View style={{position: 'absolute', opacity: 0.8}}>
                                        <TouchableOpacity style={{width: Width/4, height: Height/8, marginHorizontal: Width/(4/3)/2/1.15, marginTop: Height/7}} onPress={() => BottomSheetRef.current.show()}>
                                            {/*<Image src={renderItem.productImageUrl} style={{width: "80%", height: "80%", alignSelf: 'center'}} />*/}
                                            {/*<Text style={{width: "135%", alignSelf: 'center', textAlign: 'center'}} numberOfLines={1}>{renderItem?.title?.split(" ").map((item)=>{return item + " "}).slice(0,2)}</Text>*/}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={{fontSize: Width/22, fontWeight: "500", marginTop: -40, marginBottom: 20}}>이 목표를 향해 가고 있어요!</Text>
                                <Pressable onPress={() => {BottomSheetRef.current.show()}} style={styles.itemInfoContainer} >
                                    <Image src={renderItem?.productImageUrl} style={{width: 100, height: 100, marginRight: 15}}></Image>
                                    <View style={{width: '70%', justifyContent: "flex-start"}}>
                                        <Text style={styles.infoGoalTitle}>{renderItem?.title}</Text>
                                        <Text style={[styles.infoGoalTitle, {marginTop: 1, fontSize: Width/29}]}>{renderItem?.goalMoney}원</Text>
                                        <Text style={[styles.infoGoalTitle, {marginTop: Height/10, marginLeft: Width/2.4, fontSize: Width/38, position: 'absolute', textDecorationLine: 'underline'}]}>자세히보기</Text>
                                    </View>
                                </Pressable>
                                <Text style={{fontSize: Width/22, fontWeight: "500", marginTop: -15}}>이 유저들이 함께 하고 있어요!</Text>
                                <View style={[styles.userContainer, {marginTop: -30}]}>
                                    <FlatList scrollEnabled={false} data={renderUserItem} renderItem={({item}) => (
                                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', height: Height/15}}>
                                            <Image src={"https://i.ibb.co/k26Ly0G/user-1.png"} style={{width: "11.5%", height: "70%", backgroundColor: "rgba(172,172,172,0.27)", borderRadius: Width/10, marginTop: 10}} />
                                            <View style={{alignItems: "flex-start", width: "83%", justifyContent: "center"}}>
                                                <View style={{flexDirection: 'row', justifyContent: "space-between", width: "100%", paddingHorizontal: 1.5}}>
                                                    <Text>{item.name}</Text>
                                                    <Text style={{marginRight: 4}}>{Math.round(Number(renderMyItem?.balance) / Number(renderItem?.goalMoney) * 100)}%</Text>
                                                </View>
                                                <View style={{width: "100%", backgroundColor: "#e4e4e4", height: "35%", borderRadius: Width/50, overflow: 'hidden', marginTop: "1.5%"}}>
                                                    <View style={{width: `${(Number(renderMyItem?.balance) / Number(renderItem?.goalMoney) * 100)}%`, height: "100%", backgroundColor: "rgba(83,142,255,0.64)", alignItems: 'flex-end', justifyContent: 'center'}}>

                                                    </View>
                                                </View>
                                                {/*<Text style={{fontSize: 14, fontWeight: '600', opacity: 0.4}}>챌린지 시작 날짜 : {`${year}.${month}.${day}`}</Text>*/}
                                            </View>
                                        </View>
                                    )}/>
                                </View>
                            </View>
                        </ScrollView>
                        : <>
                            {
                                myChallengeList.length == 0 ? <>
                                    <Text style={{fontSize: 19, alignSelf: 'center', marginTop: Height/2.5, fontWeight: "500", color: "#959595"}}>가입한 챌린지가 없습니다</Text>
                                </> :
                                    <ScrollView style={{overflow: "hidden"}} contentContainerStyle={{paddingBottom: 80}}>
                                        <Text style={{fontSize: 19.5, fontWeight: "500", color: "#000000", marginTop: 30, marginBottom: -40, marginLeft: "6%"}}>🏃 진행중인 챌린지</Text>
                                        <FlatList scrollEnabled={false} style={{marginTop: 30}} data={myChallengeList} renderItem={({item}) => (
                                            <TouchableOpacity onPress={() => {setSelectedId(Number(item.roomId)); setRenderMyItem(item)}} style={styles.selectorContainer}>
                                                <Text numberOfLines={1} style={{fontSize: Width/24, fontWeight: "500", marginTop: 15, position: 'absolute', marginLeft: 25}}>{item?.title}</Text>
                                                <Text numberOfLines={1} style={{fontSize: Width/34, fontWeight: "400", marginTop: 35, position: 'absolute', marginLeft: 25, color: "#878787"}}>{item?.description}</Text>
                                                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 35}}>
                                                    <Image src={item.productImageUrl} style={{width: Width/6, height: Height/12, marginTop: 2, marginLeft: 2, marginBottom: 5}} />
                                                    <View style={{alignItems: "center", width: "76.5%"}}>
                                                        <Text numberOfLines={2} style={{width: "85%", color: "#3c3c3c", marginTop: 10, fontSize: 13.75, alignSelf: "flex-start"}}>{item?.title}</Text>
                                                        <Text style={{width: "100%", marginTop: 2, fontSize: 13, fontWeight: "500", color: "#357bff"}}>{item.goalMoney} 원</Text>
                                                    </View>
                                                </View>
                                                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 9}}>
                                                    <View style={{width: "90%", backgroundColor: "#e4e4e4", height: "36%", borderRadius: Width/50, overflow: 'hidden'}}>
                                                        <View style={{width: `${(Number(item.balance) / Number(item?.goalMoney) * 100)}%`, height: "100%", backgroundColor: "rgba(83,142,255,0.64)", alignItems: 'flex-end', justifyContent: 'center'}}>
                                                        </View>
                                                    </View>
                                                    <Text style={{fontSize: 12}}>{Math.round(Number(item.balance) / Number(item?.goalMoney) * 100)}%</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )} />
                                    </ScrollView>
                            }
                        </>
                }
            </SafeAreaView>
        </>
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
        height: Height/4.9,
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
})

export default MyChallengeInfoScreen;