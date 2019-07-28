//https://stackoverflow.com/questions/4200913/xml-to-javascript-object
class XmlParser {
    static parse(xml, arrayTags) {
        var dom = null;
        if (window.DOMParser) {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        } else if (window.ActiveXObject) {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml)) {
                throw dom.parseError.reason + " " + dom.parseError.srcText;
            }
        } else {
            throw "cannot parse xml string!";
        }

        var result = {};
        for (let i = 0; i < dom.childNodes.length; i++) {
            XmlParser.parseNode(dom.childNodes[i], arrayTags, result);
        }

        return result;
    }

    static isArray(o) {
        return Object.prototype.toString.apply(o) === '[object Array]';
    }


    static parseNode(xmlNode, arrayTags, result)
    {
        if (xmlNode.nodeName == "#text") {
            var v = xmlNode.nodeValue;
            if (v.trim()) {
                result['#text'] = v;
            }
            return;
        }

        var jsonNode = {};
        var existing = result[xmlNode.nodeName];
        if(existing) {
            if(!XmlParser.isArray(existing)) {
                result[xmlNode.nodeName] = [existing, jsonNode];
            } else {
                result[xmlNode.nodeName].push(jsonNode);
            }
        } else {
            if(arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1) {
                result[xmlNode.nodeName] = [jsonNode];
            } else {
                result[xmlNode.nodeName] = jsonNode;
            }
        }

        if(xmlNode.attributes) {
            var length = xmlNode.attributes.length;
            for(var i = 0; i < length; i++) {
                var attribute = xmlNode.attributes[i];
                jsonNode[attribute.nodeName] = attribute.nodeValue;
            }
        }

        var length = xmlNode.childNodes.length;
        for(var i = 0; i < length; i++) {
            XmlParser.parseNode(xmlNode.childNodes[i], arrayTags, jsonNode);
        }
    }
}