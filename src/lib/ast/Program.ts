import { AstNode, AstNodeCategory, AstNodeType, Statement } from './node';

export class Program implements AstNode {
    nodeType: AstNodeType = AstNodeType.Program;
    nodeCategory: AstNodeCategory = AstNodeCategory.Program;

    private statements: Statement[] = [];

    get Statements() {
        return this.statements;
    }

    public addStatement(stmt) {
        this.statements.push(stmt);
    }

    tokenLiteral() {
        if (this.statements.length) {
            return this.statements[0].tokenLiteral();
        }
        return '';
    }

    toString() {
        return this.statements.map((s) => s.toString()).join('\n');
    }
}
