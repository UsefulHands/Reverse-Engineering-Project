import "frida-il2cpp-bridge";

const mapping: Record<string, string> = {
    il2cpp_get_corlib: "aCQWzMpNOM_"
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const FridaModule = globalThis.Module as any;

const original = FridaModule.findExportByName;

FridaModule.findExportByName = function (
    moduleName: string | null,
    exportName: string
): NativePointer | null {
    if (moduleName === "libil2cpp.so" && mapping[exportName]) {
        exportName = mapping[exportName];
    }
    return original.call(FridaModule, moduleName, exportName);
};