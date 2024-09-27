import React, {useEffect, useState} from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import {Height, Width} from '../../config/global/dimensions.ts';
import DismissButton from '../../component/DismissButton.tsx';
import store from '../../state/store.ts';
import {it} from "@jest/globals";
import {ChallengeProductResponseType} from "../../type/responseType/ChallengeProductResponseType.ts";

const ChallengeItemSelectScreen = ({data, close = () => {console.log("test")}} : {data : ChallengeProductResponseType[], close : any}) => {
    const [selectedLink, setSelectedLink] = useState<ChallengeProductResponseType>();


    const renderItem = ({ item } : {item : any}) => (
        item == "" ? <View style={[styles.itemContainer, {backgroundColor: 'transparent'}]} key={item}>

            </View> :
        <TouchableOpacity onPress={() => setSelectedLink(item)} style={styles.itemContainer}>
            <Image src={item.imageUrl} style={styles.image} key={item.name}/>
            <View style={styles.textContainer}>
                <Text numberOfLines={2} style={styles.title}>{item.name}</Text>
                <Text style={styles.price}>{item.price}원</Text>
            </View>
        </TouchableOpacity>
    );
    const loadingRenderItem = (idx : number) => (
        <View style={styles.itemContainer} key={idx} >
            <View style={[styles.image, {backgroundColor: "rgba(170,170,170,0.64)"}]} />
            <View style={styles.textContainer}>
                <Text numberOfLines={2} style={styles.title}></Text>
                <Text style={styles.price}></Text>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            {
                data[0] ? <>
                    {selectedLink ? (
                        <View style={styles.webViewContainer}>
                            <WebView source={{uri : selectedLink.description}} style={styles.webview}/>
                            <View style={styles.infoBottom} >
                                <Text numberOfLines={3} style={styles.infoTitle}>{selectedLink.name}</Text>
                                <Text numberOfLines={3} style={styles.infoPrice}>{selectedLink.price} 원</Text>
                                <View style={styles.row}>
                                    <TouchableOpacity onPress={() => {
                                        //@ts-ignore
                                        setSelectedLink(null);
                                    }} style={styles.infoButton}>
                                        <Text style={{fontSize: Width/22, color: "#555", fontWeight: "600"}}>취소</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {
                                        store.challengeItemState.setState((prev) => ({itemList: [...prev.itemList, selectedLink]}));
                                        //@ts-ignore
                                        setSelectedLink(null);
                                        close();
                                    }} style={[styles.infoButton, {backgroundColor: "rgba(88,146,255,0.44)"}]}>
                                        <Text style={{fontSize: Width/22, color: "#555", fontWeight: "600"}}>확인</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ) : (
                        <>
                            <Text style={styles.dismissText} onPress={close}>‹</Text>
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                data={Boolean(data.length % 2) ? [...data, ""] : [data]}
                                renderItem={renderItem}
                                keyExtractor={(item) => item.title}
                                numColumns={2}
                                columnWrapperStyle={styles.row}
                                style={{width: "97%", alignSelf: 'center'}}
                            />
                        </>
                    )}
              </> : <>
                    <Text style={styles.dismissText} onPress={close}>‹</Text>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={["1","2","3","4","5","6","7","8","9","0","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27"]}
                        renderItem={(idx) => loadingRenderItem(Number(idx))}
                        numColumns={2}
                        columnWrapperStyle={styles.row}
                        style={{width: "97%", alignSelf: 'center'}}
                    />
                </>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Height/20,
    },
    dismissText: {
        fontSize: Width / 7,
        fontWeight: "200",
        marginLeft: "4%",
        marginBottom: "-2.5%",
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
    }
});

export default ChallengeItemSelectScreen;
