"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const emmet_1 = require("emmet");
const node_1 = require("vscode-languageserver/node");
const syntaxes = {
    markup: ["html", "xml", "xsl", "jsx", "js", "pug", "slim", "haml", "hbs",
        "handlebars"],
    stylesheet: ["css", "sass", "scss", "less", "sss", "stylus"],
};
function parseLanguage(language) {
    if (language == "javascriptreact" || language == "typescriptreact")
        language = "jsx";
    if (language === "javascript")
        language = "js";
    return language;
}
function isMarkupEmmet(language) {
    const markupSyntaxes = syntaxes.markup;
    language = parseLanguage(language);
    if (markupSyntaxes.some((filetype) => language == filetype)) {
        return true;
    }
    return false;
}
function getSyntax(language) {
    const availableSyntaxes = [...syntaxes.markup, ...syntaxes.stylesheet];
    language = parseLanguage(language);
    if (availableSyntaxes.some((syntax) => syntax == language)) {
        return language;
    }
    return undefined;
}
function getExtracted(language, line, character) {
    let extracted;
    if (isMarkupEmmet(language)) {
        extracted = (0, emmet_1.extract)(line, character);
    }
    else {
        extracted = (0, emmet_1.extract)(line, character, { type: "stylesheet" });
    }
    if ((extracted === null || extracted === void 0 ? void 0 : extracted.abbreviation) == undefined) {
        throw "failed to parse line";
    }
    return {
        left: extracted.start,
        right: extracted.end,
        abbreviation: extracted.abbreviation,
        location: extracted.location,
    };
}
function getExpanded(language, abbreviation) {
    let expanded;
    const options = {
        "output.field": (index, placeholder) => "${" + index + (placeholder && ":" + placeholder) + "}",
    };
    const syntax = getSyntax(language);
    if (isMarkupEmmet(language)) {
        expanded = (0, emmet_1.default)(abbreviation, { options, syntax });
    }
    else {
        expanded = (0, emmet_1.default)(abbreviation, { type: "stylesheet", options, syntax });
    }
    return expanded;
}
function complete(textDocsPosition, documents) {
    const docs = documents.get(textDocsPosition.textDocument.uri);
    if (!docs)
        throw "failed to find document";
    const languageId = docs.languageId;
    const content = docs.getText();
    const linenr = textDocsPosition.position.line;
    const line = String(content.split(/\r?\n/g)[linenr]);
    const character = textDocsPosition.position.character;
    const { left, right, abbreviation } = getExtracted(languageId, line, character);
    const textResult = getExpanded(languageId, abbreviation);
    const range = {
        start: {
            line: linenr,
            character: left,
        },
        end: {
            line: linenr,
            character: right,
        },
    };
    return [
        {
            insertTextFormat: node_1.InsertTextFormat.Snippet,
            label: abbreviation,
            detail: abbreviation,
            documentation: textResult,
            textEdit: {
                range,
                newText: textResult,
            },
            kind: node_1.CompletionItemKind.Snippet,
            data: {
                range,
                textResult,
            },
        },
    ];
}
exports.default = complete;
//# sourceMappingURL=completion.js.map