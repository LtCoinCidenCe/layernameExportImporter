# layernameExportImporter PSD文件图层导出导入器
Use Photoshop script to export all layers' names. Then, the importer script helps rewrite all layers' names back to the PSD file, assuming they are all shift-jis encoded.

通过Photoshop脚本按照结构导出所有的图层名字，然后可以使用导入器将图层名按shift-jis（日文）编码写回PSD文件。

Used on Photoshop CS6, does not guarantee they work on other versions.  
在Photoshop CS6上使用过，不保证在其他版本中兼容。

## 2024-09-17 更新
Doesn't require external software to modify encoding anymore. However it still fails when there is illegal encoding in the original file (like mixture of encodings). Recommend checking the exported file when any problem happens. Rebuilding script could be used after you inspected the exported layer names manually.

不再需要外部软件来修改编码。但是在源文件中有非法编码的时候仍然会失败（如文件混合了编码）。推荐在问题发生后检查导出文件。重建脚本可以在你手动检查图层名文本文件后使用。

find "comment this line if you modify the encoding by yourself" if you still want to do the encoding with something like VS Code, other than shift-jis.

如果你仍想自己改变编码，找到“comment this line if you modify the encoding by yourself”然后修改编码，来允许从shift-jis以外编码转换。
