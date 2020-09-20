



let data = {
    src_1 : "소스1",
    src_2 : "소스2",
    src_3 : "소스3",
    dummy : "아무 데이터"
}

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
        },
        "bbb" : "{{src_2}} - {{src_3}}" ,
        "ccc" : "{{src_1}}"
    }

    return _conv(data_mapping, src_data );
}

function generateCode(src_data)
{
    let dataObj = convert(src_data);

    let ret = {
        "JSON-LD" : JSON.stringify(dataObj, null, '\t'),
        "object" : dataObj,
        "src_data" : src_data
    }
    return ret;
}
