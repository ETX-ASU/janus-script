import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class InfixExpression implements Expression {
    constructor(
        private token: Token,
        private operator?: string,
        private left?: Expression,
        private right?: Expression
    ) {}

    nodeType: AstNodeType = AstNodeType.InfixExpression;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Operator() {
        return this.operator;
    }

    set Operator(val) {
        this.operator = val;
    }

    get Left() {
        return this.left;
    }

    set Left(val) {
        this.left = val;
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
        return `(${(this.left as Expression).toString()} ${
            this.operator
        } ${(this.right as Expression).toString()})`;
    }
}
