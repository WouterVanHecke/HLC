import React from 'react';
import { Text, View, Image, TextInput, StyleSheet, Alert, Dimensions, ActivityIndicator, Picker } from 'react-native';
import { TabNavigator, TabBarBottom, StackNavigator, SwitchNavigator } from 'react-navigation';
import Button from 'apsl-react-native-button';

import api from '../utilities/api';

var screen = Dimensions.get('window');
export default class CarryOutActionScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            participants: [],
            myParticipant: null,
            products: [],
            myProducts: [],
            action: "",
            selectedProductID : null,
            selectedParticipantID: null,
            amount: 5,
            myProductsMin: [],
            sending: false,
        };
    }

    componentWillMount() {
        //myProducts: this.state.myProducts, participants: this.setState.participants, products: this.state.products, myParticipant: this.setState.myParticipant, action: action
        const { params } = this.props.navigation.state;
        const _myProducts = params ? params.myProducts : null;
        const _participants = params ? params.participants : null;
        const _products = params ? params.products : null;
        const _myParticipant = params ? params.myParticipant : null;
        const _action = params ? params.action : null;

        this.setState({
            participants: _participants,
            myParticipant: _myParticipant,
            products: _products,
            myProducts: _myProducts,
            action: _action,
        })

        if(_action == "Create a product"){
            _myProducts.splice(0,1);

            this.setState({
                myProductsMin: _myProducts,
            })
        }
    }

  ////////////////////////////////////////////////////////////FUNCTIONS////////////////////////////////////////////////////////////

    _checkParams = () => {
        this.setState({sending: true});
        switch (this.state.action) {
            case "Create more supply":
                let fun = "org.obliviate.supchain.CreateMoreSupply";
                let product = "resource:org.obliviate.supchain.Product#" + this.state.selectedProductID;
                let quantity = this.state.amount;
                api.createMoreSupply(fun, product, quantity).then((res) => {
                    if(res.transactionId){
                        this.setState({sending: false, amount: 0, selectedProductID: null, selectedParticipantID: null});
                        this.props.navigation.navigate('Events', {transactionID: res.transactionId, from: this.state.action});
                    }else{
                        //problems
                        Alert.alert(res.error.message);
                    }
                });

                break;
            case "Buy a product":
                let _fun = "org.obliviate.supchain.TradeProduct";
                let _newProduct;
                let _oldProduct;
                let _chosenType;

                if(this.state.myParticipant.companyType == "MANUFACTURER"){
                    for(let i = 0; i < this.state.myProducts.length; i++){
                        if(this.state.myProducts[i].productName == this.state.selectedProductID){
                            _newProduct = "resource:org.obliviate.supchain.Product#" + this.state.myProducts[i].productID;
                            _chosenType = this.state.selectedProductID;
                        }
                    }
                    for(let i = 0; i < this.state.products.length; i++){
                        if(this.state.products[i].productName == _chosenType){
                            if(this.state.products[i].owner == "resource:org.obliviate.supchain.CompanyParticipant#" + this.state.selectedParticipantID){
                                _oldProduct = "resource:org.obliviate.supchain.Product#" + this.state.products[i].productID;
                            }
                        }
                    }
                }else{
                    for(let i = 0; i < this.state.myProducts.length; i++){
                        if(this.state.myProducts[i].productID == this.state.selectedProductID){
                            _newProduct = "resource:org.obliviate.supchain.Product#" + this.state.myProducts[i].productID;
                            _chosenType = this.state.myProducts[i].productName;
                        }
                    }
                    for(let i = 0; i < this.state.products.length; i++){
                        if(this.state.products[i].productName == _chosenType){
                            if(this.state.products[i].owner == "resource:org.obliviate.supchain.CompanyParticipant#" + this.state.selectedParticipantID){
                                _oldProduct = "resource:org.obliviate.supchain.Product#" + this.state.products[i].productID;
                            }
                        }
                    }
                }
                
                let _quantity = this.state.amount;

                api.tradeProduct(_fun, _oldProduct, _newProduct, _quantity).then((res) => {
                    if(res.transactionId){
                        this.setState({sending: false, amount: 0, selectedProductID: null, selectedParticipantID: null});
                        this.props.navigation.navigate('Events', {transactionID: res.transactionId, from: this.state.action});
                    }else{
                        //problems
                        Alert.alert(res.error.message);
                    }
                });
                break;
            case "Create a product":
                //class
                //right tomato product
                //new product (selected)
                //quantity
                let _class = "org.obliviate.supchain.CreateNewProduct";
                let _TProduct;
                let _NProduct;
                let _amount = this.state.amount;

                for(let i = 0; i < this.state.myProducts.length;i++){
                    if(this.state.myProducts[i].productID == this.state.selectedProductID){
                        _NProduct = "resource:org.obliviate.supchain.Product#" + this.state.myProducts[i].productID;
                    }
                }

                for(let i = 0; i < this.state.products.length; i++){
                    if(this.state.products[i].productName == "TOMATOES"){
                        if(this.state.products[i].owner == "resource:org.obliviate.supchain.CompanyParticipant#" + this.state.myParticipant.companyID){
                            _TProduct =  "resource:org.obliviate.supchain.Product#" + this.state.products[i].productID;
                        }
                    }
                }

                api.createNewProduct(_class, _TProduct, _NProduct, _amount).then((res) => {
                    if(res.transactionId){
                        this.setState({sending: false, amount: 0, selectedProductID: null, selectedParticipantID: null});
                        this.props.navigation.navigate('Events', {transactionID: res.transactionId, from: this.state.action});
                    }else{
                        //problems
                        Alert.alert(res.error.message);
                    }
                });

                break;
        }
    }

  ////////////////////////////////////////////////////////////LAYOUT////////////////////////////////////////////////////////////

    render() {

        let output;

        switch (this.state.action){
            case "Create more supply":
                items = this.state.myProducts.map( product => (
                    <Picker.Item label={product.productName} value={product.productID} />
                ));

                output = <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 20}}>Kies het product</Text>
                    <Picker
                        selectedValue={this.state.selectedProductID == null ? null : this.state.selectedProductID}
                        style={{ height: 50, width: 200 }}
                        onValueChange={(itemValue, itemIndex) => this.setState({selectedProductID: itemValue})}
                    >
                        <Picker.Item label="..." value="..." />
                        {items}
                    </Picker>
                    <Text style={{fontSize: 20}}>Kies het aantal</Text>
                    <TextInput
                        style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({amount : text})}
                        value={this.state.amount}
                    />
                </View>
                break;
            case "Buy a product":
                let items;

                if(this.state.myParticipant.companyType == "MANUFACTURER"){
                    items = <Picker.Item label="TOMATOES" value="TOMATOES" />
                }else{
                    items = this.state.myProducts.map( product => (
                        <Picker.Item label={product.productName} value={product.productID} />
                    ));
                }

                if(this.state.selectedProductID != null){
                    let chosenProduct;

                    for(let i = 0; i < this.state.products.length; i++){
                        if(this.state.products[i].productID == this.state.selectedProductID){
                            chosenProduct = this.state.products[i];
                            break;
                        } 
                    }
                    
                    let participants;
                    let participantsList = [];

                    if(this.state.myParticipant.companyType == "MANUFACTURER"){
                        for(let i = 0; i < this.state.participants.length; i++){
                            if(this.state.participants[i].companyType == 'SUPPLIER'){
                                if(this.state.participants[i].productTypes.indexOf('TOMATOES') != -1){
                                    participantsList.push(this.state.participants[i]);
                                }
                            }
                        }
                    }else if(this.state.myParticipant.companyType == "RETAILER"){
                        for(let i = 0; i < this.state.participants.length; i++){
                            if(this.state.participants[i].companyType == 'MANUFACTURER'){
                                for(let j = 0; j < this.state.participants[i].productTypes.length; j++){
                                    if(chosenProduct.productName == this.state.participants[i].productTypes[j]){
                                        participantsList.push(this.state.participants[i]);
                                    }
                                }
                            }
                        }
                    }else if(this.state.myParticipant.companyType == "CUSTOMER"){
                        for(let i = 0; i < this.state.participants.length; i++){
                            if(this.state.participants[i].companyType == 'RETAILER'){
                                if(this.state.participants[i].productTypes.indexOf(this.state.myParticipant.productTypes[0]) != -1){
                                    participantsList.push(this.state.participants[i]);
                                }
                            }
                        }
                    }

                    _partcipants = participantsList.map( participant => (
                        <Picker.Item label={participant.companyName} value={participant.companyID} />
                    ));
                }

                
                output = <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 20}}>Kies het product</Text>
                    <Picker
                        selectedValue={this.state.selectedProductID == null ? null : this.state.selectedProductID}
                        style={{ height: 50, width: 200 }}
                        onValueChange={(itemValue, itemIndex) => this.setState({selectedProductID: itemValue})}
                    >
                        <Picker.Item label="..." value="..." />
                        {items}
                    </Picker>

                    {this.state.selectedProductID == null ? null : <View><Text style={{fontSize: 20}}>Kies het bedrijf</Text>
                    <Picker
                        selectedValue={this.state.selectedParticipantID == null ? null : this.state.selectedParticipantID}
                        style={{ height: 50, width: 300 }}
                        onValueChange={(itemValue, itemIndex) => this.setState({selectedParticipantID: itemValue})}
                    >
                        <Picker.Item label="..." value="..." />
                        {_partcipants}
                    </Picker></View>}

                    <Text style={{fontSize: 20}}>Kies het aantal</Text>
                    <TextInput
                        style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({amount : text})}
                        value={this.state.amount}
                    />
                </View>
                
                break;
            case "Create a product":
                items = this.state.myProductsMin.map( product => (
                    <Picker.Item label={product.productName} value={product.productID} />
                ));

                output = <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 20}}>Kies het product</Text>
                    <Picker
                        selectedValue={this.state.selectedProductID == null ? null : this.state.selectedProductID}
                        style={{ height: 50, width: 200 }}
                        onValueChange={(itemValue, itemIndex) => this.setState({selectedProductID: itemValue})}
                    >
                        <Picker.Item label="..." value="..." />
                        {items}
                    </Picker>
                    <Text style={{fontSize: 20}}>Kies het aantal</Text>
                    <TextInput
                        style={{width: 200, height: 40, borderColor: 'gray', borderWidth: 1}}
                        onChangeText={(text) => this.setState({amount : text})}
                        value={this.state.amount}
                    />
                </View>
                break;
        }

        return (

            <View>
                <Text style={{fontSize: 40, fontWeight: 'bold', color: 'black', marginTop: 20, marginLeft: 5}}>{this.state.action}</Text>
                <Text style={{fontSize: 30, fontWeight: 'bold', color: 'black', marginBottom: 30, marginLeft: 5}}>Vul de gegevens in:</Text>
                
                {output}

                <View style={{alignItems: 'center'}}>
                    <View style={{alignItems: 'center'}}>
                        <Button
                            isLoading={this.state.sending}
                            onPress={() => this._checkParams()}
                            style={{height: 50, width: 300, borderRadius: 20, borderColor: "rgb(26, 117, 255)", marginTop: 40, backgroundColor: "rgb(26, 117, 255)"}}
                            textStyle={{fontWeight: 'bold', color: 'white', fontSize: 20}}
                        >Verstuur gegevens
                        </Button>
                    </View>
                </View>
            </View>
        
        );
    }
}

  ////////////////////////////////////////////////////////////STYLE////////////////////////////////////////////////////////////
