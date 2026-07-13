export const registerCLanguageCompletions = (monaco) => {
  monaco.languages.registerCompletionItemProvider('c', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        // Keywords
        {
          label: 'int',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'int ',
          detail: 'Integer type (32-bit typically)'
        },
        {
          label: 'float',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'float ',
          detail: 'Single-precision floating-point type'
        },
        {
          label: 'double',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'double ',
          detail: 'Double-precision floating-point type'
        },
        {
          label: 'char',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'char ',
          detail: 'Character type (8-bit)'
        },
        {
          label: 'void',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'void ',
          detail: 'Empty type'
        },
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'if (${1:condition}) {\n\t$0\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Conditional branch'
        },
        {
          label: 'else',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'else {\n\t$0\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Alternative conditional branch'
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'for (int ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t$0\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Loop structure'
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'while (${1:condition}) {\n\t$0\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'While loop'
        },
        {
          label: 'struct',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'struct ${1:Name} {\n\t$0\n};',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Structure definition'
        },
        {
          label: 'return',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'return $0;',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Return value from function'
        },
        
        // C Stdlib functions
        {
          label: 'printf',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'printf("${1:message}\\n", ${2:args});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'int printf(const char *format, ...)',
          documentation: 'Prints formatted output to stdout.'
        },
        {
          label: 'scanf',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'scanf("${1:%d}", &${2:variable});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'int scanf(const char *format, ...)',
          documentation: 'Reads formatted data from stdin.'
        },
        {
          label: 'malloc',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: '(${1:type}*)malloc(sizeof(${1:type}) * ${2:size});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'void* malloc(size_t size)',
          documentation: 'Allocates dynamic memory block.'
        },
        {
          label: 'free',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'free(${1:pointer});',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'void free(void *ptr)',
          documentation: 'Deallocates dynamically allocated memory block.'
        },
        {
          label: 'strlen',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'strlen(${1:str})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'size_t strlen(const char *str)',
          documentation: 'Returns length of a string.'
        },
        {
          label: 'strcmp',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'strcmp(${1:str1}, ${2:str2})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'int strcmp(const char *str1, const char *str2)',
          documentation: 'Compares two strings.'
        },

        // Common Preprocessors
        {
          label: '#include <stdio.h>',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: '#include <stdio.h>\n',
          detail: 'Standard Input/Output library'
        },
        {
          label: '#include <stdlib.h>',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: '#include <stdlib.h>\n',
          detail: 'Standard General Utilities library'
        },
        {
          label: '#include <string.h>',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: '#include <string.h>\n',
          detail: 'String handling functions'
        },
        {
          label: '#include <math.h>',
          kind: monaco.languages.CompletionItemKind.Module,
          insertText: '#include <math.h>\n',
          detail: 'Mathematical library'
        },
        {
          label: '#define',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: '#define ${1:CONSTANT} ${2:value}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          detail: 'Define constant macro'
        }
      ];

      return { suggestions };
    }
  });
};
