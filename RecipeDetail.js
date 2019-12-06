import React from 'react';
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Button, Input, CheckBox } from 'react-native-elements';
import { styles } from './Styles';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

//Page for adding new recipes or editing them

export class RecipeDetailScreen extends React.Component {

  constructor(props) {
    super(props);

    this.recipeToUpdate = this.props.navigation.getParam('recipe', undefined);
    this.mainScreen = this.props.navigation.getParam('mainScreen');

    this.isAdd = (typeof this.recipeToUpdate === 'undefined');
    
    let initName = '';
    let initAuthor = '';
    let initIngredients = [];
    let initSteps = [];
    let initLabels = [];
    let initImage = require('./images/ImageNotAvailable.png');

    if (!this.isAdd) {
      initName = this.recipeToUpdate.name;
      initAuthor = this.recipeToUpdate.author;
      initIngredients = this.recipeToUpdate.ingredients;
      initSteps = this.recipeToUpdate.steps;
      initLabels = this.recipeToUpdate.labels;
      initImage = this.recipeToUpdate.image;
    } else {
      for (lbl of this.mainScreen.state.labels) {
        initLabels.push({
          key: lbl.key,
          text: lbl.text,
          value: false
        })
      }
    }

    this.state = {
        inputName: initName,
        inputAuthor: initAuthor,
        inputIngredients: initIngredients,
        inputSteps: initSteps,
        labels: initLabels,
        image: initImage,
        imageWidth: 112,
        imageHeight: 175,
      
    }
    // this.currentImageRef = this.mainScreen.db.doc('images/currentImage');
    // this.currentImageRef.get().then(docSnap => {
    //   let currentImageURI = docSnap.data().imageURI;
    //   if (typeof currentImageURI !== 'undefined') {
    //   this.setState({image:  {uri: currentImageURI}});
    //   }
    // });
    }

  async componentDidMount() {
    const {status} = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  handleSave = () => {
    let newRecipe = {
      name: this.state.inputName,
      author: this.state.inputAuthor,
      ingredients: this.state.inputIngredients,
      steps: this.state.inputSteps,
      labels: this.state.labels,
      image: this.state.image
    };

    let mainScreen = this.props.navigation.getParam('mainScreen');
    if (this.isAdd) {
      mainScreen.addRecipe(newRecipe);
    } else {
      newRecipe.key = this.recipeToUpdate.key;
      mainScreen.updateRecipe(newRecipe);
    }
    this.props.navigation.navigate('Home', {recipeDetailScreen: this});
  }

  handleLabelToggle = (labelToToggle) => {
    this.setState(prevState => {
      let theLabels = prevState.labels.slice();
      for (label of theLabels) {
        if (label.key === labelToToggle.key) {
          label.value = !label.value;
        }
      }
      return {labels: theLabels};
    });
  }

  updateImage = (imageObject) => {
    let aspectRatio = imageObject.width / imageObject.height;
    let w = 225;
    let h = w / aspectRatio;
    this.setState({
      image: {uri: imageObject.uri},
      imageWidth: w,
      imageHeight: h
    });

    console.log(imageObject.uri);

    let recipeDetailScreen = this;
    let uriParts = imageObject.uri.split('/');
    let fname = uriParts[uriParts.length - 1];
    fetch(imageObject.uri).then(response => {
      return response.blob();
    })
    .then(blob => {
      return this.mainScreen.storageRef.child(fname).put(blob);
    })
    .then(uploadTaskSnapshot => {
      return uploadTaskSnapshot.ref.getDownloadURL();
    })
    .then(downloadURL => {
      console.log('image saved to', downloadURL);
      recipeDetailScreen.currentImageRef.set({imageURI: downloadURL});
    });
  }

  render() {
    return (
      <ScrollView contentContainerStyle={{flexGrow: 1}}
      keyboardShouldPersistTaps='handled'>
      <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Recipe</Text>
          </View>
        <View style={styles.detailsBodyContainer}>
          <View style={styles.detailsInputContainer}>
            <Input
              placeholder="Name"
              inputContainerStyle={styles.largeInput}
              containerStyle={{justifyContent: 'flex-start'}}
              value={this.state.inputName}
              onChangeText={(value)=>{this.setState({inputName: value})}}
            />
          </View>
          <View style={styles.detailsInputContainer}>
            <Input
              placeholder="Author"
              inputContainerStyle={styles.largeInput}
              containerStyle={{justifyContent: 'flex-start'}}
              value={this.state.inputAuthor}
              onChangeText={(value)=>{this.setState({inputAuthor: value})}}
            />
          </View>
          <View style={styles.detailsInputContainer}>
             <Input
              multiline={true}
              placeholder="Ingredients"
              inputContainerStyle={styles.xLargeInput}
              containerStyle={{justifyContent: 'flex-start'}}
              value={this.state.inputIngredients}
              onChangeText={(value)=>{this.setState({inputIngredients: value})}}
            />
          </View>
          <View style={styles.detailsInputContainer}>
          <Input
              multiline={true}
              placeholder="Steps"
              inputContainerStyle={styles.xLargeInput}
              containerStyle={{justifyContent: 'flex-start'}}
              value={this.state.inputSteps}
              onChangeText={(value)=>{this.setState({inputSteps: value})}}
            />
          </View>
          <View style={styles.detailsLabelsContainer}>
            <FlatList
              data={this.state.labels}
              renderItem={({item})=>{
                return(
                  <View style={styles.labelSelectContainer}>
                    <CheckBox
                      containerStyle={styles.labelSelectCheckBoxContainer}
                      checked={item.value}
                      onPress={()=>{this.handleLabelToggle(item)}}
                    />
                    <Text style={styles.labelSelectText}>{item.text}</Text>
                  </View>
                );
              }}
            />
          </View>
        </View> 
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>   
           <Image
            style={{width: this.state.imageWidth, height: this.state.imageHeight}}
            source={this.state.image}
          />
          <TouchableOpacity
            onPress={()=>{
              this.props.navigation.navigate('Camera', {
                recipeDetailScreen: this
              })
            }}>
              <Ionicons name="md-camera" size={48} color="#db2544"/>
            </TouchableOpacity>
          </View> 
        <View style={styles.footerContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {this.props.navigation.navigate.goBack();}} >
              <Text style={styles.buttonText}>Cancel</Text>          
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.handleSave} >
              <Text style={styles.buttonText}>Save</Text>          
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>  
    );
  }

}
export class CameraScreen extends React.Component {

  constructor(props) {
    super(props);
    this.recipeDetailScreen = this.props.navigation.getParam('recipeDetailScreen'); 
    this.state = {
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
    };  
  }

  componentDidMount() {
    Permissions.askAsync(Permissions.CAMERA).then(permStatus => {
      this.setState({ hasCameraPermission: permStatus.status === 'granted' });
    });
  }

    handleTakePicture = () => {
        this.recipeDetailScreen = this.props.navigation.getParam('recipeDetailScreen'); 
        this.camera.takePictureAsync().then((picData)=>{
        this.recipeDetailScreen.updateImage(picData);
        this.props.navigation.goBack();
    })
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Camera 
          style={{ flex: 1 }} 
          type={this.state.type}
          ref={cameraRef => {
              this.camera = cameraRef;
            }}
            >
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 0.1,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {
                  this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
              </TouchableOpacity>
            </View>
          </Camera>
          <Button
            title='Take Picture'
            onPress={this.handleTakePicture}
          />
        </View>
      );
    }
  }
}
