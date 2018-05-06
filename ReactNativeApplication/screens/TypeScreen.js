import React from 'react';
import { Text, View, Image, TextInput, StyleSheet, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button';

import api from '../utilities/api';

var screen = Dimensions.get('window');
export default class TypeScreen extends React.Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            isLoading : true,
            participants: [],
            types: []
        };
    }

    componentDidMount() {
        api.getAllParticipants().then((res) => {
            this.setState({
                participants: res,
                isLoading: false,
            });

            this.getDistinctTypes();
        })
    }

  ////////////////////////////////////////////////////////////FUNCTIONS////////////////////////////////////////////////////////////

    getDistinctTypes = () => {
        var types = [];

        for(let i = 0; i < this.state.participants.length; i++){
            if(types.length == 0){
                types.push(this.state.participants[i].companyType);
            }else{
                if(types.indexOf(this.state.participants[i].companyType) == -1){
                    types.push(this.state.participants[i].companyType);
                }
            }
        }

        this.setState({
            types: types,
        })
    }

    _checkType = (type) => {
        this.props.navigation.navigate('Participant', {participants: this.state.participants, type: type});
    }

  ////////////////////////////////////////////////////////////LAYOUT////////////////////////////////////////////////////////////

    render() {

        buttons = this.state.types.map( type => (
            <Button
                onPress={() => this._checkType(type)}
                style={{height: 50, width: 300, borderRadius: 20, borderColor: "rgb(26, 117, 255)", marginBottom: 20, backgroundColor: "rgb(26, 117, 255)"}}
                textStyle={{fontWeight: 'bold', color: 'white', fontSize: 20}}
            >{type}
            </Button>
        ));

        return (

            this.state.isLoading == true 
            ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color='black' animating/><Text style={{fontSize: 20}}>Loading...</Text></View>
            : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 40, fontWeight: 'bold', color: 'black', marginBottom: 60}}>Kies een type bedrijf</Text>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        {buttons}
                    </View>
                </View>
            </View>

        );
    }
}

  ////////////////////////////////////////////////////////////STYLE////////////////////////////////////////////////////////////
