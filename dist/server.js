#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const completion_1 = require("./completion");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
const node_1 = require("vscode-languageserver/node");
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
const triggerCharacters = [
    ">",
    ")",
    "]",
    "}",
    "@",
    "*",
    "$",
    "+",
    // alpha
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    // num
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
];
connection.onInitialize(function () {
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: triggerCharacters,
            },
        },
    };
    return result;
});
const documentSettings = new Map();
documents.onDidClose(function (e) {
    documentSettings.delete(e.document.uri);
});
connection.onCompletion(function (textDocumentPosition) {
    try {
        return (0, completion_1.default)(textDocumentPosition, documents);
    }
    catch (error) {
        connection.console.log(`ERR: ${error}`);
    }
    return [];
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map