// 读取各种类型
var addr = ptr("0x12345678");

Memory.readS8(addr);          // signed 8-bit
Memory.readU8(addr);          // unsigned 8-bit
Memory.readS16(addr);         // signed 16-bit
Memory.readU16(addr);         // unsigned 16-bit
Memory.readS32(addr);         // signed 32-bit
Memory.readU32(addr);         // unsigned 32-bit
Memory.readS64(addr);         // signed 64-bit
Memory.readFloat(addr);       // float
Memory.readDouble(addr);      // double
Memory.readUtf8String(addr);  // UTF-8 string
Memory.readUtf16String(addr); // UTF-16 string

// 读取 byte 数组
var byteArray = Memory.readByteArray(addr, 64);
console.log(hexdump(byteArray));

// 写入内存
Memory.writeS32(addr, 42);
Memory.writeUtf8String(addr, "hello");
