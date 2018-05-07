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
            api.getProductByID(newProductID).then((res2) => {
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

    createViewForSupply = () => {
        return (
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/supplier.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10,marginLeft: 5, fontSize: 18, color: 'black'}}>{this.state.myParticipant.companyName}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.myProduct.productName + "\n"}{this.state.myProduct.quantity - this.state.amount}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/arrow.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.myProduct.productName + "\n"}+{this.state.amount}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/supplier.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10,marginLeft: 5, fontSize: 18, color: 'black'}}>{this.state.myParticipant.companyName}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.myProduct.productName + "\n"}{this.state.myProduct.quantity}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

    createViewForTrade = () => {

        let requires = [require('../images/supplier.png'), require('../images/manufacturer.png'), require('../images/plane.png'), require('../images/car.png'), require('../images/retailer.png'), require('../images/customer.png'),];

        return(
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} 
                        source={this.state.oldOwner.companyType == "SUPPLIER" ? requires[0] : this.state.oldOwner.companyType == "MANUFACTURER" ? requires[1] : 
                        this.state.oldOwner.companyType == "RETAILER" ? requires[4] :  requires[5]}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>{this.state.oldOwner.companyName}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}{this.state.oldProduct.quantity}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/arrow.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}+{this.state.amount}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Price per unit: {this.state.oldProduct.price + " euro"}</Text>
                    </View>
                </View>
                {this.state.newOwner.companyType == "CUSTOMER" ? null : <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/car.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>From: {this.state.oldOwner.country + "\n"}{this.state.oldOwner.companyName}</Text>
                        {this.state.oldOwner.country != this.state.newOwner.country 
                            ? <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>To: {this.state.oldOwner.country} Airport</Text> 
                            : <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>To: {this.state.newOwner.country + "\n"}{this.state.oldOwner.companyName}</Text>}
                    </View>
                </View>}
                {this.state.newOwner.companyType == "CUSTOMER" ? null : <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/arrow.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}+{this.state.amount}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Price per unit: {this.state.oldProduct.price + " euro"}</Text>
                    </View>
                </View>}
                {this.state.newOwner.companyType != "CUSTOMER" && this.state.oldOwner.country != this.state.newOwner.country 
                    ? <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/plane.png')}/>
                        <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                            <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>From: {this.state.oldOwner.country}</Text>
                            <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>To: {this.state.newOwner.country}</Text>
                        </View>
                    </View> 
                : null}
                {this.state.newOwner.companyType != "CUSTOMER" && this.state.oldOwner.country != this.state.newOwner.country 
                    ? <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/arrow.png')}/>
                        <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                            <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}+{this.state.amount}</Text>
                            <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Price per unit: {this.state.oldProduct.price + " euro"}</Text>
                        </View>
                    </View>
                : null}
                {this.state.newOwner.companyType != "CUSTOMER" && this.state.oldOwner.country != this.state.newOwner.country 
                    ? <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/car.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>From: {this.state.newOwner.country} Airport</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>To: {this.state.newOwner.country + "\n"}{this.state.newOwner.companyName}</Text>
                    </View>
                </View>
                : null}
                {this.state.newOwner.companyType != "CUSTOMER" && this.state.oldOwner.country != this.state.newOwner.country 
                    ? <View style={{flexDirection: 'row', marginBottom: 10}}>
                        <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/arrow.png')}/>
                        <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                            <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}+{this.state.amount}</Text>
                            <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Price per unit: {this.state.oldProduct.price + " euro"}</Text>
                        </View>
                    </View>
                : null}
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} 
                        source={this.state.newOwner.companyType == "SUPPLIER" ? requires[0] : this.state.newOwner.companyType == "MANUFACTURER" ? requires[1] : 
                        this.state.newOwner.companyType == "RETAILER" ? requires[4] :  requires[5]}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>{this.state.newOwner.companyName}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.newProduct.productName + "\n"}{this.state.newProduct.quantity}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

    createViewForNewProduct= () => {
        return(
            <ScrollView contentContainerStyle={{alignItems: 'center'}}>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/manufacturer.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 5, marginLeft: 5, fontSize: 18, color: 'black'}}>{this.state.myParticipant.companyName}</Text>
                        <Text style={{marginBottom: 5, marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}{this.state.oldProduct.quantity + (this.state.amount * this.getMultiplyAmount(this.state.newProduct.productName))}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.newProduct.productName + "\n"}{this.state.newProduct.quantity - this.state.amount}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/arrow.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 10, marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}-{(this.state.amount * this.getMultiplyAmount(this.state.newProduct.productName))}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.newProduct.productName + "\n"}+{this.state.amount}</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', marginBottom: 10}}>
                    <Image style={{width: screen.width / 2.5, height: screen.width / 2.5}} source={require('../images/manufacturer.png')}/>
                    <View style={{height: screen.width / 2.5, width: screen.width / 2, justifyContent: 'center'}}>
                        <Text style={{marginBottom: 5, marginLeft: 5, fontSize: 18, color: 'black'}}>{this.state.myParticipant.companyName}</Text>
                        <Text style={{marginBottom: 5, marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.oldProduct.productName + "\n"}{this.state.oldProduct.quantity}</Text>
                        <Text style={{marginLeft: 5, fontSize: 18, color: 'black'}}>Supply for: {this.state.newProduct.productName + "\n"}{this.state.newProduct.quantity}</Text>
                    </View>
                </View>
            </ScrollView>
        );
    }

    getMultiplyAmount = (type) => {
        var diffProducts = [
            ['SEEDS', 'TOMATOES', 3], //SUCCESRATE = 1:3
            ['TOMATOES', 'SPAGHETTI_SAUCE', 3],
            ['TOMATOES', 'LASAGNA', 5],
            ['TOMATOES', 'SOUP', 2],
            ['TOMATOES', 'KETCHUP', 10]
        ];

        switch(type) {
            case "TOMATOES":
                return(diffProducts[0][2]);
            case "SPAGHETTI_SAUCE":
            return(diffProducts[1][2]);
            case "LASAGNA":
            return(diffProducts[2][2]);
            case "SOUP":
            return(diffProducts[3][2]);
            case "KETCHUP":
            return(diffProducts[4][2]);
        }
    }

  ////////////////////////////////////////////////////////////LAYOUT////////////////////////////////////////////////////////////

    render() {

        return (

            this.state.isLoading == true 
            ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator size="large" color='black' animating/><Text>Transactie verwerken...</Text></View>
            : <View style={{flex: 1}}>
                <Text style={{fontSize: 40, fontWeight: 'bold', color: 'black', marginTop: 20, marginLeft: 5}}>Transaction flow</Text>
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    {this.state.myTransaction == "CreateMoreSupply" ? this.createViewForSupply() : this.state.myTransaction == "TradeProduct" ? this.createViewForTrade() : this.createViewForNewProduct()}
                </View>
            </View>
        );
    }
}

  ////////////////////////////////////////////////////////////STYLE////////////////////////////////////////////////////////////
