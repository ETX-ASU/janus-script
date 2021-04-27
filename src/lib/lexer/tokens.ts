export enum TokenType {
    ILLEGAL = 'ILLEGAL',
    EOF = 'EOF',
    // Identifiers + literals
    IDENT = 'IDENT', // add, foobar, x, y, ...
    NUMBER = 'NUMBER', // 1343456
    STRING = 'STRING',
    // Operators
    ASSIGN = 'ASSIGN',
    ASSIGN_REF = 'ASSIGN_REF',
    PLUS = '+',
    MINUS = '-',
    SLASH = '/',
    BANG = '!',
    GT = '>',
    LT = '<',
    ASTERISK = '*',
    EQ = '==',
    NOT_EQ = '!=',
    CARET = '^',
    // Delimiters
    COMMA = ',',
    DOT = '.',
    SEMICOLON = ';',
    LPAREN = '(',
    RPAREN = ')',
    LBRACE = '{',
    RBRACE = '}',
    LBRACKET = '[',
    RBRACKET = ']',
    COLON = ':',
    // we need to have special annoying syntax to support handlebars identifiers
    OPEN_BLOCK = '<<',
    CLOSE_BLOCK = '>>',
    // Keywords
    FUNCTION = 'FUNCTION',
    LET = 'LET',
    IF = 'IF',
    ELSE = 'ELSE',
    RETURN = 'RETURN',
    TRUE = 'TRUE',
    FALSE = 'FALSE',
    DELETE = 'DELETE'
}

export type Token = {
    readonly type: TokenType;
    readonly literal: string;
};

export const keywords = new Map<string, TokenType>();
keywords.set('fn', TokenType.FUNCTION);
keywords.set('let', TokenType.LET);
keywords.set('if', TokenType.IF);
keywords.set('else', TokenType.ELSE);
keywords.set('return', TokenType.RETURN);
keywords.set('true', TokenType.TRUE);
keywords.set('false', TokenType.FALSE);
keywords.set('delete', TokenType.DELETE);

export const lookupIdentifier = (ident: string): TokenType => {
    if (keywords.has(ident)) {
        return keywords.get(ident) || TokenType.ILLEGAL;
    }
    return TokenType.IDENT;
};

export const isLetter = (ch) => {
    if (!ch) return false;
    return /[a-zA-Z_]/.test(ch);
};

export const isDigit = (ch) => {
    if (!ch) {
        return false;
    }
    return /[0-9]/.test(ch);
};

export const isWhitespace = (ch) => {
    return ch === ' ' || ch === '\t' || ch === '\r' || ch === '\n';
};

export const newToken = (type: TokenType, literal) => ({ type, literal });
