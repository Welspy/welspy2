import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Height, Width} from '../config/global/dimensions.ts';

const DismissButton = ({onPress, style} : {onPress : any, style? : any}) => {
    return (
        <Pressable style={!style ? [styles.container] : style} onPress={onPress}>
            <Text style={styles.dismissText}>‹</Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Width / (100/88),
        alignSelf: 'center',
        height: Height / 10.5,
        justifyContent: "flex-end",
    },
    dismissText: {
        fontSize: Width / 7.5,
        fontWeight: "200",
    }
})

export default DismissButton;