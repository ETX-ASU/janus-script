import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Expression, Statement } from './node';

export class ReturnStatement implements Statement {
    constructor(private token: Token, private returnValue?: Expression) {}

    nodeType: AstNodeType = AstNodeType.ReturnStatement;
    nodeCategory: AstNodeCategory = AstNodeCategory.Statement;

    get ReturnValue() {
        return this.returnValue;
    }

    set ReturnValue(val) {
        this.returnValue = val;
    }

    tokenLiteral() {
        return this.token.literal;
    }

    toString() {
        let exprStr = '';
        if (this.returnValue) {
            exprStr = this.returnValue.toString();
        }
        return `${this.token.literal} ${exprStr};`;
    }
}
