"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombinatorialInfo = void 0;
const info_js_1 = require("./info.js");
class CombinatorialInfo extends info_js_1.Info {
    constructor() {
        super();
        this.variableComponents = [];
        this.displayID = 'combinatorial' + (CombinatorialInfo.counter++);
    }
    addVariableComponentInfo(variableComponentInfo) {
        this.variableComponents[variableComponentInfo.cellID] = variableComponentInfo;
    }
    getVariableComponentInfo(variable) {
        return this.variableComponents[variable];
    }
    removeVariableComponentInfo(variable) {
        delete this.variableComponents[variable];
    }
    setTemplateURI(templateURI) {
        this.templateURI = templateURI;
    }
    getTemplateURI() {
        return this.templateURI;
    }
    makeCopy() {
        const copy = new CombinatorialInfo();
        copy.displayID = this.displayID;
        copy.uriPrefix = this.uriPrefix;
        copy.templateURI = this.templateURI;
        copy.version = this.version;
        copy.strategy = this.strategy;
        copy.name = this.name;
        copy.description = this.description;
        for (let key in this.variableComponents) {
            copy.variableComponents[key] = this.variableComponents[key].makeCopy();
        }
        return copy;
    }
    copyDataFrom(info) {
        this.displayID = info.displayID;
        this.uriPrefix = info.uriPrefix;
        this.templateURI = info.templateURI;
        this.version = info.version;
        this.strategy = info.strategy;
        this.name = info.name;
        this.description = info.description;
        this.variableComponents = [];
        for (let key in info.variableComponents) {
            this.variableComponents[key] = info.variableComponents[key].makeCopy();
        }
    }
    encode(enc) {
        let node = enc.document.createElement('CombinatorialInfo');
        if (this.displayID)
            node.setAttribute("displayID", this.displayID);
        if (this.uriPrefix)
            node.setAttribute("uriPrefix", this.uriPrefix);
        if (this.templateURI)
            node.setAttribute("templateURI", this.templateURI);
        if (this.version)
            node.setAttribute("version", this.version);
        if (this.strategy)
            node.setAttribute("strategy", this.strategy);
        if (this.name)
            node.setAttribute("name", this.name);
        if (this.description)
            node.setAttribute("description", this.description);
        if (this.variableComponents) {
            let varCompsNode = enc.document.createElement('Array');
            varCompsNode.setAttribute("as", 'variableComponents');
            for (let key in this.variableComponents) {
                let varCompNode = enc.encode(this.variableComponents[key]);
                varCompNode.setAttribute("as", this.variableComponents[key].cellID);
                varCompsNode.appendChild(varCompNode);
            }
            node.appendChild(varCompsNode);
        }
        return node;
    }
    getFullURI() {
        let fullURI = this.uriPrefix + '/' + this.displayID;
        if (this.version && this.version.length > 0) {
            fullURI += '/' + this.version;
        }
        return fullURI;
    }
}
exports.CombinatorialInfo = CombinatorialInfo;
CombinatorialInfo.counter = 0;
