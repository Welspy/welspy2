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
import {Height, Width} from '../../config/global/dimensions.ts';
import React, {useEffect, useRef, useState} from 'react';
import store from '../../state/store.ts';
//@ts-ignore
import BottomSheet from 'react-native-gesture-bottom-sheet';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import DismissButton from '../../component/DismissButton.tsx';
import CircleGraph from '../../component/CircleGraph.tsx';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {MyChallengeResponseType} from "../../type/responseType/MyChallengeResponseType.ts";
import {ChallengeProductResponseType} from "../../type/responseType/ChallengeProductResponseType.ts";

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
    const [renderMyItem, setRenderMyItem] = useState<MyChallengeResponseType>();
    const [renderProductItem, setRenderProductItem] = useState<ChallengeProductResponseType>();

    const BottomSheetRef = useRef<BottomSheet>(null);
    useEffect(() => {
        if (selectedId != 0) {
            Welspy.challenge.getChallengeById(selectedId);
            Welspy.product.getProductById(Number(renderItem?.productId));
        }
    }, [selectedId]);

    useEffect(() => {
        if(renderItem?.productId) {
            Welspy.product.getProductById(renderItem.productId);
        }
    }, [renderItem])

    useEffect(() => {
        if(queueSequence[0] == "room?GET") {
            store.challengeState.setState({renderMyChallenge: [hookQueue[0]?.response?.data?.data, myChallengeList.filter(item => Number(item.roomId) == Number(selectedId))[0]]});
            store.hookState.setState({hookQueue: [], queueSequence: []});
        } else if (queueSequence[0] == "bank/charge?PATCH") {
            if(hookQueue[0].isSuccess) {
                Alert.alert("성공", "챌린지에 성공적으로 돈이 저축되었습니다", [{text: "확인", style: 'default', onPress: ()=>{navigation.goBack()}}])
            } else {
                Alert.alert("실패", "챌린지에 돈이 저축되지 않았습니다", [{text: "확인", style: 'default', onPress: ()=>{navigation.goBack()}}])
            }
            Welspy.bank.getMyBank();
            store.hookState.setState({hookQueue: [], queueSequence: []});
        } else if (queueSequence[0] == "product?GET") {
            if(hookQueue[0].isSuccess) {
                console.log(hookQueue[0].response?.data?.data)
              setRenderProductItem(hookQueue[0].response?.data?.data);
            }
            store.hookState.setState({hookQueue: [], queueSequence: []});
        }
    }, [queueSequence]);
    useEffect(() => {
        setRenderItem(renderMyChallenge[0])
        if (renderMyChallenge[0]?.roomId) {
        }
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
                                <Text style={{fontSize: Width/27, marginBottom: Height/120, color: '#878787', fontWeight: "400"}}>{renderItem?.description}</Text>
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
                                        height: '22%',
                                        paddingHorizontal: 10,
                                        width: '100%',
                                        alignItems: 'flex-start',
                                        flexDirection: "column"
                                    },
                                ]}>
                                <Text
                                    numberOfLines={3}
                                    style={{
                                        fontSize: Width / 28,
                                        fontWeight: '500',
                                        width: '90%',
                                        marginTop: -3,
                                        marginBottom: 5,
                                    }}>
                                    {renderProductItem?.name}
                                </Text>
                                <Pressable
                                    style={{
                                        position: 'absolute',
                                        marginLeft: 285,
                                        marginTop: 0,
                                        width: 25,
                                        height: 25,
                                    }}
                                    onPress={() => {
                                        console.log('test');
                                        store.challengeItemState.setState({itemList: []});
                                    }}>
                                    <Text style={{fontSize: 23, color: 'red'}}>⊗</Text>
                                </Pressable>
                                <View style={{flexDirection: 'row'}}>
                                    <Image
                                        src={renderProductItem?.imageUrl}
                                        style={{
                                            width: Width / 4,
                                            height: Height / 8,
                                            marginRight: 6,
                                            // marginLeft: -15,
                                            backgroundColor: 'transparent',
                                            resizeMode: 'contain'
                                        }}
                                    />
                                    <View style={{width: '51%'}}>
                                        <Text
                                            style={{
                                                fontSize: Width / 38,
                                                fontWeight: '300',
                                                width: '60%',
                                                color: '#777777',
                                                textDecorationLine: "line-through",
                                                marginTop: 6
                                            }}>
                                            {renderProductItem?.price}
                                            원
                                        </Text>
                                        <Text
                                            style={{
                                                fontSize: Width / 25,
                                                fontWeight: '600',
                                                color: '#2e77ff',
                                                marginTop: 4,
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
                                    Welspy.bank.sendMoney(selectedId ,sendMoney)
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
                    <TouchableOpacity onPress={() => {setSelectedId(Number(item.roomId)); setRenderMyItem(item); BottomSheetRef.current.show()}} style={styles.selectorContainer}>
                        <Text numberOfLines={1} style={{fontSize: Width/24, fontWeight: "500", marginTop: 15, position: 'absolute', marginLeft: 25}}>{item?.title}</Text>
                        <Text numberOfLines={1} style={{fontSize: Width/34, fontWeight: "400", marginTop: 35, position: 'absolute', marginLeft: 25, color: "#878787"}}>{item?.description}</Text>
                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 35}}>
                            <Image src={item.productImageUrl} style={{width: Width/6, height: Height/12, marginTop: 2, marginLeft: 2, marginBottom: 5}} />
                            <View style={{alignItems: "center", width: "76.5%"}}>
                                <Text numberOfLines={2} style={{width: "85%", color: "#3c3c3c", marginTop: 10, fontSize: 13.75, alignSelf: "flex-start"}}>{item?.title}</Text>
                                <Text style={{width: "100%", marginTop: 2, fontSize: 13, fontWeight: "500", color: "#357bff"}}>{Number(item?.goalMoney).toLocaleString()} 원</Text>
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