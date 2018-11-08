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
  Keyboard
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import MultipleChoice from 'rn-multiple-choice';
import Amplify, { Auth, API } from 'aws-amplify';
import file from '../assets/TermsandConditions.json'
text = file.text.join('\n');

export default class MenteeApplication extends Component {
  state = {
    user_id: '',
    class_year: 'Freshman',
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

  setStateFinal(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      let form_data = {}
      for (var data in this.state) {
        if (data != 'visible' && data != 'user_id')
          form_data[data] = this.state[data]
      }
      console.log(this.state.user_id)
      const response = API.put('dynamoAPI', '/items', {
        body: {
          userid: this.state.user_id,
          form_data: {hi: "hello"}
        }
      });
      console.log(JSON.stringify(response, null, 2));
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
      {key: 'Aerospace', label: 'Aerospace'},
      {key: 'Biomedical', label: 'Biomedical'},
      {key: 'Biosystems', label: 'Biosystems'},
      {key: 'Chemical', label: 'Chemical'},
      {key: 'Civil', label: 'Civil'},
      {key: 'CompE', label: 'Computer Engineering'},
      {key: 'CompS', label: 'Computer Science'},
      {key: 'Electrical', label: 'Electrical'},
      {key: 'Industrial', label: 'Industrial'},
      {key: 'Materials', label: 'Materials Science'},
      {key: 'Mechanical', label: 'Mechanical'},
      {key: 'Nuclear', label: 'Nuclear'},
      {key: 'Other', label: 'Other'}
    ];
    let prof_options = [
      {key: 'Yes', label: 'Yes'},
      {key: 'No', label: 'No'},
      {key: 'Maybe', label: 'Maybe'}
    ];
    let grad_schools = [
      {key: 'None', label: 'None'},
      {key: 'Dental', label: 'Dental School'},
      {key: 'Graduate', label: 'Graduate School'},
      {key: 'Law', label: 'Law School'},
      {key: 'MBA', label: 'MBA Program'},
      {key: 'Medical', label: 'Medical School'},
      {key: 'Pharmacy', label: 'Pharmacy School'},
      {key: 'Veterinary', label: 'Veterinary School'}
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
      <ScrollView style={styles.container}>
        <Text>Class For Year of 2018-2019</Text>
        <ModalSelector
          data={class_years}
          initValue="Select"
          onChange={(option) => this.setStateHelper('class_year', option.key)} />

        <Text>Gender</Text>
        <ModalSelector
          data={genders}
          initValue="Select"
          onChange={(option) => this.setStateHelper('gender', option.key)} />

        <Text>Major</Text>
        <ModalSelector
          data={majors}
          initValue="Select"
          onChange={(option) => this.setStateHelper('major', option.key)} />

        <Text>Minors</Text>
        <TextInput
          style={styles.inputs}
          onChangeText={value => this.setStateHelper('minors', value)}
          blurOnSubmit={true}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Minors'
        />

        <Text>Are you interested in graduate or professional education?</Text>
        <ModalSelector
          data={prof_options}
          initValue="Select"
          onChange={(option) => this.setStateHelper('grad_interested', option.key)} />

        <Text>What type of postsecondary education?</Text>
        <ModalSelector
          data={grad_schools}
          initValue="Select"
          onChange={(option) => this.setStateHelper('grad_school', option.key)} />

        <Text>Are you interested in research at UT?</Text>
        <ModalSelector
          data={research_involvement}
          initValue="No"
          onChange={(option) => this.setStateHelper('research', option.key)} />

        <Text>Are you in an honors program?</Text>
        <ModalSelector
          data={in_honors}
          initValue="No"
          onChange={(option) => this.setStateHelper('honors', option.key)} />

        <Text>What are your interest?</Text>
        <MultipleChoice
          options={[
            'Cooking / Baking',
            'Coops / Internships',
            'Crafting / DIY / Making',
            'Entrepreneurship / Business',
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
          onSelection={(option) => this.setStateInterest(option.split(' ', 1)[0])
          }
        />

        <Text>What is a typical weekend like?</Text>
        <TextInput
          style={styles.inputs}
          onChangeText={value => this.setStateHelper('weekend', value)}
          blurOnSubmit={true}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Weekend'
        />

        <Text>What is your dream job?</Text>
        <TextInput
          style={styles.inputs}
          onChangeText={value => this.setStateHelper('job', value)}
          blurOnSubmit={true}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Dream Job'
        />
        <Button
          title="Terms and Conditions"
          onPress={() => {
            this.setState({ visible: true });
          }}
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
              <Button
                onPress={() => {
                  this.setStateFinal('agree', true);
                  this.props.navigation.navigate('Home')
                }}
                title="Agree"
              />
              <Button
                onPress={() => {
                  this.setModalVisible(!this.state.visible)
                }}
                title="Cancel"
              />
          </ScrollView>
        </View>
      </Modal>
      <Text>I agree to the terms and conditions.</Text>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginBottom: 50
  },
  terms: {
    marginTop: 22,
    marginBottom: 22
  },
  inputs: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  },
  termsText: {
      padding: 10
  }
});
