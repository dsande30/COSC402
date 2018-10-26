import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  Keyboard,
  View,
  Picker,
  Image,
  TouchableOpacity,
  Text,
  ScrollView
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

import Amplify, { Auth, API } from 'aws-amplify';

export default class SignUp extends React.Component {

  state = {
    email: '',
    password: '',
    phone_number: '',
    name: '',
    role: 'Mentee'
  };

  onChangeText(key, value) {
    console.log(value);
    this.setState({
      [key]: value
    })
  }

  signUp() {
    Auth.signUp({
      username: this.state.email,
      password: this.state.password,
      attributes: {
        email: this.state.email,
        name: this.state.name,
        phone_number: this.state.phone_number,
        'custom:role': this.state.role
      }
    })
    .then( () => {
      Auth.signIn(this.state.email, this.state.password)
      .then( async () => {
        let user_data = {}
        let sample_goals = {}
        let sample_pair = []
        let user_role = false
        user_data.name = this.state.name
        user_data.email = this.state.email
        user_data.phone = this.state.phone_number
        if (this.state.role === 'Mentee') {
          user_role = false
        }
        else {
          user_role = true
        }
        console.log('calling api');
        const response = await API.post('dynamoAPI', '/items', {
          body: {
            userid: this.state.email,
            user_data: user_data,
            mentor: user_role,
            pairings: sample_pair,
            goals: sample_goals
          }
        });
      })
      .then(user => {
        this.props.navigation.navigate('Home', { data: user })
        console.log('successful sign in!')
      })
      .catch(err => console.log('error signing in: ', err))
    })
    .catch(err => console.log('error signing up: ', err))
  }

  render() {
    let roles = [
      {label: 'Mentee', value: 'Mentee' },
      {label: 'Mentor', value: 'Mentor' }
    ];
    return (
      <KeyboardAwareScrollView enableOnAndroid={true}
       enableAutoAutomaticScroll={(Platform.OS === 'ios')}>
          <KeyboardAvoidingView style={styles.container}  behavior="padding" enabled>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
                />
            </View>
            <View style={styles.form}>
              <Text style={styles.title}>New Account Registration</Text>
              <TextInput
                onChangeText={value => this.onChangeText('email', value)}
                style={styles.input}
                keyboardType='email-address'
                keyboardAppearance='dark'
                autoCorrect={false}
                autoCapitalize='none'
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => this.passwordInput.focus()}
                returnKeyType='next'
                placeholder='email'
              />
              <TextInput
                onChangeText={value => this.onChangeText('password', value)}
                style={styles.input}
                secureTextEntry={true}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                placeholder='password'
                returnKeyType='next'
                onSubmitEditing={() => this.nameInput.focus()}
                ref={(input) => this.passwordInput = input}
              />
              <TextInput
                onChangeText={value => this.onChangeText('name', value)}
                style={styles.input}
                blurOnSubmit={false}
                keyboardAppearance='dark'
                underlineColorAndroid='transparent'
                placeholder='name'
                returnKeyType='next'
                onSubmitEditing={() => this.phoneInput.focus()}
                ref={(input) => this.nameInput = input}
              />
              <TextInput
                onChangeText={value => this.onChangeText('phone_number', value)}
                style={styles.input}
                blurOnSubmit={false}
                keyboardType='phone-pad'
                keyboardAppearance='dark'
                returnKeyType='done'
                underlineColorAndroid='transparent'
                placeholder='phone number'
                onSubmitEditing={() => Keyboard.dismiss()}
                ref={(input) => this.phoneInput = input}
              />
            <View style={styles.registeringAs}>
                <Text style={styles.registerText}>Registering as:</Text>
              </View>
              <View style={styles.radio}>
                <RadioForm
                  radio_props={roles}
                  initial={0}
                  buttonColor={'#FF8200'}
                  selectedButtonColor={'#FF8200'}
                  formHorizontal={true}
                  labelHorizontal={true}
                  radioStyle={{paddingRight: 20}}
                  onPress={(value) => this.onChangeText('role', value)}
                />
              </View>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity
                style={styles.btnSignUp}
                onPress={this.signUp.bind(this)}>
                <Text style={styles.btnText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  fix: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 25,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 50,
  },
  title: {
    color: '#58595B',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 25,
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
    marginBottom: 100,
  },
  radio: {
    margin: 10,
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  },
  registeringAs: {
    margin: 10,
  },
});
