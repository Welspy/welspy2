import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import {Height, Width} from '../../config/global/dimensions.ts';
import store from '../../state/store.ts';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationType} from '../../type/navigationType/BottomTabNavigationType.ts';
import {font} from "../../config/global/font.ts";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
export const ChallengeObject = ({item, create} : {item: ChallengeResponseType, create: any}) => {

    const category = {
        "DIGITAL" : "https://i.ibb.co/CQqxftX/Mobile-Phone.png",
        "TRAVEL" : "https://i.ibb.co/j3WwhKM/Desert-Island.png",
        "FASHION" : "https://i.ibb.co/vXsRpHK/Billed-Cap.png",
        "TOYS" : "https://i.ibb.co/C6tJhqp/Badminton.png",
        "INTERIOR" : "https://i.ibb.co/vdjN1Xt/Couch-and-Lamp.png",
        "ETC" : "https://i.ibb.co/RyYQTbS/dollar.png"
    }

    const navigation = useNavigation();

    const tabNavigation = useNavigation<NavigationProp<BottomTabNavigationType>>();

    const categoriesEnum = {
        "TRAVEL" : '여행',
        "DIGITAL" : '디지털',
        "FASHION" : '패션',
        "TOYS" : '취미',
        "INTERIOR" : '인테리어',
        "ETC" : '기타'
    }

    const {myChallengeList} = store.challengeState(state => state)

    return (
        <TouchableOpacity style={styles.container} onPress={() => {
            if (item.roomId) {
                // console.log(myChallengeList.map((item) => {return item.roomId}))
                if (myChallengeList.map((item) => {return item.roomId}).includes(item.roomId)) {
                    store.challengeState.setState({renderMyChallenge: [item, myChallengeList.filter((e => e.roomId == item.roomId))[0]]})
                    tabNavigation.navigate('tabChallenge')
                    store.navigationState.setState({tabHistory: true})
                    // console.log("test", item)
                    // console.log("test1", myChallengeList.filter((e => e.roomId == item.idx)))
                } else {
                    store.challengeState.setState(({renderChallenge: item}))
                    if (navigation.getState()?.routeNames.includes("mainChallenge")) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-expect-error
                        navigation.navigate('mainChallenge')
                    } else if (navigation.getState()?.routeNames.includes("searchChallenge")) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-ignore
                        navigation.navigate('searchChallenge')
                    }
                }
            } else {
                if (navigation.getState()?.routeNames.includes("mainChallenge")) {
                    tabNavigation.navigate('tabSearch')
                } else {
                    create();
                }
            }
        }}>
            {/*{item.isAi && <Text style={[font.smallFontGray, {position: 'absolute', right: 24, marginTop: 7}]}>Ai 추천</Text>}*/}
            {item.roomId?<>
                <View style={styles.header}>
                    {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                    {/*@ts-ignore*/}
                    <Image style={[styles.challengeIcon, {height: Platform.OS == 'ios' ? "50%" : "47%"}]} src={`${category[item?.category]}`}/>
                </View>
                <View style={styles.content}>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.titleText}>{item.title?.split("|//+**+//|")[0]}</Text>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.descriptionText}>{item.description?.split("|//+**+//|")[0]}</Text>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[font.mediumFontBlack2, {marginTop: Platform.OS == 'ios' ? 0 : 0, fontWeight: Platform.OS == 'ios' ? "600" : "500", color: font.biggestFontBlue.color}]}>{`10%`} </Text>
                        <Text style={[font.mediumFontBlack2, {marginTop: Platform.OS == 'ios' ? 0 : 0, fontWeight: Platform.OS == 'ios' ? "600" : "500"}]}>{`${(item.goalMoney)?.toLocaleString()}원`}</Text>
                    </View>
                </View>
                <View style={styles.footer}>
                    <View style={styles.memberLimitText}>
                        {/*eslint-disable-next-line @typescript-eslint/ban-ts-comment*/}
                        {/*@ts-ignore*/}
                        <Text style={{fontSize: Width/32, color: "#538eff"}}>{item.currentMember}명 참여중</Text>
                    </View>
                </View>
            </> : <>
                {
                    navigation.getState()?.routeNames.includes("mainChallenge") ?
                        <Text onPress={()=>{tabNavigation.navigate('tabSearch')}} style={[font.mediumFontLightGray, {alignSelf: 'center'}]}>더 많은 챌린지 보러가기!</Text> : <Text onPress={() =>{create()}} style={[font.mediumFontLightGray, {alignSelf: 'center'}]}>검색된 챌린지가 없어요ㅠㅠ</Text>
                }
            </>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: Height / 8.5,
        width: Width / (100 / 90),
        borderRadius: Width / 30,
        // overflow: "hidden",
        flexDirection: "row",
        backgroundColor: "white",
        alignSelf: "center",
        justifyContent: "center",
        marginBottom: Height / 100,
        shadowColor: "#000",
    },
    header: {
        width: "22%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: Height / 50,
    },
    challengeIcon: {
        width: "60%",
        height: "50%",
        marginTop: "33%",
        alignSelf: "center",
        position: "absolute",
        opacity: 0.7,
        pointerEvents: 'box-none'
    },
    content: {
        width: "42.5%",
        height: "100%",
        alignItems: "flex-start",
        paddingTop: Platform.OS == 'ios' ? Height/40 : Height/46.5,
        paddingBottom: Height/80,
        paddingRight: Width/22,
        // justifyContent: "center",
    },
    footer: {
        width: "32.5%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        paddingHorizontal: Width/80,
        paddingVertical: Height / 50,
    },
    createText: {
        fontSize: Width / 24,
        fontWeight: "500",
        opacity: 0.6,
        alignSelf: "center",
    },
    memberLimitText: {
        backgroundColor: "rgba(88,185,255,0.18)",
        width: "90%",
        height: "45%",
        borderRadius: Width / 50,
        justifyContent: "center",
        alignItems: "center",
    },
    titleText: {
        fontSize: font.mediumFontGray.fontSize,
        fontWeight: font.mediumFontLightGray.fontWeight,
        color: font.smallFontGray.color,
    },
    descriptionText: {
        fontSize: font.smallFontLightGray.fontSize,
        fontWeight: font.smallFontLightGray.fontWeight,
        color: font.largeFontLightGray.color,
        marginTop: 1
    },
    goalMoneyText: {
        position: "absolute",
        fontSize: Width / 28,
        fontWeight: "600",
        marginTop: 56,
        color: "#6c6c6c",
    }
})
