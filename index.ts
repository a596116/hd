#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'

import minimist from 'minimist'
import prompts from 'prompts'
import { red, green, bold } from 'kolorist'

import renderTemplate from './utils/renderTemplate'
import * as banners from './utils/banners'
import getCommand from './utils/getCommand'
import { fileURLToPath } from 'node:url'

function isValidPackageName(projectName: string) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName
  )
}

function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true
  }

  const files = fs.readdirSync(dir)
  if (files.length === 0) {
    return true
  }
  if (files.length === 1 && files[0] === '.git') {
    return true
  }

  return false
}

function emptyDir(dir: string) {
  if (!fs.existsSync(dir)) {
    return
  }

  //   postOrderDirectoryTraverse(
  //     dir,
  //     (dir) => fs.rmdirSync(dir),
  //     (file) => fs.unlinkSync(file)
  //   )
}

async function init() {
  console.log()
  console.log(
    process.stdout.isTTY && process.stdout.getColorDepth() > 8
      ? banners.gradientBanner
      : banners.defaultBanner
  )
  console.log()

  const cwd = process.cwd()
  const argv = minimist(process.argv.slice(2), {
    alias: {
      typescript: ['ts'],
      'with-tests': ['tests'],
      router: ['vue-router'],
    },
    string: ['_'],
    // all arguments are treated as booleans
    boolean: true,
  })

  let targetDir = argv._[0]
  const defaultProjectName = !targetDir ? 'haodai-project' : targetDir

  const forceOverwrite = argv.force

  let result: {
    projectName?: string
    packageName?: string
    shouldOverwrite?: boolean
    template?: string
  } = {}

  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: targetDir ? null : 'text',
          message: '請輸入項目名稱：',
          initial: defaultProjectName,
          onState: (state) =>
            (targetDir = String(state.value).trim() || defaultProjectName),
        },
        {
          name: 'shouldOverwrite',
          type: () =>
            canSkipEmptying(targetDir) || forceOverwrite ? null : 'toggle',
          message: () => {
            const dirForPrompt =
              targetDir === '.' ? '當前目錄' : `當前文件夾 "${targetDir}"`

            return `${dirForPrompt} 存在，是否覆蓋？`
          },
          initial: true,
          active: '是',
          inactive: '否',
        },
        {
          name: 'template',
          type: () => 'select',
          hint: '- 使用箭頭切換按Enter確認。',
          message: '選擇使用的模版',
          initial: 0,
          choices: (prev, answers) => [
            {
              title: '前台模版',
              value: 'forestage',
            },
            {
              title: '後台模版',
              value: 'backstage',
            },
          ],
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red('✖') + ` 操作取消`)
            }
            return null
          },
        },
        {
          name: 'packageName',
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          message: '請輸入包名稱：',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) => isValidPackageName(dir) || '無效的包名稱',
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ` 操作取消`)
        },
      }
    )
  } catch (cancelled: any) {
    console.log(cancelled.message)
    process.exit(1)
  }

  // `initial` won't take effect if the prompt type is null
  // so we still have to assign the default values here
  const {
    projectName,
    packageName = projectName ?? defaultProjectName,
    shouldOverwrite = argv.force,
    template,
  } = result

  const root = path.join(cwd, targetDir)

  if (fs.existsSync(root) && shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\n正在構建項目 ${root}...`)

  const pkg = { name: packageName, version: '0.0.0' }
  fs.writeFileSync(
    path.resolve(root, 'package.json'),
    JSON.stringify(pkg, null, 2)
  )

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const templateRoot = path.resolve(__dirname, 'template')
  const callbacks: any = []
  const render = function render(templateName: string) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, root, callbacks)
  }
  // Render  template
  render(template!)

  // An external data store for callbacks to share data
  const dataStore = {}

  // Process callbacks
  for (const cb of callbacks) {
    await cb(dataStore)
  }

  // Instructions:
  // Supported package managers: pnpm > yarn > npm
  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent)
    ? 'pnpm'
    : /yarn/.test(userAgent)
    ? 'yarn'
    : 'npm'

  console.log(`\n項目構建完成，可執行以下命令：\n`)
  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root)
    console.log(
      `  ${bold(
        green(
          `cd ${
            cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName
          }`
        )
      )}`
    )
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)
  console.log()
}

init().catch((e) => {
  console.error(e)
})
