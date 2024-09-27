import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Platform,
    UIManager,
    LayoutAnimation,
    Pressable,
    Image,
    ScrollView,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    ImageURISource,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {BottomTabNavigationType} from '../../type/navigationType/BottomTabNavigationType.ts';
import {useEffect, useRef, useState} from 'react';
import {Height, Width} from '../../config/global/dimensions.ts';
import DismissButton from '../../component/DismissButton.tsx';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error
import BottomSheet from "react-native-gesture-bottom-sheet"
import ChallengeItemSelectScreen from './ChallengeItemSelectScreen.tsx';
import store from '../../state/store.ts';
import Welspy from '../../hooks/Welspy.ts';
import {ImageLibraryOptions, launchImageLibrary} from "react-native-image-picker"

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

    const scrollViewRef = useRef<ScrollView>(null);

    const [img, setImg] = useState<ImageURISource>({uri:''})

    const {itemList} = store.challengeItemState(state => state)
    const {isReadyGetFull} = store.challengeState(state => state)
    const [isPublic, setIsPublic] = useState(true);

    const [searchItem, setSearchItem] = useState('');
    const [memberLimit, setMemberLimit] = useState(1);

    const [renderItemList, setRenderItemList] = useState([]);

    const BottomSheetRef = useRef<BottomSheet>(null);


    useEffect(() => {
        if (queueSequence.includes("room?POST")) {
            hookQueue.map((item) => {console.log(item)});
            store.hookState.setState({hookQueue : [], queueSequence : []});
            setIndex(2)
        } else if (queueSequence.includes("product/search?GET")) {
            if(hookQueue[0].isSuccess) {
                console.log(hookQueue[0].response?.data?.data);
                setRenderItemList(hookQueue[0].response?.data?.data);
                if (hookQueue[0].response?.data?.data?.length == 0) {
                    Alert.alert("실패", "검색 상품이 없습니다")
                } else {
                    BottomSheetRef.current.show()
                }
            } else {
                Alert.alert("실패", "검색 상품이 없습니다")
                setRenderItemList([]);
            }
            store.hookState.setState({hookQueue : [], queueSequence : []});
        } else if (queueSequence.includes("product/list?GET")) {
            if(hookQueue[0].isSuccess) {
                console.log(hookQueue[0].response?.data?.data);
                setRenderItemList(hookQueue[0].response?.data?.data);
                if (hookQueue[0].response?.data?.data?.length == 0) {
                    Alert.alert("실패", "검색 상품이 없습니다")
                } else {
                    BottomSheetRef.current.show()
                }
            } else {
                Alert.alert("실패", "현재 상품이 없습니다")
                setRenderItemList([]);
            }
            store.hookState.setState({hookQueue : [], queueSequence : []});
        }
    }, [queueSequence]);

    const showPhoto = async ()=> {
        const option: ImageLibraryOptions = {
            mediaType : "photo",
            selectionLimit : 1,
        }

        const response = await launchImageLibrary(option)

        if(response.didCancel) Alert.alert('취소')
        else if(response.errorMessage) Alert.alert('Error : '+ response.errorMessage)
        else {
            console.log(response.assets)
        }
    }

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
                        <View style={styles.itemSearchBarContainer}>
                            <View style={styles.searchBar}>
                                <TextInput
                                    value={searchItem}
                                    placeholder={"검색어를 입력하세요"}
                                    style={{width: "89%", height: "100%", alignSelf: 'center', paddingHorizontal: 7.5}}
                                    onChangeText={setSearchItem}
                                    autoCapitalize={'none'}
                                    onSubmitEditing={() => {
                                        if(searchItem == "") {
                                            Welspy.product.getProductList(1, 99);
                                        } else {
                                            Welspy.product.searchProduct(1, 99, searchItem);
                                        }
                                    }}
                                />
                                <Pressable style={{width:'9.25%', height:'55%', alignSelf: 'center'}}>
                                    <Image src={"https://i.ibb.co/W3yq4wN/Group-29-3.png"} style={{width: "90%", height: "100%"}}></Image>
                                </Pressable>
                            </View>
                        </View>
                        <Text style={styles.itemInfoTitle}>챌린지 목표 상품</Text>
                        <View
                            style={[
                                styles.itemInfoContainer,
                                {
                                    backgroundColor: 'white',
                                    alignItems: 'center',
                                    marginTop: 10,
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
                                                width: '90%',
                                                alignItems: 'flex-start',
                                            },
                                        ]}>
                                        <Text
                                            numberOfLines={3}
                                            style={{
                                                fontSize: Width / 28,
                                                fontWeight: '500',
                                                width: '90%',
                                                marginTop: -3,
                                                marginBottom: 5,
                                            }}>
                                            {itemList[itemList.length - 1].name}
                                        </Text>
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
                                        <View style={{flexDirection: 'row'}}>
                                            <Image
                                                src={itemList[itemList.length - 1].imageUrl}
                                                style={{
                                                    width: Width / 4,
                                                    height: Height / 8,
                                                    marginRight: 6,
                                                    marginLeft: -15,
                                                    backgroundColor: 'transparent',
                                                    resizeMode: 'contain'
                                                }}
                                            />
                                            <View style={{width: '51%'}}>
                                                <Text
                                                    style={{
                                                        fontSize: Width / 38,
                                                        fontWeight: '300',
                                                        width: '60%',
                                                        color: '#777777',
                                                        textDecorationLine: "line-through",
                                                        marginTop: 6
                                                    }}>
                                                    {itemList[itemList.length - 1]?.price}
                                                    원
                                                </Text>
                                                <Text
                                                    style={{
                                                        fontSize: Width / 25,
                                                        fontWeight: '600',
                                                        color: '#2e77ff',
                                                        marginTop: 4,
                                                    }}>
                                                    {itemList[itemList.length - 1]?.discount}
                                                    % 할인
                                                </Text>
                                                <View style={{flexDirection: 'row', width: "70%"}}>
                                                    <Text
                                                        style={{
                                                            fontSize: Width / 23,
                                                            fontWeight: '500',
                                                            color: '#000000',
                                                        }}>
                                                        {itemList[itemList.length - 1]?.discountedPrice}
                                                        원
                                                    </Text>
                                                </View>
                                            </View>
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
                        <Text
                            style={[
                                styles.itemInfoTitle,
                                {marginTop: Height / 22.5, marginBottom: -3},
                            ]}>
                            공개 여부
                        </Text>
                        <View style={styles.isVisibleContainer}>
                            <TouchableOpacity
                                onPress={() => setIsPublic(true)}
                                style={[
                                    styles.visibleButton,
                                    {
                                        borderWidth: 2.5,
                                        borderColor: isPublic
                                            ? '#538eff'
                                            : '#ccc'
                                    },
                                ]}>
                                <Text
                                    style={{
                                        fontSize: Width / 23,
                                        fontWeight: '500',
                                        color: isPublic
                                            ? '#538eff'
                                            : '#ccc',
                                    }}>
                                    공개
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setIsPublic(false)}
                                style={[
                                    styles.visibleButton,
                                    {
                                        borderWidth: 2.5,
                                        borderColor: !isPublic
                                            ? '#538eff'
                                            : '#ccc'
                                    },
                                ]}>
                                <Text
                                    style={{
                                        fontSize: Width / 23,
                                        fontWeight: '500',
                                        color: !isPublic
                                            ? '#538eff'
                                            : '#ccc'
                                    }}>
                                    비공개
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <Text
                            style={[
                                styles.itemInfoTitle,
                                {marginTop: Height / 45, marginBottom: 10},
                            ]}>
                            최대 인원수 (명)
                        </Text>
                        <View
                            style={{
                                width: '90%',
                                height: '8%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
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
                                    fontSize: 32,
                                    color: '#9e9e9e',
                                    marginTop: -3,
                                }}>
                                ⊖
                            </Text>
                            <TextInput
                                style={[
                                    styles.input,
                                    {width: '60%', textAlign: 'center', height: '70%', fontSize: 20, paddingBottom:0},
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
                                    fontSize: 32,
                                    color: '#9e9e9e',
                                    marginTop: -3,
                                }}>
                                ⊕
                            </Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                                if (itemList[itemList.length - 1]) {
                                    setTitle(
                                        `${
                                            itemList[itemList.length - 1]?.name
                                                ? itemList[itemList.length - 1]?.name
                                                    ?.split(' ')
                                                    .slice(0, 3)
                                                    .reduce((accumulator, currentValue) => {
                                                        return accumulator + ' ' + currentValue;
                                                    })
                                                : '부자를 향해'
                                        } 돈 모으기`,
                                    );
                                    setGoalAmount(
                                        itemList[itemList.length - 1]?.discountedPrice.toString()
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
                                    itemList[itemList.length - 1]?.name
                                        ? itemList[itemList.length - 1]?.name
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
                            <TouchableOpacity style={{width: '88%', height: '12.175%', marginBottom: 19}} onPress={() => {showPhoto()}}>
                                <Image
                                    src={'https://i.ibb.co/FwZPSwD/Group-142-2.png'}
                                    style={{width: "100%", height: "100%"}}
                                    resizeMode={'cover'}></Image>
                            </TouchableOpacity>
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
                                        /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
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
                                            title: `${title}`,
                                            description: `${description}`,
                                            goalMoney: Number(goalAmount),
                                            memberLimit: memberLimit,
                                            imageUrl: `${img.uri}`,
                                            category: categoriesEnum[selectedCategory],
                                            roomType: isPublic? "PUBLIC" : "PRIVATE",
                                            productId: itemList[itemList.length - 1]?.idx,
                                            productImageUrl: itemList[itemList.length - 1]?.imageUrl,
                                        });

                                    } else {
                                        Welspy.challenge.createChallenge({
                                            title: `${title}`,
                                            description: `${description}`,
                                            goalMoney: Number(goalAmount),
                                            memberLimit: memberLimit,
                                            imageUrl: `${img.uri}`,
                                            category: categoriesEnum[selectedCategory],
                                            roomType: isPublic? "PUBLIC" : "PRIVATE",
                                            productImageUrl: "",
                                            productId: 0,
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
                    <View style={styles.SectionContainer}>

                    </View>
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
        fontSize: Width / 25,
        fontWeight: "500",
        marginLeft: "6.3%",
        alignSelf: 'flex-start',
        color: "#222"
    },
    itemInfoContainer: {
        width: '88%',
        height: "17%",
        borderRadius: Width/30,
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.015
    },
    itemSearchBarContainer: {
        width: '90%',
        height: '5.6%',
        marginTop: "5%",
        marginBottom: "3.5%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        overflow: 'visible'
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
        height: '8%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: "5.5%",
        paddingVertical: "4.3%",
    },
    searchBar: {
        width: Width / (100/90),
        alignSelf: 'center',
        height: "90%",
        backgroundColor: '#F8F8F8',
        borderRadius: Width/17.5,
        borderWidth: 1.5,
        borderColor: '#357bff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Width/25,
    },
    visibleButton: {
        width: '44%',
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