var langserver = null;

exports.activate = function () {
  // Do work when the extension is activated
  langserver = new ClangLanguageServer();
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
  if (langserver) {
    langserver.deactivate();
    langserver = null;
  }
};

class ClangLanguageServer {
  constructor() {
    // Observe the configuration setting for the server's location, and restart the server on change
    nova.config.observe(
      "bb.clangd-path",
      function (path) {
        this.start(path);
      },
      this
    );

    nova.config.observe(
      "bb.clangd-cc-path",
      function () {
        this.start(nova.config.get("bb.clangd-path", "string"));
      },
      this
    );

    nova.workspace.config.observe(
      "bb.clangd-cc-path",
      function () {
        this.start(nova.config.get("bb.clangd-path", "string"));
      },
      this
    );
  }

  deactivate() {
    this.stop();
  }

  start(path) {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
    }

    // Use the default server path
    if (!path) {
      path = "/usr/local/bin/clangd";
    }

    let CCPath = nova.config.get("bb.clangd-cc-path", "string");
    if (!CCPath)
      CCPath = nova.workspace.config.get("bb.clangd-cc-path", "string");
    if (!CCPath) CCPath = nova.workspace.path;

    // Create the client
    var serverOptions = {
      path: path,
      args: ["--compile-commands-dir=" + CCPath, "--suggest-missing-includes"],
    };
    var clientOptions = {
      // The set of document syntaxes for which the server is valid
      syntaxes: ["c", "cpp"],
    };
    var client = new LanguageClient(
      "clang-langserver",
      "clang Language Server",
      serverOptions,
      clientOptions
    );

    try {
      // Start the client
      client.start();

      // Add the client to the subscriptions to be cleaned up
      nova.subscriptions.add(client);
      this.languageClient = client;
    } catch (err) {
      // If the .start() method throws, it's likely because the path to the language server is invalid

      if (nova.inDevMode()) {
        console.error(err);
      }
    }
  }

  stop() {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
      this.languageClient = null;
    }
  }
}
