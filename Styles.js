import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1.0,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },  
  headerContainer: {
    flex: 0.2,
    justifyContent: 'flex-end',
  },
  loginHeader: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontFamily: 'Avenir',
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  bodyContainer: {
    flex: 0.8,
    padding: 10, 
    width: '100%',
    justifyContent: 'flex-start',
  },
  loginContainer: {
    flex: 0.8,
    paddingTop: 100,
    paddingBottom: 100, 
    width: '100%',
    justifyContent: 'flex-start'
  },
  bodyListItem: {
    flex: 1,
    margin: 10,
    width: '100%'
  },
  bodyListItemLeft: {
    margin: 10,
    flex: 1,
    flexDirection: 'column',
  },
  bodyListItemRight: {
    // flex: 0.5,
    margin: 10,
    flexDirection: 'column',
  },
  bodyListItemDate: {
    fontSize: 12
  },
  bodyListItemText: {
    fontSize: 18,
    fontFamily: 'Avenir',
  },
  detailsBodyContainer: {
    flex: 0.5,
    padding: 20, 
    width: '100%',
    justifyContent: 'flex-start',
    margin: 10
  },
  detailsInputContainer: {
    flex: 0.3,
    paddingRight: 40,
    paddingLeft: 40
  },
  detailsIngredientContainer: {
    flex: 0.5,
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 20
  },
  detailsLabelsContainer: {
    flex: 0.5
  },
  labelSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  labelSelectCheckBoxContainer: {
    padding: 1,
    margin: 1
  },
  labelSelectText: {
    fontSize: 16
  },
  mediumButtonContainer: {
    flex: 0.5,
    margin: 3,
  },
  mediumButtonTitle: {
    fontSize: 14
  },
  largeInput: {
    borderWidth: 1,
    borderColor: 'black',
    height: '95%',
    borderRadius: 10,
  },
  xLargeInput: {
    borderWidth: 1,
    borderColor: 'black',
    height: '95%',
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10
  },
  smallInput: {
    borderWidth: 1,
    borderColor: 'black',
    height: '70%',
    backgroundColor: 'white',
  },
  loginInput: {
    borderWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#db2544',
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingLeft: 10,
  },
  footerContainer: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  button:{
    backgroundColor: '#db2544',
    borderRadius: 8,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 40,
  },
  buttonLarge: {
    backgroundColor: '#db2544',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 210,
    height: 45,
    padding: 5,
    marginBottom: 15,
  },
  buttonLarge2: {
    backgroundColor: 'white',
    borderColor: '#db2544',
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    width: 210,
    height: 45,
    padding: 5,
    marginBottom: 15,
  },
  buttonText: {
    fontFamily: 'Avenir',
    fontSize: 16,
    textTransform: 'uppercase',
    padding: 6,
    letterSpacing: 2,
    color: 'white',
  },
  buttonText2: {
    fontFamily: 'Avenir',
    fontSize: 16,
    textTransform: 'uppercase',
    padding: 6,
    letterSpacing: 2,
    color: '#db2544',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  card: {
    // width: '100%',
    flexDirection: 'row',
  }
});