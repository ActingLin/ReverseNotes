package com.work.zuiyou;

import com.github.unidbg.AndroidEmulator;
import com.github.unidbg.arm.backend.Unicorn2Factory;
import com.github.unidbg.linux.android.AndroidEmulatorBuilder;
import com.github.unidbg.linux.android.AndroidResolver;
import com.github.unidbg.linux.android.dvm.*;
import com.github.unidbg.memory.Memory;
import com.github.unidbg.virtualmodule.android.AndroidModule;

import java.io.File;
import java.nio.charset.StandardCharsets;

public class NetCrypto  extends AbstractJni{
    private final AndroidEmulator emulator;
    private final DvmClass NetCrypto;
    private final VM vm;

    public NetCrypto () {
        emulator = AndroidEmulatorBuilder
                .for32Bit()
                .addBackendFactory(new Unicorn2Factory(true))
                .setProcessName("cn.xiaochuankeji.tieba")
                .build();

        Memory memory = emulator.getMemory();
        memory.setLibraryResolver(new AndroidResolver(23));
        vm = emulator.createDalvikVM(new File("apks/zuiyou/zuiyou570/right573.apk"));
        vm.setJni(this);
        vm.setVerbose(true);

        // INFO [com.github.unidbg.linux.AndroidElfLoader] (AndroidElfLoader:481) - libnet_crypto.so load dependency libandroid.so failed
        // 如果出现load dependency libandroid.so failed则通过下面代码加载 libandroid.so 虚拟模块, 但需早于目标 SO 加载的时机
        // 使用 libandroid.so 的虚拟模块
        new AndroidModule(emulator, vm).register(memory);

        DalvikModule dm = vm.loadLibrary("net_crypto", true);
        NetCrypto = vm.resolveClass("com/izuiyou/network/NetCrypto");
        dm.callJNI_OnLoad(emulator);
    }

    public String callSign(){
        String arg1 = "hello world";
        byte[] arg2 = "V I 50".getBytes(StandardCharsets.UTF_8);
        return NetCrypto.callStaticJniMethodObject(
                emulator,
                "sign(Ljava/lang/String;[B)Ljava/lang/String;",
                arg1,
                arg2
        ).getValue().toString();
    }

    public static void main(String[] args) {
        NetCrypto  nw = new NetCrypto ();
        String result = nw.callSign();
        System.out.println("call_sign result:"+result);
    }

    public DvmObject<?> callStaticObjectMethodV(BaseVM vm, DvmClass dvmClass, String signature, VaList vaList) {
        switch (signature) {
            case "com/izuiyou/common/base/BaseApplication->getAppContext()Landroid/content/Context;":{
                //DvmObject<?> context = vm.resolveClass("com/izuiyou/common/base/BaseApplication").newObject(null);
                DvmObject<?> context = vm.resolveClass("cn/xiaochuankeji/tieba/AppController").newObject(null);
                return context;
            }
        }
        return super.callStaticObjectMethodV(vm, dvmClass, signature, vaList);
    }

    public DvmObject<?> callObjectMethodV(BaseVM vm, DvmObject<?> dvmObject, String signature, VaList vaList) {
        switch (signature) {
            case "cn/xiaochuankeji/tieba/AppController->getPackageManager()Landroid/content/pm/PackageManager;": {
                return vm.resolveClass("android/content/pm/PackageManager").newObject(null);
//                DvmClass clazz = vm.resolveClass("android/content/pm/PackageManager");
//                return clazz.newObject(signature);
            }
            case "cn/xiaochuankeji/tieba/AppController->getPackageName()Ljava/lang/String;": {
                String packageName = vm.getPackageName();
                if (packageName != null) {
                    return new StringObject(vm, packageName);
                }
            }
            case "cn/xiaochuankeji/tieba/AppController->getClass()Ljava/lang/Class;": {
                return dvmObject.getObjectType();
            }


            /*
            * AbstractJNI 里找不到getSimpleName的处理，但是通过搜索发现，该函数是在获取类的简写名，
            * https://www.w3ccoo.com/javalang/class_getsimplename.html
            * 比如android.content.Context简写名就是Context。DvmClass的getClassName可以获取类名，我们要截取末尾的名字。
            * */
            case "java/lang/Class->getSimpleName()Ljava/lang/String;":{
                String className = ((DvmClass) dvmObject).getClassName();
                String[] name = className.split("/");

//                System.out.println(Arrays.toString(name));
//                System.out.println(name[name.length - 1]);
//                [com, izuiyou, common, base, BaseApplication]
//                BaseApplication

                return new StringObject(vm, name[name.length - 1]);
            }
            //case "cn/xiaochuankeji/tieba/AppController->getFilesDir()Ljava/io/File;":
            //然而这样做并没有修不好，运行会报错，提示创建的File为空
            case "cn/xiaochuankeji/tieba/AppController->getFilesDir()Ljava/io/File;":{
                //return vm.resolveClass("java/io/File").newObject(null);
                //需进行如下处理（原因尚不可知）
                return vm.resolveClass("java/io/File").newObject("/data/data/cn.xiaochuankeji.tieba/files");
            }
            case "java/io/File->getAbsolutePath()Ljava/lang/String;":{
                return new StringObject(vm, dvmObject.getValue().toString());
            }


        }
        return super.callObjectMethodV(vm, dvmObject, signature, vaList);
    }


    public void callStaticVoidMethodV(BaseVM vm, DvmClass dvmClass, String signature, VaList vaList) {
        switch (signature) {
            case "cn/xiaochuankeji/tieba/common/debug/AppLogReporter->reportAppRuntime(Ljava/lang/String;Ljava/lang/String;)V": {
                String arg1 = (String) vaList.getObjectArg(0).getValue(); // "runtiem"
                String arg2 = (String) vaList.getObjectArg(1).getValue(); // "invalid application name: BaseApplication"
                System.out.println("[AppLogReporter] reportAppRuntime: " + arg1 + ", " + arg2);
                return; // 忽略或记录日志，不抛异常
            }
        }
        super.callStaticVoidMethodV(vm, dvmClass, signature, vaList);
    }


    public boolean callStaticBooleanMethodV(BaseVM vm, DvmClass dvmClass, String signature, VaList vaList) {
        switch (signature){
            case "android/os/Debug->isDebuggerConnected()Z":{
                return false;
            }
        }
        return super.callStaticBooleanMethodV(vm, dvmClass, signature, vaList);
    }


    public int callStaticIntMethodV(BaseVM vm, DvmClass dvmClass, String signature, VaList vaList) {
        switch (signature){
            case "android/os/Process->myPid()I":{
                return emulator.getPid();
            }
        }
        return super.callStaticIntMethodV(vm, dvmClass, signature, vaList);
    }


}