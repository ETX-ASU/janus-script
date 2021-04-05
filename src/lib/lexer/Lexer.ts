import {
    isDigit,
    isLetter,
    isWhitespace,
    lookupIdentifier,
    newToken,
    Token,
    TokenType,
} from './tokens';

export class Lexer {
    private position = 0;
    private readPosition = 0;
    private ch: string | null = null;

    constructor(private readonly input: string) {
        this.readChar();
    }

    private readChar() {
        if (this.readPosition >= this.input.length) {
            this.ch = null;
        } else {
            this.ch = this.input[this.readPosition] || null;
        }
        this.position = this.readPosition;
        this.readPosition++;
    }

    private peekChar(): string | null {
        if (this.readPosition >= this.input.length) {
            return null;
        }
        return this.input[this.readPosition];
    }

    public nextToken(): Token {
        if (!this.ch) {
            return newToken(TokenType.EOF, '');
        }

        let token: Token;

        this.skipWhitespace();

        switch (this.ch) {
            case '=':
                if (this.peekChar() === '=') {
                    this.readChar();
                    token = newToken(TokenType.EQ, '==');
                } else {
                    token = newToken(TokenType.ASSIGN, this.ch);
                }
                break;
            case '!':
                if (this.peekChar() === '=') {
                    this.readChar();
                    token = newToken(TokenType.NOT_EQ, '!=');
                } else {
                    token = newToken(TokenType.BANG, this.ch);
                }
                break;
            case '&':
                if (this.peekChar() === '=') {
                    this.readChar();
                    token = newToken(TokenType.ASSIGN_REF, '&=');
                } else {
                    // TODO: logical AND &&
                    token = newToken(TokenType.ILLEGAL, this.ch);
                }
                break;
            case ';':
                token = newToken(TokenType.SEMICOLON, this.ch);
                break;
            case ':':
                token = newToken(TokenType.COLON, this.ch);
                break;
            case '(':
                token = newToken(TokenType.LPAREN, this.ch);
                break;
            case ')':
                token = newToken(TokenType.RPAREN, this.ch);
                break;
            case ',':
                token = newToken(TokenType.COMMA, this.ch);
                break;
            case '+':
                token = newToken(TokenType.PLUS, this.ch);
                break;
            case '-':
                token = newToken(TokenType.MINUS, this.ch);
                break;
            case '*':
                token = newToken(TokenType.ASTERISK, this.ch);
                break;
            case '/':
                token = newToken(TokenType.SLASH, this.ch);
                break;
            case '>':
                if (this.peekChar() === '>') {
                    this.readChar();
                    token = newToken(TokenType.CLOSE_BLOCK, '>>');
                } else {
                    token = newToken(TokenType.GT, this.ch);
                }
                break;
            case '<':
                if (this.peekChar() === '<') {
                    this.readChar();
                    token = newToken(TokenType.OPEN_BLOCK, '<<');
                } else {
                    token = newToken(TokenType.LT, this.ch);
                }
                break;
            case '{':
                if (isLetter(this.peekChar())) {
                    token = newToken(TokenType.IDENT, this.readBlockIdentifier());
                } else {
                    token = newToken(TokenType.LBRACE, this.ch);
                }
                break;
            case '}':
                token = newToken(TokenType.RBRACE, this.ch);
                break;
            case '[':
                token = newToken(TokenType.LBRACKET, this.ch);
                break;
            case ']':
                token = newToken(TokenType.RBRACKET, this.ch);
                break;
            case '"':
                token = newToken(TokenType.STRING, this.readString());
                break;
            case null:
                token = newToken(TokenType.EOF, '');
                break;
            default:
                if (isLetter(this.ch)) {
                    const identifier = this.readIdentifier();
                    token = newToken(lookupIdentifier(identifier), identifier);
                    return token;
                } else if (isDigit(this.ch)) {
                    const number = this.readNumber();
                    token = newToken(TokenType.NUMBER, number);
                    return token;
                } else {
                    token = newToken(TokenType.ILLEGAL, this.ch);
                }
        }
        this.readChar();
        return token;
    }

    private skipWhitespace() {
        while (isWhitespace(this.ch)) {
            // console.log('WHT', this.ch);
            this.readChar();
        }
    }

    private readString() {
        const startPos = this.position + 1;

        this.readChar();

        while (this.ch !== '"' && this.ch !== null) {
            if (this.ch === '\\') {
                if (this.peekChar() === '"' || this.peekChar() === '\\') {
                    this.readChar();
                }
            }
            this.readChar();
        }
        return this.input.substring(startPos, this.position)
        .replace(/\\"/g, '"')
        .replace(/\\\\/g, '\\');
    }

    private readNumber() {
        const startPos = this.position;
        do {
            this.readChar();
        } while (isDigit(this.ch) || this.ch === '.');
        // debugger;
        return this.input.substring(startPos, this.position);
    }

    private readIdentifier() {
        const startPos = this.position;
        while (isLetter(this.ch) || this.ch === '.') {
            // console.log('ID', this.ch);
            this.readChar();
        }
        return this.input.substring(startPos, this.position);
    }

    private readBlockIdentifier() {
        const startPos = this.position + 1;
        while (this.ch !== '}' && this.ch !== null) {
            // console.log('SPR_ID', this.ch);
            this.readChar();
        }
        return this.input.substring(startPos, this.position);
    }
}
