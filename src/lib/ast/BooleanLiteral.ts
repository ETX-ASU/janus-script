import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class BooleanLiteral implements Expression {
    constructor(private token: Token, private value: boolean) {}

    nodeType: AstNodeType = AstNodeType.BooleanLiteral;
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
