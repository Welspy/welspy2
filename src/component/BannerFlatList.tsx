import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, StyleSheet, View, Text, Pressable, Linking, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Width, Height } from "../config/global/dimensions.ts";
import { useNavigation } from '@react-navigation/native';
import store from '../state/store.ts';

const BannerFlatList = ({ images }: { images: string[] }) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(1);
    const bannerWidth = Width;
    const navigation = useNavigation();

    // 무한 순환을 위해 이미지 리스트 앞뒤로 아이템을 추가
    const loopImages = [images[images.length - 1], ...images, images[0]];

    useEffect(() => {
        const interval = setInterval(() => {
            flatListRef.current?.scrollToOffset({
                offset: (currentIndex + 1) * bannerWidth,
                animated: true,
            });
            setCurrentIndex(prevIndex => prevIndex + 1);
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        const newIndex = Math.round(offsetX / bannerWidth);

        if (newIndex === loopImages.length - 1) {
            flatListRef.current?.scrollToOffset({ animated: false, offset: bannerWidth });
            setCurrentIndex(1);
        } else if (newIndex === 0) {
            flatListRef.current?.scrollToOffset({ animated: false, offset: (loopImages.length - 2) * bannerWidth });
            setCurrentIndex(loopImages.length - 2);
        } else {
            setCurrentIndex(newIndex);
        }
    };

    return (
        <View>
            <View style={styles.bannerContainer}>
                <FlatList
                    ref={flatListRef}
                    data={loopImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ height: "100%" }}
                    onMomentumScrollEnd={handleScrollEnd}
                    renderItem={({ item, index }) => (
                        <Pressable style={styles.bannerHeader} onPress={() => {
                            switch (index) {
                                case 1: // 첫 번째 이미지로 이동한 경우
                                    navigation.navigate("tabChallenge")
                                    break;
                                case 2:
                                    navigation.navigate("tabChallenge")
                                    break;
                                default:
                                    navigation.navigate("tabChallenge")
                                    break;
                            }
                        }}>
                            <Image style={styles.banner} source={{ uri: item }} />
                        </Pressable>
                    )}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={styles.sectionHeader}>
                {images.map((_, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.section,
                            currentIndex === index + 1 && { color: "#005cff" },
                        ]}
                    >.</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        width: Width,
        overflow: "hidden",
        marginTop: Width / 20,
        height: Height/9,
        borderRadius: Width / 30,
    },
    bannerHeader: {
        width: Width,
        alignSelf: "center",
        alignItems: "center",
        height: "100%",
        marginTop: "7%",
    },
    banner: {
        width: Width/1.11,
        height: "100%",
        borderRadius: Width / 30,
        marginRight: 38,
        marginTop: -15,
        resizeMode: "cover",
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        marginTop: Width / 3.33,
        marginLeft: Width / 2.4,
    },
    section: {
        fontSize: Width / 14,
        fontWeight: "bold",
        color: '#b5b5b5',
        marginTop: -Height / 60,
        marginHorizontal: Width / 200,
    },
});

export default BannerFlatList;
