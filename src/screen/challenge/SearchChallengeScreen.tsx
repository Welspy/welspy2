import {
    Image, Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {NavigationProp, useFocusEffect, useNavigation} from '@react-navigation/native';
import {useCallback, useEffect, useRef, useState} from 'react';
import Welspy from '../../hooks/Welspy.ts';
import store from '../../state/store.ts';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import ChallengeList from '../../component/challengeList/ChallengeList.tsx';
import {SearchStackNavigationType} from '../../type/navigationType/SearchStackNavigationType.ts';
import {Height, Width} from '../../config/global/dimensions.ts';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import BottomSheet from "react-native-gesture-bottom-sheet";
import {font} from "../../config/global/font.ts";

const SearchChallengeScreen = () => {

    const navigation = useNavigation<NavigationProp<SearchStackNavigationType>>();

    const [fullList, setFullList] = useState<ChallengeResponseType[]>([]);
    const [renderList, setRenderList] = useState<ChallengeResponseType[]>([]);
    const [fullRecommendList, setFullRecommendList] = useState<ChallengeResponseType[]>([]);
    const [renderRecommendList, setRenderRecommendList] = useState<ChallengeResponseType[]>([]);
    const [renderItem, setRenderItem] = useState<ChallengeResponseType[]>([]);
    const {hookQueue, queueSequence} = store.hookState(state => state)
    const {isReadyGetFull} = store.challengeState(state => state)
    // const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

    const BottomSheetRef = useRef<BottomSheet>(null);

    const [renderFilter, setRenderFilter] = useState<{selectedCategory : string, moneyMax: number, moneyMin: number, isStart: boolean | null}>({selectedCategory : "", moneyMax: 0, moneyMin: 0, isStart: null});


    const categoriesEnum = {
        'TRAVEL' : '여행',
        'DIGITAL' : '디지털',
        'FASHION' : '패션',
        'TOYS' : '취미',
        'INTERIOR' : '인테리어',
        'ETC' : '기타'
    }

    const category = {
        "DIGITAL" : "https://i.ibb.co/CQqxftX/Mobile-Phone.png",
        "TRAVEL" : "https://i.ibb.co/j3WwhKM/Desert-Island.png",
        "FASHION" : "https://i.ibb.co/vXsRpHK/Billed-Cap.png",
        "TOYS" : "https://i.ibb.co/C6tJhqp/Badminton.png",
        "INTERIOR" : "https://i.ibb.co/vdjN1Xt/Couch-and-Lamp.png",
        "ETC" : "https://i.ibb.co/RyYQTbS/dollar.png"
    }

    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        if(renderFilter.selectedCategory != "") {
            setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
            setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
        } else {
            console.log("aaaa");
            setRenderList(fullList)
            setRenderRecommendList(fullRecommendList)
        }
        if (renderFilter.moneyMin + renderFilter.moneyMax != 0) {
            setRenderList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) < Number(renderFilter.moneyMax)}))
            setRenderRecommendList(prev => prev =prev.filter((item) => {return Number(item?.goalMoney) < Number(renderFilter.moneyMax)}))
            // setRenderList(prev => prev = fullList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
            // setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
        } else {
            if(renderFilter.selectedCategory != "") {
                setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
                setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
            } else {
                console.log("bbbb");
                setRenderList(fullList)
                setRenderRecommendList(fullRecommendList)
            }
        }
        if (renderFilter.isStart != null) {
            if (renderFilter.isStart) {
                setRenderList(prev => prev = prev.filter((item) => {return item.currentMember != 0}))
                setRenderRecommendList(prev => prev = prev.filter((item) => {return item.currentMember != 0}))
            } else {
                console.log("resdds")
                setRenderList(prev => prev = prev.filter((item) => {return item.currentMember == 0}))
                setRenderRecommendList(prev => prev = prev.filter((item) => {return item.currentMember == 0}))
            }
        } else {
            if (renderFilter.moneyMin + renderFilter.moneyMax != 0) {
                setRenderList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
                setRenderRecommendList(prev => prev =prev.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
                setRenderList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
                setRenderRecommendList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
            } else if(renderFilter.selectedCategory != "") {
                setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
                setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
            } else if (renderFilter.selectedCategory == "" || renderFilter.moneyMin + renderFilter.moneyMax == 0) {
                console.log("ress")
                setRenderList(fullList)
                setRenderRecommendList(fullRecommendList)
            }
        }
    }, [fullList]);

    const [minText, setMinText] = useState<string>("");
    const [maxText, setMaxText] = useState<string>("");
    const [isFilter, setIsFilter] = useState<boolean>(false)

    useFocusEffect(
        useCallback(() => {
            store.challengeState.setState({isReadyGetFull: true})
            Welspy.challenge.getChallengeList(1, 99)
            Welspy.challenge.getRecommendChallenge(1, 99)
            return () => {
                store.challengeState.setState({isReadyGetFull: false})
            }
        },[])
    )

    useEffect(() => {

    }, [renderFilter]);

    // useEffect(() => {
    //     // console.log(selectedCategory);
    //     if (fullList.length > 0) {
    //         if (selectedCategory.length > 0) {
    //             setRenderList(fullList.filter((item) => {
    //                 //@ts-ignore
    //                 // console.log(categoriesEnum[item?.category])
    //                 //@ts-ignore
    //                 if(selectedCategory.includes(categoriesEnum[item?.category])) {
    //                     return item;
    //                 }
    //             } ));
    //         } else {
    //             // console.log("none selected")
    //             setRenderList(fullList);
    //         }
    //     }
    // }, [selectedCategory]);

    useEffect(() => {
        if(queueSequence[0] == "room/list?GET"){
            if(isReadyGetFull) {
                if(hookQueue[0].isSuccess) {
                    // console.log(queueSequence);
                    // console.log(hookQueue);
                    setFullList(hookQueue[0].response?.data?.data);
                } else {
                    setFullList([]);
                }
                store.hookState.setState({hookQueue: [], queueSequence: []});
            }
        } else if(queueSequence[0] == "room/search?GET") {
            // console.log(queueSequence);
            // console.log(hookQueue);
            if(hookQueue[0].isSuccess) {
                setFullList(hookQueue[0].response?.data?.data)
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                setFullRecommendList((prev) => hookQueue[0].response?.data?.data.filter(({item}) => {return prev.includes(item)}));
            } else {
                setFullList([]);
                setFullRecommendList([]);
            }
            store.hookState.setState({hookQueue: [], queueSequence: []});
        } else if(queueSequence[0] == "recommend?GET"){
            if(isReadyGetFull) {
                console.log("test")
                if(hookQueue[0].isSuccess) {
                    setFullRecommendList(hookQueue[0].response?.data?.data);
                } else {
                    setFullRecommendList([]);
                }
            }
            store.hookState.setState({hookQueue: [], queueSequence: []});
            store.hookState.setState({hookQueue: [], queueSequence: []});
        }
    }, [queueSequence]);

    // const handleCategoryPress = (category : '여행'| '디지털'| '패션'| '취미'| '인테리어'| '기타') => {
    // setSelectedCategory(prev => prev.includes(category) ? prev.filter(item => item != category) : [...prev, category]);
    // };

    const [isAi, setIsAi] = useState(false)


    useEffect(() => {
        setRenderItem(renderList)
    }, [renderList]);

    useEffect(() => {
        if(renderFilter.selectedCategory != "") {
            setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
            setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
        } else {
            console.log("aaaa");
            setRenderList(fullList)
            setRenderRecommendList(fullRecommendList)
        }
        if (renderFilter.moneyMin + renderFilter.moneyMax != 0) {
            setRenderList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) < Number(renderFilter.moneyMax)}))
            setRenderRecommendList(prev => prev =prev.filter((item) => {return Number(item?.goalMoney) < Number(renderFilter.moneyMax)}))
            // setRenderList(prev => prev = fullList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
            // setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
        } else {
            if(renderFilter.selectedCategory != "") {
                setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
                setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
            } else {
                console.log("bbbb");
                setRenderList(fullList)
                setRenderRecommendList(fullRecommendList)
            }
        }
        if (renderFilter.isStart != null) {
            if (renderFilter.isStart) {
                setRenderList(prev => prev = prev.filter((item) => {return item.currentMember != 0}))
                setRenderRecommendList(prev => prev = prev.filter((item) => {return item.currentMember != 0}))
            } else {
                console.log("resdds")
                setRenderList(prev => prev = prev.filter((item) => {return item.currentMember == 0}))
                setRenderRecommendList(prev => prev = prev.filter((item) => {return item.currentMember == 0}))
            }
        } else {
            if (renderFilter.moneyMin + renderFilter.moneyMax != 0) {
                setRenderList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
                setRenderRecommendList(prev => prev =prev.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
                setRenderList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
                setRenderRecommendList(prev => prev = prev.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
            } else if(renderFilter.selectedCategory != "") {
                setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
                setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
            } else if (renderFilter.selectedCategory == "" || renderFilter.moneyMin + renderFilter.moneyMax == 0) {
                console.log("ress")
                setRenderList(fullList)
                setRenderRecommendList(fullRecommendList)
            }
        }
        // if (renderFilter.moneyMin + renderFilter.moneyMax != 0) {
        //     setRenderList(prev => prev = fullList.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
        //     setRenderRecommendList(prev => prev =fullRecommendList.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
        //     setRenderList(prev => prev = fullList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
        //     setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
        // } else {
        //     if(renderFilter.selectedCategory != "") {
        //         setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
        //         setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
        //     } else if (renderFilter.isStart != null) {
        //         if (renderFilter.isStart) {
        //             setRenderList(prev => prev = fullList.filter((item) => {return item.memberLimit != 0}))
        //             setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.memberLimit != 0}))
        //         } else {
        //             setRenderList(prev => prev = fullList.filter((item) => {return item.memberLimit == 0}))
        //             setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.memberLimit == 0}))
        //         }
        //     } else {
        //         if(renderFilter.selectedCategory != "") {
        //             setRenderList(prev => prev = fullList.filter((item) => {return item.category == renderFilter.selectedCategory}))
        //             setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.category == renderFilter.selectedCategory}))
        //         } else if (renderFilter.moneyMin + renderFilter.moneyMax != 0) {
        //             setRenderList(prev => prev = fullList.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
        //             setRenderRecommendList(prev => prev =fullRecommendList.filter((item) => {return Number(item?.goalMoney) < renderFilter.moneyMax}))
        //             setRenderList(prev => prev = fullList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
        //             setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return Number(item?.goalMoney) > renderFilter.moneyMin}))
        //         } else {
        //             setRenderList(fullList)
        //             setRenderRecommendList(fullRecommendList)
        //         }
        //     }
        // }
        // if (renderFilter.isStart != null) {
        //     if (renderFilter.isStart) {
        //         setRenderList(prev => prev = fullList.filter((item) => {return item.memberLimit != 0}))
        //         setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.memberLimit != 0}))
        //     } else {
        //         setRenderList(prev => prev = fullList.filter((item) => {return item.memberLimit == 0}))
        //         setRenderRecommendList(prev => prev = fullRecommendList.filter((item) => {return item.memberLimit == 0}))
        //     }
        // } else {
        //     setRenderList(fullList)
        //     setRenderRecommendList(fullRecommendList)
        // }
        setIsFilter(false)
    }, [isFilter]);

    return (
        <SafeAreaView style={{backgroundColor: 'white'}}>
            <BottomSheet
                ref={BottomSheetRef}
                height={Height / 1.09}
                hasDraggableIcon={true}>
                <View
                    style={[
                        styles.container,
                        {height: '100%', width: '90%', alignSelf: 'center'},
                    ]}>
                    <Text style={[renderFilter.selectedCategory == "" ? font.largeFontLightGray : font.largeFontGray, {marginTop: 50}]}>
                        카테고리 선택
                    </Text>
                    <View>
                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 15,}}>
                            <Pressable onPress={() => {setRenderFilter((prev) => prev = {...prev, selectedCategory: prev.selectedCategory == "DIGITAL" ? "" : "DIGITAL"})}} style={{backgroundColor: renderFilter.selectedCategory == "DIGITAL" ? 'rgb(200,200,200)' : '#E0E0E0', width: Width / 2.3, height: Height / 15,  borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                <Image src={category["DIGITAL"]} style={{width: 30, height: 30, marginLeft: -20}}/>
                                <Text style={[renderFilter.selectedCategory == "DIGITAL" ? font.mediumFontGray : font.mediumFontLightGray, {marginLeft: 20}]}>디지털</Text>
                            </Pressable>
                            <Pressable onPress={() => {setRenderFilter((prev) => prev = {...prev, selectedCategory: prev.selectedCategory == "FASHION" ? "" : "FASHION"})}} style={{backgroundColor: renderFilter.selectedCategory == "FASHION" ? 'rgb(200,200,200)' : '#E0E0E0', width: Width / 2.3, height: Height / 15,  borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                <Image src={category["FASHION"]} style={{width: 30, height: 30, marginLeft: -20}}/>
                                <Text style={[renderFilter.selectedCategory == "FASHION" ? font.mediumFontGray : font.mediumFontLightGray, {marginLeft: 20}]}>패션</Text>
                            </Pressable>
                        </View>
                        <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginTop: 15,}}>
                            <Pressable onPress={() => {setRenderFilter((prev) => prev = {...prev, selectedCategory: prev.selectedCategory == "TOYS" ? "" : "TOYS"})}} style={{backgroundColor: renderFilter.selectedCategory == "TOYS" ? 'rgb(200,200,200)' : '#E0E0E0', width: Width / 2.3, height: Height / 15,  borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                <Image src={category["TOYS"]} style={{width: 30, height: 30, marginLeft: -20}}/>
                                <Text style={[renderFilter.selectedCategory == "TOYS" ? font.mediumFontGray : font.mediumFontLightGray, {marginLeft: 20}]}>취미</Text>
                            </Pressable>
                            <Pressable onPress={() => {setRenderFilter((prev) => prev = {...prev, selectedCategory: prev.selectedCategory == "TRAVEL" ? "" : "TRAVEL"})}} style={{backgroundColor: renderFilter.selectedCategory == "TRAVEL" ? 'rgb(200,200,200)' : '#E0E0E0', width: Width / 2.3, height: Height / 15,  borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                <Image src={category["TRAVEL"]} style={{width: 30, height: 30, marginLeft: -20}}/>
                                <Text style={[renderFilter.selectedCategory == "TRAVEL" ? font.mediumFontGray : font.mediumFontLightGray, {marginLeft: 20}]}>여행</Text>
                            </Pressable>
                        </View>
                        <Pressable onPress={() => {setRenderFilter((prev) => prev = {...prev, selectedCategory: prev.selectedCategory == "INTERIOR" ? "" : "INTERIOR"})}} style={{backgroundColor: renderFilter.selectedCategory == "INTERIOR" ? 'rgb(200,200,200)' : '#E0E0E0', width: Width / 2.3, height: Height / 15,  borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 15}}>
                            <Image src={category["INTERIOR"]} style={{width: 30, height: 30, marginLeft: -20}}/>
                            <Text style={[renderFilter.selectedCategory == "INTERIOR" ? font.mediumFontGray : font.mediumFontLightGray, {marginLeft: 20}]}>가구</Text>
                        </Pressable>
                    </View>
                    <Text style={[renderFilter.moneyMax+renderFilter.moneyMin == 0 ? font.largeFontLightGray : font.largeFontGray, {marginBottom: -45, marginTop: 30}]}>
                        가격 범위 선택
                    </Text>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <TextInput
                                value={minText}
                                keyboardType="numeric"
                                onChangeText={text => {
                                    setMinText(text);
                                    setRenderFilter((prev) => prev = {...prev, moneyMin : Number(text)})
                                }}
                                placeholder={'최소 금액'}
                                style={[
                                    styles.bottomButton,
                                    {
                                        backgroundColor: '#E0E0E0',
                                        width: Width / 2.3,
                                        height: Height / 16,

                                        borderRadius: 14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                    },
                                    font.mediumFontGray,
                                ]}
                            />
                            <TextInput
                                value={maxText}
                                keyboardType="numeric"
                                onChangeText={text => {
                                    setMaxText(text);
                                    setRenderFilter((prev) => prev = {...prev, moneyMax : Number(text)})
                                }}
                                placeholder={'최대 금액'}
                                style={[
                                    styles.bottomButton,
                                    {
                                        backgroundColor: '#E0E0E0',
                                        width: Width / 2.3,
                                        height: Height / 16,

                                        borderRadius: 14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        textAlign: 'center',
                                    },
                                    font.mediumFontGray,
                                ]}
                            />
                        </View>
                    </View>
                    {   renderFilter.moneyMax < renderFilter.moneyMin &&
                        <Text style={{color: '#ff0000'}}>최대 금액이 최소금액보다 작습니다</Text>
                    }
                    <Text style={[renderFilter.isStart == null ? font.largeFontLightGray : font.largeFontGray, {marginBottom: -45, marginTop: 30}]}>진행 여부</Text>
                    <View>
                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                                justifyContent: 'space-between',
                            }}>
                            <Pressable
                                onPress={() => {setRenderFilter((prev) => prev = {...prev, isStart: !prev.isStart})}}
                                style={[
                                    styles.bottomButton,
                                    {
                                        backgroundColor: renderFilter.isStart == null ? '#E0E0E0' : "rgb(200,200,200)",
                                        width: Width / 2.3,
                                        height: Height / 15,

                                        borderRadius: 14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    },
                                ]}
                            >
                                <Text style={renderFilter.isStart == null ? font.mediumFontLightGray : font.mediumFontGray}>{!renderFilter.isStart ? "활성화" : "비활성화"}</Text>
                            </Pressable>
                        </View>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 30}}>
                        <Pressable
                            onPress={() => {setRenderFilter({selectedCategory : "", moneyMax: 0, moneyMin: 0, isStart: null});setMinText("");setMaxText("")}}
                            style={[
                                styles.bottomButton,
                                {
                                    backgroundColor: 'transparent',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    width: Width/2.6
                                },
                            ]}>
                            <Text style={font.largeFontBlack2}>↺ 선택 초기화</Text>
                        </Pressable>
                        <TouchableOpacity style={styles.bottomButton} onPress={() => {setIsFilter(true);BottomSheetRef.current.close()}}>
                            <Text style={font.largeFontWhite2}>적용하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.searchBar}>
                            <TextInput
                                value={searchText}
                                placeholder={'검색어를 입력하세요'}
                                style={{
                                    width: '89%',
                                    height: '100%',
                                    alignSelf: 'center',
                                    paddingHorizontal: 7.5,
                                    justifyContent: 'center',
                                }}
                                onChangeText={setSearchText}
                                onSubmitEditing={() => {
                                    if (searchText == '') {
                                        Welspy.challenge.getChallengeList(1, 99);
                                    } else {
                                        Welspy.challenge.searchChallenge(1, 999, searchText);
                                    }
                                }}
                            />
                        </View>
                        <Pressable onPress={() => {BottomSheetRef.current.show()}} style={styles.categorySectionContainer}>
                            {
                                renderFilter.moneyMin + renderFilter.moneyMax == 0 && renderFilter.selectedCategory == "" && renderFilter.isStart == null &&
                                <View style={{backgroundColor: '#efefef', height: Height/20, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10}}>
                                    <Text style={font.mediumFontGray}>필터 적용하기</Text>
                                </View>
                            }
                            {
                                renderFilter.moneyMin + renderFilter.moneyMax != 0 &&
                                <View style={{backgroundColor: '#efefef', height: Height/20, marginBottom: 10, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10}}>
                                    {

                                        <>
                                            <Text style={font.mediumFontGray}> {minText}원</Text>
                                            <Text style={font.mediumFontGray}> ~</Text>
                                            <Text style={font.mediumFontGray}> {maxText}원</Text>
                                        </>
                                    }
                                </View>
                            }
                            {
                                renderFilter.selectedCategory != "" &&
                                <View style={{backgroundColor: '#efefef', height: Height/20, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10}}>
                                    <Text style={font.mediumFontGray}>{categoriesEnum[`${renderFilter.selectedCategory}`]}</Text>
                                </View>
                            }
                            {
                                renderFilter.isStart != null &&
                                <View style={{backgroundColor: '#efefef', height: Height/20, borderRadius: 6, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', paddingHorizontal: 10}}>
                                    <Text style={font.mediumFontGray}>{renderFilter.isStart ? "비활성화" : "활성화"}</Text>
                                </View>
                            }
                        </Pressable>
                    </View>
                    <View style={[{position: 'absolute', flexDirection:'row', marginTop: Height/5.5, marginLeft: Width/(100/5)}]}>
                        <Pressable onPress={() => setIsAi(!isAi)} style={{width:20,height:20, borderRadius: 1000, alignSelf: 'center', borderWidth: 1, backgroundColor: !isAi ? "transparent" : '#81b3ff', borderColor: !isAi ? "#222" : "#0946ba"}}></Pressable>
                        <Text onPress={() => setIsAi(!isAi)} style={font.mediumFontBlack2}>  Ai 추천 적용하기</Text>
                    </View>
                    <ChallengeList
                        renderItem={[...renderItem, {}]}
                        create={() => {
                            navigation.navigate('searchCreate');
                        }}
                    />
                    <View style={{height: 120}}></View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        width: Width,
        backgroundColor: '#f0f2f5',
        overflow: 'visible',
    },
    header: {
        width: '100%',
        height: Platform.OS == 'ios' ? Height/6 : Height/5.5,
        backgroundColor: 'white',
        marginBottom: 40
    },
    searchBar: {
        width: Width / (100/90),
        marginLeft: Width / (100/5),
        alignSelf: 'flex-start',
        height: Platform.OS == 'ios' ? "35%" : "32.5%",
        backgroundColor: '#f1f1f1',
        borderRadius: Width/30,
        marginTop: Platform.OS == 'ios' ? Height/30 : Height/24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Width/25,
        marginBottom: 8,
    },
    categorySectionContainer: {
        width: '90%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    categoryButton: {
        borderWidth: 1.5,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        width: Width / 3.7,
        height: Height / 27,
        marginBottom: 7.5,
    },
    categoryButtonSelected: {
        borderColor: '#538eff',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ccc',
    },
    categoryTextSelected: {
        color: '#538eff',
    },
    sectionContainer: {
        width: '90%',
        alignSelf: 'center',
        padding: Width/(100/5),
        borderRadius: Width/30,
        backgroundColor: '#f1f1f1',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: {width: 0, height: 5, },
        shadowRadius: Width / 3,
        marginTop: Height / 55,
    },
    bottomButton: {
        width: Width / 1.95,
        height: Height / 14.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#5892ff',
        alignSelf: 'center',
        borderRadius: Width / 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: Width / 100,

        marginTop: Height/15
    },
})

export default SearchChallengeScreen;
