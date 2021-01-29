import { expect } from 'chai'
import 'mocha'
import { SkyDb } from './client'
import { genKeyPairAndSeed } from './crypto'

describe('Client', () => {
    let cli:SkyDb

    const hiSkyUrl = 'sia:AAD6lqdEIKKvRXXg_AjEOCUFHW7oKpatxL53y0BSeIyJWg'

    beforeEach(() => {
        cli = new SkyDb()
        expect(cli).to.not.be.undefined
    })

    it('uploads', async () => {
        const bits = Buffer.from('hi')
        try {
            const resp = await cli.uploadFile(bits)
            expect(resp.skylink).to.equal(hiSkyUrl)
        } catch (err) {
            console.error(err)
            throw err
        }
    })

    it('downloads', async () => {
        const resp = await cli.getFileContent(hiSkyUrl)
        expect(resp.data).to.equal('hi')
    })

    it('does registry', async () => {
        const { privateKey, publicKey } = genKeyPairAndSeed()
        await cli.registry.setEntry(privateKey, {
            datakey: "helloworld",
            data: hiSkyUrl,
            revision: BigInt(0),
        })
        const ret = await cli.registry.getEntry(publicKey, 'helloworld')
        expect(ret.entry?.data).to.equal(hiSkyUrl)
    })

    it('does skydb', async () => {
        const { privateKey, publicKey } = genKeyPairAndSeed()
        await cli.db.setJSON(privateKey, 'hello', {bob: 'iscool'})
        expect((await cli.db.getJSON(publicKey, 'hello')).data).to.have.property('bob', 'iscool')
    })
})