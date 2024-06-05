import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from '@react-navigation/native-stack';
import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  ScreenContainer,
  TextInput,
  useChatSdkContext,
  GlobalContainer as UikitContainer,
  ChatFragment
} from 'react-native-agora-chat-uikit';
import { ChatLog } from 'react-native-chat-sdk';

const dlog = new ChatLog();
dlog.tag = 'chat_uikit';

const Root = createNativeStackNavigator();

const RootParamsList: Record<string, object | undefined> = {
  Main: {},
  Chat: {},
};

const App = () => {
  return (
    <UikitContainer
      option={{
        appKey: '41900833#1069668',
        autoLogin: false,
        debugModel: true,
      }}
    >
      <NavigationContainer>
        <Root.Navigator initialRouteName="Main">
          <Root.Screen name="Main" component={MainScreen} />
          <Root.Screen name="Chat" component={ChatScreen} />
        </Root.Navigator>
      </NavigationContainer>
    </UikitContainer>
  );
};

function MainScreen({
  navigation,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  const placeholder1 = 'Please enter the user ID';
  const placeholder2 = 'Please enter the user token';
  const placeholder3 = 'Please enter the user ID of the peer user';
  const [id, setId] = React.useState('');
  const [token, setToken] = React.useState('');
  const [chatId, setChatId] = React.useState('');
  const { login: loginAction, logout: logoutAction } = useChatSdkContext();

  const login = () => {
    loginAction({
      id: id,
      pass: token,
      onResult: (result: { result: boolean; error?: any }) => {
        dlog.log('loginAction:', result.result, result.error);
      },
    });
  };
  const logout = () => {
    logoutAction({
      onResult: (result: { result: boolean; error?: any }) => {
        dlog.log('logout:', result.result, result.error);
      },
    });
  };
  const gotoChat = () => {
    if (chatId.length > 0) {
      navigation.push('Chat', { chatId: chatId, chatType: 0 });
    }
  };
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder1}
            value={id}
            onChangeText={(t) => {
              setId(t);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder={placeholder2}
            value={token}
            onChangeText={(t) => {
              setToken(t);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={login}>
            SIGN IN
          </Button>
          <Button style={styles.button} onPress={logout}>
            SIGN OUT
          </Button>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={placeholder3}
            value={chatId}
            onChangeText={(t) => {
              setChatId(t);
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button style={styles.button} onPress={gotoChat}>
            START CHAT
          </Button>
        </View>
      </View>
    </ScreenContainer>
  );
}

function ChatScreen({
  route,
}: NativeStackScreenProps<typeof RootParamsList>): JSX.Element {
  return (
    <ScreenContainer mode="padding" edges={['right', 'left', 'bottom']}>
      <ChatFragment
        screenParams={{
          params: route.params as any,
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  button: {
    height: 40,
    marginHorizontal: 10,
  },
  inputContainer: {
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderBottomColor: '#0041FF',
    borderBottomWidth: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
});

export default App;