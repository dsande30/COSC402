import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  ScrollView,
  FlatList,
  Modal,
  TouchableHighlight,
  Keyboard
} from 'react-native';

import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from 'react-native-simple-radio-button';

import DatePicker from 'react-native-datepicker';
import MultipleChoice from 'rn-multiple-choice';
import { TextField } from 'react-native-material-textfield';
import { List, Icon, Avatar, ListItem, SearchBar } from 'react-native-elements';
import Amplify, { Auth, API } from 'aws-amplify';

export default class Goals extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: '',
      name: '',
      role: '',
      form_data: {},
      goals: {},
      mentor: '',
      pairings: [],
      photo: '',
      modal_edit_visible: false,
      modal_add_visible: false,
      curr_goal: {
        'description': '',
        'due': '',
        'status': 0,
        'reminder': [],
        'creator': 'User'
      },
      newDescription: '',
      date: '',
      reminder: [],
      creator: 'User',
      status: 0
    }
  }

  componentDidMount() {
    let { navigation } = this.props;
    let old_state = navigation.getParam('data', 'NO-ID');
    old_state.modal_edit_visible = false;
    old_state.modal_add_visible = false;
    old_state.newDescription = '';
    old_state.date = '';
    old_state.creator = '',
    old_state.reminder = [],
    old_state.status = 0,
    old_state.curr_goal = {
      'description': '',
      'due': '',
      'status': 0,
      'creator': '',
      'reminder': []
    };
    console.log(old_state)
    if (this.state.user_id == '') {
      this.setState(old_state);
    }
  }

  removeGoal() {
    let goals = this.state.goals
    let compGoals = goals.completeGoals;
    let incompGoals = goals.incompleteGoals;
    let target = this.state.curr_goal
    let index, index2;

    index = compGoals.indexOf(target);
    index2 = incompGoals.indexOf(target);

    if (index !== -1) compGoals.splice(index, 1);
    else if (index2 !== -1) incompGoals.splice(index2, 1);

    goals.completeGoals = compGoals;
    goals.incompleteGoals = incompGoals;

    this.setStateHelper('goals', goals);
    this.setModalVisible('modal_edit_visible', !this.state.modal_edit_visible);
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      console.log(this.state)
    })
  }

  setModalVisible(key, visible) {
    this.setState({[key]: visible}, console.log(this.state));
  }

  addNewGoal() {
    console.log('adding new goal')
    let newGoal = {
      'description': this.state.newDescription,
      'due': this.state.date,
      'status': 0,
      'creator': 'User',
      'reminder': this.state.reminder
    }
    let copy = this.state.goals
    copy['incompleteGoals'].push(newGoal);
    this.setStateHelper('goals', copy);
    this.setModalVisible('modal_add_visible', !this.state.modal_add_visible);
  }

  editGoal(item) {
    this.setState({
      newDescription: item.description,
      date: item.due,
      status: item.status,
      creator: item.creator,
      reminder: item.reminder,
      curr_goal: item
    })
    console.log("SELECT GOALS: " + this.state.curr_goal.reminder)
    this.setModalVisible('modal_edit_visible', true);
  }

  updateGoal() {
    let index;
    let goals = this.state.goals;
    let array = this.state.goals.completeGoals;
    let array2 = this.state.goals.incompleteGoals;
    let array3 = this.state.goals.missedGoals;
    let updated;

    updated = {
      'description': this.state.newDescription,
      'due': this.state.date,
      'status': this.state.status,
      'creator': 'User',
      'reminder': this.state.reminder
    }

    index = array.findIndex(item => item.description === this.state.curr_goal.description)
    index2 = array2.findIndex(item => item.description === this.state.curr_goal.description)
    index3 = array3.findIndex(item => item.description === this.state.curr_goal.description)

    if (index != -1) {
      if (updated.status === 1) {
        goals.completeGoals[index] = updated;
      }
      else {
        goals.completeGoals.splice(index, 1);
        if (updated.status === 0) {
          goals['incompleteGoals'].push(updated);
        }
        else {
          goals['missedGoals'].push(updated);
        }
      }
    }
    else if (index2 != -1) {
      if (updated.status === 0) {
        goals.incompleteGoals[index2] = updated;
      }
      else {
        goals.incompleteGoals.splice(index2, 1);
        if (updated.status === 1) {
          goals['completeGoals'].push(updated);
        }
        else {
          goals['missedGoals'].push(updated);
        }
      }
    }
    else if (index3 != -1) {
      if (updated.status === 2) {
        goals.missedGoals[index3] = updated;
      }
      else {
        goals.missedGoals.splice(index3, 1)
        if (updated.status === 1) {
          goals['completeGoals'].push(updated);
        }
        else {
          goals['incompleteGoals'].push(updated);
        }
      }
    }
    this.setStateHelper('goals', goals)
    this.setModalVisible('modal_edit_visible', !this.state.modal_edit_visible);
  }

  getDate(date) {
    let rv;

    if (date == '' || date == 'NULL') rv = false;
    else rv = date;

    return rv;
  }

  setStateInterest(value) {
    if (this.state.reminder.includes(value)) {
      console.log("removing " + value)
      let copy = [...this.state.reminder]
      copy.splice(copy.indexOf(value), 1)
      console.log(copy)
      this.setState({
        reminder: copy
      })
    }
    else {
      console.log("inserting " + value)
      this.setState({
        reminder: [...this.state.reminder, value]
      })
    }
  }

  getDiff(date) {
    dt1 = new Date()
    dt2 = new Date(date)
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24))
  }

  getDueDate(item) {
    let body;

    if (item.due != "NULL") {
      const days = this.getDiff(item.due)
      body =
      <View style={styles.flexBlock}>
        <View style={styles.textLeftContainer}>
          <Text style={styles.subtitleText}>Due: {item.due} ({days} days)</Text>
        </View>
      </View>
    }
    return body;
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
          backgroundColor: '#CED0CE',
          marginLeft: '14%',
        }}
        />
    );
  };

  render () {
    let states = [
      {label: 'In Progress', value: 0 },
      {label: 'Complete', value: 1 },
      {label: 'Missed', value: 2 },
    ];
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modal_add_visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextField
                inputContainerStyle={styles.inputContainer}
                containerStyle={styles.fieldContainer}
                labelTextStyle={styles.inputText}
                titleTextStyle={styles.inputText}
                affixTextStyle={styles.inputText}
                onChangeText={value => this.setStateHelper('newDescription', value)}
                label='Goal Description'
                title='Required'
                secureTextEntry={false}
                blurOnSubmit={false}
                tintColor='#FF8200'
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                returnKeyType='done'
                // onBlur={() => {
                //   this.checkErrors()
                //   this.checkFull('job')
                // }}
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
                // ref={(input) => this.jobInput = input}
              />

            <DatePicker
              style={{width: 200}}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="MM/DD/YYYY"
              minDate="11/11/2018"
              maxDate="12/31/2018"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
              }}
              onDateChange={(date) => {this.setState({date: date})}}
              />

            <RadioForm
              radio_props={states}
              initial={this.state.status}
              buttonColor={'#FF8200'}
              selectedButtonColor={'#FF8200'}
              formHorizontal={true}
              labelHorizontal={true}
              radioStyle={{paddingRight: 20}}
              onPress={(value) => this.setStateHelper('status', value)}
              />

              <TouchableHighlight
                onPress={this.addNewGoal.bind(this)}>
                <Text>Add Goal</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible('modal_add_visible', !this.state.modal_add_visible);
                }}>
                <Text>Cancel</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal_edit_visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TextField
                inputContainerStyle={styles.inputContainer}
                containerStyle={styles.fieldContainer}
                labelTextStyle={styles.inputText}
                titleTextStyle={styles.inputText}
                affixTextStyle={styles.inputText}
                onChangeText={value => this.setStateHelper('newDescription', value)}
                label='Goal Description'
                value={this.state.curr_goal.description}
                title='Required'
                secureTextEntry={false}
                blurOnSubmit={false}
                tintColor='#FF8200'
                underlineColorAndroid='transparent'
                keyboardAppearance='dark'
                returnKeyType='done'
                // onBlur={() => {
                //   this.checkErrors()
                //   this.checkFull('job')
                // }}
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
                // ref={(input) => this.jobInput = input}
                />
              <DatePicker
                style={{width: 200}}
                date={this.getDate(this.state.date)}
                mode="date"
                placeholder="select date"
                format="MM/DD/YYYY"
                minDate="11/11/2018"
                maxDate="12/31/2018"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={(date) => {this.setState({date: date})}}
                />

              <RadioForm
                radio_props={states}
                initial={this.state.status}
                buttonColor={'#FF8200'}
                selectedButtonColor={'#FF8200'}
                formHorizontal={true}
                labelHorizontal={true}
                radioStyle={{paddingRight: 20}}
                onPress={(value) => this.setStateHelper('status', value)}
                />

              <TouchableHighlight
                onPress={this.updateGoal.bind(this)}>
                <Text>Save</Text>
              </TouchableHighlight>

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible('modal_edit_visible', !this.state.modal_edit_visible);
                }}>
                <Text>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={this.removeGoal.bind(this)}>
                <Text>Remove Goal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>

        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.goals.completeGoals}
            extraData={this.state}
            renderItem={({ item }) => (
              <ListItem
                  leftIcon={<Icon
                            name={'check'}
                            size={30}
                            onPress={() => this.removeGoal(item)}/>}
                  rightIcon={<Icon
                              name={'delete-forever'}
                              size={30}
                              onPress={() => this.removeGoal(item)}/>}
                  title={item.description}
                  containerStyle={{ borderBottomWidth: 0 }}
                  onPress={() => this.editGoal(item)}
                  avatarStyle={{backgroundColor:'#FFFFFF'}}
                  />
              )}
              keyExtractor={item => item.description}
              ItemSeparatorComponent={this.renderSeparator}
              />
          </List>
          <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
            <FlatList
              data={this.state.goals.incompleteGoals}
              extraData={this.state}
              renderItem={({ item }) => (
                <ListItem
                  avatar={<Avatar
                    size="small"
                    rounded
                    source={require('../assets/incomplete.png')}
                    onPress={() => console.log('pressed avatar')}
                    activeOpacity={0.5}
                    />}
                    title={item.description}
                    subtitle={this.getDueDate(item)}
                    containerStyle={{ borderBottomWidth: 0 }}
                    onPress={() => this.editGoal(item)}
                    avatarStyle={{backgroundColor:'#FFFFFF'}}
                    />
                )}
                keyExtractor={item => item.description}
                ItemSeparatorComponent={this.renderSeparator}
                />
            </List>

            <TouchableHighlight
              onPress={() => {
                this.setModalVisible('modal_add_visible', true);
              }}>
              <Text>Add Goal</Text>
            </TouchableHighlight>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  imageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#00000080'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#00746F',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  imageContainer: {
    flex: 1,
    height: 100,
    width: 100,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  btnSurvey: {
    alignItems: 'center',
    backgroundColor: '#E65933',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginTop: 50,
  },
  viewBtn: {
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: 'rgba(240,237,227,0.6)',
    width: '25%',
  },
  viewMentorsBtn: {
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: 'rgba(240,237,227,0.6)',
    width: '65%',
  },
  viewTxt: {
    color: 'black'
  },
  btnSignOutContainer: {
    marginTop: 150,
  },
  flexBlock: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  flexContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  textLeftContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 11,
  },
  subtitleText: {
    color: 'grey',
    fontWeight: 'bold'
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 10,
  },
  formText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
    color: '#58595B'
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
  }
});
