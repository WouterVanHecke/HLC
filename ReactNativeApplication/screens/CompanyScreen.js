import React from 'react';
import { Text, View, Image, TextInput, StyleSheet, Alert, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button';

var screen = Dimensions.get('window');
export default class CompanyScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            type : "",
            myParticipants: [],
        };
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        const _participants = params ? params.participants : null;
        const _type = params ? params.type : null;

        this.setState({
            participants: _participants,
            type: _type,
        });

        this.filterParticipants(_participants, _type);
    }

  ////////////////////////////////////////////////////////////FUNCTIONS////////////////////////////////////////////////////////////

    filterParticipants = (_participants, _type) => {
        let mine = [];
        for(let i = 0; i < _participants.length; i++){
            if(_participants[i].companyType == _type){
                mine.push(_participants[i]);
            }
        }

        this.setState({
            myParticipants: mine
        });
    }

    _checkParticipant= (id) => {
        this.props.navigation.navigate('Action', {participants: this.state.participants, companyID: id});
    }

  ////////////////////////////////////////////////////////////LAYOUT////////////////////////////////////////////////////////////

  render() {

    participants = this.state.myParticipants.map( participant => (
        <Button
            onPress={() => this._checkParticipant(participant.companyID)}
            style={{height: 50, width: 300, borderRadius: 20, borderColor: "rgb(26, 117, 255)", marginBottom: 20, backgroundColor: "rgb(26, 117, 255)"}}
            textStyle={{fontWeight: 'bold', color: 'white', fontSize: 20}}
        >{participant.companyName}
        </Button>
    ));

    return (

        <View>
            <Text style={{fontSize: 40, fontWeight: 'bold', color: 'black', marginTop: 20, marginLeft: 5}}>{this.state.type}</Text>
            <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black', marginBottom: 30,  marginLeft: 5}}>Kies een bedrijf</Text>
            <View style={{alignItems: 'center'}}>
                <ScrollView>
                    {participants}
                </ScrollView>
            </View>
        </View>
      
    );
  }
}

  ////////////////////////////////////////////////////////////STYLE////////////////////////////////////////////////////////////
