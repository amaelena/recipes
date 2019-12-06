import React from 'react';
import { View, Text, FlatList, StatusBar, Image, ScrollView, ImageBackground, TouchableOpacity, List } from 'react-native';
import { Button, Input, Card, ListItem } from 'react-native-elements';
import { styles } from './Styles';

export class ViewRecipeScreen extends React.Component {
    static navigationOptions = {
        title: 'View Recipe',
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
        this.recipeToView = this.props.navigation.getParam('recipe', undefined);
        this.mainScreen = this.props.navigation.getParam('mainScreen');

        this.state = {
            name: this.recipeToView.name,
            author: this.recipeToView.author,
            ingredients: this.recipeToView.ingredients,
            steps: this.recipeToView.steps,
            labels: this.recipeToView.labels,
            image: this.recipeToView.image,
            imageWidth: '100%',
            imageHeight: 175,
        }
    }


deleteRecipe(recipeToDelete) {
    let recipeKey = recipeToDelete.key; //this gives us the data model recipe key, how to get list to show key?
    let newListToShow = [];
    this.mainScreen.usersRef.doc(this.mainScreen.state.currentUser.key).collection('recipes').get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            if (doc.data().recipeID === recipeKey) { //deletes document out of the recipes subcollection
                doc.ref.delete();
            }
        });
        console.log(this.recipesRef);
    });
}
    // this.mainScreen.usersRef.doc(this.mainScreen.state.currentUser.key)
    // if 

    //           this.mainScreen.recipesRef.doc.forEach(function(doc) {
    //             console.log(doc.key);
                // if (recipe.key === doc.data().recipeID) {
            //    newListToShow.push(recipe);
            //         }
            //     }); 
            // }
        // }
        // this.mainScreen.componentDidMount();
        // this.setState({listToShow: newListToShow});
    // this.recipesRef.doc(recipeKey).delete().then(()=> {
    //   let newRecipes = [];
    //   for (recipe of this.state.recipes) {
    //     if (recipe.key !== recipeKey) {
    //       newRecipes.push(recipe);
    //     }
    //   }
    //   this.setState({recipes: newRecipes});

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
    });
  }

  handleDelete(recipeToDelete) {
    this.deleteRecipe(recipeToDelete);
    this.props.navigation.navigate('Home', {
        ViewRecipeScreen: this
    })
  }

  handleEdit(recipeToEdit) {
    this.props.navigation.navigate('RecipeDetail', {
      recipe: recipeToEdit,
      ViewRecipeScreen: this
    });
  }


  render() {
    StatusBar.setBarStyle('light-content', true);
    return (
      <View style={styles.container}>
        <View style={styles.bodyContainer}>
            <Image source = {this.state.image} style={{width: '100%', height: 100}}/>
            <Text style={styles.bodyListItemText}>{this.state.name}</Text>
            <Text style={styles.bodyListItemText}>{this.state.author}</Text>  
        </View>
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('RecipeDetail', {recipe: this.recipeToView, mainScreen: this.mainScreen});}}>
            <Text style={styles.buttonText}>Edit</Text>          
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {this.handleDelete(this.recipeToView)}}>
            <Text style={styles.buttonText}>Delete</Text>          
          </TouchableOpacity>
        </View>
      </View>
    );
  }

}