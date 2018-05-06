'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

let cardname = 'admin@bp-supply-chain-v2';

class ComposerFiller {

    constructor() {
        this.SupChainConnection = new BusinessNetworkConnection();
    }

    async init() {
        return this.businessNetworkDefinition = await this.SupChainConnection.connect(cardname);
    }

    listen() {
        console.log('Started to listen to events');
        this.SupChainConnection.on('event', (evt) => {
            var output = "";
            if(evt.$type == 'TransactionFailedEvent'){
                output = `The transaction "${evt.transactionFunction}" failed. ${evt.message}.\n`;
                console.log(output);
            }else if(evt.$type == 'CreateMoreSupplySuccesEvent'){
                output = `The quantity of the product ${evt.productName} for company ${evt.companyName} has been raised from ${evt.oldQuantity} to ${evt.newQuantity}.\n`
                console.log(output);
            }else if(evt.$type == 'TradeProductSuccesEvent'){
                output = `A trade happened between the companies: ${evt.oldOwnerName} and ${evt.newOwnerName}.\nThe trade consisted of ${evt.quantity} units of ${evt.productName} at a price of ${evt.price} euro per unit.\n`
                console.log(output);
            }
            else if(evt.$type == 'CreateNewProductSuccesEvent'){
                output = `The company ${evt.companyName} turned ${evt.quantityOld} ${evt.productNameOld} into ${evt.quantityNew} new ${evt.productNameNew}.\n`
                console.log(output);
            }
        });
    }

    static async start() {
        let cf = new ComposerFiller();
        await cf.init().then(() => {cf.listen()});
    }

}

ComposerFiller.start();

