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

    async removeAllParticipants() {
        try {
            let participantRegistry = await this.SupChainConnection.getParticipantRegistry('org.obliviate.supchain.CompanyParticipant');
            let assetsRegistry = await this.SupChainConnection.getAssetRegistry('org.obliviate.supchain.Product');
            await participantRegistry.getAll().then((res) => {participantRegistry.removeAll(res)});
            await assetsRegistry.getAll().then((res) => {assetsRegistry.removeAll(res).then(() => {console.log('All info removed')})});
        }catch(error) {
            console.log(error);
            throw error;
        }
    }

    static async start() {
        let cf = new ComposerFiller();
        await cf.init();
        await cf.removeAllParticipants();
    }
}

ComposerFiller.start();

