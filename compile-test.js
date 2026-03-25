const { compile } = require('@noir-lang/noir_wasm');
const fs = require('fs');
const path = require('path');

async function main() {
    console.log("Compiling custody_proof...");
    try {
        const entryPoint = path.resolve(__dirname, 'circuits/custody_proof', 'src', 'main.nr');
        // Let's print the compile function to see what it expects
        // console.log(compile.toString());
        const compiled = compile(entryPoint);
        
        const targetDir = path.resolve(__dirname, 'circuits/custody_proof/target');
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        
        fs.writeFileSync(
            path.join(targetDir, 'custody_proof.json'), 
            JSON.stringify(compiled, null, 2)
        );
        console.log("Successfully compiled custody_proof.json");
    } catch (e) {
        console.error("Compilation failed:", e);
    }
}

main();
