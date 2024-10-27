import {Platform, StyleSheet} from "react-native";
import {Width} from "./dimensions.ts";

export const font = StyleSheet.create({
    biggestFontBlack : {
        fontSize: Platform.OS === 'ios' ? Width/18.5 : Width/22,
        fontWeight: Platform.OS === 'ios' ? "700" : "500",
        color: 'black',
    },
    biggestFontBlue : {
        fontSize: Platform.OS === 'ios' ? Width/16 : Width/17,
        fontWeight: Platform.OS === 'ios' ? "800" : "700",
        color: '#5b94f3',
    },
    largeFontBlack : {
        fontSize: Platform.OS === 'ios' ? Width/22 : Width/26,
        fontWeight: Platform.OS === 'ios' ? "600" : "500",
        color: 'black',
    },
    largeFontBlack2 : {
        fontSize: Platform.OS === 'ios' ? Width/22 : Width/26,
        fontWeight: Platform.OS === 'ios' ? "500" : "500",
        color: 'black',
    },
    largeFontGray : {
        fontSize: Platform.OS === 'ios' ? Width/22 : Width/25,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: '#232323',
    },
    largeFontBlue : {
        fontSize: Platform.OS === 'ios' ? Width/22 : Width/24,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: '#5b94f3',
    },
    largeFontWhite : {
        fontSize: Platform.OS === 'ios' ? Width/22 : Width/24,
        fontWeight: Platform.OS === 'ios' ? "600" : "500",
        color: 'white',
    },
    largeFontWhite2 : {
        fontSize: Platform.OS === 'ios' ? Width/22 : Width/24,
        fontWeight: Platform.OS === 'ios' ? "500" : "500",
        color: 'white',
    },
    largeFontLightGray: {
        fontSize: Platform.OS === 'ios' ? Width/22 : Width/24,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: '#a1a1a1',
    },
    mediumFontBlack : {
        fontSize: Platform.OS === 'ios' ? Width/27 : Width/29,
        fontWeight: Platform.OS === 'ios' ? "400" : "400",
        color: 'black',
    },
    mediumFontBlack2: {
        fontSize: Platform.OS === 'ios' ? Width/25 : Width/27,
        fontWeight: Platform.OS === 'ios' ? "400" : "400",
        color: 'black',
    },
    mediumFontGray : {
        fontSize: Platform.OS === 'ios' ? Width/27 : Width/29,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: '#555',
    },
    mediumFontBlue : {
        fontSize: Platform.OS === 'ios' ? Width/25 : Width/27,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: '#5b94f3',
    },
    mediumFontWhite : {
        fontSize: Platform.OS === 'ios' ? Width/25 : Width/27,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: 'white',
    },
    mediumFontLightGray: {
        fontSize: Platform.OS === 'ios' ? Width/25 : Width/27,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: '#a1a1a1',
    },
    smallFontBlack : {
        fontSize: Platform.OS === 'ios' ? Width/29 : Width/34.5,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: 'black',
    },
    smallFontGray : {
        fontSize: Platform.OS === 'ios' ? Width/29 : Width/34.5,
        fontWeight: Platform.OS === 'ios' ? "400" : "300",
        color: '#555',
    },
    smallFontBlue : {
        fontSize: Platform.OS === 'ios' ? Width/29 : Width/34.5,
        fontWeight: Platform.OS === 'ios' ? "500" : "400",
        color: '#5b94f3',
    },
    smallFontWhite : {
        fontSize: Platform.OS === 'ios' ? Width/28 : Width/35,
        fontWeight: Platform.OS === 'ios' ? "600" : "500",
        color: 'white',
    },
    smallFontLightGray: {
        fontSize: Platform.OS === 'ios' ? Width/30 : Width/37.9,
        fontWeight: Platform.OS === 'ios' ? "400" : "400",
        color: '#a1a1a1',
    }
})
