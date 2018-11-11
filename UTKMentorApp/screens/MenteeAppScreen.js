import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Picker,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  Button,
  ScrollView,
  Modal,
  TouchableHighlight,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import MultipleChoice from 'rn-multiple-choice';
import Amplify, { Auth, API } from 'aws-amplify';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { TextField } from 'react-native-material-textfield';
import file from '../assets/TermsandConditions.json'
text = file.text.join('\n');

export default class MenteeApplication extends Component {
  state = {
    user_id: '',
    class_year: '0',
    gender: '0',
    major: '0',
    minors: '0',
    high_GPA: '0',
    grad_interested: '0',
    grad_school: '0',
    research: '0',
    honors: '0',
    interests: ['EMP'],
    weekend: '0',
    job: '0',
    agree: false,
    visible: false,
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      console.log(this.state)
    })
  }


  onPressAgree = () => {
    this.setStateFinal('agree', true);
    console.log("Pressed Agree")
  }

  onPressCancel = () => {
    this.setModalVisible(!this.state.visible)
    console.log("Pressed Cancel")
  }

  setStateFinal(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      let user_data = {}
      let goals = {}
      let pairings = []
      let mentor = false
      let form_data = {}
      let user = this.state['user_id']
      for (var data in this.state) {
        if (data != 'visible' && data != 'user_id')
          form_data[data] = this.state[data]
      }

      async function getData() {
        const get_response = await API.get('dynamoAPI', '/items/' + user);
        return get_response;
      }
      async function putData() {
        let put_body = {
          body: {
            userid: user,
            user_data: user_data,
            form_data: form_data,
            goals: goals,
            mentor: mentor,
            pairings: pairings
          }
        }
        const put_response = await API.put('dynamoAPI', '/items?userid=' + user, put_body);
        return put_response;
      }
      getData()
      .then((rv) => {
        result = rv[0]
        user_data = result.user_data
        goals = result.goals
        mentor = result.mentor
        pairings = result.pairings
        console.log("Done GETTING!");
        putData()
        .then((data) => {
          this.props.navigation.state.params.onNavigateBack()
          this.props.navigation.goBack();
        });
      })
      .catch(() => { console.log('2')});
    })
  }

  setModalVisible(visibleVal) {
    this.setState({visible: visibleVal});
  }

  setStateInterest(value) {
    if (this.state.interests.includes(value)) {
      console.log("removing " + value)
      let copy = [...this.state.interests]
      copy.splice(copy.indexOf(value), 1)
      this.setState({
        interests: copy
      })
    }
    else {
      console.log("inserting " + value)
      this.setState({
        interests: [...this.state.interests, value]
      })
    }
  }

  render () {
    let class_years = [
      {key: 'Freshman', label: 'Freshman Engineering Student'},
      {key: 'Sophomore', label: 'Sophomore Engineering Student'}
    ];
    let genders = [
      {key: 'Male', label: 'Male'},
      {key: 'Female', label: 'Female'},
      {key: 'Other', label: 'Other'},
      {key: 'NA', label: 'Prefer not to say'}
    ];
    let majors = [
      {key: 'Aerospace Engineering', label: 'Aerospace Engineering'},
      {key: 'Biomedical Engineering', label: 'Biomedical Engineering'},
      {key: 'Biosystems Engineering', label: 'Biosystems Engineering'},
      {key: 'Chemical Engineering', label: 'Chemical Engineering'},
      {key: 'Civil Engineering', label: 'Civil Engineering'},
      {key: 'Computer Engineering', label: 'Computer Engineering'},
      {key: 'Computer Science', label: 'Computer Science'},
      {key: 'Electrical Engineering', label: 'Electrical Engineering'},
      {key: 'Industrial Engineering', label: 'Industrial Engineering'},
      {key: 'Materials Science', label: 'Materials Science'},
      {key: 'Mechanical Engineering', label: 'Mechanical Engineering'},
      {key: 'Nuclear Engineering', label: 'Nuclear Engineering'},
      {key: 'Other', label: 'Other'}
    ];
    let prof_options = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'},
      {key: 'Maybe', label: 'Maybe'}
    ];
    let grad_schools = [
      {key: 'None', label: 'None'},
      {key: 'Dental School', label: 'Dental School'},
      {key: 'Graduate School', label: 'Graduate School'},
      {key: 'Law School', label: 'Law School'},
      {key: 'MBA Program', label: 'MBA Program'},
      {key: 'Medical School', label: 'Medical School'},
      {key: 'Pharmacy School', label: 'Pharmacy School'},
      {key: 'Veterinary School', label: 'Veterinary School'}
    ];
    let research_involvement = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'},
      {key: 'Currently', label: 'I already am'}
    ];
    let in_honors = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'}
    ];
    let interests = [];
    let { navigation } = this.props;
    let user_id = navigation.getParam('user_id', 'NO-ID');
    if (this.state.user_id == '') {
      this.setState({
        user_id: user_id
      });
    }

    return (
        <KeyboardAwareScrollView enableOnAndroid={true}
          enableAutoAutomaticScroll={(Platform.OS === 'ios')}
          style={styles.container}>
          <KeyboardAvoidingView style={styles.container}  behavior="padding" enabled>

            <Text style={styles.questionText}>
                  Class for this academic year?
            </Text>
            <ModalSelector
              data={class_years}
              initValue="Select"
              onChange={(option) => this.setStateHelper('class_year', option.key)}
              backdropPressToClose={true}
              optionStyle={styles.modalOptionStyle}
              optionContainerStyle={styles.modalOptionContainer}
              optionTextStyle={styles.modalOptionText}
              overlayStyle={styles.modalBackground}
              cancelStyle={styles.modalCancel}
              cancelContainerStyle={styles.modalCancelContainer}
              selectStyle={styles.modalButtonSelector}/>

            <Text style={styles.questionText}>Gender</Text>
            <ModalSelector
              data={genders}
              initValue="Select"
              onChange={(option) => this.setStateHelper('gender', option.key)}
              backdropPressToClose={true}
              optionStyle={styles.modalOptionStyle}
              optionContainerStyle={styles.modalOptionContainer}
              optionTextStyle={styles.modalOptionText}
              overlayStyle={styles.modalBackground}
              cancelStyle={styles.modalCancel}
              cancelContainerStyle={styles.modalCancelContainer}
              selectStyle={styles.modalButtonSelector}/>

            <Text style={styles.questionText}>Major</Text>
            <ModalSelector
              data={majors}
              initValue="Select"
              onChange={(option) => this.setStateHelper('major', option.key)}
              backdropPressToClose={true}
              optionStyle={styles.modalOptionStyle}
              optionContainerStyle={styles.modalOptionContainer}
              optionTextStyle={styles.modalOptionText}
              overlayStyle={styles.modalBackground}
              cancelStyle={styles.modalCancel}
              cancelContainerStyle={styles.modalCancelContainer}
              selectStyle={styles.modalButtonSelector}/>

            <TextField
              onChangeText={value => this.onChangeText('minors', value)}
              label='Minor(s)'
              labelFontSize={28}
              labelTextStyle={styles.inputText}
              value={this.state.minors}
              style={styles.input}
              secureTextEntry={false}
              blurOnSubmit={false}
              tintColor='#FF8200'
              underlineColorAndroid='transparent'
              keyboardAppearance='dark'
              /*placeholder='password'*/
              returnKeyType='next'
              onSubmitEditing={() => Keyboard.dismiss()}
            />

            <Text style={styles.questionText}>
                Are you interested in graduate or professional education?
            </Text>
            <ModalSelector
              data={prof_options}
              initValue="Select"
              onChange={(option) => this.setStateHelper('grad_interested', option.key)}
              backdropPressToClose={true}
              optionStyle={styles.modalOptionStyle}
              optionContainerStyle={styles.modalOptionContainer}
              optionTextStyle={styles.modalOptionText}
              overlayStyle={styles.modalBackground}
              cancelStyle={styles.modalCancel}
              cancelContainerStyle={styles.modalCancelContainer}
              selectStyle={styles.modalButtonSelector}/>

            <Text style={styles.questionText}>
                What type of postsecondary education?
            </Text>
            <ModalSelector
              data={grad_schools}
              initValue="Select"
              onChange={(option) => this.setStateHelper('grad_school', option.key)}
              backdropPressToClose={true}
              optionStyle={styles.modalOptionStyle}
              optionContainerStyle={styles.modalOptionContainer}
              optionTextStyle={styles.modalOptionText}
              overlayStyle={styles.modalBackground}
              cancelStyle={styles.modalCancel}
              cancelContainerStyle={styles.modalCancelContainer}
              selectStyle={styles.modalButtonSelector}/>

            <Text style={styles.questionText}>
                Are you interested in research at UT?
            </Text>
            <ModalSelector
              data={research_involvement}
              initValue="Select"
              onChange={(option) => this.setStateHelper('research', option.key)}
              backdropPressToClose={true}
              optionStyle={styles.modalOptionStyle}
              optionContainerStyle={styles.modalOptionContainer}
              optionTextStyle={styles.modalOptionText}
              overlayStyle={styles.modalBackground}
              cancelStyle={styles.modalCancel}
              cancelContainerStyle={styles.modalCancelContainer}
              selectStyle={styles.modalButtonSelector}/>

            <Text style={styles.questionText}>
                Are you in an honors program? (CHP, Engineering Honors, etc)
            </Text>
            <ModalSelector
              data={in_honors}
              initValue="Select"
              onChange={(option) => this.setStateHelper('honors', option.key)}
              backdropPressToClose={true}
              optionStyle={styles.modalOptionStyle}
              optionContainerStyle={styles.modalOptionContainer}
              optionTextStyle={styles.modalOptionText}
              overlayStyle={styles.modalBackground}
              cancelStyle={styles.modalCancel}
              cancelContainerStyle={styles.modalCancelContainer}
              selectStyle={styles.modalButtonSelector}/>

            <Text style={styles.questionText}>
                Select some of your interests:
            </Text>
            <View style={styles.choiceContainer}>
                <MultipleChoice
                  options={[
                    'Cooking / Baking',
                    'Coops / Internships',
                    'Crafting / DIY / Making',
                    'Entrepreneurship',
                    'Fitness',
                    'Hiking / Backpacking',
                    'Movies / TV',
                    'Music',
                    'Politics',
                    'Research',
                    'Social Media',
                    'Sports',
                    'Sustainability',
                    'Travel',
                    'Video Games'
                  ]}
                  onSelection={(option) => this.setStateInterest(option.split(' ', 1)[0])}
                />
            </View>

            <TextField
              onChangeText={value => this.setStateHelper('weekend', value)}
              label='What is a typical weekend like?'
              value={this.state.weekend}
              multiline={true}
              /*style={styles.input}*/
              secureTextEntry={false}
              blurOnSubmit={false}
              tintColor='#FF8200'
              underlineColorAndroid='transparent'
              keyboardAppearance='dark'
              /*placeholder='password'*/
              returnKeyType='next'
            />

            <TextField
              onChangeText={value => this.setStateHelper('job', value)}
              label='What is your dream job?'
              value={this.state.weekend}
              multiline={true}
              style={styles.input}
              secureTextEntry={false}
              blurOnSubmit={false}
              tintColor='#FF8200'
              underlineColorAndroid='transparent'
              keyboardAppearance='dark'
              /*placeholder='password'*/
              returnKeyType='next'
            />

            <Button
              title="Terms and Conditions"
              onPress={() => {
                this.setState({ visible: true });
              }}
              color='#ff8200'
              />
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.visible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
              }}>
              <View style={styles.terms}>
                <ScrollView>
                  <Text style={styles.termsText}>
                      {text}
                  </Text>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={this.onPressAgree}>
                    <Text style={styles.btnText}>Agree</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={this.onPressCancel}>
                    <Text style={styles.btnText}>Cancel</Text>
                  </TouchableOpacity>
              </ScrollView>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginBottom: 50,
    padding: 10
  },
  terms: {
    marginTop: 22,
    marginBottom: 22
  },
  inputs: {
    alignSelf: 'center',
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  },
  inputText: {
    // why does this not work?
    justifyContent: 'center',
  },
  termsText: {
      padding: 10
  },
  questionText: {
      fontWeight: 'bold',
      fontSize: 24,
      alignSelf: 'center',
      padding: 10,
  },
  modalBackground: {
      flex: 3,
      alignSelf: 'flex-end',
      justifyContent: 'flex-end',
      alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 20,
  },
  modalOptionStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomColor: 'black',
  },
  modalOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  modalCancel: {
    alignItems: 'center',
  },
  modalCancelContainer: {
      //HACK I know this is bad
      position: 'absolute',
      top: Dimensions.get('window').height - 60,
      paddingTop: 10,
      height: 60,
      width: 100,
      alignSelf: 'center',
  },
  modalButtonSelector: {
      justifyContent: 'flex-start',
      alignSelf: 'center'
  },
  choiceContainer: {
      width: Dimensions.get('window').width / 2,
      borderWidth: 3,
      borderColor: 'black',
      padding: 5,
      alignSelf: 'center',
      marginTop: 10,
      padding: 15,
  },
  termsButton: {
      backgroundColor: '#58595B',
      width: '50%',
      borderRadius: 20,
      padding: 10,
      alignSelf: 'center',
      marginBottom: 10,
  },
  btnText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: 'bold',
  }
});
