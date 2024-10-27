import {Image, Pressable, StyleSheet, Text, View} from "react-native";
import {Height, Width} from "../config/global/dimensions.ts";
import {MyChallengeResponseType} from "../type/responseType/MyChallengeResponseType.ts";
import {font} from "../config/global/font.ts";

const ItemObject = ({item, onPress, select} : {item : MyChallengeResponseType, onPress: any, select: any}) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Image src={item.imageUrl} style={{width: 80, height: 80}}></Image>
            <View style={{width: 220, marginLeft: 12, marginTop: -20}}>
                <Text style={font.mediumFontBlack2} numberOfLines={1}>{item.title}</Text>
                <Text style={font.smallFontLightGray} numberOfLines={2}>{item.description}</Text>
            </View>
            <Text style={[{position: 'absolute', right: 10, bottom: 10, textDecorationLine: 'underline'}, font.smallFontGray]}>결제창으로 이동하기</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Height / 8.5,
        width: Width / (100 / 90),
        borderRadius: Width / 30,
        flexDirection: "row",
        backgroundColor: "white",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: Height / 100,
        shadowColor: "#000",
    },
})

export default ItemObject
