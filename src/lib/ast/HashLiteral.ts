import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression } from './node';

export class HashLiteral implements Expression {
    constructor(
        private token: Token,
        private pairs: Map<Expression, Expression>
    ) {}

    nodeType: AstNodeType = AstNodeType.HashLiteral;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Pairs() {
        return this.pairs;
    }

    setPair(key, value) {
        this.pairs.set(key, value);
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        const pairs: string[] = [];
        this.pairs.forEach((value, key) => {
            pairs.push(`${key.toString()}:${value.toString()}`);
        });
        return `{${pairs.join(',')}}`;
    }
}
