const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const types = require('@babel/types');
const fs = require('fs');

/**
 * 第一步 初始化
 */
const init = {
    Program(path) {
        var exp_path0 = path.get("body.0");   // Vwtrj.$_AK = ...
        var exp_path1 = path.get("body.1");   // Vwtrj.$_BS = ...
        var exp_path2 = path.get("body.2");   // Vwtrj.$_CV = ...
        var exp_path3 = path.get("body.3");   // Vwtrj.$_DD = ...
        var func_path   = path.get("body.4");  // function Vwtrj() {}

        global_eval_code = exp_path0 + "\n" + exp_path1 + "\n" +
                           exp_path2 + "\n" + exp_path3 + "\n" +
                           func_path + "\n";
        eval(global_eval_code);              // 在插件里执行，Vwtrj 活了

        init_funcName   = func_path.node.id.name;                                       // "Vwtrj"
        decrypted_string_funcName  = exp_path2.node.expression.left.property.name;      // "$_CV"
        restore_state_value_funcName = exp_path3.node.expression.left.property.name;    // "$_DD"

        globalThis[init_funcName] = eval(init_funcName);   // 挂到 globalThis

        path.node.body = [path.node.body[path.node.body.length - 1]];   // 只保留最后一条（业务代码），把前 5 条初始化语句删掉
    }
}
/**
 * 第二步 常量还原-记录别名、删除三连声明
 */
// 解密字符串
var decrypted_string_func = function (arg) {
    let funcName1 = init_funcName + "." + decrypted_string_funcName;   // "Vwtrj.$_CV"
    let value1 = eval(funcName1 + "(" + arg + ")");
    return value1;
};
// 恢复状态值
var restore_state_value_func = function (arg1, arg2) {
    let funcName2 = init_funcName + "." + restore_state_value_funcName;  // "Vwtrj.$_DD"
    let value2 = eval(funcName2 + "()[" + arg1 + "][" + arg2 + "]");
    return value2;
};
var name_Array = []
const record_alias = {
    VariableDeclaration(path){
        var node = path.node;
        if (node.declarations == undefined
            || node.declarations.length != 3
            || node.declarations[0].init == undefined
            || node.declarations[0].init.property == undefined)
            return;
        if (node.declarations[0].init.property.name != decrypted_string_funcName) return;  // 必须是 Vwtrj.$_CV
        let name1 = node.declarations[0].id.name;   // $_CJDb
        let name2 = node.declarations[2].id.name;   // $_CJET
        name_Array.push(name1, name2);
    }
}
const delete_triple_statement = {
    VariableDeclaration(path){
        var node = path.node;
        var arrNode = node.declarations;
        for (var i = 0; i < arrNode.length; i++) {
            if (is_direct_call(arrNode[i]) == true) {   // 这个 declarator 的 init 是 Vwtrj.$_CV
                path.remove();
                var nextPath = path.getNextSibling();
                nextPath.remove();                  // 删下一条（$_CJCe.shift() 之类）
                var nnextPath = nextPath.getNextSibling();
                nnextPath.remove();                 // 删下下一条（var $_CJFH = ...）
                break;
            }
        }
    }
}
/**
 * 第三步 替换调用-直接、间接
 */
// 判断是否为直接调用
function is_direct_call(declaration) {
    if (declaration.init == undefined || declaration.init.property == undefined)
        return;
    if (declaration.init.property.name == decrypted_string_funcName)
        return true;
}
// path转Literal节点
function path_to_literal(path, value) {
    switch (typeof value) {
        case 'boolean':
            path.replaceWith(types.booleanLiteral(value));
            break;
        case 'string':
            path.replaceWith(types.stringLiteral(value));
            break;
        case 'number':
            path.replaceWith(types.numericLiteral(value));
            break;
        default:
            console.log("出现其他类型" + value + "类型:" + typeof value);
            console.log(value);
            break
    }
}
const replace_alias_call = {
    CallExpression(path) {
        var node = path.node;
        if (node.callee == undefined || node.callee.name == undefined)
            return;
        if (name_Array.indexOf(node.callee.name) == -1)   // 不在别名表里
            return;
        let arg = node.arguments[0].value;
        let value = decrypted_string_func(arg);           // Vwtrj.$_CV(arg)
        path_to_literal(path, value);                     // 替换成字面量
    }
}
const delete_direct_call = {
    CallExpression(path) {
        var node = path.node;
        if (node.callee == undefined || node.callee.property == undefined) return;
        if (node.callee.property.name == decrypted_string_funcName) {   // 直接调 Vwtrj.$_CV(...)
            let arg = node.arguments[0].value;
            let value = decrypted_string_func(arg);
            path_to_literal(path, value);
        }
    }
}
/**
 * 第四步 常量还原-unicode转字符串
 */
