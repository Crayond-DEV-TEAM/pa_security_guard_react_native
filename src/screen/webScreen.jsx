import React from 'react';

import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
} from 'react-native';

import { WebView } from 'react-native-webview';

const INJECTED_JAVASCRIPT = `(function() {
    const authLocalStorage = window.localStorage.getItem('auth_token');
    const clientLocalStorage = window.localStorage.getItem('user_id');
    const userProfileIdLocalStorage = window.localStorage.getItem('accessType');

    const obj = {
        authLocalStorage,
        clientLocalStorage,
        userProfileIdLocalStorage
    }

    const getItemLocalStorage = JSON.stringify(obj);
    window.ReactNativeWebView.postMessage(getItemLocalStorage);
})();`;


const WebScreen = (props) => {
    const { diviceToken } = props;

    // console.log(`https://dev-resident-v3.propertyautomate.com/login/?deviceToken=${diviceToken}`+ ' diviceToken');
    const onMessage = (payload) => {
        console.log('payload asses', payload);
    };

    const WebviewRender = () => {
            return <WebView
                injectedJavaScript={INJECTED_JAVASCRIPT}
                onMessage={onMessage}
                source={{ uri: `https://dev-security-guard-v2.propertyautomate.com/` }} style={{ marginTop: 20 }} />
    }

    return (
        <SafeAreaView style={styles.container}>
            <WebviewRender />
        </SafeAreaView>
    );
}

export default WebScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: -StatusBar.currentHeight + 10,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
});