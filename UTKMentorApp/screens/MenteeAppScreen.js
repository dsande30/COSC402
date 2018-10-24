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
import MultipleChoice from 'react-native-multiple-choice';
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
    interests: {'cooking/baking': false,
                'coops/internships': false,
                'crafting/diy/making': false,
                'entrepreneurship/business': false,
                'fitness': false,
                'hiking/backpacking': false,
                'movies/tv': false,
                'music': false,
                'politics': false,
                'research': false,
                'social media': false,
                'sports': false,
                'sustainability': false,
                'travel': false,
                'video games': false
              },
    weekend: '',
    job: '',
    agree: ''
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    })
    console.log(key)
    console.log(this.state.class_year)
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

        <MultipleChoice
          options={[
            'Cooking/Baking',
            'Coops/Internships',
            'Crafting/DIY/Making',
            'Entrepreneurship/Business',
            'Fitness',
            'Hiking/Backpacking',
            'Movies/TV',
            'Music',
            'Politics',
            'Research',
            'Social Media',
            'Sports',
            'Sustainability',
            'Travel',
            'Video Games'
          ]}
        />

        <TextInput
          onChangeText={value => this.setStateHelper('weekend', value)}
          blurOnSubmit={false}
          keyboardAppearance='dark'
          returnKeyType='done'
          underlineColorAndroid='transparent'
          placeholder='Weekend'
        />

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
