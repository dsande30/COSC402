import React, { Component } from 'react';
import { View, Image, Text, FlatList, ActivityIndicator } from 'react-native';
import { List, Avatar, ListItem, SearchBar, Icon } from 'react-native-elements';

import Amplify, { API } from 'aws-amplify';

export default class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      role: '',
      user_data: ''
    };

    this.arrayholder = [];
  }

  static navigationOptions = {
    title:           <Icon
                name='magnify'
                type='material-community'
                color='rgba(255,255,255,0.70)'
                size={30}
              />,
    headerStyle: {
      backgroundColor: '#58595B',
    },
    headerTintColor: 'rgba(255,255,255,0.70)',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
    headerBackTitle: null,
  }

  setData() {
    let { navigation } = this.props;
    let role = navigation.getParam('role', 'NO-ID')
    let user_data = navigation.getParam('user_data')
    this.props.navigation.state.params.onNavigateBack()

    // Mark the "search profile" goal as done if its their first time
    let goals = user_data.goals
    let incompGoals = user_data.goals.incompleteGoals
    if (user_data.mentor) {
      index = incompGoals.findIndex(item => item.description === "Search mentee profiles" && item.creator === "EMP")
    }
    else {
      index = incompGoals.findIndex(item => item.description === "Search mentor profiles" && item.creator === "EMP")
    }

    if (index != -1) {
      let compGoal = incompGoals[index]
      compGoal.status = 1
      goals.incompleteGoals.splice(index, 1);
      goals['completeGoals'].push(compGoal);
      console.log(goals)
    }

    if (this.state.role == '') {
      this.setState({
        role: role,
        user_data: user_data
      }, () => {
        if (index != -1) {
          this.putData()
        }
      });
    }
    this.getData()
    .then((rv) => {
      this.getMentors(rv.data);
    })
    .catch((err) => console.log(err.response));
  }

  async putData() {
    let put_body = {
      body: {
        userid: this.state.user_data.user_id,
        user_data: this.state.user_data.user_data,
        form_data: this.state.user_data.form_data,
        goals: this.state.user_data.goals,
        mentor: this.state.user_data.mentor,
        pairings: this.state.user_data.pairings
      }
    }
    const put_response = await API.put('dynamoAPI', '/items?userid=' + this.state.user_data.user_id, put_body);
    return put_response;
  }

  componentDidMount() {
    this.setData();
  }

  async getData() {
    const get_response = await API.get('dynamoAPI', '/items')
    return get_response;
  }

  getMentors(data) {
    const searches = []
    this.setState({
      loading: true
    });
    for (var i = 0; i < data.length; i++) {
      if (this.state.role == 'Mentee'
          && data[i].mentor === true
          && Object.keys(data[i].form_data).length > 0) searches.push(data[i]);
      else if (this.state.role == 'Mentor'
               && data[i].mentor === false
               && Object.keys(data[i].form_data).length > 0) searches.push(data[i]);
    }

    searches.sort((a, b) => a.form_data.major.localeCompare(b.form_data.major));
    this.arrayholder = searches;
    this.setState({
      data: searches,
      loading: false,
    });
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

  openBio(email) {
    let obj;
    for (var i = 0; i < this.arrayholder.length; i++) {
      if (this.arrayholder[i].user_data.email == email) {
        obj = this.arrayholder[i];
        obj.name = this.arrayholder[i].user_data.name
        if (obj.mentor == true) obj.role = 'Mentor'
        else obj.role = 'Mentee'
      }
    }

    this.props.navigation.navigate('Individual', { data: obj, from: 'search', user_data: this.state.user_data });
  }

  searchFilterFunction = text => {
    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.user_data.name.toUpperCase()} ${item.form_data.major.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  renderHeader = () => {
    return (
      <SearchBar
        placeholder="Type Here..."
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
      />
    );
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (
            <ListItem
            avatar={<Avatar
              size="small"
              rounded
              title={item.user_data.name.substring(0,2).toUpperCase()}
              onPress={() => console.log("Works!")}
              activeOpacity={0.7}
              />}
            title={item.user_data.name}
            subtitle={item.form_data.major}
            containerStyle={{ borderBottomWidth: 0 }}
            onPress={() => this.openBio(item.user_data.email)}
            />
          )}
          keyExtractor={item => item.form_data.email}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
        />
      </List>
    );
  }
}
