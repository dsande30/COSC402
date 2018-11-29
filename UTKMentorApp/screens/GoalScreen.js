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
      user_data: {},
      modal_edit_visible: false,
      modal_add_visible: false,
      curr_goal: {
        'description': '',
        'due': 'NULL',
        'status': 0,
        'reminder': [],
        'creator': 'User'
      },
      newDescription: '',
      date: 'NULL',
      new_date: 'NULL',
      reminder: [],
      creator: 'User',
      status: 0
    }
  }

  static navigationOptions = {
    title: 'Manage Goals'
  }

  componentDidMount() {
    let { navigation } = this.props;
    let old_state = navigation.getParam('data', 'NO-ID');
    old_state.modal_edit_visible = false;
    old_state.modal_add_visible = false;
    old_state.newDescription = '';
    old_state.date = 'NULL';
    old_state.creator = '',
    old_state.reminder = [],
    old_state.status = 0,
    old_state.new_date = 'NULL',
    old_state.curr_goal = {
      'description': '',
      'due': 'NULL',
      'status': 0,
      'creator': '',
      'reminder': []
    };
    //console.log(old_state)
    if (this.state.user_id == '') {
      this.setState(old_state);
    }
  }

  removeGoal() {
    let goals = this.state.goals
    let compGoals = goals.completeGoals;
    let incompGoals = goals.incompleteGoals;
    let missedGoals = goals.missedGoals;
    let target = this.state.curr_goal
    let index, index2;

    index = compGoals.indexOf(target);
    index2 = incompGoals.indexOf(target);
    index3 = missedGoals.indexOf(target);

    if (index !== -1) compGoals.splice(index, 1);
    else if (index2 !== -1) incompGoals.splice(index2, 1);
    else if (index3 !== -1) missedGoals.splice(index3, 1);

    goals.completeGoals = compGoals;
    goals.incompleteGoals = incompGoals;
    goals.missedGoals = missedGoals;

    this.setStateHelper('goals', goals);
    this.setModalVisible('modal_edit_visible', !this.state.modal_edit_visible);
  }

  async putData() {
    let put_body = {
      body: {
        userid: this.state.user_id,
        user_data: this.state.user_data,
        form_data: this.state.form_data,
        goals: this.state.goals,
        mentor: this.state.mentor,
        pairings: this.state.pairings
      }
    }
    const put_response = await API.put('dynamoAPI', '/items?userid=' + this.state.user_id, put_body);
    return put_response;
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      //console.log(this.state)
    })
  }

  setModalVisible(key, visible) {
    this.setState({[key]: visible}, console.log(this.state));
  }

  addNewGoal() {
    console.log('adding new goal')
    if (this.state.new_date == '') console.log('here')
    let newGoal = {
      'description': this.state.newDescription,
      'due': this.state.new_date,
      'status': this.state.status,
      'creator': 'User',
      'reminder': this.state.reminder
    }
    let copy = this.state.goals

    if (newGoal.status === 0)
      copy['incompleteGoals'].push(newGoal);
    else if (newGoal.status === 1)
      copy['completeGoals'].push(newGoal);
    else if (newGoal.status === 2)
      copy['missedGoals'].push(newGoal);

    this.setStateHelper('goals', copy);
    this.setStateHelper('new_date', 'NULL');
    this.setModalVisible('modal_add_visible', !this.state.modal_add_visible);
  }

  editGoal(item) {
    if (item.due == '') item.due = 'NULL'
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

  submitChanges() {
    this.putData()
    .then((rv) => {
      console.log(rv)
      this.props.navigation.state.params.onNavigateBack()
      this.props.navigation.goBack();
    })
    .catch((err) => console.log(err));
  }

  getDiff(date) {
    dt1 = new Date()
    dt2 = new Date(date)
    console.log((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24))
    return Math.floor((Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) - Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate()) ) /(1000 * 60 * 60 * 24))
  }

  getDueDate(item) {
    let body;

    if (item.due != 'NULL') {
      const days = this.getDiff(item.due)
      if (days >= 0) {
        body =
        <View style={styles.flexBlock}>
          <View style={styles.textLeftContainer}>
            <Text style={styles.subtitleText}>Due: {item.due} ({days} days)</Text>
          </View>
        </View>
      }
      else if (days < 0) {
        body =
        <View style={styles.flexBlock}>
          <View style={styles.textLeftContainer}>
            <Text style={styles.subtitleText}>Due: {item.due} ({Math.abs(days)} days past due)</Text>
          </View>
        </View>
      }
    }
    return body;
  }

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '86%',
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
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.goalHeader}>Click on any goals below to edit them or add a new goal using the button below.</Text>
          <View style={styles.line}></View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modal_add_visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.headerText}>Create New Goal</Text>
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
            <Text style={styles.modalText}>Goal due date (leave empty for none)</Text>
            <View style={styles.flexBlock}>
              <View style={styles.flexCalendarContainer}>
                <View style={styles.calendarContainer}>
                  <DatePicker
                    style={{ width: '100%'}}
                    date={this.getDate(this.state.new_date)}
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
                        marginLeft: 36,
                        borderRadius: 20,
                      },
                      btnTextConfirm: {
                        color: '#FF8200'
                      },
                      btnTextCancel: {
                        color: '#d50000'
                      }
                    }}
                    onDateChange={(date) => {this.setState({new_date: date})}}
                  />
                </View>
              </View>
              <View style={styles.flexCalendarContainer}>
                <TouchableHighlight
                  style={styles.clearCalendarBtn}
                  underlayColor={'#F6F6F6'}
                  onPress={() => this.setState({new_date: 'NULL'})}>
                  <Text style={{color: '#d50000', fontWeight: 'bold'}}>Clear</Text>
                </TouchableHighlight>
              </View>
            </View>

            <Text style={styles.modalText}>Mark goal as:</Text>
            <RadioForm
              radio_props={states}
              initial={this.state.status}
              buttonColor={'#FF8200'}
              selectedButtonColor={'#FF8200'}
              formHorizontal={true}
              labelHorizontal={true}
              radioStyle={{paddingRight: 20, marginTop: 5}}
              onPress={(value) => this.setStateHelper('status', value)}
              />
            <View style={styles.flexBlock}>
              <View style={styles.flexContainer}>
                <TouchableHighlight
                  style={styles.btnUpdate}
                  onPress={this.addNewGoal.bind(this)}>
                  <Text style={styles.btnUpdateText}>Create</Text>
                </TouchableHighlight>
              </View>
              <View style={styles.flexContainer}>
                <TouchableHighlight
                  style={styles.btnCancel}
                  onPress={() => {
                    this.setModalVisible('modal_add_visible', !this.state.modal_add_visible);
                  }}>
                  <Text style={styles.btnCancelText}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>

            </View>
          </View>
        </Modal>

        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modal_edit_visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.headerText}>Edit Goal</Text>
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
              <Text style={styles.modalText}>Goal due date</Text>
              <View style={styles.flexBlock}>
                <View style={styles.flexCalendarContainer}>
                  <View style={styles.calendarContainer}>
                    <DatePicker
                      style={{ width: '100%'}}
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
                          marginLeft: 36,
                          borderRadius: 20,
                        },
                        btnTextConfirm: {
                          color: '#FF8200'
                        },
                        btnTextCancel: {
                          color: '#d50000'
                        }
                      }}
                      onDateChange={(date) => {this.setState({date: date})}}
                      />
                  </View>
                </View>
                <View style={styles.flexCalendarContainer}>
                  <TouchableHighlight
                    style={styles.clearCalendarBtn}
                    underlayColor={'#F6F6F6'}
                    onPress={() => this.setState({date: 'NULL'})}>
                    <Text style={{color: '#d50000', fontWeight: 'bold'}}>Clear</Text>
                  </TouchableHighlight>
                </View>
              </View>
              <Text style={styles.modalText}>Mark goal as</Text>
              <RadioForm
                radio_props={states}
                initial={this.state.status}
                buttonColor={'#FF8200'}
                selectedButtonColor={'#FF8200'}
                formHorizontal={true}
                labelHorizontal={true}
                radioStyle={{paddingRight: 20, marginTop: 5}}
                onPress={(value) => this.setStateHelper('status', value)}
                />

              <View style={styles.flexBlock}>
                <View style={styles.flexContainer}>
                  <TouchableHighlight
                    style={styles.btnRemove}
                    onPress={this.removeGoal.bind(this)}>
                    <Text style={styles.btnRemoveText}>Delete</Text>
                  </TouchableHighlight>
                </View>
                <View style={styles.flexContainer}>
                  <TouchableHighlight
                    style={styles.btnCancel}
                    onPress={() => {
                      this.setModalVisible('modal_edit_visible', !this.state.modal_edit_visible);
                    }}>
                    <Text style={styles.btnCancelText}>Cancel</Text>
                  </TouchableHighlight>
                </View>
              </View>
              <View style={{ alignItems: 'center'}}>
                <TouchableHighlight
                  style={styles.btnUpdate}
                  onPress={this.updateGoal.bind(this)}>
                  <Text style={styles.btnUpdateText}>Save</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
      </Modal>

        <View style={styles.goalContainer}>
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.goals.incompleteGoals}
            extraData={this.state}
            renderItem={({ item }) => (
              <ListItem
                containerStyle={styles.listContainerIncomplete}
                titleStyle={styles.titleStyle}
                leftIcon={<Icon
                        name='checkbox-blank'
                        type='material-community'
                        color='rgba(0, 0, 0, 0.6)'
                        size={30}
                        onPress={() => this.editGoal(item)}
                        />}
                rightIcon={<Icon
                            name='lead-pencil'
                            type='material-community'
                            color='rgba(0, 0, 0, 0.6)'
                            size={20}
                            onPress={() => this.editGoal(item)}
                            />}
                title={item.description}
                subtitle={this.getDueDate(item)}
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
              data={this.state.goals.missedGoals}
              extraData={this.state}
              renderItem={({ item }) => (
                <ListItem
                  containerStyle={styles.listContainerMissed}
                  titleStyle={styles.titleStyle}
                  subtitle={this.getDueDate(item)}
                  onPress={() => this.editGoal(item)}
                  leftIcon={<Icon
                            name='alert-box'
                            type='material-community'
                            size={30}
                            color='rgba(0, 0, 0, 0.6)'
                            onPress={() => this.editGoal(item)}/>}
                  rightIcon={<Icon
                            name='lead-pencil'
                            type='material-community'
                            size={20}
                            color='rgba(0, 0, 0, 0.6)'
                            onPress={() => this.editGoal(item)}/>}
                            title={item.description}
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
                  data={this.state.goals.completeGoals}
                  extraData={this.state}
                  renderItem={({ item }) => (
                    <ListItem
                      containerStyle={styles.listContainerComplete}
                      titleStyle={styles.titleStyle}
                      subtitle={this.getDueDate(item)}
                      leftIcon={<Icon
                                name='checkbox-marked'
                                type='material-community'
                                size={30}
                                color='rgba(0, 0, 0, 0.6)'
                                onPress={() => this.editGoal(item)}/>}
                      rightIcon={<Icon
                                name='lead-pencil'
                                type='material-community'
                                size={20}
                                color='rgba(0, 0, 0, 0.6)'
                                onPress={() => this.editGoal(item)}/>}
                      title={item.description}
                      onPress={() => this.editGoal(item)}
                      avatarStyle={{backgroundColor:'#FFFFFF'}}
                      />
                    )}
                    keyExtractor={item => item.description}
                    ItemSeparatorComponent={this.renderSeparator}
                    />
                </List>
                </View>

            <View style={styles.flexContainer}>
              <TouchableOpacity
                onPress={() => this.setModalVisible('modal_add_visible', true)}
                style={styles.btnAdd}>
                <Icon
                  name='plus'
                  type='material-community'
                  size={40}
                  color='rgba(255,255,255,0.7)'
                  onPress={() => this.setModalVisible('modal_add_visible', true)}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.flexContainer}>
              <TouchableHighlight
                style={styles.btnUpdate}
                onPress={this.submitChanges.bind(this)}>
                <Text style={styles.btnUpdateText}>Save Changes</Text>
              </TouchableHighlight>
            </View>

        </ScrollView>
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
  modalText: {
    fontSize: 16,
    color: '#58595B',
    marginTop: 15,
    fontWeight: 'bold'
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    paddingRight: '5%',
    paddingLeft: '5%',
  },
  calendarContainer: {
    marginTop: 5,
    marginBottom: 10
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  btnCancelText: {
    textAlign: 'center',
    color: '#d50000',
    fontWeight: 'bold',
  },
  btnUpdateText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  btnCancel: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: '#d50000',
    borderWidth: 1,
    height: 36,
    width: '50%',
    borderRadius: 20,
    marginTop: 35,
    marginBottom: 15
  },
  btnRemove: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d50000',
    width: '50%',
    height: 36,
    borderRadius: 20,
    marginBottom: 15,
    marginTop: 35
  },
  btnRemoveText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  clearCalendarBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'transparent',
    color: '#58595B',
    borderColor: '#58595B',
    borderWidth: 0,
    marginLeft: '5%',
    height: 36,
    width: '50%'
  },
  btnUpdate: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#58595B',
    width: '50%',
    height: 36,
    borderRadius: 20,
    marginTop: 35,
    marginBottom: 25
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
  listContainerComplete: {
    backgroundColor: '#82CA9D',
    borderRadius: 10,
    borderBottomWidth: 0
  },
  listContainerIncomplete: {
    backgroundColor: '#E2E2DE',
    borderRadius: 10,
    borderBottomWidth: 0
  },
  listContainerMissed: {
    backgroundColor: '#FF817B',
    borderRadius: 10,
    borderBottomWidth: 0
  },
  titleStyle: {
    marginLeft: 12,
    color: '#58595B'
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
  flexCalendarContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  textLeftContainer: {
    paddingLeft: 12,
  },
  subtitleText: {
    color: 'grey',
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
    backgroundColor: '#F6F6F6'
  },
  fieldContainer: {
    marginTop: 20
  },
  goalHeader: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'normal',
    padding: 15,
  },
  line: {
    borderBottomColor: '#58595B',
    borderBottomWidth: 2,
    marginTop: 5,
    marginBottom: 0,
    marginLeft: '3%',
    marginRight: '3%',
    borderRadius: 10
  },
  goalContainer: {
    backgroundColor: 'transparent',
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 5,
    borderRadius: 15
  },
  btnAdd: {
    backgroundColor: '#58595B',
    borderRadius: 30,
    width: 48,
    height: 48,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    marginTop: 20,
    paddingTop: 3
  },
});
