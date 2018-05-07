'use strict';

const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

let cardname = 'admin@bp-supply-chain-v2';

class ComposerFiller {

    constructor() {
        this.SupChainConnection = new BusinessNetworkConnection();

        //china 1, germany 2, brazil 3
        //part type - product type - country
        this.info = [
            [ //SUPPLIER
                ['PID:111','Zhengyuan', 'China', 'SUPPLIER', 'SEEDS', 300000, 'AID:11', 0.01],
                ['PID:112','Reimer Seeds', 'Germany', 'SUPPLIER', 'SEEDS', 300000, 'AID:12', 0.02],
                ['PID:113','Basso Semillas', 'Brazil', 'SUPPLIER', 'SEEDS', 300000, 'AID:13', 0.015],
                ['PID:121','Khanh Foods', 'China', 'SUPPLIER', 'TOMATOES', 1000000, 'AID:21', 0.5, 1],
                ['PID:122','Silbury', 'Germany', 'SUPPLIER', 'TOMATOES', 1000000, 'AID:22', 0.45, 1],
                ['PID:123','Bata Food', 'Brazil', 'SUPPLIER', 'TOMATOES', 1000000, 'AID:23', 0.52, 1],
                ['PID:131','Seawinner', 'China', 'SUPPLIER', 'FERTILIZER', 200000, 'AID:31', 2],
                ['PID:133','Argus Fertilizer', 'Brazil', 'SUPPLIER', 'FERTILIZER', 200000, 'AID:32', 2.2],
                ['PID:141','Soil supplier 1', 'China', 'SUPPLIER', 'SOIL', 100000, 'AID:41', 1],
                ['PID:143','Soil supplier 2', 'Brazil', 'SUPPLIER', 'SOIL', 100000, 'AID:42', 0.8],
                ['PID:152','Amprion', 'Germany', 'SUPPLIER', 'ELEKTRICITY'],
                ['PID:162','Berlin Water Works', 'Germany', 'SUPPLIER', 'WATER'],
                ['PID:172','Weidemann GmbH', 'Germany', 'SUPPLIER', 'MACHINES'],
                ['PID:182','Schoeller Allibert', 'Germany', 'SUPPLIER', 'CONTAINERS']
            ],
            [ //MANUFACTURER, 50 000 tomaten
                ['PID:211', 'Lovekitchen', 'China', 'MANUFACTURER', 'SOUP', 10000, 'AID:51', 'AID:24'],
                ['PID:212', "Campbell's GmbH", 'Germany', 'MANUFACTURER', 'SOUP', 10000, 'AID:52', 'AID:25'],
                ['PID:222', 'Hiltfields', 'Germany', 'MANUFACTURER', 'SPAGHETTI_SAUCE', 8000, 'AID:61', 'AID:26'],
                ['PID:223', 'Heinz', 'Brazil', 'MANUFACTURER', 'SPAGHETTI_SAUCE', 8000, 'AID:62', 'AID:27'],
                ['PID:233', 'CLAP INDUSTRIAL DE ALIMENTOS ', 'Brazil', 'MANUFACTURER', 'LASAGNA', 6000, 'AID:71', 'AID:28'],
                ['PID:231', 'Xiamen Luckte', 'China', 'MANUFACTURER', 'LASAGNA', 6000, 'AID:72', 'AID:29'],
                ['PID:241', 'Tianz', 'China', 'MANUFACTURER', 'KETCHUP', 10000, 'AID:81', 'AID:210'],
                ['PID:242', 'Hiltfields', 'Germany', 'MANUFACTURER', 'KETCHUP', 10000, 'AID:82', 'AID:211']
            ],
            [ //DISTRIBUTER
                ['PID:3113', 'DISTRIBUTER SAMPLE 1', 'Brazil', 'DISTRIBUTER', 'PLANE_BRAZIL_CHINA'],
                ['PID:3111', 'DISTRIBUTER SAMPLE 2', 'China', 'DISTRIBUTER', 'PLANE_CHINA_BRAZIL'],
                ['PID:3122', 'DISTRIBUTER SAMPLE 3', 'Germany', 'DISTRIBUTER', 'PLANE_GERMANY_CHINA'],
                ['PID:3121', 'DISTRIBUTER SAMPLE 4', 'China', 'DISTRIBUTER', 'PLANE_CHINA_GERMANY'],
                ['PID:3132', 'DISTRIBUTER SAMPLE 5', 'Germany', 'DISTRIBUTER', 'PLANE_GERMANY_BRAZIL'],
                ['PID:3133', 'DISTRIBUTER SAMPLE 6', 'Brazil', 'DISTRIBUTER', 'PLANE_BRAZIL_GERMANY'],
                ['PID:3211', 'DISTRIBUTER SAMPLE 7', 'China', 'DISTRIBUTER', 'CAR_CHINA'],
                ['PID:3221', 'DISTRIBUTER SAMPLE 8', 'China', 'DISTRIBUTER', 'CAR_CHINA'],
                ['PID:3212', 'DISTRIBUTER SAMPLE 9', 'Germany', 'DISTRIBUTER', 'CAR_GERMANY'],
                ['PID:3222', 'DISTRIBUTER SAMPLE 10', 'Germany', 'DISTRIBUTER', 'CAR_GERMANY'],
                ['PID:3213', 'DISTRIBUTER SAMPLE 11', 'Brazil', 'DISTRIBUTER', 'CAR_BRAZIL'],
                ['PID:3223', 'DISTRIBUTER SAMPLE 12', 'Brazil', 'DISTRIBUTER', 'CAR_BRAZIL']
            ],
            [ //RETAILER
                ['PID:412', 'COLRUYT', 'Germany', 'RETAILER', ['TOMATOES', 'SOUP', 'SPAGHETTI_SAUCE', 'LASAGNA', 'KETCHUP'], [500, 100, 80, 50, 50], ['AID:212', 'AID:53', 'AID:63', 'AID:73', 'AID:83']],
                ['PID:423', 'WALMARKT', 'Brazil', 'RETAILER', ['TOMATOES', 'SOUP', 'SPAGHETTI_SAUCE', 'LASAGNA', 'KETCHUP'], [500, 100, 80, 50, 50], ['AID:213', 'AID:54', 'AID:64', 'AID:74', 'AID:84']],
                ['PID:431', 'PRISMA', 'China', 'RETAILER', ['TOMATOES', 'SOUP', 'SPAGHETTI_SAUCE', 'LASAGNA', 'KETCHUP'], [500, 100, 80, 50, 50], ['AID:214', 'AID:55', 'AID:65', 'AID:75', 'AID:85']],
                ['PID:442', 'PANOS', 'Germany', 'RETAILER', ['TOMATOES', 'KETCHUP'], [50, 10], ['AID:215', 'AID:86']],
                ['PID:452', "FRITUUR T'HOEKSKE", 'Germany', 'RETAILER', ['SPAGHETTI_SAUCE', 'KETCHUP'], [5, 10], ['AID:66', 'AID:87']]
            ],
            [ //CUSTOMER
                ['PID:511', 'Wouter Van Hecke', 'China', 'CUSTOMER', 'TOMATOES', 3, 'AID:216'],
                ['PID:521', 'Jens Mortier', 'China', 'CUSTOMER', 'SOUP', 2, 'AID:56'],
                ['PID:512', 'Sam Maesschalck', 'Germany', 'CUSTOMER', 'LASAGNA', 1, 'AID:76'],
                ['PID:522', 'Diego Carboni', 'Germany', 'CUSTOMER', 'KETCHUP', 1, 'AID:88'],
                ['PID:513', 'Catarina Melas', 'Brazil', 'CUSTOMER', 'KETCHUP', 1, 'AID:89'],
                ['PID:523', 'Jessica Brandao', 'Brazil', 'CUSTOMER', 'SPAGHETTI_SAUCE', 2, 'AID:67']
            ],
        ];
    }

