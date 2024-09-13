import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {Path, Defs, LinearGradient, Stop, Circle} from 'react-native-svg';

interface CircleGraphType {
    radius: number;
    strokeWidth: number;
    percentage: number;
    color1: string;
    color2: string;
}

const CircleGraph: React.FC<CircleGraphType> = ({radius, strokeWidth, percentage, color1, color2,}) => {
    const x1 = radius + (radius - strokeWidth / 2) * Math.cos(-90 * Math.PI / 180);
    const y1 = radius + (radius - strokeWidth / 2) * Math.sin(-90 * Math.PI / 180);
    const x2 = radius + (radius - strokeWidth / 2) * Math.cos((-90+((percentage / 100) * 360)) * Math.PI / 180);
    const y2 = radius + (radius - strokeWidth / 2) * Math.sin((-90+((percentage / 100) * 360)) * Math.PI / 180);

    const pathData = `
        M ${x1},${y1}
        A ${radius - strokeWidth / 2},${radius - strokeWidth / 2} 0 ${(percentage / 100) * 360 > 180 ? 1 : 0},1 ${x2},${y2}
    `;

    return (
        <View style={styles.container}>
            <Svg width={radius * 2} height={radius * 2}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
                        <Stop offset="0%" stopColor={color1} />
                        <Stop offset="100%" stopColor={color2} />
                    </LinearGradient>
                </Defs>
                <Circle
                    cx={radius}
                    cy={radius}
                    r={radius - strokeWidth / 2}
                    stroke="#d3d3d3"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Path
                    d={pathData}
                    stroke="url(#grad)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="none"
                />
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CircleGraph;
