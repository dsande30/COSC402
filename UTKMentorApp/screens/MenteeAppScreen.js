import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  Picker
} from 'react-native';
import ModalSelector from 'react-native-modal-selector'
import Amplify, { Auth, API } from 'aws-amplify';

export default class MenteeApplication extends Component {
  state = {
    class_year: 'Freshman',
    gender: '',
    major: '',
    grad_interested: '',
    grad_school: '',
    research: '',
    honors: ''
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
          initValue="Class Year"
          onChange={(option) => this.setStateHelper('class_year', option.key)} />
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