    async init() {
        return this.businessNetworkDefinition = await this.SupChainConnection.connect(cardname);
    }

    async createParticipants_Assets() {
        try {

            let participantRegistry = await this.SupChainConnection.getParticipantRegistry('org.obliviate.supchain.CompanyParticipant');
            let assetsRegistry = await this.SupChainConnection.getAssetRegistry('org.obliviate.supchain.Product');
            let walletRegistry = await this.SupChainConnection.getAssetRegistry('org.obliviate.supchain.Wallet');
            let factory = this.businessNetworkDefinition.getFactory();
            var participants = [];
            var products = [];
            var wallets = [];

            for(let i = 0; i < this.info.length; i++){
                for(let j = 0; j < this.info[i].length; j++){

                    let participant = factory.newResource('org.obliviate.supchain', 'CompanyParticipant', this.info[i][j][0]);
                    let wallet = factory.newResource('org.obliviate.supchain', 'Wallet', "W-" + this.info[i][j][0]);

                    participant.companyName = this.info[i][j][1];
                    participant.country = this.info[i][j][2];
                    participant.companyType = this.info[i][j][3];

                    if(i == 3){
                        participant.productTypes = this.info[i][j][4];
                    }else{
                        participant.productTypes = [this.info[i][j][4]];
                    }

                    wallet.privateKey = "E9873D79C6D87DC0FB6A57786333" + this.info[i][j][0] + "89F4453213303DA61F20BD67FC233AA33262";
                    wallet.publicKey = "6FPZBT79E9G1VPR0FB6A5778633389F4453846303DA61F2R9FKS5C233AA33262";
                    wallet.address = "E9873D79C6D87F2R9FKS5C233AA3";
                    wallet.balance = 100000;

                    participant.networkWallet = factory.newRelationship('org.obliviate.supchain', 'Wallet', "W-" + this.info[i][j][0]);

                    participants.push(participant);
                    wallets.push(wallet);

                    if(i == 3){

                        for(let k = 0; k < this.info[i][j][4].length; k++){
                            let product = factory.newResource('org.obliviate.supchain', 'Product', this.info[i][j][6][k]);

                            product.productName = this.info[i][j][4][k];
                            product.quantity = this.info[i][j][5][k];
                            product.price = 0;

                            product.owner = factory.newRelationship('org.obliviate.supchain', 'CompanyParticipant', this.info[i][j][0]);

                            products.push(product);
                        }

                    }else{
                        if(i != 2 && this.info[i][j][6] != undefined) {
                            let product = factory.newResource('org.obliviate.supchain', 'Product', this.info[i][j][6]);

                            product.productName = this.info[i][j][4];
                            product.quantity = this.info[i][j][5];

                            if(i == 0 && this.info[i][j][7] != undefined){
                                product.price = this.info[i][j][7];
                            }else{
                                product.price = 0;
                            }

                            product.owner = factory.newRelationship('org.obliviate.supchain', 'CompanyParticipant', this.info[i][j][0]);

                            products.push(product);
                        }
                    }

                    if(i == 1){
                        let product = factory.newResource('org.obliviate.supchain', 'Product', this.info[i][j][7]);

                        product.productName = 'TOMATOES';
                        product.quantity = 50000;
                        product.price = 0;

                        product.owner = factory.newRelationship('org.obliviate.supchain', 'CompanyParticipant', this.info[i][j][0]);

                        products.push(product);
                    }
                    
                }
            }

            await participantRegistry.addAll(participants).then(() => {console.log('All participants added')});
            await assetsRegistry.addAll(products).then(() => {console.log('All assets added')});
            await walletRegistry.addAll(wallets).then(() => {console.log('All wallets added')});


        } catch(error) {
            console.log(error);
            throw error;
        }
        
    }

    static async start() {
        let cf = new ComposerFiller();
        await cf.init().then(() => {cf.createParticipants_Assets().then(() => {console.log('Done')})});

    }
}

ComposerFiller.start();

