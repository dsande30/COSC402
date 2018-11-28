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
import { Icon } from 'react-native-elements';
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
    class_year: '',
    class_year_error: false,
    gender: '',
    gender_error: false,
    major: '',
    major_error: false,
    minors: '',
    minors_error: '',
    grad_interested: '',
    grad_interested_error: false,
    grad_school: '',
    grad_school_error: false,
    research: '',
    research_error: false,
    honors: '',
    honors_error: false,
    interests: ['EMP'],
    interests_error: '',
    weekend: '',
    weekend_error: '',
    job: '',
    job_error: '',
    agree: false,
    visible: false,
    disabled: true,
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value,
      [key+'_error']: ''
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
      let pairings = []
      let mentor = false
      let form_data = {}
      let not_wanted = ['user_id', 'visible', 'disabled', 'job_error', 'weekend_error', 'class_year_error',
                        'gender_error', 'major_error', 'minors_error', 'high_GPA_error', 'grad_interested_error',
                        'grad_school_error', 'research_error', 'honors_error', 'checked']
      let user = this.state['user_id']
      for (var data in this.state) {
        if (!not_wanted.includes(data)) {
          const input = this.state[data];
          form_data[data] = input;
        }
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
                "status": 1,
                "creator": "EMP",
                "reminder": []
              }
            ],
          "incompleteGoals":
          [
            {
              "description": "Search mentor profiles",
              "due": "NULL",
              "status": 0,
              "creator": "EMP",
              "reminder": []
            },
            {
              "description": "Get paired with a mentor",
              "due": "NULL",
              "status": 0,
              "creator": "EMP",
              "reminder": []
            },
            {
              "description": "Meet with your mentor",
              "due": "NULL",
              "status": 0,
              "creator": "EMP",
              "reminder": []
            }
          ],
          "missedGoals":
          [
            {
              "description": "Feel free to delete this example goal",
              "due": "06/01/2018",
              "status": 0,
              "creator": "EMP",
              "reminder": []
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
        result = rv[0]
        user_data = result.user_data
        goals = result.goals
        mentor = result.mentor
        pairings = result.pairings
        console.log("Done GETTING!");
        putData()
        .then((data) => {
          console.log(data)
          this.props.navigation.state.params.onNavigateBack()
          this.props.navigation.goBack();
        })
        .catch((err) => console.log(err.response))
      })
      .catch(() => { console.log('2')});
    })
  }

  setModalVisible(visibleVal) {
    var anEmpty = false
    var haveThree = false
    var anError = false
    let wanted = ['class_year', 'gender', 'major', 'high_GPA', 'grad_interested',
                  'grad_school', 'research', 'honors']

    Keyboard.dismiss()
    for (var data in this.state) {
      if (wanted.includes(data)) {
        const input = this.state[data];
        console.log(input)
        input = String.prototype.trim.call(input);
        if (input == '') {
          this.setState({
            [data+'_error']: true
          })
          anEmpty = true
        }
      }
    }

    if (this.state.interests.length == 4) {
      haveThree = true
      this.setState({
        ['interests_error']: false
      })
    }
    else {
      this.setState({
        ['interests_error']: true
      })
    }

    if (this.state.minors.length > 75) {
      this.setState({
        ['minors_error']: 'Character limit exceeded'
      })
      anError = true
    }

    if (this.state.weekend.length > 200) {
      this.setState({
        ['weekend_error']: 'Character limit exceeded'
      })
      anError = true
    }
    else if (this.state.weekend == '') {
      this.setState({
        ['weekend_error']: 'Oops! You forgot this one'
      })
      anError = true
    }

    if (this.state.job.length > 200) {
      this.setState({
        ['job_error']: 'Character limit exceeded'
      })
      anError = true
    }
    else if (this.state.job == '') {
      this.setState({
        ['job_error']: 'Oops! You forgot this one'
      })
      anError = true
    }

    if (anEmpty) {
      this.scrollRef.props.scrollToPosition(0, 0);
      return -1
    }
    else if (!haveThree) {
      this.scrollRef.props.scrollToPosition(0, 550)
      return -1
    }
    else if (anError) {
      return -1
    }
    if (this.state.minors == '') {
      this.setState({
        ['minors']: 'NULL'
      })
    }
    this.setState({visible: visibleVal});
  }

  setStateInterest(value) {
    if (this.state.interests.includes(value)) {
      console.log("removing " + value)
      let copy = [...this.state.interests]
      copy.splice(copy.indexOf(value), 1)
      console.log(copy)
      this.setState({
        interests: copy
      })
    }
    else {
      console.log(this.state.interests.length)
      if (this.state.interests.length < 4) {
        console.log("inserting " + value)
        this.setState({
          interests: [...this.state.interests, value]
        })
      }
      else {
        console.log("removing " + this.state.interests[1])
        let copy = [...this.state.interests]
        copy.splice(1, 1)
        console.log("inserting " + value)
        copy.push(value)
        console.log(copy)
        this.setState({
          interests: copy
        })
      }
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
      {key: 'Freshman Engineering Student', label: 'Freshman Engineering Student'},
      {key: 'Sophomore Engineering Student', label: 'Sophomore Engineering Student'}
    ];
    let genders = [
      {key: 'Male', label: 'Male'},
      {key: 'Female', label: 'Female'},
      {key: 'Other', label: 'Other'},
      {key: 'Prefer not to say', label: 'Prefer not to say'}
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
      {key: 'I already am', label: 'I already am'}
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
    let modal = {
      btnStyle: styles.modalSelectBtn,
      textStyle: styles.modalSelectText,
      init: 'Select'
    }
    let error = {
      btnStyle: styles.errorSelectBtn,
      textStyle: styles.errorSelectText,
      init: 'Oops! You forgot this one'
    }

    let modalStyles = {
      class_year: {},
      gender: {},
      major: {},
      high_GPA: {},
      grad_interested: {},
      grad_school: {},
      research: {},
      honors: {}
    }

    let wanted = ['class_year', 'gender', 'major', 'high_GPA', 'grad_interested',
                  'grad_school', 'research', 'honors']

    var multipleChoiceStyle

    if (this.state.interests_error == true) {
      console.log('^^^^^^')
      multipleChoiceStyle = styles.errorInterestText
    }
    else {
      multipleChoiceStyle = styles.interestText
    }

    for (var item in wanted) {
      if (this.state[wanted[item]+'_error'] == false) {
        modalStyles[wanted[item]] = Object.assign({}, modal)
        if (this.state[wanted[item]] != 'NULL' && this.state[wanted[item]] != '') {
          modalStyles[wanted[item]].init = this.state[wanted[item]]
        }
      }
      else {
        modalStyles[wanted[item]] = error
      }
    }

    return (
        <KeyboardAwareScrollView style={styles.container}
          innerRef={(ref) => {this.scrollRef = ref}}>
          <View style={styles.formContainer}>
            <Text style={styles.modalText}>Class for this academic year?</Text>
            <ModalSelector style={styles.selector}
              selectStyle={modalStyles.class_year.btnStyle}
              selectTextStyle={modalStyles.class_year.textStyle}
              selectedItemTextStyle={styles.selectedItemText}
              optionTextStyle={styles.optionText}
              optionContainerStyle={styles.optionContainer}
              cancelContainerStyle={styles.cancelContainer}
              animationType='fade'
              cancelText='Cancel'
              cancelTextStyle={styles.cancelTextStyle}
              data={class_years}
              initValue={modalStyles.class_year.init}
              onChange={(option) => this.setStateHelper('class_year', option.key)} />

            <Text style={styles.modalText}>Gender?</Text>
            <ModalSelector style={styles.selector}
              selectStyle={modalStyles.gender.btnStyle}
              selectTextStyle={modalStyles.gender.textStyle}
              selectedItemTextStyle={styles.selectedItemText}
              optionTextStyle={styles.optionText}
              optionContainerStyle={styles.optionContainer}
              cancelContainerStyle={styles.cancelContainer}
              animationType='fade'
              cancelText='Cancel'
              cancelTextStyle={styles.cancelTextStyle}
              data={genders}
              initValue={modalStyles.gender.init}
              onChange={(option) => this.setStateHelper('gender', option.key)} />

            <Text style={styles.modalText}>Major?</Text>
            <ModalSelector style={styles.selector}
              selectStyle={modalStyles.major.btnStyle}
              selectTextStyle={modalStyles.major.textStyle}
              selectedItemTextStyle={styles.selectedItemText}
              optionTextStyle={styles.optionText}
              optionContainerStyle={styles.optionContainer}
              cancelContainerStyle={styles.cancelContainer}
              animationType='fade'
              cancelText='Cancel'
              cancelTextStyle={styles.cancelTextStyle}
              data={majors}
              initValue={modalStyles.major.init}
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
              error={this.state.minors_error}
              title='Optional (leave blank if none)'
              /*style={styles.input}*/
              secureTextEntry={false}
              blurOnSubmit={false}
              tintColor='#FF8200'
              underlineColorAndroid='transparent'
              keyboardAppearance='dark'
              /*placeholder='password'*/
              returnKeyType='done'
              characterRestriction={75}
              onBlur={() => {
                this.checkErrors()
                Keyboard.dismiss()
              }}
              onSubmitEditing={() => {
                this.checkErrors()
                Keyboard.dismiss()
              }}
            />

          <Text style={styles.modalText}>Are you interested in graduate or professional education?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={modalStyles.grad_interested.btnStyle}
            selectTextStyle={modalStyles.grad_interested.textStyle}
            selectedItemTextStyle={styles.selectedItemText}
            optionTextStyle={styles.optionText}
            optionContainerStyle={styles.optionContainer}
            cancelContainerStyle={styles.cancelContainer}
            animationType='fade'
            cancelText='Cancel'
            cancelTextStyle={styles.cancelTextStyle}
            data={prof_options}
            initValue={modalStyles.grad_interested.init}
            onChange={(option) => this.setStateHelper('grad_interested', option.key)} />

          <Text style={styles.modalText}>What type of postsecondary education?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={modalStyles.grad_school.btnStyle}
            selectTextStyle={modalStyles.grad_school.textStyle}
            selectedItemTextStyle={styles.selectedItemText}
            optionTextStyle={styles.optionText}
            optionContainerStyle={styles.optionContainer}
            cancelContainerStyle={styles.cancelContainer}
            animationType='fade'
            cancelText='Cancel'
            cancelTextStyle={styles.cancelTextStyle}
            data={grad_schools}
            initValue={modalStyles.grad_school.init}
            onChange={(option) => this.setStateHelper('grad_school', option.key)} />

          <Text style={styles.modalText}>Are you interested in research at UT?</Text>
          <ModalSelector style={styles.selector}
            selectStyle={modalStyles.research.btnStyle}
            selectTextStyle={modalStyles.research.textStyle}
            selectedItemTextStyle={styles.selectedItemText}
            optionTextStyle={styles.optionText}
            optionContainerStyle={styles.optionContainer}
            cancelContainerStyle={styles.cancelContainer}
            animationType='fade'
            cancelText='Cancel'
            cancelTextStyle={styles.cancelTextStyle}
            data={research_involvement}
            initValue={modalStyles.research.init}
            onChange={(option) => this.setStateHelper('research', option.key)} />

          <Text style={styles.modalText}>Are you in an honors program? (CHP, Engineering Honors, etc)</Text>
          <ModalSelector style={styles.selector}
            selectStyle={modalStyles.honors.btnStyle}
            selectTextStyle={modalStyles.honors.textStyle}
            selectedItemTextStyle={styles.selectedItemText}
            optionTextStyle={styles.optionText}
            optionContainerStyle={styles.optionContainer}
            cancelContainerStyle={styles.cancelContainer}
            animationType='fade'
            cancelText='Cancel'
            cancelTextStyle={styles.cancelTextStyle}
            data={in_honors}
            initValue={modalStyles.honors.init}
            onChange={(option) => this.setStateHelper('honors', option.key)} />

          <Text style={multipleChoiceStyle}>Please choose your top three interests</Text>
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
            renderIndicator={(option) => {
              return(
                <Icon
                  name='check'
                  type='material-community'
                  color='rgba(171, 193, 120, 1)'
                  size={30}
                />
              )
            }}
            maxSelectedOptions={3}
            onSelection={(option) => this.setStateInterest(option)}
            optionStyle={styles.mcOption}
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
            characterRestriction={200}
            /*placeholder='password'*/
            returnKeyType='next'
            onBlur={() => {
              this.checkErrors()
              this.checkFull('weekend')
              Keyboard.dismiss()
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
            characterRestriction={200}
            /*placeholder='password'*/
            returnKeyType='done'
            onBlur={() => {
              this.checkErrors()
              this.checkFull('job')
              Keyboard.dismiss()
            }}
            onSubmitEditing={() => {
              this.checkFull('job')
              this.checkErrors()
              Keyboard.dismiss()
            }}
            ref={(input) => this.jobInput = input}

          />
        </View>

        <TouchableOpacity
          style={styles.openTermsButton}
          onPress={() => this.setModalVisible(!this.state.visible)}>
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
                <Text style={styles.cancelTermsText}>Cancel</Text>
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
  interestText: {
    fontSize: 16,
    color: '#58595B',
    marginTop: 25,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  errorInterestText: {
    fontSize: 16,
    color: '#d50000',
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
      backgroundColor: '#FFFFFF',
      width: '50%',
      borderRadius: 20,
      justifyContent: 'center',
      borderWidth: 1,
      height: 36,
      borderColor: '#d50000',
      alignSelf: 'center',
      marginBottom: 10,
  },
  cancelTermsText: {
    color: '#d50000',
    fontWeight: 'bold',
    textAlign: 'center'
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
  },
  sectionStyle: {
    color: '#FF8200'
  },
  cancelTextStyle: {
    color: '#d50000'
  },
  selectedItemText: {
    color: '#FF8200',
  },
  optionText: {
    color: '#58595B'
  },
  optionContainer: {
    backgroundColor: '#FFFFFF',
  },
  cancelContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  modalSelectBtn: {
    borderColor: '#FF8200'
  },
  modalSelectText: {
    color: '#FF8200'
  },
  errorSelectBtn: {
    borderColor: '#d50000'
  },
  errorSelectText: {
    color: '#d50000'
  },
  mcOption: {
    height: 44,
  }
});
