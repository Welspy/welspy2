import {FlatList, StyleSheet} from 'react-native';
import {ChallengeResponseType} from '../../type/responseType/ChallengeResponseType.ts';
import {ChallengeObject} from './ChallengeObject.tsx';

const challengeList = ({styles, renderItem, create} : {styles: any, renderItem: ChallengeResponseType[], create: any}) => {
    return (
        <FlatList scrollEnabled={false} data={renderItem} renderItem={({item}) => (
            <ChallengeObject create={create} item={item}/>
        )} style={styles} />
    );
}

export default challengeList;