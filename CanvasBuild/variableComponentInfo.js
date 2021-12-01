"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableComponentInfo = void 0;
class VariableComponentInfo {
    constructor(cellID) {
        this.variants = [];
        if (cellID)
            this.cellID = cellID;
    }
    makeCopy() {
        const copy = new VariableComponentInfo(this.cellID);
        copy.uri = this.uri;
        copy.operator = this.operator;
        for (let variant of this.variants) {
            copy.variants.push(variant.makeCopy());
        }
        return copy;
    }
    addVariant(info) {
        // avoid duplicates
        for (let variant of this.variants) {
            if (variant.uri == info.uri)
                return;
        }
        this.variants.push(info);
    }
}
exports.VariableComponentInfo = VariableComponentInfo;
