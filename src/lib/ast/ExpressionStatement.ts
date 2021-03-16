import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression, Statement } from './node';

export class ExpressionStatement implements Statement {
    constructor(private token: Token, private expression?: Expression) {}

    nodeType: AstNodeType = AstNodeType.ExpressionStatement;
    nodeCategory: AstNodeCategory = AstNodeCategory.Statement;

    get Token() {
        return this.token;
    }

    get Expression() {
        return this.expression as Expression;
    }

    set Expression(val) {
        this.expression = val;
    }

    tokenLiteral() {
        return this.expression?.tokenLiteral() || '';
    }

    toString() {
        if (this.expression) {
            return this.expression.toString();
        }
        return '';
    }
}
