import React from 'react';

import {
    // SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    Dimensions,
    View,
    Platform,
} from 'react-native';

import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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

const isIOS = Platform.OS === 'ios';
const { height } = Dimensions.get('window');

const WebScreen = (props) => {
    const { diviceToken,webUrl } = props;

    // console.log(`https://dev-resident-v3.propertyautomate.com/login/?deviceToken=${diviceToken}`+ ' diviceToken');
    const onMessage = (payload) => {
        // console.log('payload asses', payload);
    };

    const WebviewRender = () => {
            return <WebView
                injectedJavaScript={INJECTED_JAVASCRIPT}
                onMessage={onMessage}
                incognito={true}
                cacheEnabled={false}
                cacheMode={'LOAD_NO_CACHE'}
                style={{ marginTop: isIOS ? 0 : 10 }}
                source={{ uri: webUrl }}
                />
    }

    return (
        <View style={{flex: 1,backgroundColor:"#5078e1"}}>
            <SafeAreaProvider style={{flex: 1}}>
                <StatusBar translucent backgroundColor={"#5078e1"} barStyle="light-content"/>
                <SafeAreaView style={{flex:1, paddingBottom: isIOS && height < 812 ? -1 : -40}}>
                    <WebviewRender />
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
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