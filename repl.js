const { Lexer, Parser, Evaluator, Environment } = require('./build/main');
const readline = require('readline');

const globalEnv = new Environment();
const evaluator = new Evaluator();

const rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('Janus> ');
rl.prompt();

const { std } = require('./repl-test-script');

rl.on('line', function (line) {
    if (line === 'dump') {
        console.log(globalEnv.toJSON());
        // console.log(JSON.stringify(globalEnv));
    } else if (line === 'watch') {
        globalEnv.addListener('change', (e) => {
            console.log('CHANGE', e);
        });
    } else if (line === 'import std;') {
        const lex = new Lexer(std);
        const parser = new Parser(lex);
        const prog = parser.parseProgram();
        if (parser.errors.length) {
            console.error(parser.errors);
        } else {
            const result = evaluator.eval(prog, globalEnv);
            console.log(result.Inspect());
        }
    } else {
        const lex = new Lexer(line);
        const parser = new Parser(lex);
        const prog = parser.parseProgram();
        if (parser.errors.length) {
            console.error(parser.errors);
        } else {
            const result = evaluator.eval(prog, globalEnv);
            console.log(result.Inspect());
        }
    }
    rl.prompt();
}).on('close', function () {
    console.log('Have a great day!');
    process.exit(0);
});
