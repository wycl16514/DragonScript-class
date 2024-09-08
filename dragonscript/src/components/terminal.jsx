import React from "react"
import Terminal from 'react-console-emulator'
import Scanner from '../compiler/scanner/token'
import ArithmeticParser from "../compiler/parser/arithmetic_parser/arithmetic_parser"
import RecursiveDescentParser from "../compiler/parser/recursive_descent_parser"
import TreeAdjustVisitor from "../compiler/evaluator/tree_adjust_visitor"
import Tree from 'react-d3-tree';
import Intepreter from "../compiler/evaluator/intepreter"
import { useState } from 'react';
import Resolver from "../compiler/evaluator/resolver"

const TerminalEmulator = () => {
    const [parseTree, setParseTree] = useState(undefined)
    const [showTerminal, setShowTerminal] = useState(true)
    const printToken = (token) => {
        return `token object: \n{
            lexeme: "${token.lexeme}",
            token: "${token.token}",
            line: "${token.line}"
        }\n
        `
    }
    const commands = {
        recursiveparsetree: {
            description: "creating a parse tree",
            usage: "usage recursiveparsetree <string>",
            fn: (...args) => {
                const parser = new RecursiveDescentParser(args.join(' '))

                //try {
                const root = parser.parse()
                const treeAdjustVisitor = new TreeAdjustVisitor()
                root.accept(treeAdjustVisitor)
                let resolver = new Resolver()
                root.accept(resolver)
                // //debugging 
                let intepreter = new Intepreter()
                root.accept(intepreter)

                setParseTree(root)
                setShowTerminal(false)
                // } catch (e) {
                //     console.log(`recursiveparsetree error: ${e}`)
                //}
            }

        },
        arithparsetree: {
            description: "creating a arithmetic parse tree with only + and *",
            usage: "usage arighparsetree <string>",
            fn: (...args) => {
                const parser = new ArithmeticParser(args.join(' '))
                let res = {}
                try {
                    res = parser.parse()
                    setParseTree(res.parseTree)
                    setShowTerminal(false)
                }
                catch (err) {
                    res.parseResult = err.message
                }
                return res.parseResult
            }

        },
        arithparse: {
            description: "parsing a arithmetic expression with only + and *",
            usage: "arithparse <string>",
            fn: (...args) => {
                const parser = new ArithmeticParser(args.join(' '))
                let res = {}
                try {
                    res = parser.parse()
                }
                catch (err) {
                    res.parseResult = err.message
                }

                return res.parseResult
            }
        },
        lexing: {
            desription: "lexing a passed string",
            usage: "lexing <string>",
            fn: (...args) => {
                const scanner = new Scanner(args.join(' '))
                let exe_result = ''
                while (true) {
                    const token_obj = scanner.scan()
                    if (token_obj.token !== Scanner.EOF) {
                        exe_result += printToken(token_obj)
                    } else {
                        break
                    }
                }
                return exe_result
            }
        }
    }

    return (
        <div>
            <div>
                {
                    showTerminal && <Terminal
                        commands={commands}
                        welcomeMessage={'Welcome to dragon script terminal'}
                        promptLabel={"me@dragon:~$"}
                    >
                    </Terminal>
                }
            </div>

            {
                parseTree && (
                    <div id="treeWrapper" style={{
                        paddingLeft: '20',
                        width: '1000em', height: '1000em'
                    }}>

                        <Tree data={parseTree} />

                    </div>
                )
            }

        </div>
    )
}

export default TerminalEmulator;