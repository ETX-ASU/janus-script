import test from 'ava';
import { LetStatement } from '../ast/LetStatement';
import { Lexer } from '../lexer/Lexer';
import { Parser } from './Parser';

test('let statements', (t) => {
    const lexer = new Lexer('let x = 1;');
    const parser = new Parser(lexer);

    const program = parser.parseProgram();

    t.assert(program.Statements.length === 1);
    t.assert(program.Statements[0].tokenLiteral() === 'let');
    const letStmt = program.Statements[0] as LetStatement;
    t.assert(letStmt.Name.Value === 'x');
});

test('let statment refs', (t) => {
    const script = `let y &= x;`;
    const lexer = new Lexer(script);
    const parser = new Parser(lexer);
    const prog = parser.parseProgram();

    t.assert(parser.errors.length === 0);

    t.assert(prog.Statements.length === 1);
    t.assert(prog.Statements[0].tokenLiteral() === 'let');
    const letStmt = prog.Statements[0] as LetStatement;
    t.assert(letStmt.Name.Value === 'y');
    t.assert(letStmt.Value.toString() === 'x');
    t.assert(letStmt.IsRef === true);
});