const restore_constant = {
    StringLiteral(path) {
        delete path.node.extra;
    }
}
/**
 * 第五步 展开控制流平坦化
 */
const flatten_control_flow = {
    ForStatement(path) {
        var node = path.node;
        var prevSiblingPath = path.getPrevSibling();    // 找 for 前面的初始状态声明 var $_DCGCG = Vwtrj.$_DD()[12][19];
        if (prevSiblingPath.container == undefined ||
            prevSiblingPath.container[0] == undefined ||
            prevSiblingPath.container[0].declarations == undefined ||
            prevSiblingPath.container[0].declarations[0].init == undefined ||
            prevSiblingPath.container[0].declarations[0].init.object == undefined ||
            prevSiblingPath.container[0].declarations[0].init.object.object == undefined
        )
            return;
        if (prevSiblingPath.container[0].declarations[0].init.object.object.callee.property.name != restore_state_value_funcName)   // $_DD
            return;
        var body = node.body.body;
        if (!types.isSwitchStatement(body[0]) || !types.isIdentifier(body[0].discriminant))
            return;

        var swithStm = body[0];

        var arg = prevSiblingPath.container[0].declarations[0].init;
        let init_arg_f = arg.object.property.value;
        let init_arg_s = arg.property.value;

        var init_arg = restore_state_value_func(init_arg_f, init_arg_s);
        let break_arg_f = node.test.right.object.property.value;
        let break_arg_s = node.test.right.property.value;
        var break_init = restore_state_value_func(break_arg_f, break_arg_s);

        var caseList = swithStm.cases;
        var resultBody = [];

        for (var i = 0; i < caseList.length; i++) {
            for (; init_arg !== break_init;) {
                var case_arg_f = caseList[i].test.object.property.value;
                var case_arg_s = caseList[i].test.property.value;
                var case_init = restore_state_value_func(case_arg_f, case_arg_s);
                if (init_arg == case_init) {
                    var targetBody = caseList[i].consequent;
                    if (types.isBreakStatement(targetBody[targetBody.length - 1]) &&
                        types.isExpressionStatement(targetBody[targetBody.length - 2]) &&
                        targetBody[targetBody.length - 2].expression.right.object.object.callee.object.name == init_funcName) {
                        var change_arg_f = targetBody[targetBody.length - 2].expression.right.object.property.value;
                        var change_arg_s = targetBody[targetBody.length - 2].expression.right.property.value;
                        init_arg = restore_state_value_func(change_arg_f, change_arg_s);
                        targetBody.pop();
                        targetBody.pop();
                    } else if (types.isBreakStatement(targetBody[targetBody.length - 1])) {
                        targetBody.pop();
                    }
                    resultBody = resultBody.concat(targetBody);
                    break;
                } else {
                    break;
                }

            }

        }
        path.replaceWithMultiple(resultBody);
        prevSiblingPath.remove();
    }
}

function main() {
    let encode_file = './slide.7.9.3.js', decode_file = './3_slide.js';
    let js_code = fs.readFileSync(encode_file, {encoding: 'utf-8'});
    let ast = parser.parse(js_code);

    //这里把每个visitor放到外面去了是为了整齐 实际写traverse遍历规则时直接在traverse里面写有代码提示更方便
    traverse(ast, init);                    // 初始化
    traverse(ast, record_alias);            // 记录别名
    traverse(ast, delete_triple_statement); // 删掉三连声明
    traverse(ast, delete_direct_call);      // 替换直接调用
    traverse(ast, replace_alias_call);      // 替换别名调用
    traverse(ast, restore_constant);        // 常量恢复(去掉 Unicode 转义)
    traverse(ast, flatten_control_flow);    // 展开控制流平坦化

    let {code} = generator(ast, opts = {jsescOption:{"minimal":true}});
    fs.writeFile(decode_file, code, (err) => {});
}
main();

