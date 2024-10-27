import {FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useCallback, useEffect, useRef} from "react";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import {font} from "../../config/global/font.ts";
import Welspy from "../../hooks/Welspy.ts";
import store from "../../state/store.ts";
import {ChallengeResponseType} from "../../type/responseType/ChallengeResponseType.ts";
import {MyChallengeResponseType} from "../../type/responseType/MyChallengeResponseType.ts";
import ItemObject from "../../component/ItemObject.tsx";
import BottomSheet from "react-native-gesture-bottom-sheet";
import {WebView} from "react-native-webview";
import {Height, Width} from "../../config/global/dimensions.ts";
import {ChallengeProductResponseType} from "../../type/responseType/ChallengeProductResponseType.ts";

const ProductionScreen = () => {

    const navigation = useNavigation().getState();

    const {queueSequence, hookQueue} = store.hookState(state => state)

    const [renderList, setRenderList] = React.useState<MyChallengeResponseType[]>([])
    const [renderItem, setRenderItem] = React.useState<MyChallengeResponseType[]>([])
    const [renderProduct, setRenderProduct] = React.useState<ChallengeProductResponseType>()

    const BottomSheetRef = useRef<BottomSheet>(null);

    const [selectedItem, setSelectedItem] = React.useState<MyChallengeResponseType>()

    useFocusEffect(
        useCallback(() => {
            store.challengeState.setState({isReadyGetFull: true})
            Welspy.challenge.getMyChallenge(1)
            return () => {
                store.challengeState.setState({isReadyGetFull: false})
            }
        },[])
    )

    useEffect(() => {
        if(queueSequence[0] == "room/my-room?GET"){
            console.log(queueSequence, hookQueue)
            if(hookQueue[0].isSuccess) {
                setRenderList(hookQueue[0].response?.data?.data)
            } else {
                setRenderList([])
            }
            store.hookState.setState({hookQueue: [], queueSequence: []});
        } else if (queueSequence[0] == "product?GET"){
            if(hookQueue[0].isSuccess) {
                setRenderProduct(hookQueue[0].response?.data?.data)
            }
            store.hookState.setState({hookQueue: [], queueSequence: []});
        }
    }, [queueSequence]);

    useEffect(() => {
        // console.log(renderList.filter((item) => {return (Number(item.balance) / Number(item.goalMoney))*100 >= 100}).map((item)=>item.roomId))
        setRenderItem(renderList.filter((item) => {return (Number(item.balance) / Number(item.goalMoney))*100 >= 100}))
    }, [renderList]);

    useEffect(() => {
        Welspy.product.getProductById(Number(selectedItem?.roomId))
    }, [selectedItem]);

    return (
        <SafeAreaView style={styles.container}>
            <BottomSheet ref={BottomSheetRef} height={Height/1.08} hasDraggableIcon={true}>
                <View style={styles.webViewContainer}>
                    {/*@ts-ignore*/}
                    {/*<WebView source={{uri : `https://store.sony.co.kr/product-view/123163746`}} style={styles.webview}/>*/}
                    <WebView source={{uri : `${renderProduct?.productUrl}`}} style={styles.webview}/>
                    <View style={styles.infoBottom} >
                        <Text numberOfLines={3} style={styles.infoTitle}>{selectedItem?.title}</Text>
                        <Text numberOfLines={3} style={styles.infoPrice}>{selectedItem?.goalMoney} 원</Text>
                        <View style={styles.row}>
                            <TouchableOpacity onPress={() => {
                                BottomSheetRef.current.close();
                            }} style={styles.infoButton}>
                                <Text style={{fontSize: Width/22, color: "#555", fontWeight: "600"}}>돌아가기</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                            }} style={[styles.infoButton, {backgroundColor: "rgba(88,146,255,0.44)"}]}>
                                <Text style={{fontSize: Width/22, color: "#555", fontWeight: "600"}}>신청</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </BottomSheet>
            <View style={[styles.container, {width: "90%", alignSelf: 'center', paddingTop: 25}]}>
                <Text style={font.largeFontBlack}>완료한 챌린지</Text>
                <View style={{marginTop: 20}}>
                    <FlatList
                        data={renderItem}
                        renderItem={({item}) => (<ItemObject item={item} onPress={() => {BottomSheetRef.current.show();setSelectedItem(item)}}/>)}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    dismissText: {
        fontSize: Width / 7,
        fontWeight: "200",
        marginLeft: "4%",
        marginBottom: "-2.5%",
        color: "#000000",
    },
    itemContainer: {
        flex: 1,
        margin: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 2,
    },
    image: {
        width: '100%',
        height: Height/8.5,
        resizeMode: 'contain',
    },
    textContainer: {
        padding: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '500',
        color: 'black'
    },
    price: {
        fontSize: 15,
        color: '#595959',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    webViewContainer: {
        width: '100%',
        height: Height,
    },
    webview: {
        flex:1,
        backgroundColor: '#fff',
        borderRadius: Width/30,
    },
    infoImage: {
        width: '60%',
        height: '30%',
    },
    infoBottom: {
        backgroundColor: '#ffffff',
        width:'100%',
        height:'31%',
        position: 'absolute',
        paddingHorizontal: Width/15,
        paddingVertical: Height/20,
        marginTop: Height/ (100 / 65),
        borderRadius: Width/10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -5,
        },
        shadowRadius: Width / 6,
        shadowOpacity: 0.2,
    },
    infoTitle: {
        fontSize: Width/21,
        fontWeight: '500',
        color: 'black',
    },
    infoPrice: {
        fontSize: Width/23,
        fontWeight: '500',
        letterSpacing: 0.2,
        color: '#737373',
    },
    infoButton: {
        width: "45%",
        height: Height/14,
        backgroundColor: '#e1e1e1',
        marginTop: Height/40,
        borderRadius: Width/40,
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default ProductionScreen
