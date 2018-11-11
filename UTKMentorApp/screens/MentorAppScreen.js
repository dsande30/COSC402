import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Modal,
  TouchableHighlight,
  Keyboard,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MultipleChoice from 'rn-multiple-choice';
import Amplify, { Auth, API } from 'aws-amplify';
import { TextField } from 'react-native-material-textfield';
import file from '../assets/TermsandConditions.json'
text = file.text.join('\n');


export default class MentorApplication extends Component {
  state = {
    user_id: '',
    class_year: '',
    gender: '',
    major: '',
    minors: '',
    coop: '',
    gpa: '',
    grad_interested: '',
    grad_school: '',
    research: '',
    honors: '',
    interests: ['EMP'],
    weekend: '',
    weekend_error: '',
    job: '',
    job_error: '',
    agree: false,
    visible: false,
    disabled: true
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      console.log(this.state)
    })
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
        let goals = {
          "completeGoals":
            [
              {
                "description": "Fill out an application",
                "due": "NULL",
                "status": 1
              }
            ],
          "incompleteGoals":
          [
            {
              "description": "Search mentee profiles",
              "due": "NULL",
              "status": 0
            },
            {
              "description": "Get paired with a mentee",
              "due": "08/31/2019",
              "status": 0
            },
            {
              "description": "Meet with your mentee",
              "due": "NULL",
              "status": 0
            }
          ]
        }
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
        console.log(rv);
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
      .catch((err) => { console.log(err)});
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

  checkErrors() {
    if (this.state.weekend_error == '' &&
        this.state.job_error == '')
    {
      console.log('enable button')
      this.setState({
        ['disabled']: false
      })
    } else {
      console.log('disable button')
      this.setState({
        ['disabled']: true
      })
    }
  }

  checkFull(key) {
    if (this.state[key] == '') {
      this.setState({
        [key+'_error']: 'Oops! You forgot this one'
      })
    }
  }

  render () {
    let class_years = [
      {key: 'Junior', label: 'Junior Engineering Student'},
      {key: 'Senior', label: 'Senior Engineering Student'},
      {key: 'Fifth Year+', label: 'Fifth Year+ Engineering Student'}
    ];
    let genders = [
      {key: 'Male', label: 'Male'},
      {key: 'Female', label: 'Female'},
      {key: 'Other', label: 'Other'},
      {key: 'N/A', label: 'Prefer not to say'}
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
    let coop_options = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'},
      {key: 'Maybe', label: 'Maybe'}
    ]
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
      {key: 'No', label: 'No'}
    ];
    let in_honors = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'}
    ];
    let interests = [];
    let { navigation } = this.props;
    let user_id = navigation.getParam('user_id', 'NO-ID');
    console.log(user_id)
    if (this.state.user_id == '') {
      this.setState({
        user_id: user_id
      });
    }

    return (
      <KeyboardAwareScrollView style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.modalText}>Class for this academic year?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={class_years}
            initValue="Select"
            onChange={(option) => this.setStateHelper('class_year', option.key)} />

          <Text style={styles.modalText}>Gender?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={genders}
            initValue="Select"
            onChange={(option) => this.setStateHelper('gender', option.key)} />

          <Text style={styles.modalText}>Major?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={majors}
            initValue="Select"
            onChange={(option) => this.setStateHelper('major', option.key)} />

          <TextField
            inputContainerStyle={styles.inputContainer}
            containerStyle={styles.fieldContainer}
            labelTextStyle={styles.inputText}
            titleTextStyle={styles.inputText}
            affixTextStyle={styles.inputText}
            onChangeText={value => this.setStateHelper('minors', value)}
            label='Minor(s)?'
            value={this.state.minors}
            title='Optional'
            /*style={styles.input}*/
            secureTextEntry={false}
            blurOnSubmit={false}
            tintColor='#FF8200'
            underlineColorAndroid='transparent'
            keyboardAppearance='dark'
            keyboardType='email-address'
            /*placeholder='password'*/
            returnKeyType='done'
            onBlur={() => {
              this.checkErrors()
            }}
            onSubmitEditing={() => {
              this.checkErrors()
              Keyboard.dismiss()
            }}
          />

          <Text style={styles.modalText}>Do you plan on being on coop for a semester this year?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={coop_options}
            initValue="Select"
            onChange={(option) => this.setStateHelper('coop', option.key)} />

          <Text style={styles.modalText}>Are you interested in graduate or professional education?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={prof_options}
            initValue="Select"
            onChange={(option) => this.setStateHelper('grad_interested', option.key)} />

          <Text style={styles.modalText}>What type of postsecondary education?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={grad_schools}
            initValue="Select"
            onChange={(option) => this.setStateHelper('grad_school', option.key)} />

          <Text style={styles.modalText}>Are you involved in research at UT?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={research_involvement}
            initValue="Select"
            onChange={(option) => this.setStateHelper('research', option.key)} />

          <Text style={styles.modalText}>Are you in an honors program? (CHP, Engineering Honors, etc)</Text>
          <ModalSelector style={styles.selector}
            selectStyle={styles.modalSelectBtn}
            selectTextStyle={styles.modalSelectText}
            data={in_honors}
            initValue="Select"
            onChange={(option) => this.setStateHelper('honors', option.key)} />

          <Text style={styles.interestText}>What are your interest?</Text>
          <MultipleChoice style={styles.multChoice}
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
            onSelection={(option) => this.setStateInterest(option)
            }
          />
          <TextField
            inputContainerStyle={styles.inputContainer}
            containerStyle={styles.fieldContainer}
            labelTextStyle={styles.inputText}
            titleTextStyle={styles.inputText}
            affixTextStyle={styles.inputText}
            onChangeText={value => this.setStateHelper('weekend', value)}
            label='What is a typical weekend like?'
            value={this.state.weekend}
            error={this.state.weekend_error}
            title='Required'
            /*style={styles.input}*/
            secureTextEntry={false}
            blurOnSubmit={false}
            tintColor='#FF8200'
            underlineColorAndroid='transparent'
            keyboardAppearance='dark'
            /*placeholder='password'*/
            returnKeyType='next'
            onBlur={() => {
              this.checkErrors()
              this.checkFull('weekend')
            }}
            onSubmitEditing={() => {
              this.jobInput.focus()
              this.checkFull('weekend')
              this.checkErrors()
            }}
          />

          <TextField
            inputContainerStyle={styles.inputContainer}
            containerStyle={styles.fieldContainer}
            labelTextStyle={styles.inputText}
            titleTextStyle={styles.inputText}
            affixTextStyle={styles.inputText}
            onChangeText={value => this.setStateHelper('job', value)}
            label='What is your dream job?'
            value={this.state.job}
            error={this.state.job_error}
            title='Required'
            /*style={styles.input}*/
            secureTextEntry={false}
            blurOnSubmit={false}
            tintColor='#FF8200'
            underlineColorAndroid='transparent'
            keyboardAppearance='dark'
            /*placeholder='password'*/
            returnKeyType='done'
            onBlur={() => {
              this.checkErrors()
              this.checkFull('job')
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss()
              this.checkFull('job')
              this.checkErrors()
            }}
            ref={(input) => this.jobInput = input}

          />
        </View>

        <TouchableOpacity
          style={styles.openTermsButton}
          onPress={() => {this.setState({ visible: true })}}>
          <Text style={styles.btnText}>Terms and Conditions</Text>
        </TouchableOpacity>
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
                style={styles.acceptTermsButton}
                onPress={this.onPressAgree}>
                <Text style={styles.btnText}>Agree</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelTermsButton}
                onPress={this.onPressCancel}>
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  formContainer: {
    marginRight: '5%',
    marginLeft: '5%',
    marginTop: 20
  },
  selector: {
    marginTop: 10
  },
  modalText: {
    fontSize: 16,
    color: '#58595B',
    marginTop: 15,
    fontWeight: 'bold'
  },
  modalSelectBtn: {
    borderColor: '#FF8200'
  },
  modalSelectText: {
    color: '#FF8200'
  },
  multChoice: {

  },
  interestText: {
    fontSize: 16,
    color: '#58595B',
    marginTop: 25,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  terms: {
    marginTop: 22,
    marginBottom: 22
  },
  inputText: {
    paddingLeft: 12,
  },
  inputContainer: {
    paddingLeft: 12,
    backgroundColor: '#F6F6F6',
  },
  fieldContainer: {
    marginTop: 20
  },
  acceptTermsButton: {
      backgroundColor: '#58595B',
      width: '50%',
      borderRadius: 20,
      padding: 10,
      alignSelf: 'center',
      marginBottom: 10,
  },
  cancelTermsButton: {
      backgroundColor: '#d50000',
      width: '50%',
      borderRadius: 20,
      padding: 10,
      alignSelf: 'center',
      marginBottom: 10,
  },
  openTermsButton: {
      backgroundColor: '#FF8200',
      width: '50%',
      borderRadius: 20,
      padding: 10,
      alignSelf: 'center',
      marginBottom: 40,
      marginTop: 30
  },
  btnText: {
      textAlign: 'center',
      color: '#FFF',
      fontWeight: 'bold',
  }
});
