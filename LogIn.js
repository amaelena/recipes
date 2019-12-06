import React from 'react';
import { View, ScrollView, Text, ImageBackground, StatusBar, TouchableOpacity } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { styles } from './Styles';
import { TextInput } from 'react-native-gesture-handler';
import firebase from 'firebase';
import '@firebase/firestore';

var firebaseConfig = {
  apiKey: "AIzaSyBmRHQzEuc6uFoY_sbocsaa9qlkRY3M2So",
  authDomain: "fir-3-bb044.firebaseapp.com",
  databaseURL: "https://fir-3-bb044.firebaseio.com",
  projectId: "fir-3-bb044",
  storageBucket: "fir-3-bb044.appspot.com",
  messagingSenderId: "508807938358",
  appId: "1:508807938358:web:14cb3d763a96e49560b397"
};

export class LogInScreen extends React.Component {

  static navigationOptions = {
    headerStyle: {
      height: 0,
    },
    headerTintColor: '#fff',
  };

    constructor(props) {
        super(props);
        if (firebase.apps.length == 0){
          firebase.initializeApp(firebaseConfig);
        }
         //const db, if firebase.apps.length===0
        const db = firebase.firestore();
        this.db = db;
        
        
        let initUsername = '';
        let initPassword = '';
        let initError = '';
    
        this.state = {
          inputUsername: initUsername,
          inputPassword: initPassword,
          errorMsg: initError,
        }
        const storage = firebase.storage();
        this.storageRef = storage.ref();
        this.recipesRef = this.db.collection('recipes'); 
        this.labelsRef = this.db.collection('labels');
        this.usersRef = this.db.collection('users');
      }

      handleLogin = () => {
        let username = this.state.inputUsername;
        this.usersRef.where('username', '==', username).get().then(querySnapshot => {
          if (querySnapshot.empty) {
            this.setState({errorMsg: 'no such user'});
          } else {
            let user = querySnapshot.docs[0].data();
            user.key = querySnapshot.docs[0].id;
            if (user.password === this.state.inputPassword) {
              this.props.navigation.navigate('Home', {user: user, db: this.db});
            } else {
              this.setState({errorMsg: 'wrong password'});
            }
          }
        });
      }
    
      handleCreateAccount = () => {
        console.log('querying');
        let username = this.state.inputUsername;
        this.usersRef.where('username', '==', username).get().then(queryRef => {
          if (queryRef.empty) {
            console.log('query ran');
            let newUser = {
              username: username, 
              password: this.state.inputPassword
            };
            this.usersRef.add(newUser).then(docRef => {
              newUser.key = docRef.id;
              this.props.navigation.navigate('Home', {user: newUser, db: this.db});
              this.setState({      
                errorMsg: '',
                inputUserName: '',
                inputPassword: ''})
            });
          } else {
            console.log('query ran');
            this.setState({errorMsg: 'user already exists'});
          }
        });
      }

  
    render() {
      StatusBar.setBarStyle('dark-content');
      return (
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>
        <ImageBackground source={require('./fruit.jpg')} style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <View style={styles.loginContainer}>
            <View style = {styles.loginHeader}>
              <Text style={styles.headerText}>Family Recipes</Text>
            </View>
            <View style={styles.detailsInputContainer}>
                <Input
                multiline={false}
                placeholder="Username"
                inputContainerStyle={styles.loginInput}
                containerStyle={{justifyContent: 'flex-start', paddingTop: 30}}
                value={this.state.inputText}
                onChangeText={(value)=>{this.setState({inputUsername: value})}}
                />
                <Text>{this.state.errorMsg}</Text>
            </View>
            <View style={styles.detailsInputContainer}>
                <Input
                multiline={false}
                placeholder="Password"
                inputContainerStyle={styles.loginInput}
                containerStyle={{justifyContent: 'flex-start'}}
                value={this.state.inputText}
                onChangeText={(value)=>{this.setState({inputPassword: value})}}
                />
                <Text>{this.state.errorMsg}</Text>
            </View>
          <View style={{flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={styles.buttonLarge} onPress={() => {this.handleLogin()}}>
              <Text style={styles.buttonText}>Log In</Text>          
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonLarge2} onPress={() => {this.handleCreateAccount()}}>
              <Text style={styles.buttonText2}>Create Account</Text>          
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ImageBackground>
      </ScrollView>
      );
    }
  
  }