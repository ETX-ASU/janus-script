import test from 'ava';

import { Lexer } from './Lexer';
import { TokenType } from './tokens';

test('lexer nextToken', (t) => {
    const program = `let five = 5;
    let {shoe size} = 13;
    let under_score = 1;
    {under_score};
    { shoe size}
    let add = fn(a, b) <<
        a + b;
    >>
    let result = add(five, {shoe size});
    !-/*5;
    5 < 10 > 5;
    if (5 < 10) <<
        return false;
    >> else <<
        return true;
    >>
    
    10 == 10;
    10 != 9;
    "foo"
    "foo bar"
    [1, 2];
    {"foo": 1, "bar": 2}
    {1: {shoe size}, 2: "test"}
    |
    {|steve}
    {q|steve}
    if ({q|steve} > 2) { let {qbert$!@@#} = {shoe size}; }
    let {crazy town!} = fn({in @ sane}, y) { return [{in @ sane}, y]; }
    let {some.result of insanity} = {crazy town!}(1, 2);
    let foo = "some \\"escaped\\" quotes";
    let biz &= foo;
    let bingo = "\\sqrt[3]{}";
    let json = "{\\"json\\":1}";
    let nest = [[1,2],[3,4]];`;

    const expected = [
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'five'],
        [TokenType.ASSIGN, '='],
        [TokenType.NUMBER, '5'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'shoe size'],
        [TokenType.ASSIGN, '='],
        [TokenType.NUMBER, '13'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'under_score'],
        [TokenType.ASSIGN, '='],
        [TokenType.NUMBER, '1'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.IDENT, 'under_score'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LBRACE, '{'],
        [TokenType.IDENT, 'shoe'],
        [TokenType.IDENT, 'size'],
        [TokenType.RBRACE, '}'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'add'],
        [TokenType.ASSIGN, '='],
        [TokenType.FUNCTION, 'fn'],
        [TokenType.LPAREN, '('],
        [TokenType.IDENT, 'a'],
        [TokenType.COMMA, ','],
        [TokenType.IDENT, 'b'],
        [TokenType.RPAREN, ')'],
        [TokenType.OPEN_BLOCK, '<<'],
        [TokenType.IDENT, 'a'],
        [TokenType.PLUS, '+'],
        [TokenType.IDENT, 'b'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.CLOSE_BLOCK, '>>'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'result'],
        [TokenType.ASSIGN, '='],
        [TokenType.IDENT, 'add'],
        [TokenType.LPAREN, '('],
        [TokenType.IDENT, 'five'],
        [TokenType.COMMA, ','],
        [TokenType.IDENT, 'shoe size'],
        [TokenType.RPAREN, ')'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.BANG, '!'],
        [TokenType.MINUS, '-'],
        [TokenType.SLASH, '/'],
        [TokenType.ASTERISK, '*'],
        [TokenType.NUMBER, '5'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.NUMBER, '5'],
        [TokenType.LT, '<'],
        [TokenType.NUMBER, '10'],
        [TokenType.GT, '>'],
        [TokenType.NUMBER, '5'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.IF, 'if'],
        [TokenType.LPAREN, '('],
        [TokenType.NUMBER, '5'],
        [TokenType.LT, '<'],
        [TokenType.NUMBER, '10'],
        [TokenType.RPAREN, ')'],
        [TokenType.OPEN_BLOCK, '<<'],
        [TokenType.RETURN, 'return'],
        [TokenType.FALSE, 'false'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.CLOSE_BLOCK, '>>'],
        [TokenType.ELSE, 'else'],
        [TokenType.OPEN_BLOCK, '<<'],
        [TokenType.RETURN, 'return'],
        [TokenType.TRUE, 'true'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.CLOSE_BLOCK, '>>'],
        [TokenType.NUMBER, '10'],
        [TokenType.EQ, '=='],
        [TokenType.NUMBER, '10'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.NUMBER, '10'],
        [TokenType.NOT_EQ, '!='],
        [TokenType.NUMBER, '9'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.STRING, 'foo'],
        [TokenType.STRING, 'foo bar'],
        [TokenType.LBRACKET, '['],
        [TokenType.NUMBER, '1'],
        [TokenType.COMMA, ','],
        [TokenType.NUMBER, '2'],
        [TokenType.RBRACKET, ']'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LBRACE, '{'],
        [TokenType.STRING, 'foo'],
        [TokenType.COLON, ':'],
        [TokenType.NUMBER, '1'],
        [TokenType.COMMA, ','],
        [TokenType.STRING, 'bar'],
        [TokenType.COLON, ':'],
        [TokenType.NUMBER, '2'],
        [TokenType.RBRACE, '}'],
        [TokenType.LBRACE, '{'],
        [TokenType.NUMBER, '1'],
        [TokenType.COLON, ':'],
        [TokenType.IDENT, 'shoe size'],
        [TokenType.COMMA, ','],
        [TokenType.NUMBER, '2'],
        [TokenType.COLON, ':'],
        [TokenType.STRING, 'test'],
        [TokenType.RBRACE, '}'],
        [TokenType.ILLEGAL, '|'],
        [TokenType.LBRACE, '{'],
        [TokenType.ILLEGAL, '|'],
        [TokenType.IDENT, 'steve'],
        [TokenType.RBRACE, '}'],
        [TokenType.IDENT, 'q|steve'],
        [TokenType.IF, 'if'],
        [TokenType.LPAREN, '('],
        [TokenType.IDENT, 'q|steve'],
        [TokenType.GT, '>'],
        [TokenType.NUMBER, '2'],
        [TokenType.RPAREN, ')'],
        [TokenType.LBRACE, '{'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'qbert$!@@#'],
        [TokenType.ASSIGN, '='],
        [TokenType.IDENT, 'shoe size'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.RBRACE, '}'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'crazy town!'],
        [TokenType.ASSIGN, '='],
        [TokenType.FUNCTION, 'fn'],
        [TokenType.LPAREN, '('],
        [TokenType.IDENT, 'in @ sane'],
        [TokenType.COMMA, ','],
        [TokenType.IDENT, 'y'],
        [TokenType.RPAREN, ')'],
        [TokenType.LBRACE, '{'],
        [TokenType.RETURN, 'return'],
        [TokenType.LBRACKET, '['],
        [TokenType.IDENT, 'in @ sane'],
        [TokenType.COMMA, ','],
        [TokenType.IDENT, 'y'],
        [TokenType.RBRACKET, ']'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.RBRACE, '}'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'some.result of insanity'],
        [TokenType.ASSIGN, '='],
        [TokenType.IDENT, 'crazy town!'],
        [TokenType.LPAREN, '('],
        [TokenType.NUMBER, '1'],
        [TokenType.COMMA, ','],
        [TokenType.NUMBER, '2'],
        [TokenType.RPAREN, ')'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'foo'],
        [TokenType.ASSIGN, '='],
        [TokenType.STRING, 'some "escaped" quotes'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'biz'],
        [TokenType.ASSIGN_REF, '&='],
        [TokenType.IDENT, 'foo'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'bingo'],
        [TokenType.ASSIGN, '='],
        [TokenType.STRING, '\\sqrt[3]{}'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'json'],
        [TokenType.ASSIGN, '='],
        [TokenType.STRING, '{"json":1}'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.LET, 'let'],
        [TokenType.IDENT, 'nest'],
        [TokenType.ASSIGN, '='],
        [TokenType.LBRACKET, '['],
        [TokenType.LBRACKET, '['],
        [TokenType.NUMBER, '1'],
        [TokenType.COMMA, ','],
        [TokenType.NUMBER, '2'],
        [TokenType.RBRACKET, ']'],
        [TokenType.COMMA, ','],
        [TokenType.LBRACKET, '['],
        [TokenType.NUMBER, '3'],
        [TokenType.COMMA, ','],
        [TokenType.NUMBER, '4'],
        [TokenType.RBRACKET, ']'],
        [TokenType.RBRACKET, ']'],
        [TokenType.SEMICOLON, ';'],
        [TokenType.EOF, '']
    ];

    const lexer = new Lexer(program);
    expected.forEach(([expectedType, expectedLiteral]) => {
        const actual = lexer.nextToken();
        t.assert(actual.type === expectedType, `expected type: ${actual.type} to be ${expectedType}`);
        t.assert(actual.literal === expectedLiteral, `expected literal: ${actual.literal} to be ${expectedLiteral}`);
    });
});