// const MAX_STEPS = 10000;   // 防死循环
//
// // 判断某个节点是不是 Vwtrj.$_DD()[f][s]
// function is_state_matrix_expr(node) {
//     return types.isMemberExpression(node)
//         && types.isMemberExpression(node.object)
//         && types.isCallExpression(node.object.object)
//         && types.isMemberExpression(node.object.object.callee)
//         && types.isIdentifier(node.object.object.callee.object)
//         && types.isIdentifier(node.object.object.callee.property)
//         && types.isNumericLiteral(node.object.property)
//         && types.isNumericLiteral(node.property);
// }
//
// // 从 Vwtrj.$_DD()[f][s] 求状态值
// function read_state(node) {
//     const f = node.object.property.value;
//     const s = node.property.value;
//     return restore_state_value_func(f, s);
// }
//
// const flatten_control_flow = {
//     ForStatement(path) {
//         const node = path.node;
//
//         // 1) 结构检查：for(;;) 不行，body 必须是 BlockStatement
//         if (!node.test) return;
//         if (!types.isBlockStatement(node.body)) return;
//         if (!types.isBinaryExpression(node.test, { operator: '!==' })) return;
//
//         // 2) test 两边：一边是状态变量标识符，一边是 Vwtrj.$_DD()[f][s]
//         let stateVarName, breakNode;
//         if (types.isIdentifier(node.test.left) && is_state_matrix_expr(node.test.right)) {
//             stateVarName = node.test.left.name;
//             breakNode = node.test.right;
//         } else if (types.isIdentifier(node.test.right) && is_state_matrix_expr(node.test.left)) {
//             stateVarName = node.test.right.name;
//             breakNode = node.test.left;
//         } else {
//             return;
//         }
//         if (breakNode.object.object.callee.property.name !== restore_state_value_funcName) return;
//
//         // 3) body 第一条必须是 switch(stateVarName)
//         const switchStm = node.body.body[0];
//         if (!types.isSwitchStatement(switchStm)) return;
//         if (!types.isIdentifier(switchStm.discriminant)) return;
//         if (switchStm.discriminant.name !== stateVarName) return;
//
//         // 4) 前一条兄弟必须是 var stateVarName = Vwtrj.$_DD()[f][s]
//         const prev = path.getPrevSibling();
//         if (!prev.node || prev.removed) return;
//         if (!types.isVariableDeclaration(prev.node) || prev.node.declarations.length !== 1) return;
//         const decl = prev.node.declarations[0];
//         if (!types.isIdentifier(decl.id) || decl.id.name !== stateVarName) return;
//         if (!decl.init || !is_state_matrix_expr(decl.init)) return;
//         if (decl.init.object.object.callee.property.name !== restore_state_value_funcName) return;
//
//         // 5) 求初始状态和结束状态
//         let initState, breakState;
//         try {
//             initState  = read_state(decl.init);
//             breakState = read_state(breakNode);
//         } catch (e) {
//             return;
//         }
//         if (initState === undefined || breakState === undefined) return;
//
//         // 6) 建立 state -> case 的映射（跳过 default）
//         const caseMap = new Map();
//         for (const c of switchStm.cases) {
//             if (!c.test || !is_state_matrix_expr(c.test)) continue;
//             let v;
//             try { v = read_state(c.test); } catch (e) { continue; }
//             if (v === undefined) continue;
//             caseMap.set(v, c);
//         }
//
//         // 7) 线性展开状态机
//         const resultBody = [];
//         let current = initState;
//         let steps = 0;
//         let ok = true;
//
//         while (current !== breakState) {
//             if (++steps > MAX_STEPS) { ok = false; break; }
//             const caseNode = caseMap.get(current);
//             if (!caseNode) { ok = false; break; }
//
//             // 复制 consequent，避免改原 AST
//             let body = caseNode.consequent.slice();
//
//             // 去掉末尾的状态跳转 + break
//             let nextState = breakState;   // 默认：没有跳转就视为结束
//             if (body.length >= 2) {
//                 const last = body[body.length - 1];
//                 const secondLast = body[body.length - 2];
//                 if (types.isBreakStatement(last)
//                     && types.isExpressionStatement(secondLast)
//                     && types.isAssignmentExpression(secondLast.expression)
//                     && types.isIdentifier(secondLast.expression.left)
//                     && secondLast.expression.left.name === stateVarName
//                     && is_state_matrix_expr(secondLast.expression.right)
//                     && secondLast.expression.right.object.object.callee.property.name === restore_state_value_funcName) {
//                     try { nextState = read_state(secondLast.expression.right); } catch (e) { ok = false; break; }
//                     if (nextState === undefined) { ok = false; break; }
//                     body = body.slice(0, -2);
//                 } else if (types.isBreakStatement(last)) {
//                     body = body.slice(0, -1);
//                 }
//             } else if (body.length === 1 && types.isBreakStatement(body[0])) {
//                 body = [];
//             }
//
//             resultBody.push(...body);
//             current = nextState;
//         }
//
//         if (!ok) return;   // 展开失败，保持原样
//
//         // 8) 先删 prev，再替换 for
//         prev.remove();
//         path.replaceWithMultiple(resultBody);
//     }
// };
