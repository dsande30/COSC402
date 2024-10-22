import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
  FlatList,
  ScrollView,
  Modal,
  TouchableHighlight,
  Keyboard
} from 'react-native';

import Amplify, { Auth, API } from 'aws-amplify';
import { Icon, List, Avatar, ListItem, SearchBar } from 'react-native-elements';
import { LinearGradient } from 'expo';

export default class Profile extends Component {
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
      photo: ''
    }
    this.user_id = ''
    this.name = ''
    this.role = ''
    this.form_data = {}
    this.goals = {}
    this.mentor = ''
    this.pairings = []
  }

  static navigationOptions = {
    header: null
  }

  handleOnNavigateBack = () => {
    this.componentDidMount();
  }

  //Get user's dynamo data
  async getData() {
    const get_response = await API.get('dynamoAPI', '/items/' + this.user_id);
    return get_response;
  }

  async getUser() {
    const info = await Auth.currentAuthenticatedUser();
    return info;
  }

  setData() {
    this.getData()
    .then((rv) =>
      {
        console.log('setting dynamo data')
        this.form_data = rv[0].form_data
        this.goals = rv[0].goals
        this.mentor = rv[0].mentor
        this.pairings = rv[0].pairings
      }
    )
  }

  willFocus = this.props.navigation.addListener(
    'willFocus',
    payload => {
      this.setUserAttributes();
    }
  );

  setUserAttributes() {
    this.getUser()
    .then((data) =>
    {
      let photo;
      console.log('setting user data')
      this.user_id = data.attributes.email
      this.name = data.attributes.name.split(' ')[0]
      this.role = data.attributes['custom:role']
      if (this.user_id == 'jcate6@vols.utk.edu') photo = require('../assets/james.jpeg')
      else photo = require('../assets/andrey.jpeg')
      this.getData()
      .then((rv) => {
        this.setState({
          user_id: this.user_id,
          name: this.name,
          role: this.role,
          photo: photo,
          form_data: rv[0].form_data,
          goals: rv[0].goals,
          mentor: rv[0].mentor,
          pairings: rv[0].pairings,
          user_data: rv[0].user_data
        }, function () { console.log('set that state')})
      })
    })
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

  signOut() {
    Auth.signOut()
      .then(data => {
        console.log('succesful sign out: ', data)
        this.props.navigation.navigate('SignIn')
      })
      .catch(err => console.log(err));
  }

  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }

  getApplication(screenName) {
    this.props.navigation.navigate(screenName)
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      console.log(this.state)
    })
  }

  componentDidMount() {
    this.setUserAttributes();
  }

  getDiff(date) {
    dt1 = new Date()
    dt2 = new Date(date)
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
    let body, appButton, yourImage, mentorImage, viewYou, viewMentors, completeGoals, incompleteGoals, missedGoals, goalsHeader;
    let incompleteHeader, completeHeader, missedHeader, goalInterface;

    // HomeScreen either shows "start survey" or goals and stuff
    if (this.state.role == 'Mentee') {
      if (Object.keys(this.state.form_data).length == 0) {
        yourImage = <TouchableHighlight>
                      <Image
                        style={styles.image}
                        source={this.state.photo}
                        />
                    </TouchableHighlight>
        mentorImage = <TouchableHighlight>
                        <Image
                          style={styles.image}
                          source={require('../assets/question-mark.png')}
                          />
                      </TouchableHighlight>
        body = <Text style={styles.formText}>Welcome! Thank you for creating an account as a
               <Text style={{fontWeight: 'bold'}}> Mentee</Text>.
                 To help us learn more about your interests and find your mentor,
                 please fill out the survey below.
               </Text>
       appButton = <TouchableOpacity
                      style={styles.btnSurvey}
                      onPress={() => this.props.navigation.navigate('MenteeForm', { user_id: this.state.user_id, onNavigateBack: this.handleOnNavigateBack })}>
                      <Text style={styles.btnText}>Begin Survey</Text>
                   </TouchableOpacity>
      }
      else {
        yourImage = <TouchableHighlight
                      underlayColor='transparent'
                      activeOpacity={0.2}
                      onPress={() => this.props.navigation.navigate('Individual', {data: this.state, from: 'profile'})}>
                      <Image
                        style={styles.image}
                        source={this.state.photo}
                        />
                    </TouchableHighlight>
        mentorImage = <TouchableHighlight
                        underlayColor='transparent'
                        activeOpacity={0.2}
                        onPress={() => this.props.navigation.navigate('Search', {role: this.state.role, user_data: this.state, onNavigateBack: this.handleOnNavigateBack })}>
                        <Image
                          style={styles.image}
                          source={require('../assets/question-mark.png')}
                          />
                      </TouchableHighlight>
        viewYou = <TouchableOpacity
                       style={styles.viewBtn}
                       onPress={() => this.props.navigation.navigate('Individual', {data: this.state})}>
                       <Text style={styles.viewTxt}>View</Text>
                    </TouchableOpacity>
        viewMentors = <TouchableOpacity
                       style={styles.viewMentorsBtn}
                       onPress={() => this.props.navigation.navigate('Search', {role: this.state.role, user_data: this.state, onNavigateBack: this.handleOnNavigateBack })}>
                       <Text style={styles.viewTxt}>Browse Mentors</Text>
                     </TouchableOpacity>
        appButton = <TouchableOpacity
                       style={styles.btnEdit}
                       onPress={() => this.props.navigation.navigate('Goals', { data: this.state, onNavigateBack: this.handleOnNavigateBack })}>
                       <Icon
                         name='lead-pencil'
                         type='material-community'
                         color='rgba(255,255,255,0.70)'
                         size={25}
                       />
                    </TouchableOpacity>
        goalsHeader =
        <View>
        <Text style={styles.goalHeader}>Your Goals</Text>
        <View style={styles.line}></View>
        </View>

        incompleteHeader =
        <View>
        <Text style={styles.goalLabel}>In-Progress</Text>
        </View>

        missedHeader =
        <View>
        <Text style={styles.goalLabel}>Missed</Text>
        </View>

        completeHeader =
        <View>
        <Text style={styles.goalLabel}>Completed</Text>
        </View>

        completeGoals =
        <List containerStyle={styles.listContainer}>
          <FlatList
            data={this.state.goals.completeGoals}
            extraData={this.state}
            renderItem={({ item }) => (
              <ListItem
                containerStyle={styles.listContainerComplete}
                titleStyle={styles.titleStyle}
                hideChevron
                leftIcon={<Icon
                          name='checkbox-marked'
                          type='material-community'
                          size={30}
                          color='rgba(0, 0, 0, 0.6)'/>}
                title={item.description}
                />
              )}
              keyExtractor={item => item.description}
              ItemSeparatorComponent={this.renderSeparator}
              />
          </List>
        incompleteGoals =
        <List containerStyle={styles.listContainer}>
          <FlatList
            data={this.state.goals.incompleteGoals}
            extraData={this.state}
            renderItem={({ item }) => (
              <ListItem
                containerStyle={styles.listContainerIncomplete}
                titleStyle={styles.titleStyle}
                hideChevron
                leftIcon={<Icon
                        name='checkbox-blank'
                        type='material-community'
                        color='rgba(0, 0, 0, 0.6)'
                        size={30}
                        />}
                title={item.description}
                subtitle={this.getDueDate(item)}
                avatarStyle={{backgroundColor:'#FFFFFF'}}
                />
              )}
              keyExtractor={item => item.description}
              ItemSeparatorComponent={this.renderSeparator}
              />
          </List>
          missedGoals =
          <List containerStyle={styles.listContainer}>
            <FlatList
              data={this.state.goals.missedGoals}
              extraData={this.state}
              renderItem={({ item }) => (
                <ListItem
                  containerStyle={styles.listContainerMissed}
                  titleStyle={styles.titleStyle}
                  subtitle={this.getDueDate(item)}
                  hideChevron
                  leftIcon={<Icon
                    name='alert-box'
                    type='material-community'
                    size={30}
                    color='rgba(0, 0, 0, 0.6)'/>}
                    title={item.description}
                    avatarStyle={{backgroundColor:'#FFFFFF'}}
                    />
                  )}
                  keyExtractor={item => item.description}
                  ItemSeparatorComponent={this.renderSeparator}
                  />
              </List>
          goalInterface =
        <View style={styles.goalContainer}>
          {body}
          {goalsHeader}
          {incompleteHeader}
          {incompleteGoals}
          {missedHeader}
          {missedGoals}
          {completeHeader}
          {completeGoals}
          <View style={styles.btnContainer}>
            {appButton}
          </View>
        </View>
      }
    }
    else if (this.state.role == 'Mentor') {
      if (Object.keys(this.state.form_data).length == 0) {
        yourImage = <TouchableHighlight>
                      <Image
                        style={styles.image}
                        source={this.state.photo}
                        />
                    </TouchableHighlight>
        mentorImage = <TouchableHighlight>
                        <Image
                          style={styles.image}
                          source={require('../assets/question-mark.png')}
                          />
                      </TouchableHighlight>
        body = <Text style={styles.formText}>You have signed up as a
               <Text style={{fontWeight: 'bold'}}> Mentor</Text>.
                 To help us learn more about your interests and match you with mentees,
                 please fill out the survey below.
               </Text>

       appButton = <TouchableOpacity
                      style={styles.btnSurvey}
                      onPress={() => this.props.navigation.navigate('MentorForm', { user_id: this.state.user_id, onNavigateBack: this.handleOnNavigateBack })}>
                      <Text style={styles.btnText}>Begin Survey</Text>
                   </TouchableOpacity>
      }
      else {
        yourImage = <TouchableHighlight
                      underlayColor='transparent'
                      activeOpacity={0.2}
                      onPress={() => this.props.navigation.navigate('Individual', {data: this.state})}>
                      <Image
                        style={styles.image}
                        source={this.state.photo}
                        />
                    </TouchableHighlight>
        mentorImage = <TouchableHighlight
                        underlayColor='transparent'
                        activeOpacity={0.2}
                        onPress={() => this.props.navigation.navigate('Search', {role: this.state.role, user_data: this.state, onNavigateBack: this.handleOnNavigateBack })}>
                        <Image
                          style={styles.image}
                          source={require('../assets/question-mark.png')}
                          />
                      </TouchableHighlight>
        viewYou = <TouchableOpacity
                       style={styles.viewBtn}
                       onPress={() => this.props.navigation.navigate('Individual', {data: this.state})}>
                       <Text style={styles.viewTxt}>View</Text>
                    </TouchableOpacity>
        appButton = <TouchableOpacity
                       style={styles.btnEdit}
                       onPress={() => this.props.navigation.navigate('Goals', { data: this.state, onNavigateBack: this.handleOnNavigateBack })}>
                       <Icon
                         name='lead-pencil'
                         type='material-community'
                         color='rgba(255,255,255,0.70)'
                         size={25}
                       />
                    </TouchableOpacity>
        viewMentors = <TouchableOpacity
                       style={styles.viewMentorsBtn}
                       onPress={() => this.props.navigation.navigate('Search', {role: this.state.role, user_data: this.state, onNavigateBack: this.handleOnNavigateBack })}>
                       <Text style={styles.viewTxt}>Browse Mentees</Text>
                     </TouchableOpacity>
       goalsHeader =
       <View>
       <Text style={styles.goalHeader}>Your Goals</Text>
       <View style={styles.line}></View>
       </View>

      incompleteHeader =
      <View>
      <Text style={styles.goalLabel}>In-Progress</Text>
      </View>

      missedHeader =
      <View>
      <Text style={styles.goalLabel}>Missed</Text>
      </View>

      completeHeader =
      <View>
      <Text style={styles.goalLabel}>Completed</Text>
      </View>

       completeGoals =
       <List containerStyle={styles.listContainer}>
         <FlatList
           data={this.state.goals.completeGoals}
           extraData={this.state}
           renderItem={({ item }) => (
             <ListItem
               containerStyle={styles.listContainerComplete}
               titleStyle={styles.titleStyle}
               hideChevron
               leftIcon={<Icon
                         name='checkbox-marked'
                         type='material-community'
                         size={30}
                         color='rgba(0, 0, 0, 0.6)'/>}
               title={item.description}
               />
             )}
             keyExtractor={item => item.description}
             ItemSeparatorComponent={this.renderSeparator}
             />
         </List>
       incompleteGoals =
       <List containerStyle={styles.listContainer}>
         <FlatList
           data={this.state.goals.incompleteGoals}
           extraData={this.state}
           renderItem={({ item }) => (
             <ListItem
               containerStyle={styles.listContainerIncomplete}
               titleStyle={styles.titleStyle}
               hideChevron
               leftIcon={<Icon
                       name='checkbox-blank'
                       type='material-community'
                       color='rgba(0, 0, 0, 0.6)'
                       size={30}
                       />}
               title={item.description}
               subtitle={this.getDueDate(item)}
               avatarStyle={{backgroundColor:'#FFFFFF'}}
               />
             )}
             keyExtractor={item => item.description}
             ItemSeparatorComponent={this.renderSeparator}
             />
         </List>
         missedGoals =
         <List containerStyle={styles.listContainer}>
           <FlatList
             data={this.state.goals.missedGoals}
             extraData={this.state}
             renderItem={({ item }) => (
               <ListItem
                 containerStyle={styles.listContainerMissed}
                 titleStyle={styles.titleStyle}
                 hideChevron
                 subtitle={this.getDueDate(item)}
                 leftIcon={<Icon
                   name='alert-box'
                   type='material-community'
                   size={30}
                   color='rgba(0, 0, 0, 0.6)'/>}
                   title={item.description}
                   avatarStyle={{backgroundColor:'#FFFFFF'}}
                   />
                 )}
                 keyExtractor={item => item.description}
                 ItemSeparatorComponent={this.renderSeparator}
                 />
             </List>
          goalInterface =
        <View style={styles.goalContainer}>
          {body}
          {goalsHeader}
          {incompleteHeader}
          {incompleteGoals}
          {missedHeader}
          {missedGoals}
          {completeHeader}
          {completeGoals}
          <View style={styles.btnContainer}>
            {appButton}
          </View>
        </View>
      }
    }
    return (
      <ScrollView style={styles.container}>
        <LinearGradient
          style={styles.header}
          colors={['#87898C', '#FFF']}
          >
          <View style={styles.imageBlock}>
            <View style={styles.imageContainer}>
              {yourImage}
            </View>
            <View style={styles.imageContainer}>
              {mentorImage}
            </View>
          </View>
          <View style={styles.flexBlock}>
            <View style={styles.flexContainer}>
              {viewYou}
            </View>
            <View style={styles.flexContainer}>
              {viewMentors}
            </View>
          </View>
          <Text style={styles.nameText}>Hi, {this.state.name}!</Text>
        </LinearGradient>

        {goalInterface}

        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btnSignOut}
            onPress={this.signOut.bind(this)}>
            <Text style={styles.btnSignOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 0,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#00746F',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 10,
  },
  listContainerComplete: {
    backgroundColor: '#82CA9D',
    borderBottomColor: '#A7A9AC',
    borderBottomWidth: 0,
    borderRadius: 10
  },
  listContainerIncomplete: {
    backgroundColor: '#E2E2DE',
    borderBottomColor: '#A7A9AC',
    borderBottomWidth: 0,
    borderRadius: 10
  },
  listContainerMissed: {
    backgroundColor: '#FF817B',
    borderBottomColor: '#A7A9AC',
    borderBottomWidth: 0,
    borderRadius: 10
  },
  titleStyle: {
    marginLeft: 12,
    color: '#58595B'
  },
  goalHeader: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    marginTop: 15,
    color: '#FFFFFF'
  },
  textLeftContainer: {
    paddingLeft: 12,
  },
  subtitleText: {
    color: 'grey',
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
    backgroundColor: '#58595B',
    width: '50%',
    borderRadius: 20,
    padding: 10,
    marginTop: 50,
  },
  viewBtn: {
    alignItems: 'center',
    borderRadius: 20,
    height: 28,
    marginTop: 5,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  viewMentorsBtn: {
    alignItems: 'center',
    borderRadius: 20,
    height: 28,
    marginTop: 5,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  viewTxt: {
    color: 'white',
    marginRight: 12,
    marginLeft: 12
  },
  btnSignOutContainer: {
    marginTop: 120,
    marginBottom: 20
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
  },
  btnText: {
    textAlign: 'center',
    color: '#FFF',
    fontWeight: 'bold',
  },
  btnSignOutText: {
    textAlign: 'center',
    color: '#d50000',
    fontWeight: 'bold',
  },
  btnContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnSignOut: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderColor: '#d50000',
    borderWidth: 1,
    height: 36,
    width: '50%',
    borderRadius: 20,
    marginTop: 35,
    marginBottom: 25
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
  nameText: {
    color: '#58595B',
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 25,
  },
  formText: {
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
    color: '#58595B'
  },
  goalLabel: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 25,
    color: '#FFFFFF',
  },
  listContainer: {
    marginTop: 5,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    backgroundColor: 'transparent'
  },
  goalContainer: {
    backgroundColor: '#A7A9AC',
    paddingBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    borderRadius: 15
  },
  btnEdit: {
    backgroundColor: '#58595B',
    borderRadius: 30,
    width: 48,
    height: 48,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    marginTop: 20
  },
});
