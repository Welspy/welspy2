import React, { useEffect, useRef, useState } from "react";
import {FlatList, Image, StyleSheet, View, Text, Pressable, Linking} from 'react-native';
import { Width, Height } from "../config/global/dimensions.ts";
import {useNavigation} from '@react-navigation/native';
import store from '../state/store.ts';

const BannerFlatList = ({ images } : { images : string[] }) => {
    const flatListRef = useRef<FlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const navigation = useNavigation();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    useEffect(() => {
        if (flatListRef.current) {
            if (currentIndex === images.length - 1) {
                flatListRef.current.scrollToOffset({ animated: true, offset: currentIndex * Width / 1.125 });
                setTimeout(() => {
                    flatListRef.current?.scrollToOffset({ animated: false, offset: 0 });
                    setCurrentIndex(0);
                }, 500);
            } else {
                flatListRef.current.scrollToOffset({ animated: true, offset: currentIndex * Width / 1.125 });
            }
        }
    }, [currentIndex, images.length, Width / 1.125]);

    return (
        <View style={styles.bannerContainer}>
            <FlatList
                ref={flatListRef}
                data={images}
                showsHorizontalScrollIndicator={false}
                horizontal={true}
                pagingEnabled={true}
                contentContainerStyle={{ height: "100%" }}
                style={styles.bannerHeader}
                renderItem={({ item, index }) => (
                    <Pressable onPress={() => {
                        switch (index) {
                            case 0:
                                //@ts-ignore
                                store.challengeItemState.setState({itemList: [{title: "Apple iPhone 15 128GB 옐로", price: "₩1,090,000", imageUrl:  "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR0Xo-f1jmaBHDx9vyoU9y_hz5woIuaK1hfBs-SObJFTlho-3rBZ6nInJwVvC74j0CXkkkMds1vE25u50MFaIWWWg8f5R_sUISKT8bVooDDYItcZabqgorq&usqp=CAE", detailUrl: "https://www.google.com/shopping/product/1772562870471691575?q=iPhone&prds=eto:13371518191653458544_0,pid:16649351467938767413,rsk:PC_6601648695432433635&sa=X&ved=0ahUKEwjEze65h8CIAxU3s1YBHeUJBmcQ8gIIqQcoAA",}]});
                                //@ts-ignore
                                navigation.navigate('mainCreate')
                                break;
                            case 1:
                                //@ts-ignore
                                navigation.navigate('tabChallenge')
                                break;
                            case 2:
                                Linking.openURL("https://www.youtube.com/watch?v=MWnXIaIPGng")
                        }
                    }}>
                    <Image style={styles.banner} source={{ uri: item }} />
                    </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}
            />
            <View style={styles.sectionHeader}>
                {[...new Set(images)].map((_, index) => (
                    <Text
                        key={index}
                        style={[
                            styles.section,
                            currentIndex === index && { color: "#ff731d" },
                        ]}
                    >.</Text>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        alignItems: "center",
        width: Width / 1.125,
        height: Height / 7,
        paddingHorizontal: Height / 70,
    },
    bannerHeader: {
        width: Width / 1.115,
        height: "80%",
        marginTop: "7%",
        borderRadius: Width / 25,
        overflow: "hidden",
    },
    banner: {
        width: Width / 1.1,
        height: "135%",
        marginTop: -15,
    },
    sectionHeader: {
        height: "16%",
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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
