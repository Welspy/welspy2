import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    UIManager,
    LayoutAnimation, Pressable, Image, ScrollView, Alert, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationType} from '../../type/navigationType/BottomTabNavigationType.ts';
import {useEffect, useRef, useState} from 'react';
import {Height, Width} from '../../config/global/dimensions.ts';
import DismissButton from '../../component/DismissButton.tsx';
//@ts-ignore
import BottomSheet from "react-native-gesture-bottom-sheet"
import axios from 'axios';
import ChallengeItemSelectScreen from './ChallengeItemSelectScreen.tsx';
import store from '../../state/store.ts';
import Welspy from '../../hooks/Welspy.ts';
import {serverURL} from '../../config/server/server.ts';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}
if (Platform.OS === 'ios' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CreateChallengeScreen = () => {

    const navigation = useNavigation<NavigationProp<BottomTabNavigationType>>();

    const {queueSequence, hookQueue} = store.hookState(state => state)

    const fullNavigation = useNavigation()

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (queueSequence.includes("room?POST")) {
            store.hookState.setState({hookQueue : [], queueSequence : []});
            navigation.goBack();
        }
    }, [queueSequence]);

    const getCrawlData = async () => {
        setIsLoading(true);
        // await axios.get(`${`${(serverURL)}`.slice(0,-5)}3000/search`,
        // await axios.get(`http://localhost:3000/search`,
        await axios.get(`https://3b5b-221-168-22-204.ngrok-free.app/search`,
            {
                params: {
                    query : searchItem,
                    page: 1,
                    size: 10,
                }
            }).then((response) => {
            setRenderItemList(response.data);
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const scrollViewRef = useRef<ScrollView>(null);

    const {itemList} = store.challengeItemState(state => state)
    const {isReadyGetFull} = store.challengeState(state => state)
    const [isPublic, setIsPublic] = useState(true);

    const [isSearchItem, setIsSearchItem] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const [memberLimit, setMemberLimit] = useState(1);

    const [renderItemList, setRenderItemList] = useState([]);

    const BottomSheetRef = useRef<BottomSheet>(null);

    const closeBottomSheet = () => {
        BottomSheetRef.current.close();
        setRenderItemList([]);
        setSearchItem('');
    }


    const [index, setIndex] = useState(0);

    const [title, setTitle] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<'여행'| '디지털'| '패션'| '취미'| '인테리어'| '기타'>("기타");
    const [file, setFile] = useState<string>("https://i.ibb.co/0sY6r0M/Rectangle-226.png");

    const categories = ['여행', '디지털', '패션', '취미', '인테리어', '기타'];

    const categoriesEnum = {
        '여행' : 'TRAVEL',
        '디지털' : 'DIGITAL',
        '패션' : 'FASHION',
        '취미' : 'TOYS',
        '인테리어' : 'INTERIOR',
        '기타' : 'ETC'
    }

    useEffect(() => {
        if (fullNavigation.getState()?.routes) {
            store.navigationState.setState({isBottomTabVisible: false})
        }
        return () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            !isReadyGetFull && Welspy.challenge.getChallengeList(1,4)
            Welspy.challenge.getMyChallenge(1)
            store.navigationState.setState({isBottomTabVisible: true})
        }
    }, [fullNavigation]);

    useEffect(() => {
        switch (index) {
            case 0:
                scrollViewRef.current?.scrollTo({
                    x: 0,
                    animated: true,
                });
                break;
            case 1:
                scrollViewRef.current?.scrollTo({
                    x: Width,
                    animated: true,
                });
                break;
            case 2:
                scrollViewRef.current?.scrollTo({
                    x: Width * 2,
                    animated: true,
                });
                break;
        }
    }, [index]);

    useEffect(() => {
        if (searchItem.length) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsSearchItem(true);
        } else {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setIsSearchItem(false);
        }
    }, [searchItem]);

    const handleCategoryPress = (category : '여행'| '디지털'| '패션'| '취미'| '인테리어'| '기타') => {
        setSelectedCategory(category);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.container}>
                <BottomSheet ref={BottomSheetRef} height={Height} draggable={false}>
                    <ChallengeItemSelectScreen
                        data={renderItemList}
                        close={closeBottomSheet}
                    />
                </BottomSheet>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled={true}
                    scrollEnabled={false}>
                    <View style={styles.SectionContainer}>
                        <DismissButton
                            onPress={() => {
                                navigation.goBack();
                                store.challengeItemState.setState({itemList: []});
                            }}></DismissButton>
                        <Text style={styles.itemInfoTitle}>챌린지 목표 상품</Text>
                        <View
                            style={[
                                styles.itemInfoContainer,
                                {
                                    backgroundColor: 'rgba(188,188,188,0.18)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                            ]}>
                            {itemList[itemList.length - 1] ? (
                                <>
                                    <View
                                        style={[
                                            styles.itemInfoContainer,
                                            {
                                                height: '70%',
                                                paddingHorizontal: 10,
                                                flexDirection: 'row',
                                                width: '90%',
                                                alignItems: 'flex-start',
                                            },
                                        ]}>
                                        <Pressable
                                            style={{
                                                position: 'absolute',
                                                marginLeft: 285,
                                                marginTop: 0,
                                                width: 25,
                                                height: 25,
                                            }}
                                            onPress={() => {
                                                console.log('test');
                                                store.challengeItemState.setState({itemList: []});
                                            }}>
                                            <Text style={{fontSize: 23, color: 'red'}}>⊗</Text>
                                        </Pressable>
                                        <Image
                                            src={itemList[itemList.length - 1].imageUrl}
                                            style={{
                                                width: Width / 4,
                                                height: Height / 8,
                                                marginRight: 10,
                                                marginLeft: -10,
                                                backgroundColor: 'transparent'
                                            }}
                                        />
                                        <View style={{width: '51%'}}>
                                            <Text
                                                numberOfLines={3}
                                                style={{
                                                    fontSize: Width / 30,
                                                    fontWeight: '600',
                                                    width: '100%',
                                                    marginTop: 15,
                                                }}>
                                                {itemList[itemList.length - 1].title}
                                            </Text>
                                            <Text
                                                style={{
                                                    fontSize: Width / 25,
                                                    fontWeight: '600',
                                                    width: '60%',
                                                    color: '#777777',
                                                }}>
                                                {itemList[itemList.length - 1].price
                                                    .toString()
                                                    .slice(1)}{' '}
                                                원
                                            </Text>
                                        </View>
                                    </View>
                                </>
                            ) : (
                                <>
                                    <Text style={{fontSize: 16, opacity: 0.5}}>
                                        상품이 검색되지 않았습니다
                                    </Text>
                                </>
                            )}
                        </View>
                        <View style={styles.itemSearchBarContainer}>
                            <TextInput
                                value={searchItem}
                                placeholder={'상품의 이름을 검색해보세요'}
                                style={[
                                    styles.itemSearchBarTextInput,
                                    {width: isSearchItem ? '78%' : '100%'},
                                ]}
                                autoCapitalize="none"
                                onChangeText={value => {
                                    setSearchItem(value);
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    width: '20%',
                                    height: '100%',
                                    marginLeft: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(83,142,255,0.4)',
                                    borderRadius: Width / 30,
                                }}
                                onPress={() => {
                                    getCrawlData();
                                    BottomSheetRef.current.show();
                                }}>
                                <Text
                                    style={{
                                        fontSize: Width / 23,
                                        color: '#686868',
                                        fontWeight: '500',
                                    }}>
                                    검색
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {/*<Text*/}
                        {/*    style={[*/}
                        {/*        styles.itemInfoTitle,*/}
                        {/*        {marginTop: Height / 25, marginBottom: 0},*/}
                        {/*    ]}>*/}
                        {/*    공개 여부*/}
                        {/*</Text>*/}
                        {/*<View style={styles.isVisibleContainer}>*/}
                        {/*    <TouchableOpacity*/}
                        {/*        onPress={() => setIsPublic(true)}*/}
                        {/*        style={[*/}
                        {/*            styles.visibleButton,*/}
                        {/*            {*/}
                        {/*                backgroundColor: isPublic*/}
                        {/*                    ? 'rgba(83,142,255,0.4)'*/}
                        {/*                    : 'rgba(188,188,188,0.3)',*/}
                        {/*            },*/}
                        {/*        ]}>*/}
                        {/*        <Text*/}
                        {/*            style={{*/}
                        {/*                fontSize: Width / 23,*/}
                        {/*                color: '#686868',*/}
                        {/*                fontWeight: '500',*/}
                        {/*            }}>*/}
                        {/*            공개*/}
                        {/*        </Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*    <TouchableOpacity*/}
                        {/*        onPress={() => setIsPublic(false)}*/}
                        {/*        style={[*/}
                        {/*            styles.visibleButton,*/}
                        {/*            {*/}
                        {/*                backgroundColor: !isPublic*/}
                        {/*                    ? 'rgba(83,142,255,0.4)'*/}
                        {/*                    : 'rgba(188,188,188,0.3)',*/}
                        {/*            },*/}
                        {/*        ]}>*/}
                        {/*        <Text*/}
                        {/*            style={{*/}
                        {/*                fontSize: Width / 23,*/}
                        {/*                color: '#686868',*/}
                        {/*                fontWeight: '500',*/}
                        {/*            }}>*/}
                        {/*            비공개*/}
                        {/*        </Text>*/}
                        {/*    </TouchableOpacity>*/}
                        {/*</View>*/}
                        <Text
                            style={[
                                styles.itemInfoTitle,
                                {marginTop: Height / 15, marginBottom: 10},
                            ]}>
                            최대 인원수
                        </Text>
                        <View
                            style={{
                                width: '88%',
                                height: '8%',
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexDirection: 'row',
                                marginBottom: '2%',
                            }}>
                            <Text
                                onPress={() => {
                                    if(memberLimit > 1) {
                                        setMemberLimit(prev => prev - 1);
                                    } else {
                                        setMemberLimit(1)
                                    }
                                }}
                                style={{
                                    fontSize: 24,
                                    fontWeight: '600',
                                    color: '#686868',
                                    marginTop: -10,
                                }}>
                                ⊖
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {width: '40%', textAlign: 'center', height: '80%'},
                                ]}
                                placeholder={'최대 인원수'}
                                value={`${memberLimit}`}
                                onChangeText={value => {
                                    setMemberLimit(Number(value));
                                }}
                                keyboardType={'numeric'}
                            />
                            <Text
                                onPress={() => {
                                    setMemberLimit(prev => prev + 1);
                                }}
                                style={{
                                    fontSize: 24,
                                    fontWeight: '600',
                                    color: '#686868',
                                    marginTop: -10,
                                }}>
                                ⊕
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (itemList[itemList.length - 1]) {
                                    setTitle(
                                        `${
                                            itemList[itemList.length - 1]?.title
                                                ? itemList[itemList.length - 1]?.title
                                                    ?.split(' ')
                                                    .slice(0, 3)
                                                    .reduce((accumulator, currentValue) => {
                                                        return accumulator + ' ' + currentValue;
                                                    })
                                                : '부자를 향해'
                                        } 돈 모으기`,
                                    );
                                    setGoalAmount(
                                        itemList[itemList.length - 1].price
                                            .toString()
                                            .slice(1)
                                            .split(',')
                                            .reduce((accumulator, currentValue) => {
                                                return accumulator + currentValue;
                                            }),
                                    );
                                    setIndex(1);
                                } else {
                                    Alert.alert('정말로 목표 상품 없이 진행하시겠습니까?', '', [
                                        {
                                            text: '그대로 진행',
                                            onPress: () => {
                                                setIndex(1);
                                            },
                                            style: 'destructive',
                                        },
                                        {
                                            text: '둘러보기',
                                            onPress: () => {
                                                setIndex(0);
                                            },
                                        },
                                    ]);
                                }
                            }}
                            style={{
                                width: '88%',
                                height: '6%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#538eff',
                                marginTop: '7%',
                                borderRadius: Width / 50,
                            }}>
                            <Text
                                style={{
                                    color: '#FFF',
                                    fontSize: Width / 21,
                                    fontWeight: '600',
                                }}>
                                다음
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.SectionContainer}>
                            <DismissButton
                                onPress={() => {
                                    setTitle('');
                                    setGoalAmount('');
                                    setDescription('');
                                    setSelectedCategory('기타');
                                    setIndex(0);
                                }}></DismissButton>
                            <Text style={styles.label}>제목</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={`${
                                    itemList[itemList.length - 1]?.title
                                        ? itemList[itemList.length - 1]?.title
                                            ?.split(' ')
                                            .slice(0, 3)
                                            .reduce((accumulator, currentValue) => {
                                                return accumulator + ' ' + currentValue;
                                            })
                                        : '부자를 향해'
                                } 돈 모으기`}
                                value={title}
                                onChangeText={setTitle}
                                clearTextOnFocus={true}
                                autoCapitalize="none"
                            />

                            <Text style={styles.label}>소개</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="챌린지에 대한 소개"
                                value={description}
                                onChangeText={setDescription}
                                autoCapitalize="none"
                                multiline={true}
                                blurOnSubmit={false}
                            />
                            <Text style={styles.label}>목표 금액</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="100000 원"
                                value={goalAmount}
                                onChangeText={value => {
                                    if (itemList[itemList.length - 1]?.price) {
                                    } else {
                                        setGoalAmount(value);
                                    }
                                }}
                                keyboardType={'numeric'}
                                dataDetectorTypes={'trackingNumber'}
                            />
                            <Text style={[styles.label, {marginBottom: 10}]}>배경 이미지</Text>
                            <Image
                                src={'https://i.ibb.co/FwZPSwD/Group-142-2.png'}
                                style={{width: '88%', height: '12.175%', marginBottom: 19}}
                                resizeMode={'cover'}></Image>
                            <Text style={[styles.label, {marginBottom: 10}]}>카테고리</Text>
                            <View style={styles.categoryContainer}>
                                {categories.map(category => (
                                    <TouchableOpacity
                                        key={category}
                                        style={[
                                            styles.categoryButton,
                                            selectedCategory === category &&
                                            styles.categoryButtonSelected,
                                        ]}
                                        //@ts-ignore
                                        onPress={() => handleCategoryPress(category)}>
                                        <Text
                                            style={[
                                                styles.categoryText,
                                                selectedCategory === category &&
                                                styles.categoryTextSelected,
                                            ]}>
                                            {category}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    if (itemList.length > 0) {
                                        Welspy.challenge.createChallenge({
                                            title: `${title}|//+**+//|${itemList[itemList.length - 1].title}|//+**+//|${memberLimit}`,
                                            description: `${description}|//+**+//|${itemList[itemList.length - 1].imageUrl}|//+**+//|${itemList[itemList.length - 1].detailUrl}`,
                                            imageUrl: file,
                                            goalAmount: Number(goalAmount),
                                            category: categoriesEnum[selectedCategory],
                                        });
                                    } else {
                                        Welspy.challenge.createChallenge({
                                            title: `${title}|//+**+//|()()()|//+**+//|${memberLimit}`,
                                            description: `${description}|//+**+//|()()()|//+**+//|()()()}`,
                                            imageUrl: file,
                                            goalAmount: Number(goalAmount),
                                            category: categoriesEnum[selectedCategory],
                                        });
                                    }
                                    Welspy.challenge.joinChallenge(Number(store.challengeState.getState().currentChallengeIdx) + 1)
                                }}
                                style={{
                                    width: '88%',
                                    height: '6%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#538eff',
                                    marginTop: '5%',
                                    borderRadius: Width / 50,
                                }}>
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontSize: Width / 21,
                                        fontWeight: '600',
                                    }}>
                                    챌린지 생성
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </ScrollView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F8F8',
    },
    itemInfoTitle: {
        fontSize: Width / 18,
        fontWeight: "600",
        marginLeft: "6%",
        alignSelf: 'flex-start',
        marginBottom: "9%",
        color: "#222"
    },
    itemInfoContainer: {
        width: '88%',
        height: "17%",
        borderRadius: Width/30,
    },
    itemSearchBarContainer: {
        width: '88%',
        height: '6%',
        marginTop: "5%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: "hidden",
    },
    itemSearchBarTextInput: {
        width: '100%',
        height: '100%',
        borderRadius: Width/30,
        backgroundColor: 'rgba(188,188,188,0.18)',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: "6%",
    },
    isVisibleContainer: {
        width: '100%',
        height: '8.5%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: "4.3%",
    },
    visibleButton: {
        width: '36%',
        height: '100%',
        borderRadius: Width/40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    SectionContainer: {
        width: Width,
        height: Height*1.2,
        alignItems: 'center',
    },
    label: {
        fontSize: 19,
        fontWeight: "700",
        alignSelf: "flex-start",
        marginLeft: "6%",
    },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 15,
        width: '88%',
        fontSize: 15.5,
        fontWeight: '500',
        marginBottom: 20,
    },
    fileUploadBox: {
        height: 100,
        borderWidth: 2,
        borderColor: '#ccc',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    categoryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        width: '88%',
    },
    categoryButton: {
        borderWidth: 2.5,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 7,
        width: Width / 4,
        height: Height / 21,
        marginBottom: 10,
    },
    categoryButtonSelected: {
        borderColor: '#538eff',
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ccc',
    },
    categoryTextSelected: {
        color: '#538eff',
    },
    submitButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
    }
})

export default CreateChallengeScreen;