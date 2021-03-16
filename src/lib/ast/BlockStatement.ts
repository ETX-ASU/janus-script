import { Token } from '../lexer/tokens';

import { AstNodeCategory, AstNodeType, Statement } from './node';

export class BlockStatement implements Statement {
    constructor(private token: Token, private statements: Statement[] = []) {}

    nodeType: AstNodeType = AstNodeType.BlockStatement;
    nodeCategory: AstNodeCategory = AstNodeCategory.Statement;

    get Statements() {
        return this.statements;
    }

    set Statements(val) {
        this.statements = val;
    }

    addStatement(stmt) {
        this.statements.push(stmt);
    }

    tokenLiteral(): string {
        return this.token.literal;
    }

    toString(): string {
        return this.statements.map((s) => s.toString()).join('\n');
    }
}
