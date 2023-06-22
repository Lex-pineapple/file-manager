const commandSheet = {
  'os': {
    op_cat: 'os',
    op_name: 'os',
    args_num: 5,
    args_type: 'static',
    args: ['--EOL', '--cpus', '--homedir', '--username', '--architecture']
  },
  'up': {
    op_cat: 'nav',
    op_name: 'up',
    args_num: 0,
    args_type: null,
    args: []
  },
  'cd': {
    op_cat: 'nav',
    op_name: 'cd',
    args_num: 1,
    args_type: 'var',
    args: ['path_to_directory']
  },
  'ls': {
    op_cat: 'nav',
    op_name: 'ls',
    args_num: 0,
    args_type: null,
    args: []
  },
  'cat': {
    op_cat: 'fileOs',
    op_name: 'cat',
    args_num: 1,
    args_type: null,
    args: ['path_to_file']
  },
  'add': {
    op_cat: 'fileOs',
    op_name: 'add',
    args_num: 1,
    args_type: 'var',
    args: ['new_file_name']
  },
  'rn': {
    op_cat: 'fileOs',
    op_name: 'rn',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'new_filename']
  },
  'cp': {
    op_cat: 'fileOs',
    op_name: 'cp',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_new_directory']
  },
  'mv': {
    op_cat: 'fileOs',
    op_name: 'mv',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_new_directory']
  },
  'rm': {
    op_cat: 'fileOs',
    op_name: 'rm',
    args_num: 1,
    args_type: 'var',
    args: ['path_to_file']
  },
  'hash': {
    op_cat: 'hash',
    op_name: 'hash',
    args_num: 1,
    args_type: 'var',
    args: ['path_to_file']
  },
  'compress': {
    op_cat: 'archv',
    op_name: 'compress',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_destination']
  },
  'decompress': {
    op_cat: 'archv',
    op_name: 'decompress',
    args_num: 2,
    args_type: 'var',
    args: ['path_to_file', 'path_to_destination']
  },
}

export default commandSheet;