import {
    Button,
    FlatList,
    Image,
    LayoutAnimation, Linking, Platform, Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text, TextInput,
    TouchableOpacity, UIManager,
    View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {NavigationProp, useFocusEffect, useNavigation} from '@react-navigation/native';
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
import Toast from "react-native-toast-message";
import {BottomTabNavigationType} from "../../type/navigationType/BottomTabNavigationType.ts";
import {BottomTabNavigationProp} from "@react-navigation/bottom-tabs";
import {font} from "../../config/global/font.ts";

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
    const {alarmState} = store.navigationState(state => state)
    const {tabHistory} = store.navigationState(state => state)

    const [selectedId, setSelectedId] = useState<number>(0);
    const [sendMoney, setSendMoney] = React.useState<number>(0);
    const [renderMyItem, setRenderMyItem] = useState<MyChallengeResponseType>();
    const [renderItem, setRenderItem] = useState<ChallengeResponseType>()
    const [renderProductItem, setRenderProductItem] = useState<ChallengeProductResponseType>()
    const [renderUserItem, setRenderUserItem] = useState<ChallengeUserResponseType[]>([])

    const BottomSheetRef = useRef<BottomSheet>(null);
    const BottomSheetRefSend = useRef<BottomSheet>(null);

    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (selectedId != 0) {
            Welspy.challenge.getChallengeById(selectedId);
        }
    }, [selectedId]);

    const {bankInfo} = store.userState(state => state)

    useFocusEffect(
        useCallback(() => {
            Welspy.challenge.getMyChallenge(1, 50);
            store.challengeState.setState({renderMyChallenge: [{},{}]});setSelectedId(0);setRenderMyItem({});setRenderItem({})
            store.navigationState.setState({alarmState: {...alarmState, challenge: 0}})
        },[])
    )

    useEffect(() => {
        // console.log(sendMoney);
        Welspy.bank.getMyBank()
    }, [sendMoney]);

    useEffect(() => {
        if(queueSequence[0] == "room?GET") {
            store.challengeState.setState({renderMyChallenge: [hookQueue[0]?.response?.data?.data, myChallengeList.filter(item => Number(item.roomId) == Number(selectedId))[0]]});
            store.hookState.setState({hookQueue: [], queueSequence: []});
        } else if (queueSequence[0] === "room/member?GET") {
            setRenderUserItem(hookQueue[0].response?.data.data)
            store.challengeState.setState({userList: hookQueue[0].response?.data?.data})
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            store.hookState.setState({hookQueue : [], queueSequence : []});
        } else if (queueSequence[0] === "product?GET") {
            if(hookQueue[0].isSuccess) {
                setRenderProductItem(hookQueue[0].response?.data?.data)
            }
            store.hookState.setState({hookQueue : [], queueSequence : []});
        }
    }, [queueSequence]);

    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setRenderItem(renderMyChallenge[0])
        if (renderMyChallenge[0]?.roomId) {
            Welspy.challenge.getChallengeUserList(1, 4, renderMyChallenge[0].roomId)
        }
    }, [renderMyChallenge]);

    useFocusEffect(
        useCallback(() => {
            if (myChallengeList.length == 0) {
                // fullNavigation.goBack();
                Welspy.challenge.getMyChallenge(1,999)
            }
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        },[])
    )

    useEffect(() => {
        if(renderItem?.productId) {
          Welspy.product.getProductById(renderItem.productId);
        }
    }, [renderItem])

    const [modal, setModal] = React.useState<boolean>(false);

    useEffect(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [modal]);

    const navigation = useNavigation<BottomTabNavigationProp<BottomTabNavigationType>>();

    return (
        <>
            <SafeAreaView style={styles.container}>
                <BottomSheet ref={BottomSheetRefSend} height={Height/1.08} hasDraggableIcon>
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
                                            renderItem?.title?.split(" ").map((item, index) => (
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
                                    <Text style={[styles.infoTitle, {marginBottom: Height/200}]}>{renderItem?.title}</Text>
                                    <Text numberOfLines={2} style={{fontSize: Width/27, marginBottom: Height/120, color: '#878787', fontWeight: "400"}}>{renderItem?.description}</Text>
                                </View>
                                <View style={[styles.userContainer, {marginTop: -20}]}>
                                    <View style={{flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "center"}}>
                                        <Text style={{fontSize: Width/30, fontWeight: '400'}}>챌린지 목표까지</Text>
                                    </View>
                                    <View style={{alignSelf: 'center', alignItems: "center"}}>
                                        <Text style={{fontSize: Width/21, fontWeight: '600', marginBottom: 20, color: "#538eff"}}>{Number(Math.round((Number(renderItem?.goalMoney) - Number(renderMyItem?.balance))))}원</Text>
                                    </View>
                                    <View onLayout={() => {LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);}} style={{marginBottom: "10%"}}>
                                        <CircleGraph
                                            radius={Width/4.75}
                                            strokeWidth={Width/23}
                                            percentage={Number(Math.round((Number(renderMyItem?.balance) / Number(renderItem?.goalMoney)) * 100))}
                                            color1={"#58b9ff"}
                                            color2={"#357bff"}
                                        />
                                        {/*<Text style={{fontSize: Width/12.5, fontWeight: "600", alignSelf: 'center', marginTop: Height/10, position: 'absolute'}}>{0}%</Text>*/}
                                    </View>
                                    <Text style={{position: "absolute", alignSelf: 'center', marginTop: 170, fontSize: 24}}>{Math.round((Number(renderMyItem?.balance) / Number(renderItem?.goalMoney)) * 100)}%</Text>
                                    {/*    <View style={{position: 'absolute', opacity: 0.8}}>*/}
                                    {/*        <TouchableOpacity style={{width: Width/4, height: Height/8, marginHorizontal: Width/(4/3)/2/1.15, marginTop: Height/7}} onPress={() => BottomSheetRef.current.show()}>*/}
                                    {/*            <Image src={`${renderItem?.description?.split("|//+**+//|")[1]}`} style={{width: "80%", height: "80%", alignSelf: 'center'}} />*/}
                                    {/*            <Text style={{width: "135%", alignSelf: 'center', textAlign: 'center'}} numberOfLines={1}>{`${renderItem?.title?.split("|//+**+//|")[1]}`.split(" ").map((item)=>{return item + " "}).slice(0,2)}</Text>*/}
                                    {/*            <Text style={{width: "135%", alignSelf: 'center', textAlign: 'center', fontWeight: "500", fontSize: Width/16}} numberOfLines={1}>{0}%</Text>*/}
                                    {/*        </TouchableOpacity>*/}
                                    {/*    </View>*/}
                                </View>
                                <Text style={{fontSize: Width/22, fontWeight: "500", marginTop: -70, marginBottom: 10}}>이 목표를 향해 가고 있어요!</Text>
                                <View
                                    style={[
                                        styles.itemInfoContainer,
                                        {
                                            height: '21%',
                                            paddingHorizontal: 10,
                                            width: '100%',
                                            alignItems: 'flex-start',
                                            flexDirection: "column"
                                        },
                                    ]}>
                                    <View style={{flexDirection: 'row'}}>
                                        <Image
                                            src={renderProductItem?.imageUrl}
                                            style={{
                                                width: Width / 4,
                                                height: Height / 9,
                                                marginRight: 15,
                                                marginLeft: 10,
                                                backgroundColor: 'transparent',
                                                resizeMode: 'cover'
                                            }}
                                        />
                                        <View style={{width: '50%'}}>
                                            <Text
                                                numberOfLines={3}
                                                style={{
                                                    fontSize: Width / 28,
                                                    fontWeight: '500',
                                                    width: '90%',
                                                }}>
                                                {renderProductItem?.name}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Width / 38,
                                                    fontWeight: '300',
                                                    width: '60%',
                                                    color: '#777777',
                                                    textDecorationLine: "line-through",
                                                }}>
                                                {renderProductItem?.price}
                                                원
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Width / 25,
                                                    fontWeight: '600',
                                                    color: '#2e77ff',
                                                    marginTop: 5,
                                                }}>
                                                {renderProductItem?.discount}
                                                % 할인
                                            </Text>
                                            <View style={{flexDirection: 'row', width: "70%"}}>
                                                <Text
                                                    style={{
                                                        fontSize: Width / 23,
                                                        fontWeight: '500',
                                                        color: '#000000',
                                                    }}>
                                                    {renderProductItem?.discountedPrice}
                                                    원
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        width: '100%',
                                        height: '8%',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#538eff',
                                        marginTop: -20.5,
                                        borderRadius: Width / 30,
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
                                    <Text style={{fontSize: 15, color: "rgba(216,0,0,0.65)", marginLeft: "8%", marginBottom: 20, marginTop: 7, fontWeight: "600"}}>잔액이 {bankInfo.balance}원이에요.</Text>
                                }
                            </View>
                            <Toast />
                            <TouchableOpacity
                                style={{
                                    position: 'absolute',
                                    width: '88%',
                                    height: '6.75%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#538eff',
                                    borderRadius: Width / 30,
                                    alignSelf: 'center',
                                    marginTop: '167%',
                                }}
                                onPress={() => {
                                    if (Number(bankInfo.balance) < sendMoney) {
                                        Toast.show({
                                            type: "error",
                                            text1: "잔액이 부족합니다"
                                        })
                                    } else {
                                        Welspy.bank.sendMoney(selectedId ,sendMoney)
                                    }
                                }}
                            >
                                <Text
                                    style={font.mediumFontWhite}>
                                    확인
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </BottomSheet>
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
                        <ScrollView showsVerticalScrollIndicator={false} stickyHeaderHiddenOnScroll={true} stickyHeaderIndices={[1]} StickyHeaderComponent={() => (<>
                            <DismissButton style={{height: Height/13.5, justifyContent: "flex-start", marginTop: -10, width: Width, alignSelf: 'center', paddingHorizontal: "5%"}} onPress={() => {
                                console.log(navigation.getState())
                                if(tabHistory) {
                                    navigation.navigate("tabMain");
                                    store.navigationState.setState({tabHistory: false})
                                } else {
                                    store.challengeState.setState({renderMyChallenge: [{},{}]});setSelectedId(0);setRenderMyItem({});setRenderItem({})
                                }
                            }}></DismissButton>
                        </>)}>
                            <View style={styles.scrollContainer}>
                                <DismissButton style={{height: Height/13.5, justifyContent: "flex-start", marginTop: -10, width: Width, alignSelf: 'center', paddingHorizontal: "5%"}} onPress={() => {
                                    console.log(navigation.getState())
                                    if(tabHistory) {
                                        navigation.navigate("tabMain");
                                        store.navigationState.setState({tabHistory: false})
                                    } else {
                                        store.challengeState.setState({renderMyChallenge: [{},{}]});setSelectedId(0);setRenderMyItem({});setRenderItem({})
                                    }
                                }}></DismissButton>
                                <View style={{width: "100%", marginTop: Platform.OS == 'ios' ? 0 : 20}}>
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
                                    <Text style={[font.smallFontLightGray,{marginBottom: Height/120}]}>{renderItem.description}</Text>
                                    <View style={{width: "80%", height: Height/43.5, flexDirection: "row"}}>
                                        <Image src={"https://i.ibb.co/k26Ly0G/user-1.png"} style={{width: "7%", height: "85%", marginTop: 2, marginLeft: -1.5}}/>
                                        <Text style={font.mediumFontBlue}> {renderUserItem?.length}</Text>
                                        <Text style={[font.smallFontBlack,{marginTop: 2.25}]}> / {renderItem?.memberLimit}</Text>
                                    </View>
                                </View>
                                <View style={[styles.userContainer, {marginTop: -12.5}]}>
                                    <View style={{flexDirection: 'row', width: "100%", alignItems: "center", justifyContent: "center"}}>
                                        <Text style={font.largeFontBlack}>챌린지 목표까지</Text>
                                    </View>
                                    <View style={{alignSelf: 'center', alignItems: "center"}}>
                                        <Text style={[font.biggestFontBlue, {marginBottom: 20}]}> {Number(Number(renderItem?.goalMoney) - (Number(renderMyChallenge[1]?.balance))).toLocaleString()}원 </Text>
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
                                    <Text style={[font.biggestFontBlack,{position: "absolute", alignSelf: 'center', marginTop: Platform.OS == 'ios' ? 190 : 199}]}>{Math.round((Number(renderMyItem?.balance) / Number(renderItem?.goalMoney)) * 100)}%</Text>
                                    <View style={{position: 'absolute', opacity: 0.8}}>
                                        <TouchableOpacity style={{width: Width/4, height: Height/8, marginHorizontal: Width/(4/3)/2/1.15, marginTop: Height/7}} onPress={() => BottomSheetRef.current.show()}>
                                            {/*<Image src={renderItem.productImageUrl} style={{width: "80%", height: "80%", alignSelf: 'center'}} />*/}
                                            {/*<Text style={{width: "135%", alignSelf: 'center', textAlign: 'center'}} numberOfLines={1}>{renderItem?.title?.split(" ").map((item)=>{return item + " "}).slice(0,2)}</Text>*/}
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <Text style={[{marginTop: -40, marginBottom: 20}, font.largeFontBlack]}>이 목표를 향해 가고 있어요!</Text>
                                <View style={{flexDirection: 'row', height: Height/6.5, borderRadius: Width/30, alignItems: 'center', marginBottom: 40, shadowOpacity: 0.02, shadowOffset: {width: 1, height: 1},backgroundColor: 'white',shadowRadius: 20}}>
                                    <Image
                                        src={renderItem?.imageUrl}
                                        style={{
                                            width: Width / 4,
                                            height: Height / 9,
                                            marginRight: 15,
                                            marginLeft: 10,
                                            backgroundColor: 'transparent',
                                            resizeMode: 'cover'
                                        }}
                                    />
                                    <View style={{width: '50%', marginTop: -5}}>
                                        <Text
                                            numberOfLines={3}
                                            style={{
                                                fontSize: Width / 28,
                                                fontWeight: '500',
                                                width: '90%',
                                            }}>
                                            {renderProductItem?.name}
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: Width / 38,
                                                fontWeight: '300',
                                                width: '60%',
                                                color: '#777777',
                                                textDecorationLine: "line-through",
                                            }}>
                                            {renderProductItem?.price}
                                            원
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: Width / 25,
                                                fontWeight: '600',
                                                color: '#2e77ff',
                                                marginTop: 5,
                                            }}>
                                            {renderProductItem?.discount}
                                            % 할인
                                        </Text>
                                        <View style={{flexDirection: 'row', width: "70%"}}>
                                            <Text
                                                style={{
                                                    fontSize: Width / 23,
                                                    fontWeight: '500',
                                                    color: '#000000',
                                                }}>
                                                {renderProductItem?.discountedPrice}
                                                원
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={[{marginTop: -15}, font.largeFontBlack]}>이 유저들이 함께 하고 있어요!</Text>
                                <View style={[styles.userContainer, {marginTop: -30}]}>
                                    <FlatList  showsHorizontalScrollIndicator={false} horizontal={true} pagingEnabled={true}
                                               onScroll={(event) => {
                                                   const pageNumber = Math.floor(event.nativeEvent.contentOffset.x / (Width/1.25));
                                                   setCurrentPage(pageNumber+1);
                                               }}
                                               data={renderUserItem
                                                   .reduce((acc, _, i) => {
                                                       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                       // @ts-expect-error
                                                       if (i % 4 === 0) acc.push(renderUserItem.slice(i, i + 5));
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
                                </View>

                            </View>
                        </ScrollView>
                        : <>
                            {
                                myChallengeList.length == 0 ? <>
                                    <Text style={[{alignSelf: 'center', marginTop: Height/2.5}, font.largeFontLightGray]}>가입한 챌린지가 없습니다</Text>
                                </> :
                                    <ScrollView style={{overflow: "hidden"}} contentContainerStyle={{paddingBottom: 80}}>
                                        <Text style={[{marginTop: 30, marginBottom: -20, marginLeft: "6%"}, font.largeFontBlack]}>🏃 진행중인 챌린지</Text>
                                        <FlatList scrollEnabled={false} style={{marginTop: 30}} data={myChallengeList.filter((item) => {return (Number(item.balance) / Number(item.goalMoney))*100 < 100})} renderItem={({item}) => (
                                            <TouchableOpacity onPress={() => {setSelectedId(Number(item.roomId)); setRenderMyItem(item)}} style={styles.selectorContainer}>
                                                <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 15}}>
                                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                                    {/*@ts-expect-error*/}
                                                    <Image src={item?.imageUrl} style={{width: Width/5, height: Height/12, marginTop: 2, marginLeft: 2, marginBottom: 5, resizeMode: 'cover', borderRadius: 10}} />
                                                    <View style={{alignItems: "center", width: "76.5%", paddingLeft: 15}}>
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
            {/*    {*/}
            {/*        <Pressable style={{width: 60, height: modal ? 200 : 0, bottom: 130, borderRadius: 100, position: 'absolute', right: 22, backgroundColor: '#81b3ff', opacity: modal ? 1 : 0}}>*/}

            {/*        </Pressable>*/}
            {/*    }*/}
            {/*{renderItem?.roomId &&<Pressable onPress={() => setModal(!modal)} style={{width: 60, height: 60, backgroundColor: '#81b3ff', marginTop: Height-190, borderRadius: 100, position: 'absolute', right: 22, transform: [{rotate: modal ? '45deg' : '0deg'}]}}>*/}
            {/*    <Text style={{fontSize: 45, color: 'white', alignSelf: 'center', marginTop: 0, fontWeight: '300'}}>+</Text>*/}
            {/*</Pressable>}*/}

            </SafeAreaView>
        </>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    webView: {
        width: '100%',
        height: '90%',
    },
    scrollContainer: {
        width: '100%',
        height: Height*1.55,
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
        fontSize: font.largeFontBlack.fontSize,
        fontWeight:  font.largeFontBlack.fontWeight,
        color:  font.largeFontGray.color,
        alignSelf: 'flex-start'
    },
    category: {
        backgroundColor: '#CCDEFB',
        height: '100%',
        paddingHorizontal: 12,
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
        height: Height/6.5,
        borderRadius: Width / 20,
        alignSelf: 'center',
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12.5,
        },
        shadowRadius: Width / 50,
        shadowOpacity: 0.05,
        padding: Width/25,
        paddingTop: -Width/20,
        marginTop: Height / 50,
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
        fontSize: font.mediumFontBlack.fontSize,
        fontWeight:  font.mediumFontBlack.fontWeight,
        color:  font.largeFontGray.color,
        marginTop: Height / 45,
    },
    label: {
        fontSize: font.smallFontLightGray.fontSize,
        fontWeight:  font.smallFontLightGray.fontWeight,
        color:  font.largeFontBlack.color,
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
        fontSize: font.smallFontLightGray.fontSize,
        fontWeight:  font.smallFontLightGray.fontWeight,
        color:  font.largeFontBlue.color,
    }
})

export default MyChallengeInfoScreen;
