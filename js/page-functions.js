// Global code  in head
(function (global) {
  global.pageFunctions = global.pageFunctions || {
    executed: {},
    functions: {},
    addFunction: function (id, fn) {
      if (!this.functions[id]) this.functions[id] = fn;
    },
    executeFunctions: function () {
      if (this.added) return;
      this.added = true;
      for (const id in this.functions) {
        if (!this.executed[id]) {
          try {
            this.functions[id]();
            this.executed[id] = true;
          } catch (e) {
            console.error(`Error executing function ${id}:`, e);
          }
        }
      }
    },
  };
})(window);

// End of body code
pageFunctions.executeFunctions();
