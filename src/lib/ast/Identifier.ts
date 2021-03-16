import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class Identifier implements Expression {
    constructor(private token: Token, private value: string) {}
    nodeType: AstNodeType = AstNodeType.Identifier;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Value() {
        return this.value;
    }

    tokenLiteral() {
        return this.token.literal;
    }

    toString() {
        return this.value;
    }
}
