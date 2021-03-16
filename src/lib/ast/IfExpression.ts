import { Token } from '../lexer/tokens';

import { BlockStatement } from './BlockStatement';
import { AstNodeCategory, AstNodeType, Expression } from './node';

export class IfExpression implements Expression {
    constructor(
        private token: Token,
        private condition?: Expression,
        private consequence?: BlockStatement,
        private alternative?: BlockStatement
    ) {}

    nodeType: AstNodeType = AstNodeType.IfExpression;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Condition() {
        return this.condition;
    }

    set Condition(val) {
        this.condition = val;
    }

    get Consequence() {
        return this.consequence;
    }

    set Consequence(val) {
        this.consequence = val;
    }

    get Alternative() {
        return this.alternative;
    }

    set Alternative(val) {
        this.alternative = val;
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        let str = `if
        ${(this.condition as Expression).toString()}
        ${(this.consequence as BlockStatement).toString()}
        `;

        if (this.alternative) {
            str += `else ${this.alternative.toString()}`;
        }

        return str;
    }
}
