'use strict';

/**
 * Sample transaction
 * @param {org.obliviate.supchain.TradeProduct} tradeProduct
 * @transaction
 */
async function tradeProduct(tx) {

    if(tx.productOldOwner.productName == tx.productNewOwner.productName){

        if(tx.productOldOwner.quantity < tx.quantity){

            const productOldOwner = tx.productOldOwner;
            const productNewOwner = tx.productNewOwner;

            const quantity = tx.quantity;
            const price = tx.productOldOwner.price;

            tx.productOldOwner.quantity = tx.productOldOwner.quantity - quantity;
            tx.productNewOwner.quantity = tx.productNewOwner.quantity + quantity;

            const assetRegistry = await getAssetRegistry('org.obliviate.supchain.Product');

            await assetRegistry.update(tx.productOldOwner);
            await assetRegistry.update(tx.productNewOwner);

            // Emit an event for the modified asset.
            let event = getFactory().newEvent('org.obliviate.supchain', 'TradeProductSuccesEvent');

            event.productName = productOldOwner.productName;
            event.price = price;
            event.quantity = quantity;
            event.oldOwnerName = productOldOwner.owner.companyName;
            event.newOwnerName = productNewOwner.owner.companyName;

            emit(event);

        }else{
            //no access
            let event = getFactory().newEvent('org.obliviate.supchain', 'TransactionFailedEvent');

            event.transactionFunction = "TradeProduct";
            event.message = "You can't ask more of the seller than he has available.";

            emit(event);

            throw new Error('See event for information');
        }

    }else{
        //no access
        let event = getFactory().newEvent('org.obliviate.supchain', 'TransactionFailedEvent');

        event.transactionFunction = "TradeProduct";
        event.message = "You can't trade product that don't belong to the same category.";

        emit(event);

        throw new Error('See event for information');
    }
}

/**
 * Sample transaction
 * @param {org.obliviate.supchain.CreateMoreSupply} createSupply
 * @transaction
 */
async function createSupply(tx) {
    if(tx.product.owner.companyType == 'SUPPLIER'){
        //access
        const oldQuantity = tx.product.quantity;
        tx.product.quantity = tx.product.quantity + tx.quantity;

        const assetRegistry = await getAssetRegistry('org.obliviate.supchain.Product');
        await assetRegistry.update(tx.product);

        // Emit an event for the modified asset.
        let event = getFactory().newEvent('org.obliviate.supchain', 'CreateMoreSupplySuccesEvent');

        event.companyName = tx.product.owner.companyName;
        event.productName = tx.product.productName;
        event.oldQuantity = oldQuantity;
        event.newQuantity = tx.product.quantity;

        emit(event);
    }else{
        //no access
        let event = getFactory().newEvent('org.obliviate.supchain', 'TransactionFailedEvent');

        event.transactionFunction = "CreateMoreSupply";
        event.message = "This product doesn't belong to a supplier company";

        emit(event);

        throw new Error('See event for information');
    }
}


/**
 * Sample transaction
 * @param {org.obliviate.supchain.CreateNewProduct} createProduct
 * @transaction
 */
async function createProduct(tx) {
    if(tx.TProduct.owner.companyType == 'MANUFACTURER' || (tx.TProduct.owner.companyType == "SUPPLIER" && tx.TProduct.productName == "SEEDS" && tx.NProduct.productName == "TOMATOES")){
        var diffProducts = [
            ['SEEDS', 'TOMATOES', 3], //SUCCESRATE = 1:3
            ['TOMATOES', 'SPAGHETTI_SAUCE', 3],
            ['TOMATOES', 'LASAGNA', 5],
            ['TOMATOES', 'SOUP', 2],
            ['TOMATOES', 'KETCHUP', 10]
        ];
        
        var ok = false; var row = 0;
        for(let i = 0; i < diffProducts.length; i++){
            if(diffProducts[i][0] == tx.TProduct.productName){
                if(diffProducts[i][1] == tx.NProduct.productName){
                    if(diffProducts[i][2] * tx.quantity >= tx.TProduct.quantity){
                        ok = true;
                    }
                }
            }
        }

        if(ok == true){

            tx.TProduct.quantity = tx.TProduct.quantity - (diffProducts[rown][2] * tx.quantity);
            tx.NProduct.quantity = tx.NProduct.quantity * tx.quantity;

            const assetRegistry = await getAssetRegistry('org.obliviate.supchain.Product');
            await assetRegistry.update(tx.TProduct);
            await assetRegistry.update(tx.NProduct);

            //no access
            let event = getFactory().newEvent('org.obliviate.supchain', 'CreateNewProductSuccesEvent');

            event.companyName = tx.TProduct.owner.companyName;
            event.productNameOld = tx.TProduct.productName;
            event.productNameNew = tx.NProduct.productName;
            event.quantityOld = diffProducts[row][2] * tx.quantity;
            event.quantityNew = 1 * tx.quantity;

            emit(event);

        }else{
            //no access
            let event = getFactory().newEvent('org.obliviate.supchain', 'TransactionFailedEvent');

            event.transactionFunction = "CreateNewProduct";
            event.message = "The conditions weren't met.";

            emit(event);

            throw new Error('See event for information');
        }

    }else{
        //no access
        let event = getFactory().newEvent('org.obliviate.supchain', 'TransactionFailedEvent');

        event.transactionFunction = "CreateNewProduct";
        event.message = "Only a manufacturer company can create products out of the supply.";

        emit(event);

        throw new Error('See event for information');
    }
}