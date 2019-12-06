import React from 'react';
import { View, Text, FlatList, StatusBar, Image, ScrollView, ImageBackground, TouchableOpacity, List } from 'react-native';
import { Button, Input, Card, ListItem } from 'react-native-elements';
import { styles } from './Styles';
import firebase from 'firebase';
import '@firebase/firestore';

//main feed of recipes

export class MainScreen extends React.Component {
  static navigationOptions = {
    title: 'Recipes',
    headerStyle: {
      backgroundColor: '#db2544',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontFamily: 'Avenir',
      textTransform: 'uppercase',
      letterSpacing: 2
    },
  };
  constructor(props) {
    super(props);
    this.logInScreen = this.props.navigation.getParam('logInScreen');
    this.state = {
      currentUser: 'notarealuser', //dummy user 
      recipes: [],
      labels: [],
      listToShow: [],
     }
    }
  componentDidMount(){

    this.db = this.props.navigation.getParam('db');
    this.recipesRef = this.db.collection('recipes'); 
    this.labelsRef = this.db.collection('labels');
    this.usersRef = this.db.collection('users');

    let currentUser = this.props.navigation.getParam('user'); //gives us the specific user, this part works
    this.setState({
      currentUser: currentUser
    });
    let recipeKeys = [];
    this.db.collection('users/' + currentUser.key + '/recipes').get().then(querySnapshot => {
      if (querySnapshot.empty) {
        console.log('empty query snaphot');
      } else {
        querySnapshot.forEach(elementDoc => {
          recipeKeys.push(elementDoc.data().recipeID); //gives us a list of the recipe IDs associated with that user
        })
      }
      this.recipesRef.get().then(queryRef =>{ //get all the recipes in data model
        let listToShow = [];
        queryRef.forEach(docRef=>{ //for each document in the data model, compare keys to recipeKeys list
          let docData = docRef.data();
          let itemToShow = {
            name: docData.name,
            author: docData.author,
            ingredients: docData.ingredients,
            steps: docData.steps,
            key: docRef.id,
            labels: docData.labels,
            image: docData.image
          }
          recipeKeys.forEach(recipeKey => {
            if (itemToShow.key === recipeKey) {              
              listToShow.push(itemToShow);
            }
        });
        this.setState({
          listToShow: listToShow
        })
      });
    });
  });
    
    this.recipesRef.get().then(queryRef=>{
      let newRecipes = [];
      queryRef.forEach(docRef=>{
        let docData = docRef.data();
        let newRecipe = {
          name: docData.name,
          author: docData.author,
          ingredients: docData.ingredients,
          steps: docData.steps,
          key: docRef.id,
          labels: docData.labels,
          image: docData.image
        }
        newRecipes.push(newRecipe);
      });
      this.setState({
        recipes: newRecipes,
      });
    });
    this.labelsRef.get().then(queryRef=>{
      let newLabels = [];
      queryRef.forEach(docRef=>{
        let docData = docRef.data();
        let newLabel = {
          text: docData.text,
          key: docRef.id, 
        }
        newLabels.push(newLabel);
      });
      this.setState({
        labels: newLabels
      });
    });

     this.usersRef.get().then(queryRef=>{
      let newUsers = [];
      queryRef.forEach(docRef=>{
        let docData = docRef.data();
        let newUser = {
          username: docData.user,
          password: docData.password,
          key: docRef.id, 
        }
        newUsers.push(newUser);
      });
      this.setState({
        users: newUsers
      });
    });
  }
  
     
  addRecipe(newRecipe) {
    this.recipesRef.add(newRecipe).then(docRef=> {
      newRecipe.key = docRef.id;
      let newRecipes = this.state.recipes.slice(); // clone the data model list
      let newViewItems = this.state.listToShow.slice(); //clone the view list
      let theUser = this.state.currentUser;
      console.log(theUser.key);
      newRecipes.push(newRecipe); //add to data model
      newViewItems.push(newRecipe); //add to view
      this.db.collection('users/' + theUser.key + '/recipes').doc().set({
        recipeID: newRecipe.key
      });
      this.setState({
        recipes: newRecipes,
        listToShow: newViewItems
      });
    })
  }

  deleteRecipe(recipeToDelete) {
    let recipeKey = recipeToDelete.key;
    this.recipesRef.doc(recipeKey).delete().then(()=> {
      let newRecipes = [];
      for (recipe of this.state.recipes) {
        if (recipe.key !== recipeKey) {
          newRecipes.push(recipe);
        }
      }
      this.setState({recipes: newRecipes});
    });
  }

  updateRecipe(recipeToUpdate) {
    this.recipesRef.doc(recipeToUpdate.key).set({
      name: recipeToUpdate.name,
      author: recipeToUpdate.author,
      ingredients: recipeToUpdate.ingredients,
      steps: recipeToUpdate.steps,
      labels: recipeToUpdate.labels,
      image: recipeToUpdate.image
    }).then(() => {
      let newRecipes = [];
      for (recipe of this.state.recipes) {
        if (recipe.key === recipeToUpdate.key) {
          newRecipes.push(recipeToUpdate);
        } else {
          newRecipes.push(recipe);
        }
      }
      this.setState({recipes: newRecipes});
      // this.componentDidMount();
    });
  }

  updateLabels(newLabels) {
    this.setState({labels: newLabels});
  }
  
  getLabelName(labelKey) {
    for (lbl of this.state.labels) {
      if (lbl.key === labelKey) {
        return lbl.text;
      }
    }
    return undefined;
  }

  handleDelete(recipeToDelete) {
    this.deleteRecipe(recipeToDelete);
  }

  handleEdit(recipeToEdit) {
    this.props.navigation.navigate('RecipeDetail', {
      recipe: recipeToEdit,
      mainScreen: this
    });
  }

  handleView(recipeToView) {
    this.props.navigation.navigate('ViewRecipe', {
      recipe: recipeToView,
      mainScreen: this
    });
  }

  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
          <FlatList
            data={this.state.listToShow}
            renderItem={
              ({item}) => {
                return (
                  <View>
                    <TouchableOpacity onPress={() => {this.handleView(item)}}>
                    <Card style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        {/* <View style={styles.bodyListItemLeft}> */}
                          <Image source = {{uri: item.image.uri}} style={{width: 80, height: 80}}/>
                        {/* </View> */}
                        <View style={{flex: 0.5, alignItems: 'flex-end', justifyContent: 'center'}}>
                          <Text style={styles.bodyListItemText}>{item.name}</Text>
                          <Text style={styles.bodyListItemText}>{item.author}</Text>
                        </View>

                        {/* <Button
                          title='Delete'
                          containerStyle={styles.mediumButtonContainer}
                          titleStyle={styles.mediumButtonTitle}
                          onPress={()=>{this.handleDelete(item)}}
                        />
                        <Button
                          title='Edit'
                          containerStyle={styles.mediumButtonContainer}
                          titleStyle={styles.mediumButtonTitle}
                          onPress={()=>{this.handleEdit(item)}}
                        /> */}
                    
                    </Card>
                    </TouchableOpacity>
                  </View>
                );
              }} 
          />
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('RecipeDetail', {mainScreen: this});}}>
            <Text style={styles.buttonText}>New Recipe</Text>          
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('MealDetail', {mainScreen: this});}}>
            <Text style={styles.buttonText}>Categories</Text>          
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}