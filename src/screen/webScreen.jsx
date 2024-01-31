import React, { useEffect } from 'react';

import {
    StatusBar,
    ActivityIndicator,
    Text,
    Platform,
    View,
    Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Config from "react-native-config";
import Geolocation from '@react-native-community/geolocation';

const INJECTED_JAVASCRIPT = `(function() {
    const authLocalStorage = window.localStorage.getItem('authToken');
    const clientLocalStorage = window.localStorage.getItem('client');
    const userProfileIdLocalStorage = window.localStorage.getItem('userProfileId');

    const obj = {
        authLocalStorage,
        clientLocalStorage,
        userProfileIdLocalStorage
    }

    const getItemLocalStorage = JSON.stringify(obj);
    window.ReactNativeWebView.postMessage(getItemLocalStorage);
})();`;

export const getGeoLocationJS = () => {
    const getCurrentPosition = `
      navigator.geolocation.getCurrentPosition = (success, error, options) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'getCurrentPosition', options: options }));
  
        window.addEventListener('message', (e) => {
          let eventData = {}
          try {
            eventData = JSON.parse(e.data);
          } catch (e) {}
  
          if (eventData.event === 'currentPosition') {
            success(eventData.data);
          } else if (eventData.event === 'currentPositionError') {
            error(eventData.data);
          }
        });
      };
      true;
    `;
  
    const watchPosition = `
      navigator.geolocation.watchPosition = (success, error, options) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'watchPosition', options: options }));
  
        window.addEventListener('message', (e) => {
          let eventData = {}
          try {
            eventData = JSON.parse(e.data);
          } catch (e) {}
  
          if (eventData.event === 'watchPosition') {
            success(eventData.data);
          } else if (eventData.event === 'watchPositionError') {
            error(eventData.data);
          }
        });
      };
      true;
    `;
  
    const clearWatch = `
      navigator.geolocation.clearWatch = (watchID) => {
        window.ReactNativeWebView.postMessage(JSON.stringify({ event: 'clearWatch', watchID: watchID }));
      };
      true;
    `;
  
    return `
      (function() {
        ${getCurrentPosition}
        ${watchPosition}
        ${clearWatch}
      })();
    `;
  };

let webview = null;

const isIOS = Platform.OS === 'ios';
const { height } = Dimensions.get('window');

const WebScreen = (props) => {
    const { diviceToken,webUrl } = props;

    
console.log(diviceToken,"diviceToken")
    const [location, setLocation] = React.useState({});
    const [status, setStatus] = React.useState(null);
    
    const onMessage = (payload) => {
        console.log('payload asses', payload);
    };


    const WebviewRender = () => {
        if (webUrl?.length > 0) {
            return <WebView
                injectedJavaScript={getGeoLocationJS()}
                onMessage={ event => {
                    let data = {}
                    try {
                      data = JSON.parse(event.nativeEvent.data);
                    } catch (e) {
                      console.log(e);
                    }
                
                    if (data?.event && data.event === 'getCurrentPosition') {
                      Geolocation.getCurrentPosition((position) => {
                        webview.postMessage(JSON.stringify({ event: 'currentPosition', data: position }));
                      }, (error) => {
                        webview.postMessage(JSON.stringify({ event: 'currentPositionError', data: error }));
                      }, data.options);
                    } else if (data?.event && data.event === 'watchPosition') {
                      Geolocation.watchPosition((position) => {
                        webview.postMessage(JSON.stringify({ event: 'watchPosition', data: position }));
                      }, (error) => {
                        webview.postMessage(JSON.stringify({ event: 'watchPositionError', data: error }));
                      }, data.options);
                    } else if (data?.event && data.event === 'clearWatch') {
                      Geolocation.clearWatch(data.watchID);
                    } 
                  }}
                  ref={ ref => {
                    webview = ref;
                    // if (onRef) {
                    //   onRef(webview)
                    // }
                  }}
                overScrollMode='never'
                pullToRefreshEnabled={true}

                cacheEnabled={true}
                // cacheMode={'LOAD_NO_CACHE'}
                source={{ uri: webUrl }} style={{ marginTop: isIOS ? 0 : 10 }}

                geolocationEnabled={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                
                cacheMode={'LOAD_DEFAULT'}
                sharedCookiesEnabled={true}
                setBuiltInZoomControls={false}

                useWebKit
                originWhitelist={['*']}
                incognito={false}

                mediaCapturePermissionGrantType="grantIfSameHostElsePrompt"

                geolocationPermissionRequest={(request) => {
                  if (true) {
                    // You have geolocation permission
                    request.grant();
                  } else {
                    // You don't have geolocation permission
                    request.deny();
                  }
                }}
            />
        } else {
            return <ActivityIndicator size="large" />
        }
    }

    return (
        <View style={{flex: 1,backgroundColor:"#1976d2"}}>
            <SafeAreaProvider style={{flex: 1}}>
                <StatusBar translucent backgroundColor={"#1976d2"} barStyle="light-content"/>
                <SafeAreaView style={{flex:1, paddingBottom: isIOS && height < 812 ? -1 : -40}}>
                    <WebviewRender />
                </SafeAreaView>
            </SafeAreaProvider>
        </View>
    );
}

export default WebScreen;