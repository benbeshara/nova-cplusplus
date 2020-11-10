# C++ Language Server for Nova

**Ben Beshara** - https://benbeshara.id.au/

---

This extension provides **_very_** bare-bones integration with `clangd` to Nova - it's basically the example wrapper with a few tweaks.

## Requirements

In order to use this extension, you need to supply a version of `clangd` - its path can be specified in the global settings pane for this extension if required.

There are two simple routes that can get you started:

### Brew

Open a terminal and run

```
# brew install llvm
```

This will install a copy of clangd and symlink it into `/usr/bin`

### Standalone

Go to https://clangd.llvm.org in your web browser and download the _Standalone .zip release_.
Extract this to any location on your mac and set the path in the extension preferences.

## Usage

The plugin will start when editing a C++ source file. In order to provide project-context specific information, your project will need to provide a `compile_commands.json` file - CMake can generate one for you by passing the `CMAKE_EXPORT_COMPILE_COMMANDS` variable when generating your project. More information can be found at https://clang.llvm.org/docs/JSONCompilationDatabase.html

The directory where your `compile_commands.json` file is stored can be specified in global or project preferences, if it is not in the root oft he project directory

## Configuration

To configure global preferences, open **Extensions → Extension Library...** then select C++'s **Preferences** tab.

You can also configure preferences on a per-project basis in **Project → Project Settings...**

## To-Do

I would eventually like to make this generally more configurable, and perhaps provide some build/debug functionality.

## Contributing

If you have a better grasp of Nova's extension API feel free to open a pull request, I don't have a tonne of time to work on this by myself so any help from the community is appreciated.
