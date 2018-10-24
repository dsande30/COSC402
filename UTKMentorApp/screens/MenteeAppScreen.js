import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
} from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import MultipleChoice from 'rn-multiple-choice';
import Amplify, { Auth, API } from 'aws-amplify';

export default class MenteeApplication extends Component {
  state = {
    class_year: 'Freshman',
    gender: '',
    major: '',
    minors: '',
    high_GPA: '',
    grad_interested: '',
    grad_school: '',
    research: '',
    honors: '',
    Cooking: false,
    Coops: false,
    Crafting: false,
    Entrepreneurship: false,
    Fitness: false,
    Hiking: false,
    Movies: false,
    Music: false,
    Politics: false,
    Research: false,
    Social: false,
    Sports: false,
    Sustainability: false,
    Travel: false,
    Video: false,
    weekend: '',
    job: '',
    agree: ''
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    })
  }

  setStateInterest(key) {
    if (this.state[key] == false) {
      this.setState({
        [key]: true
      })
    } else {
      this.setState({
        [key]: false
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
          onChangeText={value => this.setStateHelper('minors', value)}
          blurOnSubmit={false}
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
          onSelection={(option) => this.setStateInterest(option.split(' ', 1))}
        />

        <Text>What is a typical weekend like?</Text>
        <TextInput
          onChangeText={value => this.setStateHelper('weekend', value)}
          blurOnSubmit={false}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Weekend'
        />

        <Text>What is your dream job?</Text>
        <TextInput
          onChangeText={value => this.setStateHelper('job', value)}
          blurOnSubmit={false}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Dream Job'
        />

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  }
});
