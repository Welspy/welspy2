import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image, Pressable, Platform, UIManager, LayoutAnimation,
} from 'react-native';
import {NavigationProp, useFocusEffect, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationType} from '../../type/navigationType/BottomTabNavigationType.ts';
import {Height, Width} from '../../config/global/dimensions.ts';
import store from '../../state/store.ts';
import ChallengeList from '../../component/challengeList/ChallengeList.tsx';
import Welspy from '../../hooks/Welspy.ts';
import {MainStackNavigationType} from '../../type/navigationType/MainStackNavigationType.ts';
import {useCallback, useEffect, useState} from 'react';
import BannerFlatList from '../../component/BannerFlatList.tsx';
import {ChallengeResponseType} from "../../type/responseType/ChallengeResponseType.ts";
import {font} from "../../config/global/font.ts";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
if (Platform.OS === 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}


const MainScreen = () => {

    const TabNavigation = useNavigation<NavigationProp<BottomTabNavigationType>>();
    const navigation = useNavigation<NavigationProp<MainStackNavigationType>>();

    const {currentList, myChallengeList, isReadyGetFull} = store.challengeState(state => state)
    const {userInfo, bankInfo} = store.userState(state => state)
    const {alarmState} = store.navigationState(state => state)
    const {hookQueue, queueSequence} = store.hookState(state => state)

    const [renderList, setRenderList] = useState<ChallengeResponseType[]>([])
    const [isAlarmVisible, setIsAlarmVisible] = useState<boolean>(false)

    useEffect(() => {
        setRenderList(currentList);
    }, [currentList]);

    useEffect(() => {
        if(queueSequence[0] == "recommend?GET") {
            if(hookQueue[0].isSuccess) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-expect-error
                setRenderList(hookQueue[0].response?.data?.data?.map((item) => {return {...item, isAi: true}}));
            } else {
                setRenderList([])
            }
            store.hookState.setState({hookQueue : [], queueSequence : []});
        }
    }, [queueSequence]);

    useFocusEffect(
        useCallback(() => {
            console.log("getMain")
            if (!isReadyGetFull){
                console.log("getMain1")
                Welspy.challenge.getMyChallenge(1);
                console.log("getMain2")
                Welspy.user.getProfile();
                console.log("getMain3")
                Welspy.bank.getMyBank();
                console.log("getMain4")
                Welspy.challenge.getRecommendChallenge(1, 4);
            }
            store.navigationState.setState({alarmState: {...alarmState, main: 0}});
        },[])
    )

    useEffect(() => {
        console.log(currentList);
    }, [currentList]);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                scrollEnabled={!isAlarmVisible}
                onMomentumScrollEnd={(event) => {
                    if(!event.nativeEvent.contentOffset.y) {
                        if (!isReadyGetFull) {
                            Welspy.challenge.getMyChallenge(1);
                            Welspy.user.getProfile();
                            Welspy.bank.getMyBank();
                            Welspy.challenge.getRecommendChallenge(1, 4);
                        }
                    }
                }}
            >
                <View style={styles.scrollContainer}>
                    <View style={styles.headerContainer}>
                        <Text></Text>
                        <View style={[styles.headerContainer, {height: "100%", width: "18%"}]}>
                            {alarmState.allOf > 0 && <Text style={{fontSize: 70, position: 'absolute', top: -45, marginLeft: 18, color: '#5b94f3'}}>.</Text>}
                            <Pressable style={styles.headerIcon} onPress={() => {store.navigationState.setState({alarmState: {...alarmState, allOf: 0}});setIsAlarmVisible(true);LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);}}><Image src={"https://i.ibb.co/wz46kCp/bell-1.png"} style={{width: "100%", height: "100%"}}/></Pressable>
                            <Text style={{fontSize: Width/13, opacity: 0.4}}>⊜</Text>
                        </View>
                    </View>
                    <View style={styles.bannerContainer}>
                        <BannerFlatList images={["https://www.lguplus.com/static/pc-contents/images/prdv/20240920-075744-468-FSLoefs4.png", "https://res.cloudinary.com/dlpdso5f7/image/upload/v1725412077/09.04_GL_%ED%99%88%ED%8E%98%EC%9D%B4%EC%A7%80_%EB%B0%B0%EB%84%88_icssnz.png", "https://mir-s3-cdn-cf.behance.net/projects/404/da2ab9110287437.Y3JvcCw4MDgsNjMyLDk2LDA.png"]}/>
                    </View>
                    <View style={styles.bankContainer}>
                        <Text style={font.largeFontBlack}>{userInfo?.name != undefined && `${userInfo?.name}님`}</Text>
                        <View style={styles.bankRow}>
                            <View style={[styles.bankRow, {width: "60%", justifyContent: "flex-start"}]}>
                                <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cb5R90SsXu0vJHdbWsXI5s3Wig-74MgsLQ&s"} style={{width: "19%", height: Height/25, marginRight: "6%", marginTop: "2%"}}/>
                                <View>
                                    <Text style={styles.bankText}>토스뱅크</Text>
                                    <Text style={[font.mediumFontBlack2, {marginTop: Platform.OS == 'ios' ? 5 : 0, fontWeight:Platform.OS == 'ios' ? "600" : "500"}]}>{bankInfo?.balance != undefined && `${(bankInfo?.balance)?.toLocaleString()}원`}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bankButton} onPress={() => {navigation.navigate('mainSend')}}>
                                <Text style={font.smallFontWhite}>결제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.challengeInfoContainer]} onPress={() => TabNavigation.navigate('tabChallenge')}>
                        <Image src={"https://i.ibb.co/zsSZ8rd/Trophy.png"} style={{width: 19, height: 19}}></Image>
                        <Text style={font.mediumFontBlack}>{` 나의 챌린지 `}</Text>
                        <Text style={[font.mediumFontBlack, {color: "#538eff", fontWeight: "600"}]}>{myChallengeList.length}</Text>
                        <Text style={font.mediumFontBlack}>{`건`}</Text>
                        <Text style={[font.mediumFontBlack , {width: "61%", textAlign: "right", fontSize: Width/15, color: "#538eff"}]}>›</Text>
                    </TouchableOpacity>
                    <Text style={[, styles.sectionTitle, font.largeFontBlack]}>
                        진행중인 챌린지
                    </Text>
                    <View style={styles.challengeContainer}>
                        <ChallengeList create={() => {navigation.navigate('mainCreate')}} styles={styles.challengeListContainer} renderItem={[...renderList.slice(0,4).filter((item) => item.roomId != null), {}]}></ChallengeList>
                    </View>
                </View>
                {
                    isAlarmVisible &&
                    <Pressable onPress={() => {setIsAlarmVisible(false)}} style={{width: Width, height: Height, position: 'absolute', backgroundColor: 'rgba(90,90,90,0.1)'}}>
                        <View style={{width: Width/2, height: Height/2, backgroundColor: 'white', alignSelf: 'flex-end', marginTop: 65, marginRight: 18}}>
                            {
                                <Text style={{fontSize: 16, fontWeight: '500', marginTop: 200, alignSelf: 'center', color: '#8a8a8a'}}>현재 추가알림이 없습니다</Text>
                            }
                        </View>
                    </Pressable>
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f0f2f5',
    },
    scrollContainer: {
        width: '100%',
        alignItems: 'center',
        height: Height*1.35,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '89%',
        height: "5%",
        marginTop: "1%",
        marginBottom: -15,
    },
    headerIcon: {
        height: "45%",
        width: Width/ 17,
        marginRight: Width/80,
    },
    bannerContainer: {
        backgroundColor: 'transparent',
        // backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        shadowColor: '#000',
        width: '90%',
        height: "10%",
        marginBottom: "3%"
    },
    bankContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: '7.5%',
        paddingHorizontal: '6%',
        marginVertical: '4%',
        marginBottom: Height / 100,
        borderRadius: Width/30,
        shadowOffset: {
            width: Width/200,
            height: Height/250,
        },
        shadowRadius: Width / 60,
        shadowOpacity: 0.05,
        shadowColor: "#000",
        justifyContent: 'space-between',
        height: Platform.OS == 'ios' ? "12.75%" : "15%",
        width: '90%',
    },
    bankTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    bankRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '52%',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop:  Platform.OS == 'ios' ? "-4.5%" : "-3%",
    },
    bankText: {
        fontSize: 14,
        color: '#333',
    },
    balanceText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#000000',
        marginBottom: '-15%',
    },
    bankButton: {
        backgroundColor: '#5892ff',
        paddingVertical: '2%',
        paddingHorizontal: '5%',
        width: '24.5%',
        height: '65%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    bankButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    challengeInfoContainer: {
        backgroundColor: '#FFFFFF',
        width: '90%',
        height: "4.4%",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '6%',
        flexDirection: "row",
        borderRadius: Width/50,
        shadowOffset: {
            width: Width/200,
            height: Height/250,
        },
        shadowRadius: Width / 60,
        shadowOpacity: 0.05,
        shadowColor: "#000",
        marginBottom: '1.5%',
    },
    challengeText: {
        fontSize: 14.5,
        fontWeight: '500',
        color: '#494949',
    },
    challengeContainer: {
        backgroundColor: 'transparent',
        paddingVertical: '2%',
        paddingHorizontal: '7.5%',
        borderRadius: 10,
        width: '90%',
        height: '45%',
        overflow: 'visible',
    },
    sectionTitle: {
        alignSelf: 'flex-start',
        marginLeft: "6%",
        marginTop: "4%",
    },
    challengeListContainer: {
        overflow: 'visible',
    }
});

export default MainScreen;
