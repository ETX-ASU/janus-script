import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class NumberLiteral implements Expression {
    constructor(private token: Token, private value: number) {}
    nodeType: AstNodeType = AstNodeType.NumberLiteral;
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
