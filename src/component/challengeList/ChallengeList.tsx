import {FlatList, StyleSheet} from 'react-native';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import {ChallengeObject} from './ChallengeObject.tsx';

const challengeList = ({styles, renderItem} : {styles: any, renderItem: ChallengeResponseType[]}) => {
    return (
        <FlatList scrollEnabled={false} data={renderItem} renderItem={({item}) => (
            <ChallengeObject item={item}/>
        )} style={styles} />
    );
}

export default challengeList;