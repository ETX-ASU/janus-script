import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class IndexExpression implements Expression {
    constructor(
        private token: Token,
        private left?: Expression,
        private index?: Expression
    ) {}

    nodeType: AstNodeType = AstNodeType.IndexExpression;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Left() {
        return this.left;
    }

    set Left(val) {
        this.left = val;
    }

    get Index() {
        return this.index;
    }

    set Index(val) {
        this.index = val;
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        return `(${(this.left as Expression).toString()}[${(this
            .index as Expression).toString()}])`;
    }
}
