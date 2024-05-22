import Parser from "./interpreter/parser.ts";

digasLanguage();

function digasLanguage() {
    const parser = new Parser();
    console.log("\n.Digas v0.1");
    while (true) {
        const input = prompt("> ")
        if(!input || input.includes("exit")){
            Deno.exit(1)
        }
        const program = parser.makeAST(input);
        console.log(program)
    }

}