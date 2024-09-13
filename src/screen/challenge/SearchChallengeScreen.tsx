import {
    Image,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import Welspy from '../../hooks/Welspy.ts';
import store from '../../state/store.ts';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import ChallengeList from '../../component/challengeList/ChallengeList.tsx';
import {SearchStackNavigationType} from '../../type/navigationType/SearchStackNavigationType.ts';
import {Height, Width} from '../../config/global/dimensions.ts';

const SearchChallengeScreen = () => {

    const fullNavigation = useNavigation();
    const navigation = useNavigation<NavigationProp<SearchStackNavigationType>>();

    const [fullList, setFullList] = useState<ChallengeResponseType[]>([]);
    const [renderFullList, setRenderFullList] = useState<ChallengeResponseType[]>([]);

    const {hookQueue, queueSequence} = store.hookState(state => state)
    const {isReadyGetFull} = store.challengeState(state => state)
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
    const categories = ['여행', '디지털', '패션', '취미', '인테리어', '기타'];

    const categoriesEnum = {
        'TRAVEL' : '여행',
        'DIGITAL' : '디지털',
        'FASHION' : '패션',
        'TOYS' : '취미',
        'INTERIOR' : '인테리어',
        'ETC' : '기타'
    }

    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {
        setRenderFullList(fullList);
    }, [fullList]);

    useEffect(() => {
        console.log('test')
        store.challengeState.setState({isReadyGetFull: true})
        Welspy.challenge.getChallengeList(1, 99)
        return () => {
            store.challengeState.setState({isReadyGetFull: false})
        }
    }, [fullNavigation]);

    useEffect(() => {
        console.log(selectedCategory);
        if (fullList.length > 0) {
            console.log('test');
            if (selectedCategory.length > 0) {
                setRenderFullList(fullList.filter((item) => {
                    //@ts-ignore
                    console.log(categoriesEnum[item?.category])
                    //@ts-ignore
                    if(selectedCategory.includes(categoriesEnum[item?.category])) {
                        return item;
                    }
                } ));
            } else {
                console.log("none selected")
                setRenderFullList(fullList);
            }
        }
    }, [selectedCategory]);

    useEffect(() => {
        if(queueSequence[0] == "room/list?GET"){
            if(isReadyGetFull) {
                console.log(queueSequence);
                console.log(hookQueue);
                setFullList(hookQueue[0].response.data.data)
                store.hookState.setState({hookQueue: [], queueSequence: []});
            }
        } else if(queueSequence[0] == "room/list/search?GET") {
            console.log(queueSequence);
            console.log(hookQueue);
            setFullList(hookQueue[0].response.data.data)
            store.hookState.setState({hookQueue: [], queueSequence: []});
        }
    }, [queueSequence]);

    const handleCategoryPress = (category : '여행'| '디지털'| '패션'| '취미'| '인테리어'| '기타') => {
        setSelectedCategory(prev => prev.includes(category) ? prev.filter(item => item != category) : [...prev, category]);
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <View style={styles.searchBar}>
                            <TextInput
                                value={searchText}
                                placeholder={"검색어를 입력하세요"}
                                style={{width: "89%", height: "100%", alignSelf: 'center', paddingHorizontal: 7.5}}
                                onChangeText={setSearchText}
                                onSubmitEditing={() => {
                                    if(searchText == "") {
                                        Welspy.challenge.getChallengeList(1, 99)
                                    } else {
                                        Welspy.challenge.searchChallenge(1, 999, searchText);
                                    }
                                }}
                            />
                            <Pressable style={{width:'9.25%', height:'60%', alignSelf: 'center'}}>
                                <Image src={"https://i.ibb.co/W3yq4wN/Group-29-3.png"} style={{width: "100%", height: "100%"}}></Image>
                            </Pressable>
                        </View>
                        <View style={styles.categorySectionContainer}>
                            {categories.map(category => (
                                <TouchableOpacity
                                    key={category}
                                    style={[
                                        styles.categoryButton,
                                        selectedCategory.includes(category) &&
                                        styles.categoryButtonSelected,
                                    ]}
                                    //@ts-ignore
                                    onPress={() => handleCategoryPress(category)}>
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            selectedCategory.includes(category) &&
                                            styles.categoryTextSelected,
                                        ]}>
                                        {category}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <ChallengeList styles={{}} renderItem={[...renderFullList, {}]} create={() => {navigation.navigate('searchCreate')}} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: Width,
        backgroundColor: '#F8F8F8',
        overflow: 'visible',
    },
    header: {
        width: '100%',
        height: Height/4,
    },
    searchBar: {
        width: Width / (100/90),
        alignSelf: 'center',
        height: "24%",
        backgroundColor: '#F8F8F8',
        borderRadius: Width/17.5,
        borderWidth: 1.5,
        borderColor: '#357bff',
        marginTop: Height/40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: Width/25,
    },
    categorySectionContainer: {
        width: '96%',
        alignSelf: 'center',
        height: "49%",
        // backgroundCor: '#ff0000',
        padding: Width/30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
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
})

export default SearchChallengeScreen;