import { Expression } from '../ast/node';
import { TokenType } from '../lexer/tokens';

export enum OperatorPrecedence {
    LOWEST,
    EQUALS, // ==
    LESSGREATER, // > or <
    SUM, // +
    PRODUCT, // *
    PREFIX, // -X or !X
    CALL, // function(x)
    INDEX, // array[index]
}

export const precendences = new Map<TokenType, OperatorPrecedence>();
precendences.set(TokenType.EQ, OperatorPrecedence.EQUALS);
precendences.set(TokenType.NOT_EQ, OperatorPrecedence.EQUALS);
precendences.set(TokenType.LT, OperatorPrecedence.LESSGREATER);
precendences.set(TokenType.GT, OperatorPrecedence.LESSGREATER);
precendences.set(TokenType.PLUS, OperatorPrecedence.SUM);
precendences.set(TokenType.MINUS, OperatorPrecedence.SUM);
precendences.set(TokenType.SLASH, OperatorPrecedence.PRODUCT);
precendences.set(TokenType.ASTERISK, OperatorPrecedence.PRODUCT);
precendences.set(TokenType.LPAREN, OperatorPrecedence.CALL);
precendences.set(TokenType.LBRACKET, OperatorPrecedence.INDEX);

export type prefixParseFn = () => Expression | undefined;
export type infixParseFn = (expression) => Expression | undefined;
