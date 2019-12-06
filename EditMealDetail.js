import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Button, Input } from 'react-native-elements';
import { styles } from './Styles';
import { MainScreen } from './Main';
import { TouchableOpacity } from 'react-native-gesture-handler';

//page where you can add/edit labels (not the list of labels)
//button styling complete

export class EditMealDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.MealDetailScreen = this.props.navigation.getParam('MealDetailScreen', undefined);
    this.label = this.props.navigation.getParam('label', undefined);
    let initText = '';
    if (typeof this.label === 'undefined') {
      this.isAdd = true;
    } else {
      initText = this.label.text;
    }
    this.state = {
      inputText: initText
    }
  }

  handleSave = () => {
    let newLabel = {
      text: this.state.inputText
    }
    if (this.isAdd) {
      this.MealDetailScreen.addLabel(newLabel);
    } else {
      newLabel.key = this.label.key;
      this.MealDetailScreen.updateLabel(newLabel);
    }
    this.props.navigation.goBack();
  }

  render() {
    return (
    <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Edit Label Name</Text>
          </View>
        <View style={styles.detailsBodyContainer}>
          <View style={styles.detailsInputContainer}>
            <Input
              placeholder="Add Label"
              inputContainerStyle={styles.largeInput}
              containerStyle={{justifyContent: 'flex-start'}}
              value={this.state.inputText}
              onChangeText={(value)=>{this.setState({inputText: value})}}
            />
          </View>
        </View>
        <View style={styles.footerContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.goBack();}} >
          <Text style={styles.buttonText}>Cancel</Text>          
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.handleSave} >
          <Text style={styles.buttonText}>Save</Text>          
        </TouchableOpacity>
        </View>
      </View>
    );
  }
}
