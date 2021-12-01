"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteractionInfo = void 0;
const info_js_1 = require("./info.js");
class InteractionInfo extends info_js_1.Info {
    constructor() {
        super();
        // treat these as dictionaries, not arrays
        this.sourceRefinement = [];
        this.targetRefinement = [];
        this.fromURI = [];
        this.toURI = [];
        this.displayID = 'Interaction' + (InteractionInfo.counter++);
    }
    makeCopy() {
        const copy = new InteractionInfo();
        copy.displayID = this.displayID;
        copy.uriPrefix = this.uriPrefix;
        copy.interactionType = this.interactionType;
        for (let key in this.sourceRefinement) {
            copy.sourceRefinement[key] = this.sourceRefinement[key];
        }
        for (let key in this.targetRefinement) {
            copy.targetRefinement[key] = this.targetRefinement[key];
        }
        for (let key in this.fromURI) {
            copy.fromURI[key] = this.fromURI[key];
        }
        for (let key in this.toURI) {
            copy.toURI[key] = this.toURI[key];
        }
        return copy;
    }
    copyDataFrom(other) {
        this.displayID = other.displayID;
        this.uriPrefix = other.uriPrefix;
        this.interactionType = other.interactionType;
        for (let key in other.sourceRefinement) {
            this.sourceRefinement[key] = other.sourceRefinement[key];
        }
        for (let key in other.targetRefinement) {
            this.targetRefinement[key] = other.targetRefinement[key];
        }
        for (let key in other.fromURI) {
            this.fromURI[key] = other.fromURI[key];
        }
        for (let key in other.toURI) {
            this.toURI[key] = other.toURI[key];
        }
    }
    getFullURI() {
        return this.uriPrefix + '/' + this.displayID;
    }
    encode(enc) {
        let node = enc.document.createElement('InteractionInfo');
        if (this.displayID)
            node.setAttribute("displayID", this.displayID);
        if (this.interactionType)
            node.setAttribute("interactionType", this.interactionType);
        if (this.uriPrefix)
            node.setAttribute("uriPrefix", this.uriPrefix);
        if (this.sourceRefinement) {
            let sourceRefinementNode = enc.document.createElement('Array');
            sourceRefinementNode.setAttribute("as", "sourceRefinement");
            for (let key in this.sourceRefinement) {
                let sourceRefNode = enc.document.createElement("add");
                sourceRefNode.setAttribute("value", this.sourceRefinement[key]);
                sourceRefNode.setAttribute("as", key);
                sourceRefinementNode.appendChild(sourceRefNode);
            }
            node.appendChild(sourceRefinementNode);
        }
        if (this.targetRefinement) {
            let targetRefinementNode = enc.document.createElement("Array");
            targetRefinementNode.setAttribute("as", "targetRefinement");
            for (let key in this.targetRefinement) {
                let targetRefNode = enc.document.createElement("add");
                targetRefNode.setAttribute("value", this.targetRefinement[key]);
                targetRefNode.setAttribute("as", key);
                targetRefinementNode.appendChild(targetRefNode);
            }
            node.appendChild(targetRefinementNode);
        }
        if (this.fromURI) {
            let fromURINode = enc.document.createElement("Array");
            fromURINode.setAttribute("as", "fromURI");
            for (let key in this.fromURI) {
                let URINode = enc.document.createElement("add");
                URINode.setAttribute("value", this.fromURI[key]);
                URINode.setAttribute("as", key);
                fromURINode.appendChild(URINode);
            }
            node.appendChild(fromURINode);
        }
        if (this.toURI) {
            let toURINode = enc.document.createElement("Array");
            toURINode.setAttribute("as", "toURI");
            for (let key in this.toURI) {
                let URINode = enc.document.createElement("add");
                URINode.setAttribute("value", this.toURI[key]);
                URINode.setAttribute("as", key);
                toURINode.appendChild(URINode);
            }
            node.appendChild(toURINode);
        }
        return node;
    }
}
exports.InteractionInfo = InteractionInfo;
// Remember that when you change this you need to change the encode function in graph service
InteractionInfo.counter = 0;
