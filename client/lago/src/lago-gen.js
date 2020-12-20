import Mustache from 'mustache'

const jsTemplate = `
function _conv(dataMapping, srcData) {
  const ret = {}
  for (const [key, value] of Object.entries(dataMapping)) {
    if (typeof value === 'object') {
      ret[key] = _conv(value, srcData)
    } else {
      ret[key] = Mustache.render(value, srcData)
    }
  }
  return ret
}

function convert (srcData) {
    const dataMapping = {{&mapping}};
      return _conv(dataMapping, srcData);
}

function generateCode(srcData) {
    let dataObj = convert(srcData);
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
`

const javaTempalte = `import java.io.StringReader;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;
import com.github.mustachejava.DefaultMustacheFactory;
import com.github.mustachejava.Mustache;
import com.github.mustachejava.MustacheFactory;
import com.google.gson.Gson;

/*
JAVA 1.8 이상.
com.github.spullara.mustache.java compiler-0.9.6.jar
com.google.code.gson gson.2.8.6.jar

<Maven 사용하는 경우>
<dependency>
    <groupId>com.github.spullara.mustache.java</groupId>
    <artifactId>compiler</artifactId>
    <version>0.9.6</version>
</dependency>
<dependency>
    <groupId>com.google.code.gson</groupId>
    <artifactId>gson</artifactId>
    <version>2.8.6</version>
</dependency>

<Gradle 사용하는 경우>
compile group: 'com.github.spullara.mustache.java', name: 'compiler', version: '0.9.6'
compile group: 'com.google.code.gson', name: 'gson', version: '2.8.6'
*/

public class SchemaOrgGenerater {

    public Map<String, Object> generateCode(Map<String, Object> srcData) {
        Map<String, Object> dataObj = convert(srcData);

        dataObj.put("@context", "http://schema.org/" + "DataSet");

        Map<String, Object> ret = new HashMap<String, Object>();
        ret.put("JSON-LD", new Gson().toJson(dataObj));
        ret.put("object", dataObj);
        ret.put("category", "DataSet");
        ret.put("src_data", srcData);
        dataObj.remove("@context");

        return ret;
    }

    static private mapString =
        {{&mapping}};

    public Map<String, Object> convert(Map<String, Object> srcData) {

        /*
        Map<String, Object> dataMapping = new HashMap<String, Object>();
        Map<String, Object> subData = new HashMap<String, Object>();
        subData.put("aaa_1", "soruce src_1 {{src_1}}");
        subData.put("aaa_2", "source src_2 {{src_2}}");
        dataMapping.put("aaa", subData);
        dataMapping.put("bbb", "{{src_2}} - {{src_3}}");
        dataMapping.put("ccc", "{{src_1}}");
        */
        Map<String, Object> dataMapping =  new JSONObject(mapString);
        return convertTemplate(dataMapping, srcData);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> convertTemplate(Map<String, Object> dataMapping, Map<String, Object> srcData) {
        Map<String, Object> ret = new HashMap<String, Object>();

        for (String key : dataMapping.keySet()) {
            if (!isPrimitiveOrString(dataMapping.get(key).getClass())) {
                ret.put(key, convertTemplate((Map<String, Object>)dataMapping.get(key), srcData));
            }
            else {
                Writer writer = new StringWriter();
                MustacheFactory mf = new DefaultMustacheFactory();
                Mustache mustache = mf.compile(new StringReader((String)dataMapping.get(key)), "example");
                mustache.execute(writer, srcData);
                try {
                    ret.put(key,writer.toString());
                }
                catch (Exception ex) {
                    System.out.println(ex.getMessage());
                    throw new RuntimeException(ex);
                }
            }
        }

        return ret;
    }

    public boolean isPrimitiveOrString(Class<?> type) {
        return (type.isPrimitive() && type != void.class) ||
                type == Double.class || type == Float.class || type == Long.class ||
                type == Integer.class || type == Short.class || type == Character.class ||
                type == Byte.class || type == Boolean.class || type == String.class;
    }
}
`

function escapeJsonString (map, indent) {
  const mapStr = JSON.stringify(map, null, '    ')
  const lines = mapStr.split('\n')
  let ret = ''
  if (indent === undefined || indent === null) indent = ''
  lines.forEach(function (line) {
    console.log(lines)
    if (ret !== '') {
      ret += '+\n' + indent
    }
    ret += JSON.stringify(line)
  })
  return ret
}

function generateSource (lang, category, map) {
  const l = lang.toLowerCase()
  switch (l) {
    case 'js' :
    case 'es' :
    case 'javascript': {
      const mapStr = JSON.stringify(map, null, '\t')
      return Mustache.render(jsTemplate, { category: category, mapping: mapStr })
    }
    case 'java' : {
      return Mustache.render(javaTempalte, { category: category, mapping: escapeJsonString(map, '\t\t') })
    }
    default : {
      console.log('Not supported ' + lang)
      return null
    }
  }
}

export default {
  generateSource: generateSource
}
