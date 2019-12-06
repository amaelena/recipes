import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import { styles } from './Styles';
import { TouchableOpacity } from 'react-native-gesture-handler';

  export class MealDetailScreen extends React.Component {
    constructor(props) {
      super(props);
      this.mainScreen = this.props.navigation.getParam('mainScreen');
      this.state = {
        labels: this.mainScreen.state.labels
      }
    }
  
    handleDelete(labelToDelete) {
      this.mainScreen.labelsRef.doc(labelToDelete.key).delete().then(()=> {
        let newLabels = [];
        for (lbl of this.state.labels) {
          if (labelToDelete.key !== lbl.key) {
            newLabels.push(lbl);
          }
        }
        this.mainScreen.updateLabels(newLabels);
        this.setState({labels: newLabels});
        this.reconcileOnDeleteLabel(labelToDelete);
      });
    }
  
    handleEdit(labelToEdit) {
      this.props.navigation.navigate('EditMealDetail', {
        MealDetailScreen: this, 
        label: labelToEdit
      });
    }
  
    addLabel(labelToAdd) {
      this.mainScreen.labelsRef.add(labelToAdd).then((docRef)=> {
        labelToAdd.key = docRef.id;
        this.setState(prevState=>{
          let newLabels = prevState.labels.slice();
          newLabels.push(labelToAdd);
          this.mainScreen.updateLabels(newLabels);
          return{labels: newLabels};
        });
        this.reconcileOnAddLabel(labelToAdd);
      });
    }
    
    updateLabel(labelToUpdate) {
      this.mainScreen.labelsRef.doc(labelToUpdate.key).set(labelToUpdate).then(()=> {
        this.setState(prevState=>{
          let newLabels = [];
          for (lbl of prevState.labels) {
            if (lbl.key === labelToUpdate.key) {
              newLabels.push(labelToUpdate);
            } else {
              newLabels.push(lbl);
            }
          }
          this.mainScreen.updateLabels(newLabels);
          return{labels: newLabels};
        })
      });
    }
  
  
    reconcileOnAddLabel(newLabel) {
      let newRecipes = [];
      newLabel.value = false;
      let batch = this.mainScreen.db.batch();
      for (e of this.mainScreen.state.recipes) {
        console.log('reconciling', e);
        e.labels.push(newLabel);
        eData = {
          name: e.name,
          author: e.author,
          ingredients: e.ingredients,
          steps: e.steps,
          labels: e.labels
        }
        eRef = this.mainScreen.recipesRef.doc(e.key);
        batch.set(eRef, eData);
        newRecipes.push(e);
      }
      batch.commit().then(() => {
        this.mainScreen.setState({recipes: newRecipes});
      });
    }
  
  
    reconcileOnDeleteLabel(deletedLabel) {
      let newRecipes = [];
      let batch = this.mainScreen.db.batch();
      for (e of this.mainScreen.state.recipes) {
        let newLabels = [];
        for (lbl of e.labels) {
          console.log("comparing", lbl.key, deletedLabel.key, lbl.key !== deletedLabel.key);
          if (lbl.key !== deletedLabel.key) {
            console.log('pushing', lbl);
            newLabels.push(lbl);
          }
        }
        console.log('new labels', newLabels);
        e.labels = newLabels;
        eData = {
          name: e.name,
          author: e.author,
          ingredients: e.ingredients,
          steps: e.steps,
          labels: e.labels
        }
        eRef = this.mainScreen.recipesRef.doc(e.key);
        batch.set(eRef, eData);
        newRecipes.push(e);
      }
      console.log(newRecipes);
      batch.commit().then(() => {
        this.mainScreen.setState({recipes: newRecipes});
      });
    }
  
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Edit Labels</Text>
          </View>
          <View style={styles.bodyContainer}>
            <FlatList
              data={this.state.labels}
              renderItem={
                ({item}) => {
                  return (
                    <View style={styles.bodyListItem}>
                      <View style={styles.bodyListItemLeft}>
                        <Text style={styles.bodyListItemText}>{item.text}</Text>
                      </View>
                      <View style={styles.bodyListItemRight}>
                        <Button
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
                        />
                      </View>
  
                    </View>
                  );
                }} 
            />
          </View>
          <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate('EditMealDetail', {MealDetailScreen: this});}} >
            <Text style={styles.buttonText}>Add Label</Text>          
          </TouchableOpacity>
          </View>  
        </View>
      )
  
    }
  
  }