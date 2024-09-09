import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import {Height, Width} from '../../config/global/dimensions.ts';

export const ChallengeObject = ({item} : {item: ChallengeResponseType}) => {

    const category = {
        "DIGITAL" : "https://i.ibb.co/DLCp14n/computer.png",
        "TRAVEL" : "https://i.ibb.co/k2LW8v0/briefcase.png",
        "FASHION" : "https://i.ibb.co/VHxdZNn/shirt.png",
        "TOYS" : "https://i.ibb.co/brNgVbg/blue-car.png",
        "INTERIOR" : "https://i.ibb.co/r5rmWFd/house-with-garden.png",
        "ETC" : "https://i.ibb.co/RyYQTbS/dollar.png"
    }

    return (
        <Pressable style={styles.container}>
            {item.idx?<>
                <View style={styles.header}>
                    {/*@ts-ignore*/}
                    <Image style={styles.challengeIcon} src={category[item.category]} />
                </View>
                <View style={styles.content}>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.titleText}>{item.title}</Text>
                    <Text ellipsizeMode={"tail"} numberOfLines={1} style={styles.descriptionText}>{item.description}</Text>
                    <Text style={styles.goalMoneyText}>{`${item.goalAmount}원`}</Text>
                </View>
                <View style={styles.footer}>
                    <View style={styles.memberLimitText}>
                        <Text style={{fontSize: Width/32, color: "#538eff"}}>{`${0}명 참여`}</Text>
                    </View>
                </View>
            </> : <Text style={styles.createText}>방 생성하기</Text>}
        </Pressable>
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
        marginBottom: Height / 90,
        shadowOffset: {
            width: Width/200,
            height: Height/250,
        },
        shadowRadius: Width / 60,
        shadowOpacity: 0.1,
        shadowColor: "#000",
    },
    header: {
        width: "20%",
        height: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: Height / 50,
    },
    challengeIcon: {
        width: "53%",
        height: "46%",
        marginTop: "4%",
        alignSelf: "center",
        opacity: 0.7
    },
    content: {
        width: "42.5%",
        height: "100%",
        alignItems: "flex-start",
        paddingTop: Height/40,
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
        fontSize: Width / 25,
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
        fontSize: Width / 24,
        fontWeight: "700",
    },
    descriptionText: {
        fontSize: Width / 28.2,
        fontWeight: "600",
        color: "#6c6c6c",
        marginTop: 1
    },
    goalMoneyText: {
        position: "absolute",
        fontSize: Width / 30,
        fontWeight: "400",
        marginTop: 64,
        color: "#999",
    }
})