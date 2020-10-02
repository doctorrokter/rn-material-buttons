import React from 'react';
import {
    StyleSheet,
    Platform, Animated,
} from 'react-native';
import Button, {ButtonDefaultProps, ButtonProps} from './Button';

export interface RaisedButtonProps extends ButtonProps {}

export const RaisedButtonDefaultProps: RaisedButtonProps = {
    ...ButtonDefaultProps,
};

const styles = StyleSheet.create({
    container: {
        height: 36,
        minWidth: 88,
        paddingHorizontal: 16,

        ...Platform.select({
            android: {
                elevation: 2,
            },
        }),
    },
});

function RaisedButton(props: RaisedButtonProps): JSX.Element {

    const [focusAnimation, setFocusAnimation] = React.useState(new Animated.Value(0));
    const [disableAnimation, setDisableAnimation] = React.useState(new Animated.Value(props.disabled ? 1 : 0));

    const { style, children, ...rest } = props;

    const animation = Animated
        .subtract(focusAnimation, disableAnimation);

    const buttonStyle = Platform.select({
        ios: {
            shadowOpacity: disableAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [0.30, 0],
            }),

            shadowRadius: animation.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 2, 4],
            }),

            shadowOffset: {
                width: 0,

                height: animation.interpolate({
                    inputRange: [-1, 0, 1],
                    outputRange: [0, 1, 2],
                }),
            },
        },

        android: {
            elevation: animation.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [0, 2, 8],
            }),
        },
    });

    return (
        <Button
            {...rest}
            style={[ styles.container, buttonStyle, style ]}
            focusAnimation={focusAnimation}
            disableAnimation={disableAnimation}
        >
            {children}
        </Button>
    );
}

RaisedButton.defaultProps = RaisedButtonDefaultProps;

export default React.memo(RaisedButton);
