import React from 'react';
import {
    StyleSheet, Platform, Animated,
} from 'react-native';
import RN from 'react-native/package.json';
import RaisedButton, {RaisedButtonDefaultProps, RaisedButtonProps} from "./RaisedButton";

export interface RaisedTextButtonProps extends RaisedButtonProps {
    title: string,
    titleColor: string,
    titleStyle: any,
    disabledTitleColor: string,
}

// @ts-ignore
export const RaisedTextButtonDefaultProps: RaisedTextButtonProps = {
    ...RaisedButtonDefaultProps,
    titleColor: 'rgb(66, 66, 66)',
    disabledTitleColor: 'rgba(0, 0, 0, .26)',
    titleStyle: null,
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
    title: {
        textAlign: 'center',
        textTransform: 'uppercase',

        backgroundColor: 'transparent',

        fontSize: 14,
        fontWeight: '500',

        ...style,
    },
});

function RaisedTextButton(props: RaisedTextButtonProps): JSX.Element {

    const [disableAnimation, setDisableAnimation] = React.useState(new Animated.Value(props.disabled ? 1 : 0));

    const {
        title,
        titleColor,
        titleStyle,
        disabledTitleColor,
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
        <RaisedButton
            rippleColor={titleColor}
            shadeColor={titleColor}
            {...rest}
            disableAnimation={disableAnimation}>
            <Animated.Text
                style={[styles.title, titleStyle, titleStyleOverrides]}
                numberOfLines={1}
            >
                {title}
            </Animated.Text>
        </RaisedButton>
    );
}

RaisedTextButton.defaultProps = RaisedTextButtonDefaultProps;

export default React.memo(RaisedTextButton);
