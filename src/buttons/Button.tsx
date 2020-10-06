import React, {PropsWithChildren} from 'react';
import {
    View,
    StyleSheet,
    Animated, Easing,
} from 'react-native';

import Ripple, {RippleProps} from 'react-native-material-ripple';

export interface ButtonProps extends RippleProps, PropsWithChildren<any> {
    color: string,
    disabledColor: string,

    shadeColor: string,
    shadeOpacity: number,
    shadeBorderRadius: number,

    focusAnimation: Animated.Value,
    focusAnimationDuration: number,

    disableAnimation: Animated.Value,
    disableAnimationDuration: number,

    payload: any,
    style: any,

    useNativeDriver: boolean,
}

// @ts-ignore
export const ButtonDefaultProps: ButtonProps = {
    rippleContainerBorderRadius: 2,
    rippleSequential: true,

    hitSlop: { top: 6, right: 4, bottom: 6, left: 4 },

    color: 'rgb(224, 224, 224)',
    disabledColor: 'rgb(240, 240, 240)',

    shadeColor: 'rgb(0, 0, 0)',
    shadeOpacity: 0.12,
    shadeBorderRadius: 2,

    focusAnimationDuration: 225,
    disableAnimationDuration: 225,

    disabled: false,

    useNativeDriver: false,
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 2,
        justifyContent: 'space-around',
    },

    shadeContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },

    shade: {
        flex: 1,
    },
});

function Button(props: ButtonProps): JSX.Element {

    const [focusAnimation, setFocusAnimation] = React.useState(new Animated.Value(0));
    const [disableAnimation, setDisableAnimation] = React.useState(new Animated.Value(props.disabled ? 1 : 0));

    React.useEffect(() => {
        Animated
            .timing(
                disableAnimation,
                {
                    toValue: props.disabled ? 1 : 0,
                    duration: props.disableAnimationDuration,
                    useNativeDriver: props.useNativeDriver,
                })
            .start();
    }, [props.disabled]);

    const handlePress = React.useCallback(() => {
        if (props.onPress) {
            props.onPress(props.payload);
        }
    }, [props.onPress, props.payload]);

    const handleFocusChange = React.useCallback((focused: boolean) => {
        Animated
            .timing(focusAnimation, {
                toValue: focused ? 1 : 0,
                duration: props.focusAnimationDuration,
                easing: Easing.out(Easing.ease),
                useNativeDriver: props.useNativeDriver,
            })
            .start();
    }, [props.focusAnimationDuration, props.useNativeDriver]);

    const handlePressIn = React.useCallback(() => {
        handleFocusChange(true);
    }, []);

    const handlePressOut = React.useCallback(() => {
        handleFocusChange(false);
    }, []);

    const {
        color,
        disabledColor,
        shadeColor,
        shadeOpacity,
        shadeBorderRadius,
        style,
        children,
        ...rest
    } = props;

    const rippleStyle = {
        backgroundColor: disableAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [color, disabledColor],
        }),
    };

    const shadeContainerStyle = {
        borderRadius: shadeBorderRadius,
    };

    const shadeStyle = {
        backgroundColor: shadeColor,
        opacity: focusAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, shadeOpacity],
        }),
    };

    return (
        <Ripple
            {...rest}

            style={[styles.container, rippleStyle, style]}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
        >
            {children}

            <View style={[ styles.shadeContainer, shadeContainerStyle ]}>
                <Animated.View style={[ styles.shade, shadeStyle ]} />
            </View>
        </Ripple>
    );
}

Button.defaultProps = ButtonDefaultProps;

export default React.memo(Button);
