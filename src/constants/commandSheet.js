const commandSheet = {
  'help': {
    op_cat: 'help',
    op_name: 'help',
    args_num: 0,
    args_type: null,
    args: [],
    details: {
      description: 'display help for command',
      args: null,
    }
  },
  'os': {
    op_cat: 'os',
    op_name: 'os',
    args_num: 5,
    args_type: 'static',
    args: ['--EOL', '--cpus', '--homedir', '--username', '--architecture'],
    details: {
      description: 'print operating system info',
      args: {
        '--EOL': 'prints default system End-Of-Line',
        '--cpus': 'prints host machine CPUs info',
        '--homedir': 'print home directory',
        '--username': 'print current system user name',
        '--architecture': 'print CPU architecture for which Node.js binary has compiled',
      }
    }
  },
  'up': {
    op_cat: 'nav',
    op_name: 'up',
    args_num: 0,
    args_type: null,
    args: [],
    details: {
      description: 'go upper from current directory',
      args: null,
    }
  },
  'cd': {
    op_cat: 'nav',
    op_name: 'cd',
    args_num: 1,
    args_type: 'var',
    args: ['path_to_directory'],
    details: {
      description: 'go to dedicated folder from current directory',
      args: {
        'path_to_directory': 'can be relative or absolute'
      }
    }
  },
  'ls': {
    op_cat: 'nav',
    op_name: 'ls',
    args_num: 0,
    args_type: null,
    args: [],
    details: {
      description: 'print in console list of all files and folders in current directory',
      args: null,
    }
  },
  'cat': {
    op_cat: 'fileOs',
    op_name: 'cat',
    args_num: 1,
    args_type: null,
    args: ['path_to_file'],
    details: {
      description: 'read file and print it\'s content in console',
      args: {
        'path_to_file': '',
      }
    }
  },
  'add': {
    op_cat: 'fileOs',
    op_name: 'add',
    args_num: 1,
    args_type: 'var',
    args: ['new_file_name'],
    details: {
      description: 'create empty file in current working directory',
      args: {
        'new_file_name': '',
      }
    }
  },
  'rn': {
    op_cat: 'fileOs',
    op_name: 'rn',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'new_filename'],
    details: {
      description: 'rename file',
      args: {
        'path_to_file': '',
        'new_filename': '',
      }
    }
  },
  'cp': {
    op_cat: 'fileOs',
    op_name: 'cp',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_new_directory'],
    details: {
      description: 'copy file',
      args: {
        'path_to_file': '',
        'path_to_new_directory': '',
      }
    }
  },
  'mv': {
    op_cat: 'fileOs',
    op_name: 'mv',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_new_directory'],
    details: {
      description: 'move file',
      args: {
        'path_to_file': '',
        'path_to_new_directory': '',
      }
    }
  },
  'rm': {
    op_cat: 'fileOs',
    op_name: 'rm',
    args_num: 1,
    args_type: 'var',
    args: ['path_to_file'],
    details: {
      description: 'delete file',
      args: {
        'path_to_file': '',
      }
    }
  },
  'hash': {
    op_cat: 'hash',
    op_name: 'hash',
    args_num: 1,
    args_type: 'var',
    args: ['path_to_file'],
    details: {
      description: 'calculate hash for file and print',
      args: {
        'path_to_file': '',
      }
    }
  },
  'compress': {
    op_cat: 'archv',
    op_name: 'compress',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_destination'],
    details: {
      description: 'comress file (using Brotli algorithm)',
      args: {
        'path_to_file': '',
        'path_to_destination': '',
      }
    }
  },
  'decompress': {
    op_cat: 'archv',
    op_name: 'decompress',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_destination'],
    details: {
      description: 'decomress file (using Brotli algorithm)',
      args: {
        'path_to_file': '',
        'path_to_destination': '',
      }
    }
  },
}

export default commandSheet;