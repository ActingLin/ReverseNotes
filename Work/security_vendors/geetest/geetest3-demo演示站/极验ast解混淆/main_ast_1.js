const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generator = require('@babel/generator').default;
const t = require('@babel/types');
const fs = require('fs');

let encode_file = './fullpage.9.2.0-guwyxh.js', decode_file = './3_1.js';

let js_code = fs.readFileSync(encode_file, {encoding: 'utf-8'});
let ast = parser.parse(js_code);


function gt_decrypt_str(AST) {
    // 解密函数 执行环境 相关代码拼接
    let decrypt_code_str = "";
    // 挂载解密函数的节点
    let A_func_node = AST.program.body[0];
    let C_func_node = AST.program.body[2];
    let mount_func_node = AST.program.body[4];
    // 节点对应的代码
    let A_func_code = generator(A_func_node).code;
    let C_func_code = generator(C_func_node).code;
    let mount_func_code = generator(mount_func_node).code;
    // 源码拼解 组成解密环境
    decrypt_code_str += A_func_code;
    decrypt_code_str += C_func_code;
    decrypt_code_str += mount_func_code;
    // console.log(decrypt_code_str);
    // 运行 加载到内存中 在运行时解密
    eval(decrypt_code_str)

    //我们需要定位到的var初始化时 等号右边的函数名 判断是不是解密函数的函数名
    let define_name = generator(C_func_node.expression.left).code;
    // console.log(define_name)
    traverse(AST, {
        VariableDeclaration(path) {
            if (path.node.declarations.length !== 3) return;
            let declarations_array = path.node.declarations;
            if (declarations_array[0].type !== 'VariableDeclarator') return;
            if (declarations_array[1].type !== 'VariableDeclarator') return;
            if (declarations_array[2].type !== 'VariableDeclarator') return;

            // 解密函数 函数名判断
            if (!declarations_array[0].init) return;                                // 过滤声明但是没初始化
            if (declarations_array[0].init.type !== 'MemberExpression') return;     // 过滤初始化但不是成员表达式
            let decrypt_func_name = generator(declarations_array[0].init).code;     // 获取解密函数名
            if (define_name !== decrypt_func_name) return;
            // console.log(path.toString());   // 输出看是否过滤正确
            // console.log('--------------------------------')
            eval(path.toString());

            // 获取实际 解密函数 函数名
            let first_decrypt_name = declarations_array[0].id.name;
            let second_decrypt_name = declarations_array[2].id.name;
            // Binding对象获取
            let first_decrypt_name_binding = path.scope.getBinding(first_decrypt_name);
            let second_decrypt_name_binding = path.scope.getBinding(second_decrypt_name);

            first_decrypt_name_binding.referencePaths.map(function (_path) {
                // 找到调用形式$_CJDb(94)
                if (!_path.parentPath) return;
                if (_path.parentPath.node.type !== 'CallExpression') return;
                if (_path.parentPath.node.arguments.length !== 1) return;
                if (_path.parentPath.node.arguments[0].type !== 'NumericLiteral') return;
                // 执行$_CJDb(94) 拿到常量
                let decrypt_value = eval(_path.parentPath + '');
                // 使用type生成并替换节点($_CJDb(94) ==> "value")
                _path.parentPath.replaceInline(t.valueToNode(decrypt_value))
            });
            second_decrypt_name_binding.referencePaths.map(function (_path) {
                if (!_path.parentPath) return;
                if (_path.parentPath.node.type !== 'CallExpression') return;
                if (_path.parentPath.node.arguments.length !== 1) return;
                if (_path.parentPath.node.arguments[0].type !== 'NumericLiteral') return;

                let decrypt_value = eval(_path.parentPath + '');
                _path.parentPath.replaceInline(t.valueToNode(decrypt_value))
            });

            var next_path = path.getNextSibling();
            var nexts_path = next_path.getNextSibling();
            path.remove()
            next_path.remove()
            nexts_path.remove()
        }
    });
}
gt_decrypt_str(ast);

function gt_decrypt_token(AST){

}
gt_decrypt_str(ast)
let {code} = generator(ast, opts = {jsescOption:{"minimal":true}});
fs.writeFile(decode_file, code, (err) => {});