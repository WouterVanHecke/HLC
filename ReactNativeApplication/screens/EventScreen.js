import React from 'react';
import { Text, View, Image, TextInput, StyleSheet, Alert, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button';

import api from '../utilities/api';

var screen = Dimensions.get('window');
export default class EventScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading : true,
            myParticipant: null,
            myTransaction: null,
            oldProduct: null,
            newProduct: null,
            myProduct: null,
            oldOwner: null,
            newOwner: null,
            amount: null,
        };
    }

    componentWillMount() {
        const { params } = this.props.navigation.state;
        const _transactionID = params ? params.transactionID : null;
        const _from = params ? params.from : null;

        api.getTransaction(_transactionID, _from).then((res) => {
            let transaction = res.$class.split(".")[3];

            this.setState({myTransaction: transaction, amount: res.quantity,});

            switch(transaction){
                case "CreateMoreSupply":
                    this.getInfo1(res);
                    break;
                case "TradeProduct":
                    this.getInfo2(res);
                    break;
                case "CreateNewProduct":
                    this.getInfo3(res);
                    break;
            }
        });
    }

  ////////////////////////////////////////////////////////////FUNCTIONS////////////////////////////////////////////////////////////

    getInfo1 = (res) => {
        //CreateMoreSupply

        //product
        //participant
        let product;
        let participant;
        let productID = res.product.split("#")[1];
        api.getProductByID(productID).then((res) => {
            product = res;
            let participantID = res.owner.split("#")[1];
            api.getParticipantByID(participantID).then((res2) => {
                participant = res2;

                this.setState({
                    myProduct: product,
                    myParticipant: participant,
                    isLoading : false,
                });
            });
        });


        //sup + amount + balance
        //arrow + amount
        //sup + amount + balance
    }

    getInfo2 = (res) => {
        //TradeProduct

        //old product
        //old owner
        //new product
        //new owner
        let oldProduct;
        let newProduct;
        let oldOwner;
        let newOwner;
        let oldProductID = res.productOldOwner.split("#")[1];
        let newProductID = res.productNewOwner.split("#")[1];
        api.getProductByID(oldProductID).then((res) => {
            oldProduct = res;
            let oldParticipantID = res.owner.split("#")[1];
            api.getParticipantByID(oldParticipantID).then((res2) => {
                oldOwner = res2;
                api.getProductByID(newProductID).then((res3) => {
                    newProduct = res3;
                    let newParticipantID = res3.owner.split("#")[1];
                    api.getParticipantByID(newParticipantID).then((res4) => {
                        newOwner = res4;

                        this.setState({
                            oldProduct: oldProduct,
                            newProduct: newProduct,
                            oldOwner: oldOwner,
                            newOwner: newOwner,
                            isLoading : false,
                        });
                    });
                });
            });
        });


        //old
        //arrow
        //car
        //arrow
        //(plane)
        //arrow
        //(car)
        //arrow
        //new
    }

    getInfo3 = (res) => {
        //CreateNewProduct

        //get old product
        //get new product
        //get participant
        let oldProduct;
        let newProduct;
        let owner;
        let oldProductID = res.TProduct.split("#")[1];
        let newProductID = res.NProduct.split("#")[1];
        api.getProductByID(oldProductID).then((res) => {
            oldProduct = res;
            api.getProductByID(oldProductID).then((res2) => {
                let newProduct = res2;
                let participantID = res2.owner.split("#")[1];
                api.getParticipantByID(participantID).then((res3) => {
                    owner = res3;

                    this.setState({
                        oldProduct: oldProduct,
                        newProduct: newProduct,
                        myParticipant: owner,
                        isLoading : false,
                    });
                });              
            });
        });

        //man
        //arrow
        //man
    }

  ////////////////////////////////////////////////////////////LAYOUT////////////////////////////////////////////////////////////

  render() {

    return (

        this.state.isLoading == true 
        ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color='black' animating/><Text>Loading...</Text></View>
        : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ScrollView>
                <Text>Everything ok</Text>
            </ScrollView>
        </View>
      
    );
  }
}

  ////////////////////////////////////////////////////////////STYLE////////////////////////////////////////////////////////////
