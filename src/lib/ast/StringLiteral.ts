import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class StringLiteral implements Expression {
    constructor(private token: Token, private value: string) {}

    nodeType: AstNodeType = AstNodeType.StringLiteral;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Value() {
        return this.value;
    }
    set Value(val) {
        this.value = val;
    }

    tokenLiteral() {
        return this.token.literal;
    }

    toString() {
        return this.token.literal;
    }
}
