import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class CallExpression implements Expression {
    constructor(
        private token: Token,
        private func: Expression,
        private args: Expression[]
    ) {}

    nodeType: AstNodeType = AstNodeType.CallExpression;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Function() {
        return this.func;
    }

    get Args() {
        return this.args;
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        return `${this.func.toString()}(${this.args
            .map((p) => p.toString())
            .join(', ')})}`;
    }
}
