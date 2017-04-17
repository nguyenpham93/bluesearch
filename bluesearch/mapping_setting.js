function config (type) {
    return {
			type : {
			"include_in_all" : false,
				"properties" : {
					"product_name" : {
						"type" 			 : "text",
						"include_in_all" : true,
						"analyzer" 		 : "analyzer_for_index",
						"search_analyzer": "analyzer_for_searching"
					},
					"detail_property" : {
						"type" : "object",
						"properties" : {
							"Dữ liệu & Kết nối" : {
								"type" : "object",
								"properties" : {
									"Hỗ trợ 3G" : { "type" : "text", "include_in_all" : true, "analyzer" : "standard"}
								}
							},
							"Giải trí & Đa phương tiện" : {
								"type" : "object",
								"properties" : {
									"Máy ảnh chính" : { "type" : "text", "include_in_all" : true, "analyzer" : "standard"},
									"Máy ảnh phụ"	: { "type" : "text", "include_in_all" : true, "analyzer" : "standard"}
								}
							},
							"Lưu trữ & bộ nhớ" : {
								"type" : "object",
								"properties" : {
									"Bộ nhớ trong" : { "type" : "text", "include_in_all" : true, "analyzer" : "standard"}
								}
							},
							"Thông tin chung" : {
								"type" : "object",
								"properties" : {
									"Hệ điều hành" : { "type" : "text", "include_in_all" : true, "analyzer" : "standard"},
									"RAM"		   : { "type" : "text", "include_in_all" : true, "analyzer" : "standard"}
								}
							},
							"store_day" : {
								"type"			 : "date",
								"include_in_all" : true,
               					"format"		 : "yyyy-MM-dd"
							}
						}
					}
				}
			}
		}
}

module.exports = config;