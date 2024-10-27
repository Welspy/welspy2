import React from 'react';
import {Image, Pressable, View} from 'react-native';


interface IconProps {
    name: string;
    size?: number;
    color?: string;
    onPress?: () => void;
}

const Icon: React.FC<IconProps> = ({ name, size = 20, color = 'black', onPress }) => {
    return (
        <View style={{width: size+10, height: size+10, justifyContent: 'flex-end', alignItems: 'center'}}>
            {
                name === "home" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/THt7g2m/Rectangle-263-1.png" : "https://i.ibb.co/4j6p0mS/Group-155.png"}} style={{width: size, height: size+2, marginBottom: 2}}></Image>
                    </Pressable>
                :name === "profile" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/Pw2cNfW/Group-144-1.png" : "https://i.ibb.co/k9cFFjv/Group-143.png"}} style={{width: size, height: size + 2}}></Image>
                    </Pressable>
                :name === "search" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/2Y754ww/Group-29.png" : "https://i.ibb.co/mRKQ9gW/Group-104.png"}} style={{width: size + 5, height: size + 5, marginBottom:2}}></Image>
                    </Pressable>
                :name === "challenge" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/qkjMsMP/Group-153.png" : "https://i.ibb.co/fDMGGjn/Group-154.png"}} style={{width: size, height: size+2}}></Image>
                    </Pressable>
                :name === "production" ?
                    <Pressable onPress={onPress}>
                        <Image source={{uri : color === '#8E8E8F' ? "https://i.ibb.co/54fmqHY/Group-151-1.png" : "https://i.ibb.co/1dc3HyY/Group-152-1.png"}} style={{width: size, height: size + 2}}></Image>
                    </Pressable>
                : <Image source={{uri : color === 'black' ? "" : ""}} style={{width: size, height: size}}></Image>
            }

        </View>
    );
};

export default Icon;
