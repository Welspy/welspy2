import React from 'react';
import {Image, Pressable, View} from 'react-native';


interface IconProps {
    name: string;
    size?: number;
    color?: string;
    onPress?: () => void;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'black', onPress }) => {
    console.log("testetst", color)
    return (
        <View style={{width: size+10, height: size+10, justifyContent: 'flex-end', alignItems: 'center'}}>
            {
                name === "home" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/pJNvDZJ/Rectangle-216-1.png" : "https://i.ibb.co/sCr2NV0/Rectangle-216.png"}} style={{width: size+1, height: size+2}}></Image>
                    </Pressable>
                :name === "profile" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/7j3tsZR/Group-98.png" : "https://i.ibb.co/KmCB12T/Group-98-1.png"}} style={{width: size, height: size}}></Image>
                    </Pressable>
                :name === "search" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/gFBt3nZ/Group-29-5.png" : "https://i.ibb.co/fCXTkXB/Group-29-4.png"}} style={{width: size, height: size}}></Image>
                    </Pressable>
                :name === "challenge" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "" : ""}} style={{width: size, height: size}}></Image>
                    </Pressable>
                : <Image source={{uri : color === 'black' ? "" : ""}} style={{width: size, height: size}}></Image>
            }

        </View>
    );
};

export default Icon;