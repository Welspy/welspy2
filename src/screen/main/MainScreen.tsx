import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Image,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationType} from '../../type/navigationType/BottomTabNavigationType.ts';
import {Height, Width} from '../../config/global/dimensions.ts';
import store from '../../state/store.ts';
import ChallengeList from '../../component/challengeList/ChallengeList.tsx';
import Welspy from '../../hooks/Welspy.ts';
import {MainStackNavigationType} from '../../type/navigationType/MainStackNavigationType.ts';
import {useEffect, useState} from 'react';
import BannerFlatList from '../../component/BannerFlatList.tsx';
import {ChallengeResponseType} from "../../type/responseType/ChallengeResponseType.ts";



const MainScreen = () => {

    const TabNavigation = useNavigation<NavigationProp<BottomTabNavigationType>>();
    const navigation = useNavigation<NavigationProp<MainStackNavigationType>>();

    const {currentList, myChallengeList, isReadyGetFull} = store.challengeState(state => state)
    const {userInfo, bankInfo} = store.userState(state => state)

    const [renderList, setRenderList] = useState<ChallengeResponseType[]>([])

    useEffect(() => {
        setRenderList(currentList);
    }, [currentList]);

    useEffect(() => {
        if (!isReadyGetFull){
          Welspy.challenge.getMyChallenge(1);
          Welspy.user.getProfile();
          Welspy.bank.getMyBank();
          Welspy.challenge.getChallengeList(1, 4);
        }
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                onMomentumScrollEnd={(event) => {
                    if(!event.nativeEvent.contentOffset.y) {
                        if (!isReadyGetFull) {
                          Welspy.challenge.getMyChallenge(1);
                          Welspy.user.getProfile();
                          Welspy.bank.getMyBank();
                          Welspy.challenge.getChallengeList(1, 4);
                        }
                    }
                }}
            >
                <View style={styles.scrollContainer}>
                    <View style={styles.headerContainer}>
                        <Text></Text>
                        <View style={[styles.headerContainer, {height: "100%", width: "18%"}]}>
                            <Text style={{fontSize: Width/13.5, opacity: 0.4}}>⊜</Text>
                            <Image src={"https://i.ibb.co/wz46kCp/bell-1.png"} style={styles.headerIcon}/>
                        </View>
                    </View>
                    <View style={styles.bannerContainer}>
                        <BannerFlatList images={["https://www.lguplus.com/static/pc-contents/images/prdv/20240920-075744-468-FSLoefs4.png", "https://i.ibb.co/J72tVN7/Frame-3-1.jpg", "https://i.ibb.co/HrQ7Xfm/Frame-2-1.jpg"]}/>
                    </View>
                    <View style={styles.bankContainer}>
                        <Text style={styles.bankTitle}>{userInfo?.name != undefined && `${userInfo?.name}님`}</Text>
                        <View style={styles.bankRow}>
                            <View style={[styles.bankRow, {width: "60%", justifyContent: "flex-start"}]}>
                                <Image src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6cb5R90SsXu0vJHdbWsXI5s3Wig-74MgsLQ&s"} style={{width: "18%", height: Height/26, marginRight: "6%", marginTop: "8%"}}/>
                                <View>
                                    <Text style={styles.bankText}>신한은행</Text>
                                    <Text style={styles.balanceText}>{bankInfo?.balance != undefined && `${(bankInfo?.balance)?.toLocaleString()}원`}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.bankButton} onPress={() => {navigation.navigate('mainSend')}}>
                                <Text style={styles.bankButtonText}>결제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={[styles.challengeInfoContainer]} onPress={() => TabNavigation.navigate('tabChallenge')}>
                        <Text style={styles.challengeText}>{`🏆 나의 챌린지 `}</Text>
                        <Text style={[styles.challengeText, {color: "#538eff", fontWeight: "600"}]}>{myChallengeList.length}</Text>
                        <Text style={styles.challengeText}>{`건`}</Text>
                        <Text style={[styles.challengeText , {width: "61%", textAlign: "right", fontSize: Width/15, color: "#538eff"}]}>›</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.challengeInfoContainer]} onPress={() => {navigation.navigate("mainCreate")}}>
                        <Text style={styles.challengeText}>{`챌린지 만들기`}</Text>
                        <Text style={[styles.challengeText , {width: "72%", textAlign: "right", fontSize: Width/19, color: "#538eff"}]}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.sectionTitle}>
                        모집중인 챌린지
                    </Text>
                    <View style={styles.challengeContainer}>
                        <ChallengeList create={() => {navigation.navigate('mainCreate')}} styles={styles.challengeListContainer} renderItem={renderList}></ChallengeList>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F4F6',
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
        width: '90%',
        height: "5%",
        marginTop: "1%",
        marginBottom: -15,
    },
    headerIcon: {
        height: "35%",
        width: Width/ 18,
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
        paddingHorizontal: '7.5%',
        marginVertical: '1.75%',
        borderRadius: Width/30,
        shadowOffset: {
            width: Width/200,
            height: Height/250,
        },
        shadowRadius: Width / 60,
        shadowOpacity: 0.05,
        shadowColor: "#000",
        justifyContent: 'space-between',
        height: "13%",
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
        marginTop: "-4.5%",
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
        paddingHorizontal: '7.5%',
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
        paddingVertical: '5%',
        paddingHorizontal: '7.5%',
        marginVertical: '2%',
        borderRadius: 10,
        width: '90%',
        height: '45%',
        overflow: 'visible',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        marginLeft: "8%",
        marginTop: "7%",
    },
    challengeListContainer: {
        overflow: 'visible',
    }
});

export default MainScreen;