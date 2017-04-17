## ELASTICSEARCH MODULE
### Cài đặt và sử dụng
``` 
yarn install 
const elastic = require("./bluesearch/index.js");
const elas = new elastic();

// Tìm tất cả sản phẩm có trong table product, database thanhquan 

elas.searchAll("thanhquan","product", (err, result) => {
    result.forEach( (product) => {
        console.log(product);
    });
});
```
## Cấu hình kết nối tới ElasticSearch
Mở file `config.json` trong thư mục `config`

```
{
    "development" : {
        "protocol" : "http",
        "host"     : "localhost",
        "port"     : 9200,
        "auth"     : "elastic:changeme"  // username : password
    },
    "production" : {
        "protocol" : "http",
        "host"     : "127.0.0.1",
        "auth"     : "elastic:changeme"
    }
}
```
## Tùy chỉnh lại file `mapping_setting.js` cho phù hợp với cấu trúc table trong database

Ví dụ: 
```
products_table : {
  "include_in_all" : false,
	"properties" : {
	  "product_name" : {
		  "type" : "text",
			"include_in_all" : true,
			"analyzer" : "analyzer_for_index",
			"search_analyzer": "analyzer_for_searching"
		},
    "product_color" : {
      "type" : "text",
      "include_in_all" : true,
		  "analyzer" : "analyzer_for_index",
			"search_analyzer": "analyzer_for_searching"
    }}}
```

## Tuỳ chỉnh các analyzer trong file `analyse_setting.js`

### Analysis của Elasticsearch có 3 giai đoạn chính : 
#### 1/ char_filter : 
 - Dùng các char_filter có sẵn hoặc tự tạo char_filter riêng để validate input của user , ví dụ: 
"html_strip" filter có nhiệm vụ loại bỏ tất cả ký tự html , và chuyển mã các ký tự giống như `&amp`
#### 2/ tokenizer : 
- Dùng tách các string input của người dùng thành mảng chứa các term, mặc định là `standard`

#### 3/ filter : dùng các filter như lowercase để convert các từ hoa thành từ thường, giúp dễ tìm kiếm hơn, 'stop' filter loại bỏ các từ thông dụng như "a,the,is,are..." , tối ưu t.gian tìm kiếm

```
"number_of_shards": 5,
			"analysis" : {
				"char_filter" : {      
					"&_to_and" : {         (1)
						"type" : "mapping",
						"mappings" : [ "& => and" ]  
				}},
				"filter" : {
					"my_filter" : {       (2)
						"type" : "nGram",
						"min_gram" : 2,
						"max_gram" : 15,
						"token_chars" : [
							"letter",
							"digit",
							"punctuation",
							"symbol"
						]
					},
					"my_stopwords" : {         (3)
						"type" : "stop",
						"stopwords" : ["cần", "một", "hỏi", "có", "a", "the", "is", "are"]
				}},
				"analyzer" : {
					"analyzer_for_index" : {        (4)
						"type" 		  : "custom",
						"char_filter" : [ "html_strip", "&_to_and" ],
						"tokenizer"	  : "standard",
						"filter"	  : [ 'lowercase', "my_stopwords", "my_filter" ]
					},
					"analyzer_for_searching" : {        (5)
						"type"	: "custom",
						"char_filter" : [ "html_strip", "&_to_and" ],
						"tokenizer"	  : "standard",
						"filter"	  : [ 'lowercase', "my_stopwords"]	
					}
				}
			}
		}
```

* (1) Tạo char_filter `&_to_and` , filter này có nhiệm vụ đổi dấu & thành "and" khi lưu vào elastic và search 
* (2) "my_filter" là filter tự tạo để tìm kiếm dựa theo yêu cầu, type : "nGram" filter này kế thừa filter Ngram, phân tách nhỏ các từ ra ví dụ : Hello => "h" "he" "hel" "hell" "hello" ...
* (3) loại bỏ các từ thông dụng
* (4) analyzer "analyzer_for_index" dùng cho index time
* (5) analyzer "analyzer_for_searching" dùng cho searchng time

## Các core function trong elasticsearch 
- Tạo index (database), param : index => tên database 
```
elas.createIndex(index);
```

### Tìm tất cả product,
- params : 
  * index => tên database
  * type => tên table
  * callback(err,result) => result : mảng result  
```
elas.searchAll(index,type, (err, result) => {
    result.forEach( (product) => {
        console.log(product);
    });
});

```
### Search theo term
- params : 
  * index => tên database
  * type => tên table
  * term => search string
  * callback(err,result) => result : mảng result  
```
   elas.search(index,type,term, (err, result) => {
       if (err) {
           console.log(err);
       } else {
           result.forEach( (product) => {
               console.log(product);
           });
       }
   });

```
### Thêm document (product) vào table 
- params : 
  * index => tên database
  * type => tên table
  * data => data insert
  * callback(err,result) => result : mảng result  
```
elas.insertDocument(index,type,data, (err, stt) => {
           if (err) console.log(err)
            else console.log(stt);
       });
```

### Xóa index (database)
- params : 
  * index => tên database
```
   elas.deleteIndex(index, (stt) => {
       console.log(stt);
   });
```
