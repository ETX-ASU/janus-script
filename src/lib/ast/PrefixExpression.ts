import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class PrefixExpression implements Expression {
    constructor(
        private token: Token,
        private operator?: string,
        private right?: Expression
    ) {}

    nodeType: AstNodeType = AstNodeType.PrefixExpression;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Operator() {
        return this.operator;
    }

    set Operator(val) {
        this.operator = val;
    }

    get Right() {
        return this.right;
    }

    set Right(val) {
        this.right = val;
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        return `(${this.operator}${(this.right as Expression).toString()})`;
    }
}
