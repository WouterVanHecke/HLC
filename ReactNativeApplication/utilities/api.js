var api = {

    urlNgRok : 'http://170a9b69.ngrok.io',

    getAllParticipants() {
        var url = `${this.urlNgRok}/api/CompanyParticipant`;
        return fetch(url).then((res) => res.json());
    },

    getAllProducts() {
        var url = `${this.urlNgRok}/api/Product`;
        return fetch(url).then((res) => res.json());
    },
    
    createMoreSupply(_fun, _product, _amount) {
        return fetch(`${this.urlNgRok}/api/CreateMoreSupply`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({$class : _fun, product : _product, quantity : _amount})
        }).then((res) => res.json());
    },

    tradeProduct(_fun, _oldProduct, _newProduct, _quantity) {
        return fetch(`${this.urlNgRok}/api/TradeProduct`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({$class : _fun, productOldOwner : _oldProduct, productNewOwner: _newProduct, quantity : _quantity})
        }).then((res) => res.json());
    },

    createNewProduct(_class, _TProduct, _NProduct, _amount) {
        return fetch(`${this.urlNgRok}/api/CreateNewProduct`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({$class : _class, TProduct : _TProduct, NProduct: _NProduct, quantity : _amount})
        }).then((res) => res.json());
    },

    getTransaction(_transactionID, _from) {
        switch (_from) {
            case "Create more supply":
                var url = `${this.urlNgRok}/api/CreateMoreSupply/${_transactionID}`;
                return fetch(url).then((res) => res.json());
                break;
            case "Buy a product":
                var url = `${this.urlNgRok}/api/TradeProduct/${_transactionID}`;
                return fetch(url).then((res) => res.json());
                break;
            case "Create a product":
                var url = `${this.urlNgRok}/api/CreateNewProduct/${_transactionID}`;
                return fetch(url).then((res) => res.json());
                break;
        };
    },

    getProductByID(_productID) {
        var url = `${this.urlNgRok}/api/Product/${_productID}`;
        return fetch(url).then((res) => res.json());
    },

    getParticipantByID(_participantID) {
        var url = `${this.urlNgRok}/api/CompanyParticipant/${_participantID}`;
        return fetch(url).then((res) => res.json());
    },
};

module.exports = api;