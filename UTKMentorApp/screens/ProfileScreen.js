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
  Modal,
  TouchableHighlight,
  Keyboard
} from 'react-native';

import { SearchableFlatList } from "react-native-searchable-list";
import Amplify, { Auth, API } from 'aws-amplify';

export default class Profile extends Component {
  state = {
    user_id: '',
    name: '',
    role: '',
    form_data: {},
    goals: {},
    mentor: '',
    parings: []
  }

  async getData() {
    const get_response = await API.get('dynamoAPI', '/items/' + this.state.user_id);
    return get_response;
  }

  async getUser() {
    const info = await Auth.currentAuthenticatedUser()
    return info
  }

  setData() {
    this.getData()
    .then((rv) => this.setState({
      form_data: rv[0].form_data,
      goals: rv[0].goals,
      mentor: rv[0].mentor,
      pairings: rv[0].pairings
    }))
  }

  setUserAttributes() {
    this.getUser().then((data) => this.setState({
      user_id: data.attributes.email,
      name: data.attributes.name,
      role: data.attributes['custom:role']
    }))
  }

  setStateHelper(key, value) {
    this.setState({
      [key]: value
    }, function(newState) {
      console.log(this.state)
    })
  }

  render () {
    this.setUserAttributes();
    this.setData();
    return (
      <ScrollView style={styles.container}>
        <View style={styles.imageBlock}>
          <View style={styles.imageContainer}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Individual')}>
              <Image
                style={styles.image}
                source={require('../assets/face.png')}
                />
            </TouchableHighlight>
            <Text>{this.state.name}</Text>
          </View>
          <View style={styles.imageContainer}>
            <TouchableHighlight onPress={() => this.props.navigation.navigate('Individual')}>
              <Image
                style={styles.image}
                source={require('../assets/mentor.png')}
                />
            </TouchableHighlight>
            <Text>?</Text>
          </View>
        </View>
        <Button
          onPress={() => this.props.navigation.navigate('Search', {role: this.state.role})}
          title="Search People"
          />
        <View style={styles.bio}>
          <Text style={styles.baseText}>
            <Text style={styles.aboutTitle}>About You{"\n"}</Text>
            <Text>Name: {this.state.name}{"\n"}</Text>
            <Text>Gender: {this.state.form_data.gender}{"\n"}</Text>
            <Text>Class: {this.state.form_data.class_year}{"\n"}</Text>
            <Text>Major: {this.state.form_data.major}{"\n"}</Text>
          </Text>
        </View>
        <View style={styles.goals}>
          <TouchableHighlight onPress={() => this.props.navigation.navigate('Goals')}>
            <Text>Hi</Text>
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
    marginBottom: 50
  },
  bio: {
    marginTop: 25,
  },
  aboutTitle: {
    textAlign: 'center'
  },
  baseText: {
    textAlign: 'center'
  },
  imageBlock: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageContainer: {
    flex: 1,
    marginTop: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  terms: {
    marginTop: 22,
    marginBottom: 22
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  inputs: {
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: '#FF8200',
    margin: 10
  }
});
