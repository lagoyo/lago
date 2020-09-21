





function _conv( data_mapping, src_data ) {
    let ret = {

    };

    for (const [key, value] of Object.entries(data_mapping)) {
        if( typeof value == "object" ) {
            ret[key] = _conv( value, src_data );
        }
        else {
            ret[key] = Mustache.render(value, src_data);
        }
    }
    return ret;
}


function convert( src_data ) {
    let data_mapping = {
        "aaa" : {
            "aaa_1" : "source src_1 {{src_1}}",
            "aaa_2" : "source src_2 {{src_2}}",
        },
        "bbb" : "{{src_2}} - {{src_3}}" ,
        "ccc" : "{{src_1}}"
    }

    return _conv(data_mapping, src_data );
}

function generateCode(src_data)
{
    let dataObj = convert(src_data);
    dataObj["@context"] = "http://schema.org/" + "DataSet"; // 변수 처리
    let ret = {
        "JSON-LD" : JSON.stringify(dataObj, null, '\t'),
        "object" : dataObj,
        "category" : "DataSet", // 변수 처리
        "src_data" : src_data
    }
    delete dataObj["@context"];
    return ret;
}
