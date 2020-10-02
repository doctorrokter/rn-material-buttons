import React from 'react';
import {
    View,
    StyleSheet, Platform, Animated,
} from 'react-native';
import RN from 'react-native/package.json';

import {RaisedTextButtonDefaultProps, RaisedTextButtonProps} from "./RaisedTextButton";
import Button from "./Button";

export interface TextButtonProps extends RaisedTextButtonProps {}

export const TextButtonDefaultProps: TextButtonProps = {
    ...RaisedTextButtonDefaultProps,

    color: 'transparent',
    disabledColor: 'transparent',

    titleColor: 'rgb(0, 0, 0)',
    disabledTitleColor: 'rgba(0, 0, 0, .26)',

    shadeOpacity: 0.20,
};

const style: any = {};
// @ts-ignore
const [, major, minor] = RN.version.match(/^(\d+)\.(\d+)\.(.+)$/);

if ('android' === Platform.OS) {
    style.textAlignVertical = 'center';

    if (!major && minor >= 40) {
        style.includeFontPadding = false;
    }
}

const styles = StyleSheet.create({
    container: {
        height: 36,
        minWidth: 64,
        paddingHorizontal: 8,
    },

    title: {
        textAlign: 'center',
        textTransform: 'uppercase',

        backgroundColor: 'transparent',

        fontSize: 14,
        fontWeight: '500',

        ...style,
    },
});

function TextButton(props: TextButtonProps): JSX.Element {

    const [disableAnimation, setDisableAnimation] = React.useState(new Animated.Value(props.disabled ? 1 : 0));

    const {
        title,
        titleColor,
        titleStyle,
        disabledTitleColor,
        style,
        shadeColor,
        ...rest
    } = props;

    const titleStyleOverrides = {
        color: disableAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [titleColor, disabledTitleColor],
        }),
    };

    return (
        <Button
            style={[styles.container, style]}
            shadeColor={titleColor}
            rippleColor={titleColor}
            {...rest}
            disableAnimation={disableAnimation}
        >
            <Animated.Text
                style={[styles.title, titleStyle, titleStyleOverrides]}
                numberOfLines={1}
            >
                {title}
            </Animated.Text>
        </Button>
    );
}

TextButton.defaultProps = TextButtonDefaultProps;

export default React.memo(TextButton);
