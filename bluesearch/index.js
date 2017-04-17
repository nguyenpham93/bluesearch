const cn = require ('./connect');
const analyse_setting = require ("./analyse_setting");
const mapping_setting = require ("./mapping_setting")

class elastic {
	constructor () {
		this.elas = cn;
    }

	createIndex (index, type) {
		let setting = analyse_setting ();
		let mapping = mapping_setting (type); 
		this.elas.indices.create ({
			index : index,
			body  : {
				"settings" : setting,
				"mappings" : mapping
			}
		}, (err, result, status) => {
			if (err) {
				console.log (err.message);
			} else {
				console.log (`Index ${result} was created`);
			}
		});
	}

	insertDocument (index, type, doc, cb) {
		this.elas.index ({
			index : index,
			type  : type,
			body : doc
		}, ( err, resp, status ) => {
			if (err) {
				cb (err.message);
			} else{
				cb (null, "Insert succeed")
			}
		});
	}

	deleteIndex (index, cb) {
		this.elas.indices.delete ({
			index : index
		}, ( err, result, status) => {
			if ( err ) {
				cb (err.message);
			}
			else {
				cb ("deleted " , result);
			}
		})
	}

	searchAll ( index, type, cb ) {
		this.elas.search ({
			index : index,
			type : type,
			body : {
				"query" : {
					"match_all" : {}
				}	
			}
		} , ( err, res, stt) => {
			let products = [];
			res.hits.hits.forEach ( (product) => {
				products.push ( product["_source"] );
			});
			cb(null,products);
		});
	}

	search ( index, type, term, cb ) {
		this.elas.search ({
			index : index,
			type  : type,
			body  : {
				query : {
					"multi_match" : {
						"query"  	 : term,
						"type" 	 	 : "best_fields",
						"fields" 	 : [ "product_name",
										 "Hỗ trợ 3G",
										 "Máy ảnh chính",
										 "Máy ảnh phụ",
										 "Bộ nhớ trong",
										 "Hệ điều hành",
										 "RAM",
										 "store_day" ],
						"tie_breaker" : 0.3
					}
				}
			}
		}, (error, response, status) => {
			if (error) {
				cb ( error.message );
			} else {
				let products = [];
				response.hits.hits.forEach ( (product) => {
					products.push ( product["_source"] );
				});
				cb ( null, products );
			}
		});
	}
}

module.exports = elastic;