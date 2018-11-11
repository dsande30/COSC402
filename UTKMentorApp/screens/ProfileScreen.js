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
import { List, Avatar, ListItem, SearchBar } from 'react-native-elements';
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
        console.log('setting dynamo data')
        console.log(rv)
        this.setState({
          user_id: this.user_id,
          name: this.name,
          role: this.role,
          photo: photo,
          form_data: rv[0].form_data,
          goals: rv[0].goals,
          mentor: rv[0].mentor,
          pairings: rv[0].pairings
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
          backgroundColor: '#CED0CE',
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
    let body, appButton, yourImage, mentorImage, viewYou, viewMentors, completeGoals, incompleteGoals;

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
                      onPress={() => this.props.navigation.navigate('Individual', {data: this.state})}>
                      <Image
                        style={styles.image}
                        source={this.state.photo}
                        />
                    </TouchableHighlight>
        mentorImage = <TouchableHighlight
                        underlayColor='transparent'
                        activeOpacity={0.2}
                        onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}>
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
                       onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}>
                       <Text style={styles.viewTxt}>Browse Mentors</Text>
                     </TouchableOpacity>
        completeGoals = <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                        <FlatList
                          data={this.state.goals.completeGoals}
                          renderItem={({ item }) => (
                            <ListItem
                            avatar={<Avatar
                              size="small"
                              rounded
                              source={require('../assets/complete.png')}
                              onPress={() => console.log("Works!")}
                              activeOpacity={0.7}
                              />}
                            title={item.description}
                            containerStyle={{ borderBottomWidth: 0 }}
                            onPress={() => console.log('pressed goal')}
                            hideChevron
                            avatarStyle={{backgroundColor:'#FFFFFF'}}
                            />
                          )}
                          keyExtractor={item => item.description}
                          ItemSeparatorComponent={this.renderSeparator}
                        />
                      </List>
        incompleteGoals = <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                          <FlatList
                            data={this.state.goals.incompleteGoals}
                            renderItem={({ item }) => (
                              <ListItem
                              avatar={<Avatar
                                size="small"
                                rounded
                                source={require('../assets/incomplete.png')}
                                onPress={() => console.log("Works!")}
                                activeOpacity={1}
                                />}
                              title={item.description}
                              subtitle={this.getDueDate(item)}
                              containerStyle={{ borderBottomWidth: 0 }}
                              onPress={() => console.log('pressed goal')}
                              hideChevron
                              avatarStyle={{backgroundColor:'#FFFFFF'}}
                              />
                            )}
                            keyExtractor={item => item.description}
                            ItemSeparatorComponent={this.renderSeparator}
                          />
                        </List>
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
                        onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}>
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
                       onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}>
                       <Text style={styles.viewTxt}>Browse Mentees</Text>
                     </TouchableOpacity>
       completeGoals = <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                       <FlatList
                         data={this.state.goals.completeGoals}
                         renderItem={({ item }) => (
                           <ListItem
                           avatar={<Avatar
                             size="small"
                             rounded
                             source={require('../assets/complete.png')}
                             onPress={() => console.log("Works!")}
                             activeOpacity={0.7}
                             />}
                           title={item.description}
                           containerStyle={{ borderBottomWidth: 0 }}
                           onPress={() => console.log('pressed goal')}
                           hideChevron
                           avatarStyle={{backgroundColor:'#FFFFFF'}}
                           />
                         )}
                         keyExtractor={item => item.description}
                         ItemSeparatorComponent={this.renderSeparator}
                       />
                     </List>
       incompleteGoals = <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                         <FlatList
                           data={this.state.goals.incompleteGoals}
                           renderItem={({ item }) => (
                             <ListItem
                             avatar={<Avatar
                               size="small"
                               rounded
                               source={require('../assets/incomplete.png')}
                               onPress={() => console.log("Works!")}
                               activeOpacity={1}
                               />}
                             title={item.description}
                             subtitle={this.getDueDate(item)}
                             containerStyle={{ borderBottomWidth: 0 }}
                             onPress={() => console.log('pressed goal')}
                             hideChevron
                             avatarStyle={{backgroundColor:'#FFFFFF'}}
                             />
                           )}
                           keyExtractor={item => item.description}
                           ItemSeparatorComponent={this.renderSeparator}
                         />
                       </List>
      }
    }
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.header}
          colors={['#00746F', '#E65933']}
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
          <Text style={styles.nameText}>{this.state.name + `'s`} Dashboard</Text>
        </LinearGradient>
        {completeGoals}
        {incompleteGoals}
        <View style={styles.btnContainer}>
          {body}
          {appButton}
          <View style={styles.btnSignOutContainer}>
            <Button color='#8D2048' style={styles.btnSignOut} title="Sign Out" onPress={this.signOut.bind(this)} />
          </View>
        </View>
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
    alignItems: 'left',
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
  }
});
