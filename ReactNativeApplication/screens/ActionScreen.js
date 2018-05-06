import React from 'react';
import { Text, View, Image, TextInput, StyleSheet, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button';

import api from '../utilities/api';

var screen = Dimensions.get('window');
export default class ActionScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading : true,
            participants: [],
            myParticipant: null,
            products: [],
            myProducts: [],
            buttons: ["Create more supply", "Buy a product", "Create a product"],
        };
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const _participants = params ? params.participants : null;
        const _companyID = params ? params.companyID : null;
        let _myParticipant = null;

        for(let i = 0; i < _participants.length; i++){
            if(_participants[i].companyID == _companyID){
                _myParticipant = _participants[i];
                break;
            }
        }

        this.setState({
            participants: _participants,
            companyID: _companyID,
            myParticipant: _myParticipant,
        });

        api.getAllProducts().then((res) => {
            this.setState({
                products: res,
            });

            this.getMyProducts(res);
        });
    }

  ////////////////////////////////////////////////////////////FUNCTIONS////////////////////////////////////////////////////////////

    getMyProducts = (products) => {
        let _myProducts = [];
        for(let i = 0; i < products.length; i++){
            let owner = products[i].owner.split("#")[1];
            if(owner == this.state.companyID){
                _myProducts.push(products[i]);
            }
        }

        this.setState({
            myProducts : _myProducts,
            isLoading: false,
        })
    }

    _checkAction = (action) => {
        this.props.navigation.navigate('CarryOutAction', {myProducts: this.state.myProducts, participants: this.state.participants, products: this.state.products, myParticipant: this.state.myParticipant, action: action});
    }

  ////////////////////////////////////////////////////////////LAYOUT////////////////////////////////////////////////////////////

    render() {

        if(this.state.isLoading == false){
            buttons = this.state.buttons.map( action => (
                <Button
                    onPress={() => this._checkAction(action)}
                    style={{height: 50, width: 300, borderRadius: 20, borderColor: "rgb(26, 117, 255)", marginBottom: 20, backgroundColor: "rgb(26, 117, 255)"}}
                    textStyle={{fontWeight: 'bold', color: 'white', fontSize: 20}}
                    isDisabled={(action == "Create more supply" && this.state.myParticipant.companyType != "SUPPLIER") ||
                        (action == "Buy a product" && this.state.myParticipant.companyType == "SUPPLIER") ||
                        (action == "Create a product" && this.state.myParticipant.companyType != "MANUFACTURER")}
                >{action}
                </Button>
            ));
        }

        return (

            this.state.isLoading == true 
            ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color='black' animating/><Text style={{fontSize: 20}}>Loading...</Text></View>
            : <View>
                <Text style={{fontSize: 40, fontWeight: 'bold', color: 'black', marginTop: 20, marginLeft: 5}}>{this.state.myParticipant.companyName}</Text>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black', marginBottom: 30, marginLeft: 5}}>Kies een actie</Text>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <View style={{justifyContent: 'center', alignItems: 'center', paddingTop: 60}}>
                        {buttons}
                    </View>
                </View>
            </View>

        );
    }
}

  ////////////////////////////////////////////////////////////STYLE////////////////////////////////////////////////////////////
