# frida-trace 使用技巧

## 13.1 基本用法

```bash
# 追踪 Java 方法
frida-trace -U -j "com.example.app!*!" -f com.example.app

# 追踪特定类的所有方法
frida-trace -U -j "com.example.app.MainActivity" -n "AppName"

# 追踪 Native 函数
frida-trace -U -i "JNI_OnLoad" -f com.example.app

# 追踪所有加密相关方法
frida-trace -U -j "*Cipher*,*SecretKey*,*MessageDigest*" -f com.example.app

# 追踪 SharedPreferences
frida-trace -U -j "*SharedPreferences!*" -f com.example.app

# 输出到文件
frida-trace -U -j "com.example.app!*!" -f com.example.app -o trace.log

# 使用 V8 引擎（更快）
frida-trace -U -j "com.example.app!*!" -f com.example.app --runtime=v8
```

## 13.2 通配符技巧

| 通配符 | 说明 | 示例 |
|--------|------|------|
| `*` | 匹配所有类或方法 | `"com.example.app*"` |
| `!` | 分隔类名和方法名 | `"com.example.app.MainActivity!onCreate"` |
| `,` | 分隔多个匹配项 | `"*Activity!onCreate,onResume"` |

## 13.3 自动生成脚本的修改

```javascript
// frida-trace 会在 __handlers__/ 目录下生成 JS 文件
// 例如: __handlers__/com.example.app.MainActivity/login.js

// 修改自动生成的 handler:
{
    onEnter(log, args, state) {
        log('login() called');
        log('\targ0 = ' + Java.cast(args[0], Java.use('java.lang.String')));
        log('\targ1 = ' + Java.cast(args[1], Java.use('java.lang.String')));
    },
    onLeave(log, retval, state) {
        log('login() returned: ' + retval);
    }
}
```
