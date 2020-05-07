export default {
  extraBabelPlugins: [
    [
      'module-resolver',
      {
        alias: {
          '^antd$': 'nornj-react/antd'
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.es', '.es6', '.mjs']
      }
    ],
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
      },
      'antd'
    ],
    [
      'import',
      {
        libraryName: 'nornj-react/antd',
        style: true
      },
      'nornj-react/antd'
    ],
    [
      'nornj-in-jsx',
      {
        imports: ['nornj-react/antd'],
        extensionConfig: {
          switch: {
            needPrefix: 'onlyUpperCase'
          },
          empty: {
            needPrefix: 'onlyUpperCase'
          },
          tooltip: {
            needPrefix: 'onlyUpperCase'
          }
        }
      }
    ]
  ],
  mode: 'site',
  title: 'NornJ',
  logo: '/images/logo.png',
  favicon: '/favicon.ico',
  dynamicImport: {},
  manifest: {},
  links: [{ rel: 'manifest', href: '/asset-manifest.json' }],
  hash: true,
  resolve: {
    includes: ['docs']
  },
  navs: {
    'zh-CN': [
      null,
      { title: 'GitHub', path: 'https://github.com/joe-sky/nornj' },
      { title: '更新日志', path: 'https://github.com/joe-sky/nornj/blob/master/packages/nornj/CHANGELOG.md' }
    ],
    'en-US': [
      null,
      { title: 'GitHub', path: 'https://github.com/joe-sky/nornj' },
      { title: 'Changelog', path: 'https://github.com/joe-sky/nornj/blob/master/packages/nornj/CHANGELOG.md' }
    ]
  },
  locales: [
    ['zh-CN', '中文'],
    ['en-US', 'English']
  ]
};
