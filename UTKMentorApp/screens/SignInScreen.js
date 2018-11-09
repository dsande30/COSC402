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
  TouchableOpacity,
  Keyboard
} from 'react-native';
import {
  KeyboardAwareScrollView
} from 'react-native-keyboard-aware-scroll-view';
import { TextField } from 'react-native-material-textfield';


import Amplify, { Auth, API } from 'aws-amplify';

export default class SignIn extends React.Component {

  state = {
    email: '',
    email_error: '',
    password: '',
    password_error: '',
    user: {}
  };

  onChangeText(key, value) {
    console.log(key);
    this.setState({
      [key]: value,
      [key+'_error']: ''
    })
  }

  checkFull(key) {
    if (this.state[key] == '') {
      this.setState({
        [key+'_error']: 'Oops! You forgot this one'
      })
    }
  }

  async getData() {
    const get_response = await API.get('dynamoAPI', '/items/' + this.state.email);
    return get_response;
  }

  async getAndrey() {
    const get_response = await API.get('dynamoAPI', '/items/akarnauc@vols.utk.edu');
    return get_response;
  }

  fastSignIn() {
    let form_data = {};
    const email = 'akarnauc@vols.utk.edu'
    const password = 'Testy123'
    Auth.signIn(email, password)
    .then(user => {
      this.setState({ user })
      this.getAndrey()
      .then((rv) => {
        result = rv[0];
        form_data = result.form_data;
        if (Object.keys(form_data).length !== 0) {
          console.log('successful PROF sign in!');
          this.props.navigation.navigate('Profile', { data: user });
        }
        else {
          console.log('successful HOME sign in!');
          this.props.navigation.navigate('Profile', {data: user});
        }
      })
      .catch((err) => console.log(err.response));
    })
    .catch(err => console.log('error signing in: ', err))
  }

  fastMenteeForm() {
    this.props.navigation.navigate('MenteeApp');
  }

  signIn() {
    let form_data = {};
    const { email, password } = this.state;
    Auth.signIn(email, password)
    .then(user => {
      this.setState({ user })
      this.getData()
      .then((rv) => {
        result = rv[0];
        form_data = result.form_data;
        if (Object.keys(form_data).length !== 0) {
          console.log('successful PROF sign in!');
          this.props.navigation.navigate('Profile', { data: user });
        }
        else {
          console.log('successful HOME sign in!');
          this.props.navigation.navigate('Profile', {data: user});
        }
      })
      .catch((err) => console.log('err'));
    })
    .catch(err => {
      console.log('error signing in: ', err)
      if (err.code == 'UserNotFoundException') {
        this.setState({
          ['email_error']: 'No user with that email',
          ['email']: ''
        })
      }
      if (err.code == 'NotAuthorizedException') {
        this.setState({
          ['password_error']: 'Password and email do not match',
          ['password']: ''
        })
      }
      if (err.code == 'UserNotConfirmedException') {
        console.log('Redirected to verification!');
        this.props.navigation.navigate('Verify');
      }
    })
  }

  render() {
    return (
        <KeyboardAwareScrollView style={styles.container} enableOnAndroid={true}
         enableAutoAutomaticScroll={(Platform.OS === 'ios')}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.logo}
                source={require('../assets/logo.png')}
              />
              <Text style={styles.title}>The Engineering Mentor Program</Text>
            </View>
            <KeyboardAvoidingView style={styles.form} behavior="padding" enabled>
              <TextField
                onChangeText={value => this.onChangeText('email', value)}
                label='Email'
                value={this.state.email}
                error={this.state.email_error}
                /*style={styles.input}*/
                secureTextEntry={false}
                blurOnSubmit={false}
                underlineColorAndroid='transparent'
                tintColor='#FF8200'
                keyboardAppearance='dark'
                keyboardType='email-address'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  this.passwordInput.focus()
                  this.checkFull('email')
                }}
              />
              <TextField
                onChangeText={value => this.onChangeText('password', value)}
                label='Password'
                value={this.state.password}
                error={this.state.password_error}
                title='At least one lower, upper, and symbol'
                /*style={styles.input}*/
                secureTextEntry={true}
                blurOnSubmit={false}
                tintColor='#FF8200'
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                /*placeholder='password'*/
                returnKeyType='next'
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                  this.checkFull('password')
                }}
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
              <TouchableOpacity
                style={styles.btnSignUp}
                onPress={this.fastSignIn.bind(this)}>
                <Text style={styles.btnText}>Fast Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnSignUp}
                onPress={this.fastMenteeForm.bind(this)}>
                <Text style={styles.btnText}>Fast Mentee Form</Text>
              </TouchableOpacity>
            </View>
        </KeyboardAwareScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    marginTop: 150,
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
    flexGrow: 1
  },
  btnSignIn: {
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginTop: 20,
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
    marginTop: 50,
  },
  input: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  }
});
