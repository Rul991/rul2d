import { readdir, readFile, stat, writeFile } from "fs/promises"
import path from "path"

const createPath = (file = '') => {
    return `./` + 
        path.join(
            path.dirname(file), 
            createBasename(file)
        ).replaceAll('\\', '/')
}

const createBasename = (file = '') => path.basename(file, '.ts')

const createIndex = async ({ filename, watchedDir }) => {
    let files = await readdir(watchedDir, { recursive: true })
    let text = ''

    for (const file of files) {
        const filePath = createPath(file)
        const className = createBasename(file)
        if((filePath.split('/').length - 1) <= 1) continue

        const fileText = (await readFile(path.join(watchedDir, file))).toString()

        const isDefault = fileText.includes('default')
        
        let defaultText = `{default as ${className}}`
        if(!isDefault) defaultText = `*`

        text += `export ${defaultText} from '${filePath}'\n`
    }

    await writeFile(path.join(watchedDir, filename), text)
}

const createIndexPlugin = () => ({
    name: 'create-index-plugin',
    buildStart() {
        createIndex({ filename: './index.ts', watchedDir: './src' })
        .then(
            console.log('Done!')
        )
    }
})

export default createIndexPlugin