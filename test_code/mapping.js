




let js_template = `
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
    let data_mapping = {{&mapping}};


    return _conv(data_mapping, src_data );
}

function generateCode(src_data)
{
    let dataObj = convert(src_data);
    dataObj["@context"] = "http://schema.org/{{category}}"; // 변수 처리
    let ret = {
        "JSON-LD" : JSON.stringify(dataObj, null, '\t'),
        "object" : dataObj,
        "category" : "{{category}}", 
        "src_data" : src_data
    }
    delete dataObj["@context"];
    return ret;
}
`;




function generateSource( lang, category, map ) {
    let mapping = JSON.stringify(map, null, '\t');
    return Mustache.render(js_template, { category : category, mapping : mapping } );
}