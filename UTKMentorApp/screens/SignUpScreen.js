import React from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Picker,
  Image,
  TouchableOpacity,
  Text
} from 'react-native';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

import Amplify, { Auth } from 'aws-amplify';

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
            autoCorrect={false}
            autoCapitalize='none'
            onSubmitEditing={() => this.passwordInput.focus()}
            returnKeyType='next'
            placeholder='email'
          />
          <TextInput
            onChangeText={value => this.onChangeText('password', value)}
            style={styles.input}
            secureTextEntry={true}
            placeholder='passsword'
            returnKeyType='next'
            onSubmitEditing={() => this.nameInput.focus()}
            ref={(input) => this.passwordInput = input}
          />
          <TextInput
            onChangeText={value => this.onChangeText('name', value)}
            style={styles.input}
            placeholder='name'
            returnKeyType='next'
            onSubmitEditing={() => this.phoneInput.focus()}
            ref={(input) => this.nameInput = input}
          />
          <TextInput
            onChangeText={value => this.onChangeText('phone_number', value)}
            style={styles.input}
            keyboardType='phone-pad'
            returnKeyType='done'
            placeholder='phone number'
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
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
