import { Token } from '../lexer/tokens';

import { BlockStatement } from './BlockStatement';
import { Identifier } from './Identifier';
import { AstNodeCategory, AstNodeType, Expression } from './node';

export class FunctionLiteral implements Expression {
    constructor(
        private token: Token,
        private parameters: Identifier[] = [],
        private body?: BlockStatement
    ) {}

    nodeType: AstNodeType = AstNodeType.FunctionLiteral;
    nodeCategory: AstNodeCategory = AstNodeCategory.Expression;

    get Parameters() {
        return this.parameters;
    }

    set Parameters(val) {
        if (Array.isArray(val)) {
            this.parameters = val;
        } else {
            this.parameters = [];
        }
    }

    get Body() {
        return this.body;
    }

    set Body(val) {
        this.body = val;
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        return `${this.tokenLiteral()}(${this.parameters
            .map((p) => p.toString())
            .join(', ')})
        ${(this.body as BlockStatement).toString()}`;
    }
}
