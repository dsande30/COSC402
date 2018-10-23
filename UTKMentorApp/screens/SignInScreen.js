import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';

import Amplify, { Auth } from 'aws-amplify';

export default class SignUp extends React.Component {

  state = {
    email: '',
    password: '',
    user: {}
  };

  onChangeText(key, value) {
    console.log(key);
    this.setState({
      [key]: value
    })
  }

  signIn() {
    const { email, password } = this.state
    Auth.signIn(email, password)
    .then(user => {
      this.setState({ user })
      this.props.navigation.navigate('Home', { data: user })
      console.log('successful sign in!')
    })
    .catch(err => console.log('error signing in: ', err))
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={require('../assets/logo.png')}
          />
          <Text style={styles.title}>The Engineering Mentor Program</Text>
        </View>
        <KeyboardAvoidingView style={styles.form} behavior="padding" enabled>
          <TextInput
            onChangeText={value => this.onChangeText('email', value)}
            style={styles.input}
            keyboardType='email-address'
            underlineColorAndroid='transparent'
            autoCorrect={false}
            autoCapitalize='none'
            onSubmitEditing={() => this.passwordInput.focus()}
            returnKeyType='next'
            placeholder='email'
          />
          <TextInput
            onChangeText={value => this.onChangeText('password', value)}
            style={styles.input}
            underlineColorAndroid='transparent'
            secureTextEntry={true}
            placeholder='password'
            onSubmitEditing={this.signIn.bind(this)}
            returnKeyType='go'
            ref={(input) => this.passwordInput = input}
          />
        </KeyboardAvoidingView>
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSignIn}
            onPress={this.signIn.bind(this)}>
            <Text style={styles.btnText}>Sign In</Text>
          </TouchableOpacity>
          <Text style={styles.signUpText}>New user? Sign up below!</Text>
          <TouchableOpacity
            style={styles.btnSignUp}
            onPress={() => this.props.navigation.navigate('SignUp')}>
            <Text style={styles.btnText}>Create a New Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 50,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    color: '#58595B',
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'center',
    fontSize: 24
  },
  form: {
    padding: 20,
    flexGrow: 1,
  },
  btnSignIn: {
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
  },
  btnSignUp: {
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginTop: 20
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  signUpText: {
    marginTop: 120,
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  }
});
