import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class ArrayLiteral implements Expression {
    constructor(private token: Token, private elements: Expression[]) {}

    nodeType: AstNodeType = AstNodeType.ArrayLiteral;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Elements() {
        return this.elements;
    }
    set Elements(val) {
        this.elements = val;
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        return `[${this.elements.map((e) => e.toString()).join(',')}]`;
    }
}
